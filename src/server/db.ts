import dns from 'dns';
import https from 'https';
import { neon, neonConfig } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import path from 'path';
import { AdminStats, InquiryStatus, ProjectInquiry } from '../types/index.ts';
import { InquiryStore } from './storage.ts';

// Prioritize IPv4 DNS lookup to avoid Windows IPv6 resolution latency
if (typeof dns.setDefaultResultOrder === 'function') {
  dns.setDefaultResultOrder('ipv4first');
}

// Custom DNS lookup using public DNS fallback to prevent Windows local router DNS ENOTFOUND
const publicResolver = new dns.Resolver();
publicResolver.setServers(['8.8.8.8', '1.1.1.1']);

function customDnsLookup(hostname: string, options: any, callback: any) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  publicResolver.resolve4(hostname, (err, addresses) => {
    if (!err && addresses && addresses.length > 0) {
      if (options && options.all) {
        return callback(null, addresses.map(a => ({ address: a, family: 4 })));
      }
      return callback(null, addresses[0], 4);
    }
    dns.lookup(hostname, options, callback);
  });
}

// In local Node / development environments, route Neon serverless queries over native HTTPS with IPv4
// to prevent Undici connect timeouts on Windows when resolving AWS us-east-2 endpoints
if (typeof process !== 'undefined' && !process.env.VERCEL) {
  neonConfig.fetchFunction = (input: any, init: any = {}): Promise<Response> => {
    const urlObj = typeof input === 'string' ? new URL(input) : input;
    const headers: Record<string, string> = {};
    if (init.headers) {
      if (typeof init.headers.forEach === 'function') {
        init.headers.forEach((v: string, k: string) => { headers[k] = v; });
      } else if (typeof init.headers === 'object') {
        Object.assign(headers, init.headers);
      }
    }

    const bodyData = init.body || '';
    if (init.method === 'POST') {
      headers['Content-Length'] = String(Buffer.byteLength(bodyData));
      if (!headers['Content-Type']) {
        headers['Content-Type'] = 'application/json';
      }
    }

    return new Promise((resolve, reject) => {
      const req = https.request(urlObj, {
        method: init.method || 'GET',
        headers,
        family: 4, // Force IPv4
        lookup: customDnsLookup,
        timeout: 15000
      }, (res) => {
        const chunks: Buffer[] = [];
        res.on('data', chunk => chunks.push(chunk));
        res.on('end', () => {
          const bodyBuffer = Buffer.concat(chunks);
          const response = new Response(bodyBuffer, {
            status: res.statusCode || 200,
            statusText: res.statusMessage || 'OK',
            headers: res.headers as any
          });
          resolve(response);
        });
      });

      req.on('error', reject);
      req.on('timeout', () => {
        req.destroy(new Error('HTTPS connection timeout to Neon'));
      });

      if (bodyData) {
        req.write(bodyData);
      }
      req.end();
    });
  };
}

// Ensure .env is loaded
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export function getDatabaseUrl(): string | undefined {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.NEON_DATABASE_URL;
  if (!url) return undefined;
  // Automatically strip channel_binding parameter as it is a TCP-only SCRAM option not supported over HTTP serverless fetch
  return url
    .replace(/&channel_binding=[^&]+/g, '')
    .replace(/\?channel_binding=[^&]+&?/g, '?')
    .replace(/\?$/, '');
}

export function isDatabaseConfigured(): boolean {
  const url = getDatabaseUrl();
  return Boolean(url && url.trim().length > 0 && !url.includes('your-neon-database-url'));
}

/**
 * Returns a Neon SQL query runner if DATABASE_URL is configured
 */
export function getNeonSql() {
  const url = getDatabaseUrl();
  if (!url) {
    throw new Error('DATABASE_URL is not configured in environment variables.');
  }
  return neon(url);
}

/**
 * Initializes the inquiries table schema in PostgreSQL if it does not already exist
 */
export async function initDatabaseSchema(): Promise<boolean> {
  if (!isDatabaseConfigured()) {
    console.warn('[Database] DATABASE_URL is not configured. Skipping schema migration.');
    return false;
  }

  const sql = getNeonSql();

  await sql`
    CREATE TABLE IF NOT EXISTS inquiries (
      id VARCHAR(64) PRIMARY KEY,
      ref_id VARCHAR(32) UNIQUE NOT NULL,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(50),
      company VARCHAR(255),
      title VARCHAR(255) NOT NULL,
      service_category VARCHAR(100) NOT NULL,
      problem_description TEXT NOT NULL,
      target_users TEXT,
      desired_solution TEXT,
      requested_features TEXT,
      existing_url VARCHAR(500),
      budget_range VARCHAR(100),
      timeline VARCHAR(100),
      preferred_contact VARCHAR(50) DEFAULT 'email',
      additional_details TEXT,
      consent BOOLEAN DEFAULT TRUE,
      status VARCHAR(50) DEFAULT 'new',
      internal_notes TEXT,
      follow_up_date VARCHAR(50),
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  await sql`CREATE INDEX IF NOT EXISTS idx_inquiries_ref_id ON inquiries(ref_id);`;
  await sql`CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);`;
  await sql`CREATE INDEX IF NOT EXISTS idx_inquiries_service_category ON inquiries(service_category);`;
  await sql`CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON inquiries(created_at DESC);`;

  // Create revoked_tokens table to support cross-instance serverless token invalidation
  await sql`
    CREATE TABLE IF NOT EXISTS revoked_tokens (
      token_hash VARCHAR(64) PRIMARY KEY,
      expires_at TIMESTAMPTZ NOT NULL,
      revoked_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  await sql`CREATE INDEX IF NOT EXISTS idx_revoked_tokens_expires_at ON revoked_tokens(expires_at);`;

  console.log('[Database] Neon PostgreSQL inquiries and revoked_tokens schema verified.');
  return true;
}

/**
 * Persists a revoked token hash to PostgreSQL to invalidate it across all serverless instances
 */
export async function persistRevokedToken(tokenHash: string, expiresAt: Date): Promise<void> {
  if (isDatabaseConfigured()) {
    try {
      const sql = getNeonSql();
      await sql`
        INSERT INTO revoked_tokens (token_hash, expires_at)
        VALUES (${tokenHash}, ${expiresAt.toISOString()})
        ON CONFLICT (token_hash) DO NOTHING;
      `;
      // Clean up past expired tokens periodically
      sql`DELETE FROM revoked_tokens WHERE expires_at < NOW()`.catch(() => {});
    } catch (e: any) {
      console.warn('[Database] Failed to persist revoked token to PostgreSQL:', e?.message || e);
    }
  }
}

/**
 * Checks whether a token hash is present in the persistent revoked_tokens table.
 * Throws an error on database query failure to support fail-closed authentication.
 */
export async function isTokenRevokedInDb(tokenHash: string): Promise<boolean> {
  if (isDatabaseConfigured()) {
    const sql = getNeonSql();
    const rows = await sql`
      SELECT 1 FROM revoked_tokens WHERE token_hash = ${tokenHash} LIMIT 1;
    `;
    return rows.length > 0;
  }
  return false;
}

/**
 * Persists an enquiry record
 */
export async function persistInquiry(inquiry: ProjectInquiry): Promise<ProjectInquiry> {
  if (isDatabaseConfigured()) {
    const sql = getNeonSql();
    const rows = await sql`
      INSERT INTO inquiries (
        id, ref_id, name, email, phone, company, title, service_category,
        problem_description, target_users, desired_solution, requested_features,
        existing_url, budget_range, timeline, preferred_contact, additional_details,
        consent, status, internal_notes, follow_up_date, created_at, updated_at
      ) VALUES (
        ${inquiry.id},
        ${inquiry.ref_id},
        ${inquiry.name},
        ${inquiry.email},
        ${inquiry.phone || null},
        ${inquiry.company || null},
        ${inquiry.title},
        ${inquiry.service_category},
        ${inquiry.problem_description},
        ${inquiry.target_users || null},
        ${inquiry.desired_solution || null},
        ${inquiry.requested_features || null},
        ${inquiry.existing_url || null},
        ${inquiry.budget_range || null},
        ${inquiry.timeline || null},
        ${inquiry.preferred_contact || 'email'},
        ${inquiry.additional_details || null},
        ${inquiry.consent},
        ${inquiry.status || 'new'},
        ${inquiry.internal_notes || null},
        ${inquiry.follow_up_date || null},
        ${inquiry.created_at},
        ${inquiry.updated_at}
      )
      RETURNING *;
    `;
    const saved = rows[0] as ProjectInquiry;
    return saved;
  }

  // Development Fallback: In-memory store when DATABASE_URL is not set
  console.warn('[Database] DATABASE_URL not set in environment. Falling back to local in-memory store.');
  const store = InquiryStore.getInstance();
  const created = store.create({
    name: inquiry.name,
    email: inquiry.email,
    phone: inquiry.phone,
    company: inquiry.company,
    title: inquiry.title,
    service_category: inquiry.service_category,
    problem_description: inquiry.problem_description,
    target_users: inquiry.target_users,
    desired_solution: inquiry.desired_solution,
    requested_features: inquiry.requested_features,
    existing_url: inquiry.existing_url,
    budget_range: inquiry.budget_range,
    timeline: inquiry.timeline,
    preferred_contact: inquiry.preferred_contact,
    additional_details: inquiry.additional_details,
    consent: inquiry.consent
  });
  // Preserve reference ID and ID if supplied
  created.id = inquiry.id;
  created.ref_id = inquiry.ref_id;
  return created;
}

/**
 * Retrieves paginated enquiries with optional search, status, and category filtering
 */
export async function fetchInquiries(options?: {
  search?: string;
  status?: string;
  category?: string;
  page?: number;
  limit?: number;
}): Promise<{ items: ProjectInquiry[]; total: number; page: number; totalPages: number }> {
  if (isDatabaseConfigured()) {
    const sql = getNeonSql();
    const page = Math.max(1, options?.page || 1);
    const limit = Math.max(1, options?.limit || 15);
    const offset = (page - 1) * limit;

    const searchTerm = options?.search ? `%${options.search.trim().toLowerCase()}%` : null;
    const filterStatus = options?.status && options.status !== 'all' ? options.status : null;
    const filterCategory = options?.category && options.category !== 'all' ? options.category : null;

    // Use parameterized Neon query
    const rows = await sql`
      SELECT *
      FROM inquiries
      WHERE
        (${searchTerm}::text IS NULL OR (
          LOWER(name) LIKE ${searchTerm} OR
          LOWER(email) LIKE ${searchTerm} OR
          LOWER(title) LIKE ${searchTerm} OR
          LOWER(ref_id) LIKE ${searchTerm} OR
          LOWER(COALESCE(company, '')) LIKE ${searchTerm}
        ))
        AND (${filterStatus}::text IS NULL OR status = ${filterStatus})
        AND (${filterCategory}::text IS NULL OR service_category = ${filterCategory})
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset};
    `;

    const countRows = await sql`
      SELECT COUNT(*)::int AS count
      FROM inquiries
      WHERE
        (${searchTerm}::text IS NULL OR (
          LOWER(name) LIKE ${searchTerm} OR
          LOWER(email) LIKE ${searchTerm} OR
          LOWER(title) LIKE ${searchTerm} OR
          LOWER(ref_id) LIKE ${searchTerm} OR
          LOWER(COALESCE(company, '')) LIKE ${searchTerm}
        ))
        AND (${filterStatus}::text IS NULL OR status = ${filterStatus})
        AND (${filterCategory}::text IS NULL OR service_category = ${filterCategory});
    `;

    const total = Number(countRows[0]?.count || 0);

    return {
      items: rows as unknown as ProjectInquiry[],
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1
    };
  }

  // Fallback to in-memory store
  const store = InquiryStore.getInstance();
  return store.getAll(options);
}

/**
 * Retrieves a single enquiry by its unique ID or Reference ID
 */
export async function fetchInquiryById(id: string): Promise<ProjectInquiry | null> {
  if (isDatabaseConfigured()) {
    const sql = getNeonSql();
    const rows = await sql`
      SELECT * FROM inquiries WHERE id = ${id} OR ref_id = ${id} LIMIT 1;
    `;
    if (rows.length === 0) return null;
    return rows[0] as unknown as ProjectInquiry;
  }

  const store = InquiryStore.getInstance();
  return store.getById(id) || null;
}

/**
 * Updates status, internal notes, or follow-up date for an enquiry
 */
export async function updateInquiryDetails(
  id: string,
  updates: Partial<Pick<ProjectInquiry, 'status' | 'internal_notes' | 'follow_up_date'>>
): Promise<ProjectInquiry | null> {
  const now = new Date().toISOString();

  if (isDatabaseConfigured()) {
    const sql = getNeonSql();
    const existing = await fetchInquiryById(id);
    if (!existing) return null;

    const newStatus = updates.status !== undefined ? updates.status : existing.status;
    const newNotes = updates.internal_notes !== undefined ? updates.internal_notes : existing.internal_notes;
    const newFollowUp = updates.follow_up_date !== undefined ? updates.follow_up_date : existing.follow_up_date;

    const rows = await sql`
      UPDATE inquiries
      SET
        status = ${newStatus},
        internal_notes = ${newNotes || null},
        follow_up_date = ${newFollowUp || null},
        updated_at = ${now}
      WHERE id = ${existing.id}
      RETURNING *;
    `;

    if (rows.length === 0) return null;
    return rows[0] as unknown as ProjectInquiry;
  }

  const store = InquiryStore.getInstance();
  return store.update(id, updates);
}

/**
 * Deletes an enquiry by ID (authorized action with confirmation)
 */
export async function removeInquiry(id: string): Promise<boolean> {
  if (isDatabaseConfigured()) {
    const sql = getNeonSql();
    const rows = await sql`
      DELETE FROM inquiries WHERE id = ${id} OR ref_id = ${id} RETURNING id;
    `;
    return rows.length > 0;
  }

  const store = InquiryStore.getInstance();
  return store.delete(id);
}

/**
 * Aggregates statistics for the Admin dashboard
 */
export async function fetchAdminStatistics(): Promise<AdminStats> {
  if (isDatabaseConfigured()) {
    const sql = getNeonSql();
    const rows = await sql`
      SELECT
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE status = 'new')::int AS new_count,
        COUNT(*) FILTER (WHERE status IN ('contacted', 'discussion_scheduled'))::int AS contacted_count,
        COUNT(*) FILTER (WHERE status IN ('in_progress', 'proposal_sent'))::int AS in_progress_count,
        COUNT(*) FILTER (WHERE status = 'completed')::int AS completed_count
      FROM inquiries;
    `;

    const row = rows[0] as any;
    return {
      total: Number(row?.total || 0),
      newCount: Number(row?.new_count || 0),
      contactedCount: Number(row?.contacted_count || 0),
      inProgressCount: Number(row?.in_progress_count || 0),
      completedCount: Number(row?.completed_count || 0)
    };
  }

  const store = InquiryStore.getInstance();
  return store.getStats();
}

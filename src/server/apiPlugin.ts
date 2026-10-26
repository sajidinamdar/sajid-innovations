import type { Plugin, ViteDevServer } from 'vite';
import type { IncomingMessage, ServerResponse } from 'http';
import { siteConfig } from '../config/siteConfig.ts';
import { sendInquiryEmails } from './emailService.ts';
import {
  verifyAdminCredentials,
  createSessionToken,
  verifySessionToken,
  revokeSessionToken,
  extractBearerToken
} from './auth.ts';
import {
  persistInquiry,
  fetchInquiries,
  fetchInquiryById,
  updateInquiryDetails,
  removeInquiry,
  fetchAdminStatistics
} from './db.ts';
import { ProjectInquiry } from '../types/index.ts';

// In-memory IP rate limiter for brute-force prevention
interface RateLimitRecord {
  count: number;
  resetAt: number;
}
const rateLimits = new Map<string, RateLimitRecord>();

function checkRateLimit(key: string, maxLimit: number, windowMs: number): boolean {
  const now = Date.now();
  const record = rateLimits.get(key);
  if (!record || now > record.resetAt) {
    rateLimits.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (record.count >= maxLimit) {
    return false;
  }
  record.count++;
  return true;
}

// Helper to parse JSON body from incoming Node request
function parseBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      // Safeguard max payload size (1MB)
      if (body.length > 1e6) {
        req.destroy();
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(new Error('Invalid JSON format'));
      }
    });
    req.on('error', err => reject(err));
  });
}

// Helper to send JSON response
function sendJson(res: ServerResponse, statusCode: number, data: any) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

// Check admin session using the shared auth module
async function getAuthorizedSession(req: IncomingMessage): Promise<{ username: string } | null> {
  const token = extractBearerToken(req.headers['authorization']);
  if (!token) return null;
  const result = await verifySessionToken(token);
  if (!result.valid || !result.username) return null;
  return { username: result.username };
}

export function apiPlugin(): Plugin {
  return {
    name: 'sajidtech-api-server',
    configureServer(server: ViteDevServer) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url || '';
        const method = req.method || 'GET';

        // Only handle /api endpoints
        if (!url.startsWith('/api')) {
          return next();
        }

        const urlObj = new URL(url, 'http://localhost:3000');
        const pathname = urlObj.pathname;

        try {
          // --- HEALTH CHECK ---
          if (pathname === '/api/health' && method === 'GET') {
            return sendJson(res, 200, {
              status: 'healthy',
              service: 'sajidtech-solutions-api',
              timestamp: new Date().toISOString()
            });
          }

          // --- PUBLIC: GET PROJECTS ---
          if (pathname === '/api/projects' && method === 'GET') {
            return sendJson(res, 200, {
              projects: siteConfig.projects
            });
          }

          // --- PUBLIC: SUBMIT IDEA INQUIRY ---
          if (pathname === '/api/ideas' && method === 'POST') {
            const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'local';
            if (!checkRateLimit(`enquiry_${clientIp}`, 20, 15 * 60 * 1000)) {
              return sendJson(res, 429, {
                error: 'Too many submissions from this connection. Please wait a few minutes before submitting another enquiry.'
              });
            }

            const body = await parseBody(req);

            // 1. Anti-spam honeypot detection
            if (body.honeypot && String(body.honeypot).trim() !== '') {
              return sendJson(res, 201, {
                success: true,
                ref_id: 'SI-2026-BOTREJECT',
                message: 'Your idea inquiry has been recorded.'
              });
            }

            // 2. Server-side validation
            const errors: Record<string, string> = {};
            if (!body.name || typeof body.name !== 'string' || body.name.trim().length < 2) {
              errors.name = 'Full name must be at least 2 characters.';
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!body.email || typeof body.email !== 'string' || !emailRegex.test(body.email.trim())) {
              errors.email = 'A valid email address is required.';
            }

            if (!body.title || typeof body.title !== 'string' || body.title.trim().length < 3) {
              errors.title = 'Project or idea title must be at least 3 characters.';
            }

            if (!body.service_category || typeof body.service_category !== 'string') {
              errors.service_category = 'Please select a service category.';
            }

            if (!body.problem_description || typeof body.problem_description !== 'string' || body.problem_description.trim().length < 10) {
              errors.problem_description = 'Please describe the problem or idea in at least 10 characters.';
            }

            if (!body.consent) {
              errors.consent = 'You must agree to the privacy policy to submit an inquiry.';
            }

            if (Object.keys(errors).length > 0) {
              return sendJson(res, 400, {
                error: 'Validation failed',
                details: errors
              });
            }

            // 3. Generate reference ID and record structure
            const year = new Date().getFullYear();
            const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
            let code = '';
            for (let i = 0; i < 6; i++) {
              code += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            const ref_id = `SI-${year}-${code}`;
            const nowIso = new Date().toISOString();

            const newInquiry: ProjectInquiry = {
              id: `inq-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
              ref_id,
              name: body.name.trim(),
              email: body.email.trim().toLowerCase(),
              phone: body.phone ? body.phone.trim() : undefined,
              company: body.company ? body.company.trim() : undefined,
              title: body.title.trim(),
              service_category: body.service_category.trim(),
              problem_description: body.problem_description.trim(),
              target_users: body.target_users ? body.target_users.trim() : undefined,
              desired_solution: body.desired_solution ? body.desired_solution.trim() : undefined,
              requested_features: body.requested_features ? body.requested_features.trim() : undefined,
              existing_url: body.existing_url ? body.existing_url.trim() : undefined,
              budget_range: body.budget_range || 'Not decided yet',
              timeline: body.timeline || 'Flexible',
              preferred_contact: body.preferred_contact || 'email',
              additional_details: body.additional_details ? body.additional_details.trim() : undefined,
              consent: Boolean(body.consent),
              status: 'new',
              created_at: nowIso,
              updated_at: nowIso
            };

            // 4. Persist in database
            await persistInquiry(newInquiry);

            // 5. Send instant email notification to owner and confirmation to customer
            await sendInquiryEmails(newInquiry).catch(err => {
              console.error('[API Server] Email notification warning:', err?.message || err);
            });

            return sendJson(res, 201, {
              success: true,
              ref_id: newInquiry.ref_id,
              message: "Thank you for sharing your idea. Your submission has been received. I'll review the details and contact you via your selected method to discuss next steps."
            });
          }

          // --- AUTH: LOGIN ---
          if (pathname === '/api/auth/login' && method === 'POST') {
            const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'local';
            if (!checkRateLimit(`login_${clientIp}`, 6, 60 * 1000)) {
              return sendJson(res, 429, {
                error: 'Too many login attempts. Please wait 1 minute before trying again.'
              });
            }

            const body = await parseBody(req);
            const usernameInput = String(body.username || '').trim();
            const passwordInput = String(body.password || '');

            const isValid = verifyAdminCredentials(usernameInput, passwordInput);
            if (!isValid) {
              return sendJson(res, 401, {
                error: 'Invalid administrator credentials.'
              });
            }

            const sessionToken = createSessionToken(usernameInput);

            return sendJson(res, 200, {
              token: sessionToken,
              user: {
                id: 'usr-admin-1',
                username: usernameInput,
                role: 'admin'
              }
            });
          }

          // --- AUTH: ME ---
          if (pathname === '/api/auth/me' && method === 'GET') {
            const session = await getAuthorizedSession(req);
            if (!session) {
              return sendJson(res, 401, { error: 'Unauthorized or session expired.' });
            }
            return sendJson(res, 200, {
              id: 'usr-admin-1',
              username: session.username,
              role: 'admin'
            });
          }

          // --- AUTH: LOGOUT ---
          if (pathname === '/api/auth/logout' && method === 'POST') {
            const token = extractBearerToken(req.headers['authorization']);
            if (token) {
              await revokeSessionToken(token);
            }
            return sendJson(res, 200, { success: true, message: 'Logged out successfully.' });
          }

          // --- ADMIN: DASHBOARD STATS ---
          if (pathname === '/api/admin/stats' && method === 'GET') {
            if (!(await getAuthorizedSession(req))) {
              return sendJson(res, 401, { error: 'Unauthorized or session expired.' });
            }
            const stats = await fetchAdminStatistics();
            return sendJson(res, 200, stats);
          }

          // --- ADMIN: LIST INQUIRIES ---
          if (pathname === '/api/admin/ideas' && method === 'GET') {
            if (!(await getAuthorizedSession(req))) {
              return sendJson(res, 401, { error: 'Unauthorized or session expired.' });
            }

            const search = urlObj.searchParams.get('search') || undefined;
            const status = urlObj.searchParams.get('status') || undefined;
            const category = urlObj.searchParams.get('category') || undefined;
            const page = parseInt(urlObj.searchParams.get('page') || '1', 10);
            const limit = parseInt(urlObj.searchParams.get('limit') || '15', 10);

            const result = await fetchInquiries({ search, status, category, page, limit });
            return sendJson(res, 200, result);
          }

          // --- ADMIN: SINGLE INQUIRY BY ID ---
          const singleInquiryMatch = pathname.match(/^\/api\/admin\/ideas\/([a-zA-Z0-9_-]+)$/);
          if (singleInquiryMatch) {
            const inquiryId = singleInquiryMatch[1];

            if (!(await getAuthorizedSession(req))) {
              return sendJson(res, 401, { error: 'Unauthorized or session expired.' });
            }

            if (method === 'GET') {
              const item = await fetchInquiryById(inquiryId);
              if (!item) {
                return sendJson(res, 404, { error: 'Inquiry not found.' });
              }
              return sendJson(res, 200, item);
            }

            if (method === 'PATCH') {
              const body = await parseBody(req);
              const updated = await updateInquiryDetails(inquiryId, {
                status: body.status,
                internal_notes: body.internal_notes,
                follow_up_date: body.follow_up_date
              });

              if (!updated) {
                return sendJson(res, 404, { error: 'Inquiry not found.' });
              }
              return sendJson(res, 200, updated);
            }

            if (method === 'DELETE') {
              const deleted = await removeInquiry(inquiryId);
              if (!deleted) {
                return sendJson(res, 404, { error: 'Inquiry not found.' });
              }
              return sendJson(res, 200, { success: true, message: 'Inquiry deleted successfully.' });
            }
          }

          // If no route matched
          return sendJson(res, 404, { error: 'API endpoint not found.' });
        } catch (error: any) {
          console.error('[API Server Error]', error?.message || error);
          return sendJson(res, 500, {
            error: 'Internal server error',
            message: 'Something went wrong processing your request.'
          });
        }
      });
    }
  };
}

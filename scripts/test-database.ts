import dns from 'dns';
if (typeof dns.setDefaultResultOrder === 'function') {
  dns.setDefaultResultOrder('ipv4first');
}

import fs from 'fs';
import path from 'path';
import {
  verifyAdminCredentials,
  createSessionToken,
  verifySessionToken,
  revokeSessionToken,
  extractBearerToken,
  safeCompare,
  getAdminConfig
} from '../src/server/auth.ts';
import {
  isDatabaseConfigured,
  persistInquiry,
  fetchInquiries,
  fetchInquiryById,
  updateInquiryDetails,
  removeInquiry,
  fetchAdminStatistics
} from '../src/server/db.ts';
import { ProjectInquiry } from '../src/types/index.ts';

async function runDatabaseTests() {
  console.log('====================================================');
  console.log('🧪 Sajid Innovations — Database & Admin API Tests');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, desc: string) {
    if (condition) {
      console.log(`✅ PASS: ${desc}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${desc}`);
      failed++;
    }
  }

  // --- 1. SCHEMA FILE AUDIT ---
  console.log('\n--- 1. SQL Schema Definition Audit ---');
  const schemaPath = path.resolve('src/server/schema.sql');
  assert(fs.existsSync(schemaPath), 'schema.sql exists in src/server/');
  const schemaSql = fs.readFileSync(schemaPath, 'utf-8');
  assert(schemaSql.includes('CREATE TABLE IF NOT EXISTS inquiries'), 'Schema defines inquiries table with IF NOT EXISTS');
  assert(schemaSql.includes('ref_id VARCHAR(32) UNIQUE NOT NULL'), 'ref_id is unique and non-null');
  assert(schemaSql.includes('idx_inquiries_ref_id'), 'Schema creates index on ref_id');
  assert(schemaSql.includes('idx_inquiries_status'), 'Schema creates index on status');

  // --- 2. AUTHENTICATION & SESSION SECURITY TESTS ---
  console.log('\n--- 2. Auth Module & Cryptographic Token Security ---');
  const adminConfig = getAdminConfig();
  assert(verifyAdminCredentials(adminConfig.username, adminConfig.password) === true, 'Valid configured credentials verify correctly');
  assert(verifyAdminCredentials(adminConfig.username, 'wrong_pass_test') === false, 'Wrong password returns false');
  assert(verifyAdminCredentials('wrong_user_test', adminConfig.password) === false, 'Wrong username returns false');
  assert(safeCompare('test-secret', 'test-secret') === true, 'Constant-time safeCompare matches equal strings');
  assert(safeCompare('test-secret', 'wrong-secret') === false, 'Constant-time safeCompare rejects unequal strings');

  const token = createSessionToken(adminConfig.username);
  assert(typeof token === 'string' && token.startsWith('sajid_adm_'), 'Generates signed token with sajid_adm_ prefix');

  const verified = await verifySessionToken(token);
  assert(verified.valid === true && verified.username === adminConfig.username, 'Valid signed token passes verification');

  // Tampered token test
  const tamperedToken = token.slice(0, -4) + 'abcd';
  const tamperedResult = await verifySessionToken(tamperedToken);
  assert(tamperedResult.valid === false, 'Tampered token signature is rejected');

  // Expired token test (token created with negative TTL)
  const expiredToken = createSessionToken('admin', -1000);
  const expiredResult = await verifySessionToken(expiredToken);
  assert(expiredResult.valid === false && expiredResult.error?.includes('expired') === true, 'Expired token is rejected');

  // Revocation test
  const tokenToRevoke = createSessionToken('admin');
  assert((await verifySessionToken(tokenToRevoke)).valid === true, 'Token is initially valid');
  await revokeSessionToken(tokenToRevoke);
  assert((await verifySessionToken(tokenToRevoke)).valid === false, 'Revoked token is immediately rejected');

  // Bearer extraction test
  assert(extractBearerToken(`Bearer ${token}`) === token, 'extractBearerToken extracts Bearer token');
  assert(extractBearerToken('Basic xyz') === null, 'extractBearerToken rejects non-Bearer headers');

  // --- 3. DATABASE REPOSITORY CRUD TESTS ---
  console.log('\n--- 3. Database Repository CRUD Lifecycle ---');
  console.log(`Database configured via environment: ${isDatabaseConfigured() ? 'YES (Neon)' : 'NO (Using development fallback)'}`);

  const testId = `inq-test-${Date.now()}`;
  const testRefId = `SI-2026-TESTDB`;
  const disposableInquiry: ProjectInquiry = {
    id: testId,
    ref_id: testRefId,
    name: 'Dr. Test Pathologist',
    email: 'dr.test@diagnosticlab.com',
    phone: '+91 98221 00000',
    company: 'Metropolis Test Lab',
    title: 'Sajinova Lab Trial Setup',
    service_category: 'Sajinova Lab Demo',
    problem_description: 'We need automated report printing with digital doctor signature and custom header offsets for 2 collection centers.',
    budget_range: '₹50,000 - ₹1,00,000',
    timeline: 'Immediate',
    preferred_contact: 'email',
    consent: true,
    status: 'new',
    internal_notes: 'Automated test record',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  // 3A: Create / Persist
  const saved = await persistInquiry(disposableInquiry);
  assert(saved.id === testId, 'Inquiry successfully saved with assigned ID');
  assert(saved.ref_id === testRefId, 'Inquiry successfully saved with assigned Ref ID');

  // 3B: Fetch by ID
  const fetched = await fetchInquiryById(testId);
  assert(fetched !== null && fetched.name === disposableInquiry.name, 'fetchInquiryById retrieves the stored record');

  // 3C: List & Search
  const list = await fetchInquiries({ search: 'Metropolis', limit: 10 });
  assert(list.items.some(i => i.id === testId), 'fetchInquiries finds the record via search query');

  // 3D: Update details
  const updated = await updateInquiryDetails(testId, {
    status: 'in_progress',
    internal_notes: 'Updated by automated test'
  });
  assert(updated !== null && updated.status === 'in_progress', 'updateInquiryDetails updates workflow status');
  assert(updated?.internal_notes === 'Updated by automated test', 'updateInquiryDetails updates internal notes');

  // 3E: Fetch Statistics
  const stats = await fetchAdminStatistics();
  assert(typeof stats.total === 'number' && stats.total > 0, 'fetchAdminStatistics returns aggregate numbers');
  assert(typeof stats.inProgressCount === 'number', 'fetchAdminStatistics counts in_progress inquiries');

  // 3F: Delete (Cleanup disposable record)
  const deleted = await removeInquiry(testId);
  assert(deleted === true, 'removeInquiry removes the disposable test record');

  const afterDelete = await fetchInquiryById(testId);
  assert(afterDelete === null, 'Record is confirmed deleted and no longer retrievable');

  // --- 4. PRODUCTION SERVERLESS ENDPOINT HANDLERS ---
  console.log('\n--- 4. Vercel Serverless Handlers Verification ---');

  function createMockRes() {
    let statusCode = 200;
    let headers: Record<string, string> = {};
    let body: any = null;
    let ended = false;
    const res: any = {
      setHeader: (k: string, v: string) => { headers[k] = v; },
      status: (code: number) => { statusCode = code; return res; },
      json: (data: any) => { body = data; ended = true; return res; },
      end: () => { ended = true; return res; },
      getStatusCode: () => statusCode,
      getBody: () => body
    };
    return res;
  }

  // 4A: api/auth/login.ts
  const loginHandler = (await import('../api/auth/login.ts')).default;
  const loginRes = createMockRes();
  await loginHandler({
    method: 'POST',
    headers: {},
    body: { username: adminConfig.username, password: adminConfig.password }
  }, loginRes);
  assert(loginRes.getStatusCode() === 200, 'api/auth/login returns HTTP 200 for valid credentials');
  assert(typeof loginRes.getBody().token === 'string', 'api/auth/login returns signed token');

  const activeAuthToken = loginRes.getBody().token;

  // 4B: api/auth/me.ts
  const meHandler = (await import('../api/auth/me.ts')).default;
  const meRes = createMockRes();
  await meHandler({
    method: 'GET',
    headers: { 'authorization': `Bearer ${activeAuthToken}` }
  }, meRes);
  assert(meRes.getStatusCode() === 200, 'api/auth/me returns HTTP 200 with Bearer token');
  assert(meRes.getBody().role === 'admin', 'api/auth/me returns role "admin"');

  // 4C: api/admin/stats.ts
  const statsHandler = (await import('../api/admin/stats.ts')).default;
  const adminStatsRes = createMockRes();
  await statsHandler({
    method: 'GET',
    headers: { 'authorization': `Bearer ${activeAuthToken}` }
  }, adminStatsRes);
  assert(adminStatsRes.getStatusCode() === 200, 'api/admin/stats returns HTTP 200 with Bearer token');
  assert(typeof adminStatsRes.getBody().total === 'number', 'api/admin/stats returns numeric stats');

  // 4D: api/admin/ideas.ts
  const ideasHandler = (await import('../api/admin/ideas.ts')).default;
  const adminIdeasRes = createMockRes();
  await ideasHandler({
    method: 'GET',
    headers: { 'authorization': `Bearer ${activeAuthToken}` },
    query: { limit: '5' }
  }, adminIdeasRes);
  assert(adminIdeasRes.getStatusCode() === 200, 'api/admin/ideas returns HTTP 200 with Bearer token');
  assert(Array.isArray(adminIdeasRes.getBody().items), 'api/admin/ideas returns list items');

  // 4E: api/auth/logout.ts
  const logoutHandler = (await import('../api/auth/logout.ts')).default;
  const logoutRes = createMockRes();
  await logoutHandler({
    method: 'POST',
    headers: { 'authorization': `Bearer ${activeAuthToken}` }
  }, logoutRes);
  assert(logoutRes.getStatusCode() === 200, 'api/auth/logout returns HTTP 200');

  // 4F: Verify revoked token rejected by api/admin/stats.ts
  const afterLogoutStatsRes = createMockRes();
  await statsHandler({
    method: 'GET',
    headers: { 'authorization': `Bearer ${activeAuthToken}` }
  }, afterLogoutStatsRes);
  assert(afterLogoutStatsRes.getStatusCode() === 401, 'Revoked token is rejected by protected endpoints with HTTP 401');

  console.log('\n====================================================');
  console.log(`Database & Admin API Results: ${passed} passed, ${failed} failed`);
  console.log('====================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runDatabaseTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});

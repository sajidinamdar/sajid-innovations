import dotenv from 'dotenv';
import path from 'path';
import {
  createSessionToken,
  verifySessionToken,
  verifySessionTokenSignature,
  verifyAdminCredentials,
  getAdminConfig,
  revokeSessionToken,
  extractBearerToken,
  hashToken,
  _clearRevocationMemoryForTesting,
  isAllowedAdminOrigin,
  applyAdminCors
} from '../src/server/auth.ts';
import {
  checkLoginRateLimit,
  getClientIp,
  _resetRateLimitsForTesting,
  MAX_LOGIN_ATTEMPTS
} from '../api/auth/login.ts';
import { isTokenRevokedInDb, getNeonSql } from '../src/server/db.ts';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function runSessionSecuritySuite() {
  console.log('====================================================');
  console.log('🛡️ Sajid Innovations — Session & Logout Security Tests');
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

  // --- 1. TOKEN CREATION & CRYPTOGRAPHIC INTEGRITY ---
  console.log('--- 1. Cryptographic Token Integrity ---');
  const token = createSessionToken('admin', 4 * 60 * 60 * 1000);
  assert(token.startsWith('sajid_adm_'), 'Token starts with proper prefix');
  const validCheck = await verifySessionToken(token);
  assert(validCheck.valid === true, 'Fresh token verifies successfully');
  assert(validCheck.username === 'admin', 'Decoded username matches "admin"');

  // --- 2. TAMPERED TOKENS REJECTION ---
  console.log('\n--- 2. Tampered & Malformed Token Defense ---');
  const parts = token.split('.');
  const tamperedSigToken = `${parts[0]}.${parts[1].slice(0, -6)}ffffff`;
  const tamperedSigRes = await verifySessionToken(tamperedSigToken);
  assert(tamperedSigRes.valid === false, 'Tampered signature is strictly rejected');
  assert(tamperedSigRes.error === 'Invalid token signature.', 'Returns clear signature error');

  const tamperedPayloadToken = `sajid_adm_dGVzdA.${parts[1]}`;
  const tamperedPayloadRes = await verifySessionToken(tamperedPayloadToken);
  assert(tamperedPayloadRes.valid === false, 'Tampered payload is strictly rejected');

  const malformedToken = 'invalid_format_without_prefix';
  const malformedRes = await verifySessionToken(malformedToken);
  assert(malformedRes.valid === false, 'Malformed token string is rejected');

  // --- 3. EXPIRED TOKEN REJECTION ---
  console.log('\n--- 3. Short-Lived Expiration Defense ---');
  const expiredToken = createSessionToken('admin', -5000); // 5 seconds in the past
  const expiredRes = await verifySessionToken(expiredToken);
  assert(expiredRes.valid === false, 'Expired token is strictly rejected');
  assert(expiredRes.error === 'Session token has expired.', 'Error reports token expiration');

  // --- 4. MULTI-INSTANCE / DISTRIBUTED LOGOUT REVOCATION TEST ---
  console.log('\n--- 4. Cross-Instance Serverless Logout Revocation ---');
  if (process.env.SKIP_DB_MUTATION === 'true') {
    console.log('ℹ️ SKIP_DB_MUTATION=true: Skipping Neon write/delete mutation (read-only verification mode)');
  } else {
    // Instance A: Generates a new active session token
    const testSessionToken = createSessionToken('admin', 4 * 60 * 60 * 1000);
    const testTokenHash = hashToken(testSessionToken);

    // Instance B (independent cold start): Simulating a container with empty memory
    _clearRevocationMemoryForTesting();
    const instanceBCheck = await verifySessionToken(testSessionToken);
    assert(instanceBCheck.valid === true, 'Instance B (cold start) verifies token before logout');

    // Instance A: Admin logs out
    console.log('Logging out on Instance A...');
    await revokeSessionToken(testSessionToken);

    // Check that the persistent database recorded the revoked token hash
    const isRevokedInDb = await isTokenRevokedInDb(testTokenHash);
    assert(isRevokedInDb === true, 'Token hash was written to persistent Neon revoked_tokens table');

    // Instance C (completely independent cold container with ZERO memory of logout)
    console.log('Simulating Instance C (cold lambda container in separate region/process)...');
    _clearRevocationMemoryForTesting();
    const instanceCCheck = await verifySessionToken(testSessionToken);
    assert(instanceCCheck.valid === false, 'Instance C (separate instance) rejects the logged-out token');
    assert(instanceCCheck.error === 'Session has been logged out.', 'Instance C returns "Session has been logged out"');

    // Cleanup the test revocation record to leave DB clean
    try {
      const sql = getNeonSql();
      await sql`DELETE FROM revoked_tokens WHERE token_hash = ${testTokenHash}`;
      console.log('✅ Cleaned disposable test revocation entry from Neon');
    } catch {}
  }

  // --- 4B. FAIL-CLOSED BEHAVIOR ON DATABASE QUERY ERROR ---
  console.log('\n--- 4B. Fail-Closed Authentication on DB Query Error ---');
  const tempToken = createSessionToken('admin', 4 * 60 * 60 * 1000);
  _clearRevocationMemoryForTesting();
  const origDbUrl = process.env.DATABASE_URL;
  try {
    process.env.DATABASE_URL = 'postgresql://invalid_user:invalid_pass@127.0.0.1:54321/neondb';
    const failClosedCheck = await verifySessionToken(tempToken);
    assert(failClosedCheck.valid === false, 'Token verification fails closed when database check fails');
    assert(failClosedCheck.error?.includes('Authentication verification error') === true, 'Returns fail-closed error description');
  } finally {
    process.env.DATABASE_URL = origDbUrl;
  }

  // --- 4C. FAIL-CLOSED BEHAVIOR ON MISSING CREDENTIALS & SECRETS ---
  console.log('\n--- 4C. Fail-Closed Defense on Missing Credentials & Secrets ---');
  const origPassword = process.env.ADMIN_PASSWORD;
  const origSecret = process.env.ADMIN_SESSION_SECRET;
  const origDevFallback = process.env.ALLOW_DEV_AUTH_FALLBACK;
  const origNodeEnv = process.env.NODE_ENV;

  try {
    delete process.env.ALLOW_DEV_AUTH_FALLBACK;

    // 4C.1: Missing ADMIN_PASSWORD
    delete process.env.ADMIN_PASSWORD;
    const credsCheckMissing = verifyAdminCredentials('admin', 'any_attempt_here');
    assert(credsCheckMissing === false, 'verifyAdminCredentials fails closed (false) when ADMIN_PASSWORD is missing');

    const credsCheckOldFallback = verifyAdminCredentials('admin', 'sajidtech2026!');
    assert(credsCheckOldFallback === false, 'Legacy default password "sajidtech2026!" is rejected when ADMIN_PASSWORD is unset');

    // 4C.2: Missing ADMIN_SESSION_SECRET
    delete process.env.ADMIN_SESSION_SECRET;
    let createThrows = false;
    try {
      createSessionToken('admin');
    } catch (err: any) {
      createThrows = true;
      assert(err.message.includes('ADMIN_SESSION_SECRET is not configured'), 'createSessionToken throws clear error when ADMIN_SESSION_SECRET is missing');
    }
    assert(createThrows === true, 'createSessionToken fails closed (throws exception) without session secret');

    const verifyMissingSecret = await verifySessionToken(token);
    assert(verifyMissingSecret.valid === false, 'verifySessionToken fails closed (valid=false) when ADMIN_SESSION_SECRET is missing');
    assert(verifyMissingSecret.error === 'Authentication configuration error.', 'verifySessionToken returns authentication configuration error');

    const verifySigMissingSecret = verifySessionTokenSignature(token);
    assert(verifySigMissingSecret.valid === false, 'verifySessionTokenSignature fails closed when ADMIN_SESSION_SECRET is missing');

    // 4C.3: Hardcoded fallbacks strictly blocked when VERCEL is set
    process.env.VERCEL = '1';
    process.env.ALLOW_DEV_AUTH_FALLBACK = 'true';
    const configOnVercel = getAdminConfig();
    assert(configOnVercel.password === '', 'getAdminConfig returns empty password on Vercel even if ALLOW_DEV_AUTH_FALLBACK=true');
    assert(configOnVercel.sessionSecret === '', 'getAdminConfig returns empty secret on Vercel even if ALLOW_DEV_AUTH_FALLBACK=true');
    delete process.env.VERCEL;

  } finally {
    if (origPassword !== undefined) process.env.ADMIN_PASSWORD = origPassword;
    else delete process.env.ADMIN_PASSWORD;

    if (origSecret !== undefined) process.env.ADMIN_SESSION_SECRET = origSecret;
    else delete process.env.ADMIN_SESSION_SECRET;

    if (origDevFallback !== undefined) process.env.ALLOW_DEV_AUTH_FALLBACK = origDevFallback;
    else delete process.env.ALLOW_DEV_AUTH_FALLBACK;

    if (origNodeEnv !== undefined) process.env.NODE_ENV = origNodeEnv;
    else delete process.env.NODE_ENV;
  }

  // --- 5. ENDPOINT-LEVEL HTTP REJECTION ACROSS ALL ADMIN ROUTES ---
  console.log('\n--- 5. HTTP Admin Endpoints Rejection Tests (Dev Server) ---');
  const baseUrl = 'http://localhost:3000';

  const endpoints = [
    { method: 'GET', url: `${baseUrl}/api/auth/me` },
    { method: 'GET', url: `${baseUrl}/api/admin/stats` },
    { method: 'GET', url: `${baseUrl}/api/admin/ideas` },
    { method: 'GET', url: `${baseUrl}/api/admin/ideas/inq-dummy-id` }
  ];

  for (const ep of endpoints) {
    // 5A: Missing auth header
    const noAuth = await fetch(ep.url, { method: ep.method });
    assert(noAuth.status === 401, `${ep.method} ${ep.url.replace(baseUrl, '')} returns 401 without auth header`);

    // 5B: Tampered token header
    const badAuth = await fetch(ep.url, {
      method: ep.method,
      headers: { 'Authorization': `Bearer ${tamperedSigToken}` }
    });
    assert(badAuth.status === 401, `${ep.method} ${ep.url.replace(baseUrl, '')} returns 401 with tampered signature`);

    // 5C: Expired token header
    const expAuth = await fetch(ep.url, {
      method: ep.method,
      headers: { 'Authorization': `Bearer ${expiredToken}` }
    });
    assert(expAuth.status === 401, `${ep.method} ${ep.url.replace(baseUrl, '')} returns 401 with expired token`);
  }

  // --- 6. ADMIN CORS ORIGIN RESTRICTION TESTS ---
  console.log('\n--- 6. Admin CORS Origin Restriction Tests ---');
  assert(isAllowedAdminOrigin('https://sajidinnovations.in') === true, 'Production apex domain is allowed');
  assert(isAllowedAdminOrigin('https://www.sajidinnovations.in') === true, 'Production www domain is allowed');
  assert(isAllowedAdminOrigin('http://sajidinnovations.in') === false, 'Insecure HTTP production domain is strictly rejected');
  assert(isAllowedAdminOrigin('https://sajid-innovations-preview-123.vercel.app') === true, 'Vercel preview deployment is allowed');
  assert(isAllowedAdminOrigin('https://any-branch-name.vercel.app') === true, 'Vercel branch deployment is allowed');
  assert(isAllowedAdminOrigin('http://localhost:3000') === true, 'Localhost 3000 is allowed');
  assert(isAllowedAdminOrigin('http://127.0.0.1:5173') === true, 'Localhost 5173 is allowed');
  assert(isAllowedAdminOrigin('https://malicious-site.com') === false, 'Untrusted origin is strictly rejected');
  assert(isAllowedAdminOrigin('https://sajidinnovations.in.evil.com') === false, 'Domain suffix spoofing is strictly rejected');
  assert(isAllowedAdminOrigin('https://evil-vercel.app.attacker.com') === false, 'Vercel preview spoofing is strictly rejected');
  assert(isAllowedAdminOrigin(undefined) === false, 'Undefined origin returns false');

  // Verify applyAdminCors behavior
  const mockHeaders: Record<string, string> = {};
  const mockRes: any = {
    statusCode: 200,
    setHeader: (k: string, v: string) => { mockHeaders[k] = v; },
    status: function(code: number) { this.statusCode = code; return this; },
    json: function() { return this; },
    end: function() { return this; }
  };

  // 6A: Same-origin request without Origin header -> No Access-Control-Allow-Origin: *
  delete mockHeaders['Access-Control-Allow-Origin'];
  applyAdminCors({ method: 'GET', headers: {} }, mockRes, 'GET, OPTIONS');
  assert(mockHeaders['Access-Control-Allow-Origin'] === undefined, 'Same-origin request does not set wildcard or unnecessary CORS');

  // 6B: Trusted origin request -> sets matching origin, never wildcard *
  mockRes.statusCode = 200;
  applyAdminCors({ method: 'GET', headers: { origin: 'https://sajidinnovations.in' } }, mockRes, 'GET, OPTIONS');
  assert(mockHeaders['Access-Control-Allow-Origin'] === 'https://sajidinnovations.in', 'Allowed origin reflects exact trusted origin');
  assert(mockHeaders['Access-Control-Allow-Origin'] !== '*', 'Wildcard Access-Control-Allow-Origin: * is completely eliminated');
  assert(mockHeaders['Vary'] === 'Origin', 'Sets Vary: Origin for proper cache partitioning');

  // 6C: Untrusted origin OPTIONS preflight -> returns 403 Forbidden
  let rejectedPreflightCode = 200;
  const mockRejectRes: any = {
    statusCode: 200,
    setHeader: () => {},
    status: function(code: number) { rejectedPreflightCode = code; return this; },
    json: function() { return this; },
    end: function() { return this; }
  };
  const preflightHandled = applyAdminCors({ method: 'OPTIONS', headers: { origin: 'https://evil.com' } }, mockRejectRes, 'GET, OPTIONS');
  assert(preflightHandled === false, 'Untrusted preflight halts request execution');
  assert(rejectedPreflightCode === 403, 'Untrusted preflight returns HTTP 403 Forbidden');

  // --- 7. LOGIN RATE LIMITING & CLIENT IP EXTRACTION TESTS ---
  console.log('\n--- 7. Login Rate Limiting & Client IP Extraction Tests ---');
  _resetRateLimitsForTesting();

  // 7A: IP extraction handles proxies and Vercel edge headers
  const mockReqForwarded = { headers: { 'x-forwarded-for': '203.0.113.195, 70.41.3.18, 150.172.238.178' } };
  assert(getClientIp(mockReqForwarded) === '203.0.113.195', 'Extracts genuine client IP from first x-forwarded-for entry');

  const mockReqRealIp = { headers: { 'x-real-ip': '198.51.100.42' } };
  assert(getClientIp(mockReqRealIp) === '198.51.100.42', 'Extracts client IP from x-real-ip header');

  // 7B: Allows attempts within MAX_LOGIN_ATTEMPTS threshold
  const testIp = '192.0.2.100';
  for (let i = 1; i <= MAX_LOGIN_ATTEMPTS; i++) {
    const res = checkLoginRateLimit(testIp);
    assert(res.allowed === true, `Attempt ${i}/${MAX_LOGIN_ATTEMPTS} is allowed`);
    assert(res.remaining === MAX_LOGIN_ATTEMPTS - i, `Attempt ${i} remaining correctly reports ${MAX_LOGIN_ATTEMPTS - i}`);
  }

  // 7C: Blocks attempt when threshold exceeded
  const blockedRes = checkLoginRateLimit(testIp);
  assert(blockedRes.allowed === false, 'Attempt exceeding MAX_LOGIN_ATTEMPTS is strictly blocked');
  assert(blockedRes.remaining === 0, 'Remaining attempts reported as 0');
  assert(blockedRes.retryAfterSeconds > 0 && blockedRes.retryAfterSeconds <= 60, 'Returns valid retryAfterSeconds window (1-60s)');

  // 7D: Different IP is not blocked (per-IP isolation)
  const differentIpRes = checkLoginRateLimit('192.0.2.101');
  assert(differentIpRes.allowed === true, 'Different client IP is evaluated independently');
  _resetRateLimitsForTesting();

  console.log('\n====================================================');
  console.log(`Session Security Results: ${passed} passed, ${failed} failed`);
  console.log('====================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runSessionSecuritySuite().catch(err => {
  console.error('Session security suite error:', err);
  process.exit(1);
});

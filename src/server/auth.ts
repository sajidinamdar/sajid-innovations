import crypto from 'crypto';
import dotenv from 'dotenv';
import path from 'path';
import { isTokenRevokedInDb, persistRevokedToken } from './db.ts';

// Ensure .env is loaded in development/server environments
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// Standard short-lived session duration for production: 4 hours
const DEFAULT_SESSION_TTL_MS = 4 * 60 * 60 * 1000;

// In-memory cache for fast revocation checks in warm serverless instances
const revokedTokens = new Set<string>();

/**
 * Computes a secure SHA-256 hash of a session token for storage and revocation lookups
 */
export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

/**
 * Resolves admin configuration.
 * Hardcoded fallback credentials and secrets are strictly eliminated from production and preview paths.
 * If ADMIN_PASSWORD or ADMIN_SESSION_SECRET is missing or empty, empty strings are returned,
 * causing all authentication, credential verification, and session creation operations to fail closed.
 *
 * Local developer convenience fallback is permitted ONLY when:
 * 1. NODE_ENV === 'development'
 * 2. process.env.VERCEL is falsy (not running on Vercel preview or production)
 * 3. process.env.ALLOW_DEV_AUTH_FALLBACK === 'true' (explicit opt-in)
 */
export function getAdminConfig() {
  const isCloudOrProd = process.env.NODE_ENV === 'production' || !!process.env.VERCEL;
  const isExplicitDevFallbackAllowed =
    !isCloudOrProd &&
    process.env.NODE_ENV === 'development' &&
    process.env.ALLOW_DEV_AUTH_FALLBACK === 'true';

  const username = (process.env.ADMIN_USERNAME || 'admin').trim();
  const password = process.env.ADMIN_PASSWORD ? process.env.ADMIN_PASSWORD.trim() : (isExplicitDevFallbackAllowed ? 'sajidtech2026!' : '');
  const sessionSecret = process.env.ADMIN_SESSION_SECRET ? process.env.ADMIN_SESSION_SECRET.trim() : (isExplicitDevFallbackAllowed ? 'sajidinnovations_dev_secret_key_84920' : '');

  return {
    username,
    password,
    sessionSecret
  };
}

/**
 * Constant-time string comparison to prevent timing attacks
 */
export function safeCompare(a: string, b: string): boolean {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const hashA = crypto.createHash('sha256').update(a).digest();
  const hashB = crypto.createHash('sha256').update(b).digest();
  return crypto.timingSafeEqual(hashA, hashB);
}

/**
 * Validates admin credentials using timing-safe comparison.
 * Fails closed if ADMIN_PASSWORD is missing or unconfigured.
 */
export function verifyAdminCredentials(usernameInput: string, passwordInput: string): boolean {
  if (!usernameInput || !passwordInput) return false;
  const config = getAdminConfig();
  if (!config.password) {
    console.error('[Auth Security] Fail-closed: ADMIN_PASSWORD is not configured in environment variables.');
    return false;
  }
  const userValid = safeCompare(usernameInput.trim(), config.username);
  const passValid = safeCompare(passwordInput, config.password);
  return userValid && passValid;
}

/**
 * Creates a signed, tamper-proof session token with unique ID (jti) and expiration.
 * Fails closed if ADMIN_SESSION_SECRET is missing or unconfigured.
 */
export function createSessionToken(username: string, ttlMs: number = DEFAULT_SESSION_TTL_MS): string {
  const config = getAdminConfig();
  if (!config.sessionSecret) {
    throw new Error('ADMIN_SESSION_SECRET is not configured. Session creation failed closed.');
  }
  const expiresAt = Date.now() + ttlMs;
  const jti = crypto.randomBytes(16).toString('hex');
  const payload = JSON.stringify({ u: username, exp: expiresAt, jti });
  const b64Payload = Buffer.from(payload).toString('base64url');

  const signature = crypto
    .createHmac('sha256', config.sessionSecret)
    .update(b64Payload)
    .digest('hex');

  return `sajid_adm_${b64Payload}.${signature}`;
}

/**
 * Verifies a signed session token, checking its HMAC signature, expiration,
 * and checking revocation across both local memory cache and persistent PostgreSQL storage.
 */
export async function verifySessionToken(token: string): Promise<{ valid: boolean; username?: string; error?: string }> {
  if (!token || typeof token !== 'string') {
    return { valid: false, error: 'Token missing.' };
  }

  if (!token.startsWith('sajid_adm_')) {
    return { valid: false, error: 'Invalid token format.' };
  }

  const tokenBody = token.slice('sajid_adm_'.length);
  const parts = tokenBody.split('.');
  if (parts.length !== 2) {
    return { valid: false, error: 'Malformed token.' };
  }

  const [b64Payload, providedSignature] = parts;
  const config = getAdminConfig();
  if (!config.sessionSecret) {
    console.error('[Auth Security] Fail-closed: ADMIN_SESSION_SECRET is not configured in environment variables.');
    return { valid: false, error: 'Authentication configuration error.' };
  }

  // 1. Verify HMAC signature in constant time
  const expectedSignature = crypto
    .createHmac('sha256', config.sessionSecret)
    .update(b64Payload)
    .digest('hex');

  const isSigValid = safeCompare(providedSignature, expectedSignature);
  if (!isSigValid) {
    return { valid: false, error: 'Invalid token signature.' };
  }

  // 2. Decode and check expiration
  let parsed: { u: string; exp: number; jti?: string };
  try {
    const jsonStr = Buffer.from(b64Payload, 'base64url').toString('utf-8');
    parsed = JSON.parse(jsonStr);

    if (!parsed || typeof parsed.exp !== 'number' || !parsed.u) {
      return { valid: false, error: 'Invalid token payload.' };
    }

    if (Date.now() > parsed.exp) {
      return { valid: false, error: 'Session token has expired.' };
    }
  } catch {
    return { valid: false, error: 'Token payload decode error.' };
  }

  // 3. Check revocation status
  const tokenHash = hashToken(token);

  // Fast-path: Check local warm-container memory cache
  if (revokedTokens.has(tokenHash)) {
    return { valid: false, error: 'Session has been logged out.' };
  }

  // Persistent cross-instance check: Check PostgreSQL Neon database
  try {
    const isRevokedInDatabase = await isTokenRevokedInDb(tokenHash);
    if (isRevokedInDatabase) {
      revokedTokens.add(tokenHash);
      return { valid: false, error: 'Session has been logged out.' };
    }
  } catch (dbErr: any) {
    // Fail-Closed Security: If database query fails, do not silently treat the token as valid.
    console.error('[Auth Security] Fail-closed rejection: unable to verify session revocation status against database:', dbErr?.message || dbErr);
    return { valid: false, error: 'Authentication verification error. Please retry.' };
  }

  return { valid: true, username: parsed.u };
}

/**
 * Synchronous structural and cryptographic signature validation (without DB I/O)
 */
export function verifySessionTokenSignature(token: string): { valid: boolean; username?: string; error?: string } {
  if (!token || typeof token !== 'string') {
    return { valid: false, error: 'Token missing.' };
  }

  if (!token.startsWith('sajid_adm_')) {
    return { valid: false, error: 'Invalid token format.' };
  }

  const tokenBody = token.slice('sajid_adm_'.length);
  const parts = tokenBody.split('.');
  if (parts.length !== 2) {
    return { valid: false, error: 'Malformed token.' };
  }

  const [b64Payload, providedSignature] = parts;
  const config = getAdminConfig();
  if (!config.sessionSecret) {
    return { valid: false, error: 'Authentication configuration error.' };
  }

  const expectedSignature = crypto
    .createHmac('sha256', config.sessionSecret)
    .update(b64Payload)
    .digest('hex');

  if (!safeCompare(providedSignature, expectedSignature)) {
    return { valid: false, error: 'Invalid token signature.' };
  }

  try {
    const jsonStr = Buffer.from(b64Payload, 'base64url').toString('utf-8');
    const parsed = JSON.parse(jsonStr);
    if (Date.now() > parsed.exp) {
      return { valid: false, error: 'Session token has expired.' };
    }
    return { valid: true, username: parsed.u };
  } catch {
    return { valid: false, error: 'Token payload decode error.' };
  }
}

/**
 * Revokes a session token on logout, recording it in both the local instance cache
 * and Neon PostgreSQL persistent storage for global cross-instance revocation.
 */
export async function revokeSessionToken(token: string): Promise<void> {
  if (token && typeof token === 'string') {
    const tokenHash = hashToken(token);
    revokedTokens.add(tokenHash);

    // Limit memory footprint of local blacklist to 1000 items
    if (revokedTokens.size > 1000) {
      const first = revokedTokens.values().next().value;
      if (first) revokedTokens.delete(first);
    }

    // Determine expiration timestamp for persistent DB cleanup
    let expiresAt = new Date(Date.now() + DEFAULT_SESSION_TTL_MS);
    try {
      const tokenBody = token.replace(/^sajid_adm_/, '');
      const [b64Payload] = tokenBody.split('.');
      if (b64Payload) {
        const parsed = JSON.parse(Buffer.from(b64Payload, 'base64url').toString('utf-8'));
        if (parsed && typeof parsed.exp === 'number') {
          expiresAt = new Date(parsed.exp);
        }
      }
    } catch {
      // Fallback to default TTL
    }

    // Persist to Neon PostgreSQL
    await persistRevokedToken(tokenHash, expiresAt);
  }
}

/**
 * Extracts Bearer token from HTTP Authorization header
 */
export function extractBearerToken(authHeader?: string): string | null {
  if (!authHeader || typeof authHeader !== 'string') return null;
  const parts = authHeader.trim().split(' ');
  if (parts.length === 2 && parts[0].toLowerCase() === 'bearer') {
    return parts[1];
  }
  return null;
}

/**
 * Helper to clear local in-memory cache strictly for test simulation of independent instances
 */
export function _clearRevocationMemoryForTesting(): void {
  revokedTokens.clear();
}

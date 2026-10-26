import { verifyAdminCredentials, createSessionToken, applyAdminCors } from '../../src/server/auth.ts';

// In-memory rate limiting map for login protection
const loginAttempts = new Map<string, { count: number; resetAt: number }>();
export const MAX_LOGIN_ATTEMPTS = 6;
export const WINDOW_MS = 60 * 1000;

/**
 * Accurately extracts the client IP address from Vercel edge headers or socket.
 * Takes the first IP from x-forwarded-for (client IP before proxies) or x-real-ip.
 */
export function getClientIp(req: any): string {
  const forwarded = req.headers?.['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim();
  }
  if (typeof req.headers?.['x-real-ip'] === 'string' && req.headers['x-real-ip'].length > 0) {
    return req.headers['x-real-ip'].trim();
  }
  return req.socket?.remoteAddress || 'unknown';
}

/**
 * Checks and updates rate limit state for an IP.
 * Cleans up expired entries periodically to prevent memory leaks in warm containers.
 */
export function checkLoginRateLimit(ip: string): { allowed: boolean; remaining: number; retryAfterSeconds: number } {
  const now = Date.now();

  // Prune expired records if map exceeds 500 entries
  if (loginAttempts.size > 500) {
    for (const [key, record] of loginAttempts.entries()) {
      if (now > record.resetAt) {
        loginAttempts.delete(key);
      }
    }
  }

  const record = loginAttempts.get(ip);
  if (!record || now > record.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: MAX_LOGIN_ATTEMPTS - 1, retryAfterSeconds: 0 };
  }

  if (record.count >= MAX_LOGIN_ATTEMPTS) {
    const retryAfterSeconds = Math.max(1, Math.ceil((record.resetAt - now) / 1000));
    return { allowed: false, remaining: 0, retryAfterSeconds };
  }

  record.count++;
  const remaining = Math.max(0, MAX_LOGIN_ATTEMPTS - record.count);
  return { allowed: true, remaining, retryAfterSeconds: 0 };
}

/**
 * Testing helper to reset rate limit state between test executions
 */
export function _resetRateLimitsForTesting(): void {
  loginAttempts.clear();
}

export default async function handler(req: any, res: any) {
  if (!applyAdminCors(req, res, 'POST, OPTIONS')) return;
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const clientIp = getClientIp(req);
  const rateLimit = checkLoginRateLimit(clientIp);

  if (!rateLimit.allowed) {
    res.setHeader('Retry-After', String(rateLimit.retryAfterSeconds));
    res.setHeader('RateLimit-Limit', String(MAX_LOGIN_ATTEMPTS));
    res.setHeader('RateLimit-Remaining', '0');
    res.setHeader('RateLimit-Reset', String(rateLimit.retryAfterSeconds));
    return res.status(429).json({
      error: `Too many login attempts. Please wait ${rateLimit.retryAfterSeconds} seconds before retrying.`
    });
  }

  res.setHeader('RateLimit-Limit', String(MAX_LOGIN_ATTEMPTS));
  res.setHeader('RateLimit-Remaining', String(rateLimit.remaining));

  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required.' });
    }

    const isValid = verifyAdminCredentials(String(username), String(password));
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid administrator credentials.' });
    }

    const token = createSessionToken(String(username).trim());

    return res.status(200).json({
      token,
      user: {
        id: 'usr-admin-1',
        username: String(username).trim(),
        role: 'admin'
      }
    });
  } catch (error: any) {
    console.error('[API Auth Login Error]:', error?.message || error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

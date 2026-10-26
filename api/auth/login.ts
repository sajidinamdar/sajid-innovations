import { verifyAdminCredentials, createSessionToken } from '../../src/server/auth.ts';

// In-memory rate limiting map for login protection
const loginAttempts = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = loginAttempts.get(ip);
  if (!record || now > record.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + 60000 });
    return false;
  }
  if (record.count >= 6) {
    return true;
  }
  record.count++;
  return false;
}

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const clientIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
  if (isRateLimited(String(clientIp))) {
    return res.status(429).json({ error: 'Too many login attempts. Please wait 1 minute before retrying.' });
  }

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

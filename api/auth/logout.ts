import { extractBearerToken, revokeSessionToken } from '../../src/server/auth.ts';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const token = extractBearerToken(req.headers['authorization']);
  if (token) {
    await revokeSessionToken(token);
  }

  return res.status(200).json({ success: true, message: 'Logged out successfully.' });
}

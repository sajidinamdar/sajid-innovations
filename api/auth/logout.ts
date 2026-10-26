import { extractBearerToken, revokeSessionToken, applyAdminCors } from '../../src/server/auth.ts';

export default async function handler(req: any, res: any) {
  if (!applyAdminCors(req, res, 'POST, OPTIONS')) return;
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const token = extractBearerToken(req.headers['authorization']);
  if (token) {
    await revokeSessionToken(token);
  }

  return res.status(200).json({ success: true, message: 'Logged out successfully.' });
}

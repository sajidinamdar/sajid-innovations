import { extractBearerToken, verifySessionToken, applyAdminCors } from '../../src/server/auth.ts';
import { fetchAdminStatistics } from '../../src/server/db.ts';

export default async function handler(req: any, res: any) {
  if (!applyAdminCors(req, res, 'GET, OPTIONS')) return;
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method Not Allowed' });

  const token = extractBearerToken(req.headers['authorization']);
  if (!token) {
    return res.status(401).json({ error: 'Authorization token missing.' });
  }

  const session = await verifySessionToken(token);
  if (!session.valid) {
    return res.status(401).json({ error: session.error || 'Unauthorized.' });
  }

  try {
    const stats = await fetchAdminStatistics();
    return res.status(200).json(stats);
  } catch (error: any) {
    console.error('[API Admin Stats Error]:', error?.message || error);
    return res.status(500).json({ error: 'Failed to retrieve administrative statistics.' });
  }
}

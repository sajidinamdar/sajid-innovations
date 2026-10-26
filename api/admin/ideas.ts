import { extractBearerToken, verifySessionToken, applyAdminCors } from '../../src/server/auth.ts';
import { fetchInquiries } from '../../src/server/db.ts';

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
    const query = req.query || {};
    const search = query.search ? String(query.search).trim() : undefined;
    const status = query.status ? String(query.status).trim() : undefined;
    const category = query.category ? String(query.category).trim() : undefined;
    const page = query.page ? parseInt(String(query.page), 10) : 1;
    const limit = query.limit ? parseInt(String(query.limit), 10) : 15;

    const result = await fetchInquiries({
      search,
      status,
      category,
      page,
      limit
    });

    return res.status(200).json(result);
  } catch (error: any) {
    console.error('[API Admin Inquiries Error]:', error?.message || error);
    return res.status(500).json({ error: 'Failed to retrieve enquiries.' });
  }
}

import { extractBearerToken, verifySessionToken } from '../../../src/server/auth.ts';
import { fetchInquiryById, updateInquiryDetails, removeInquiry } from '../../../src/server/db.ts';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const token = extractBearerToken(req.headers['authorization']);
  if (!token) {
    return res.status(401).json({ error: 'Authorization token missing.' });
  }

  const session = await verifySessionToken(token);
  if (!session.valid) {
    return res.status(401).json({ error: session.error || 'Unauthorized.' });
  }

  // Extract ID from Vercel dynamic route query param or request URL
  let id = req.query?.id;
  if (!id && req.url) {
    const match = req.url.match(/\/api\/admin\/ideas\/([a-zA-Z0-9_-]+)/);
    if (match) id = match[1];
  }

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Inquiry ID is required.' });
  }

  try {
    if (req.method === 'GET') {
      const item = await fetchInquiryById(id);
      if (!item) {
        return res.status(404).json({ error: 'Inquiry not found.' });
      }
      return res.status(200).json(item);
    }

    if (req.method === 'PATCH') {
      const body = req.body || {};
      const updated = await updateInquiryDetails(id, {
        status: body.status,
        internal_notes: body.internal_notes,
        follow_up_date: body.follow_up_date
      });

      if (!updated) {
        return res.status(404).json({ error: 'Inquiry not found.' });
      }
      return res.status(200).json(updated);
    }

    if (req.method === 'DELETE') {
      const deleted = await removeInquiry(id);
      if (!deleted) {
        return res.status(404).json({ error: 'Inquiry not found.' });
      }
      return res.status(200).json({ success: true, message: 'Inquiry deleted successfully.' });
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error: any) {
    console.error(`[API Admin Inquiry ${id} Error]:`, error?.message || error);
    return res.status(500).json({ error: 'Internal server error processing inquiry.' });
  }
}

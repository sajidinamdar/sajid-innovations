import nodemailer from 'nodemailer';

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export default async function handler(req: any, res: any) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({ status: 'ok', service: 'Sajid Innovations API' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const body = req.body || {};

    // 1. Honeypot check
    if (body.honeypot && String(body.honeypot).trim() !== '') {
      return res.status(200).json({
        success: true,
        ref_id: 'SI-SPAM-FILTERED',
        message: 'Inquiry received.'
      });
    }

    // 2. Validate input
    const errors: Record<string, string> = {};
    if (!body.name || typeof body.name !== 'string' || body.name.trim().length < 2) {
      errors.name = 'Please provide your name (at least 2 characters).';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!body.email || typeof body.email !== 'string' || !emailRegex.test(body.email.trim())) {
      errors.email = 'Please provide a valid email address.';
    }

    if (!body.title || typeof body.title !== 'string' || body.title.trim().length < 3) {
      errors.title = 'Please provide a project title (at least 3 characters).';
    }

    if (!body.problem_description || typeof body.problem_description !== 'string' || body.problem_description.trim().length < 10) {
      errors.problem_description = 'Please describe your idea or problem in at least 10 characters.';
    }

    if (!body.consent) {
      errors.consent = 'You must agree to share project details.';
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors
      });
    }

    // 3. Generate Reference ID
    const year = new Date().getFullYear();
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const ref_id = `SI-${year}-${code}`;

    const inquiry = {
      ref_id,
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      phone: body.phone ? body.phone.trim() : 'Not provided',
      company: body.company ? body.company.trim() : 'Not specified',
      title: body.title.trim(),
      service_category: body.service_category ? body.service_category.trim() : 'General',
      problem_description: body.problem_description.trim(),
      requested_features: body.requested_features ? body.requested_features.trim() : 'None specified',
      budget_range: body.budget_range || 'Not decided yet',
      timeline: body.timeline || 'Flexible',
      preferred_contact: body.preferred_contact || 'email',
      additional_details: body.additional_details ? body.additional_details.trim() : 'None',
      created_at: new Date().toISOString()
    };

    // 4. Send Email Notifications via Gmail SMTP
    const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
    const SMTP_PORT = parseInt(process.env.SMTP_PORT || '465', 10);
    const SMTP_USER = process.env.SMTP_USER || 'inamdarsajid46@gmail.com';
    const SMTP_PASS = process.env.SMTP_PASS || 'ikbbioruejuyqrnp';
    const NOTIFICATION_RECIPIENT = process.env.NOTIFICATION_RECIPIENT || 'inamdarsajid46@gmail.com';
    const SENDER_NAME = process.env.SENDER_NAME || 'Sajid Innovations Alerts';

    if (SMTP_USER && SMTP_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          host: SMTP_HOST,
          port: SMTP_PORT,
          secure: SMTP_PORT === 465,
          auth: {
            user: SMTP_USER,
            pass: SMTP_PASS
          }
        });

        const cleanPhone = inquiry.phone ? inquiry.phone.replace(/[^0-9+]/g, '') : '';
        const whatsappLink = cleanPhone ? `https://wa.me/${cleanPhone.replace('+', '')}` : '';

        // Email to Sajid
        await transporter.sendMail({
          from: `"${SENDER_NAME}" <${SMTP_USER}>`,
          to: NOTIFICATION_RECIPIENT,
          replyTo: `"${inquiry.name}" <${inquiry.email}>`,
          subject: `🚀 New Project Inquiry: "${inquiry.title}" (Ref: ${inquiry.ref_id})`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0b0f17; color: #f1f5f9; padding: 24px; border-radius: 12px; border: 1px solid #1e293b;">
              <h2 style="color: #60a5fa; margin-top: 0;">🚀 New Project Inquiry Received</h2>
              <div style="background: #111827; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
                <p><strong>Reference ID:</strong> <span style="color: #93c5fd; font-family: monospace;">${inquiry.ref_id}</span></p>
                <p><strong>Client Name:</strong> ${escapeHtml(inquiry.name)}</p>
                <p><strong>Email:</strong> <a href="mailto:${inquiry.email}" style="color: #60a5fa;">${inquiry.email}</a></p>
                <p><strong>Phone:</strong> ${escapeHtml(inquiry.phone)}</p>
                <p><strong>Company:</strong> ${escapeHtml(inquiry.company)}</p>
                <p><strong>Preferred Contact:</strong> ${escapeHtml(inquiry.preferred_contact)}</p>
              </div>
              <div style="background: #111827; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
                <h3 style="color: #93c5fd; margin-top: 0;">Project Details</h3>
                <p><strong>Title:</strong> ${escapeHtml(inquiry.title)}</p>
                <p><strong>Category:</strong> ${escapeHtml(inquiry.service_category)}</p>
                <p><strong>Problem / Idea:</strong></p>
                <p style="white-space: pre-wrap; background: #090d14; padding: 12px; border-radius: 6px; color: #cbd5e1;">${escapeHtml(inquiry.problem_description)}</p>
                <p><strong>Required Features:</strong> ${escapeHtml(inquiry.requested_features)}</p>
                <p><strong>Estimated Budget:</strong> ${escapeHtml(inquiry.budget_range)}</p>
                <p><strong>Preferred Timeline:</strong> ${escapeHtml(inquiry.timeline)}</p>
              </div>
              ${whatsappLink ? `<div style="text-align: center; margin: 20px 0;"><a href="${whatsappLink}" style="background: #16a34a; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">💬 Reply on WhatsApp</a></div>` : ''}
              <p style="font-size: 12px; color: #64748b; text-align: center;">Sajid Innovations Inbound Alert · ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</p>
            </div>
          `
        });

        // Email to Customer
        await transporter.sendMail({
          from: `"Sajid Inamdar" <${SMTP_USER}>`,
          to: inquiry.email,
          subject: `Inquiry Received: "${inquiry.title}" (Ref: ${inquiry.ref_id}) — Sajid Innovations`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0b0f17; color: #f1f5f9; padding: 24px; border-radius: 12px; border: 1px solid #1e293b;">
              <h2 style="color: #60a5fa; margin-top: 0;">Hello ${escapeHtml(inquiry.name)}!</h2>
              <p>Thank you for reaching out and sharing your project concept for <strong>"${escapeHtml(inquiry.title)}"</strong>.</p>
              <p>I have received your requirements and will personally review them. I will get in touch via <strong>${escapeHtml(inquiry.preferred_contact)}</strong> shortly.</p>
              <div style="background: #111827; padding: 16px; border-radius: 8px; text-align: center; margin: 20px 0;">
                <div style="font-size: 11px; text-transform: uppercase; color: #94a3b8;">Your Inquiry Reference ID</div>
                <div style="font-size: 20px; font-family: monospace; font-weight: bold; color: #60a5fa; margin-top: 6px;">${inquiry.ref_id}</div>
              </div>
              <div style="text-align: center; margin: 20px 0;">
                <a href="https://wa.me/918329465339?text=${encodeURIComponent(`Hi Sajid! I submitted an inquiry on your website for "${inquiry.title}". My reference ID is ${inquiry.ref_id}.`)}" style="background: #16a34a; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">💬 Connect on WhatsApp (+91 8329465339)</a>
              </div>
              <p style="margin-top: 24px; font-size: 13px; color: #94a3b8;">
                Warm regards,<br/>
                <strong style="color: #ffffff;">Sajid Inamdar</strong><br/>
                Sajid Innovations · Software & AI Solutions
              </p>
            </div>
          `
        });
      } catch (mailErr) {
        console.error('[Vercel Serverless] Email dispatch warning:', mailErr);
      }
    }

    return res.status(201).json({
      success: true,
      ref_id,
      message: "Thank you for sharing your idea. Your submission has been received. I'll review the details and contact you via your selected method to discuss next steps."
    });
  } catch (error: any) {
    console.error('[Vercel Serverless] Error processing inquiry:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

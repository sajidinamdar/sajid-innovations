import nodemailer from 'nodemailer';
import { persistInquiry } from '../src/server/db.ts';
import { ProjectInquiry } from '../src/types/index.ts';

function escapeHtml(str?: string): string {
  if (!str) return '';
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
    const nowIso = new Date().toISOString();
    const inquiryId = `inq-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    const inquiry: ProjectInquiry = {
      id: inquiryId,
      ref_id,
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      phone: body.phone ? body.phone.trim() : undefined,
      company: body.company ? body.company.trim() : undefined,
      title: body.title.trim(),
      service_category: body.service_category ? body.service_category.trim() : 'General',
      problem_description: body.problem_description.trim(),
      target_users: body.target_users ? body.target_users.trim() : undefined,
      desired_solution: body.desired_solution ? body.desired_solution.trim() : undefined,
      requested_features: body.requested_features ? body.requested_features.trim() : undefined,
      existing_url: body.existing_url ? body.existing_url.trim() : undefined,
      budget_range: body.budget_range || 'Not decided yet',
      timeline: body.timeline || 'Flexible',
      preferred_contact: body.preferred_contact || 'email',
      additional_details: body.additional_details ? body.additional_details.trim() : undefined,
      consent: Boolean(body.consent),
      status: 'new',
      created_at: nowIso,
      updated_at: nowIso
    };

    // 4. Persist Enquiry in Database BEFORE confirming receipt
    try {
      await persistInquiry(inquiry);
      console.log(`[API Serverless] Inquiry ${ref_id} successfully persisted to database.`);
    } catch (dbErr: any) {
      console.error('[API Serverless] Database persistence error:', dbErr?.message || 'Database write failure');
      return res.status(500).json({
        error: 'Unable to record your enquiry at this moment. Please try again or email contact@sajidinnovations.in directly.'
      });
    }

    // 5. Send Email Notifications via Secure SMTP Configuration
    const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
    const SMTP_PORT = parseInt(process.env.SMTP_PORT || '465', 10);
    const SMTP_USER = process.env.SMTP_USER || '';
    const SMTP_PASS = process.env.SMTP_PASS || '';
    const NOTIFICATION_RECIPIENT = process.env.NOTIFICATION_EMAIL || process.env.NOTIFICATION_RECIPIENT || SMTP_USER || '';
    const SENDER_NAME = process.env.SENDER_NAME || 'Sajid Innovations';
    const SMTP_TEST_MODE = process.env.SMTP_TEST_MODE === 'true';
    const PUBLIC_SUPPORT_EMAIL = 'contact@sajidinnovations.in';

    const isValidCustomerEmail = emailRegex.test(inquiry.email);
    const categoryName = inquiry.service_category || 'General';

    if (SMTP_TEST_MODE) {
      console.log(`[API Test Mode] Simulated successful email dispatch for inquiry ${ref_id}`);
    } else if (SMTP_USER && SMTP_PASS && NOTIFICATION_RECIPIENT) {
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

        const adminSubject = `New Website Enquiry — [${categoryName}] (Ref: ${inquiry.ref_id})`;
        const adminMailOptions: any = {
          from: `"${SENDER_NAME}" <${SMTP_USER}>`,
          to: NOTIFICATION_RECIPIENT,
          subject: adminSubject,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 650px; margin: 0 auto; background: #0b0f17; color: #f1f5f9; padding: 28px; border-radius: 14px; border: 1px solid #1e293b;">
              <div style="background: linear-gradient(135deg, #0284c7, #2563eb); padding: 18px 24px; border-radius: 10px; margin-bottom: 24px;">
                <span style="display: inline-block; background-color: #0369a1; color: #ffffff; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-family: monospace; font-weight: bold;">${inquiry.ref_id}</span>
                <h2 style="color: #ffffff; margin: 8px 0 0 0; font-size: 18px;">New Website Enquiry Received</h2>
              </div>
              <div style="background: #111827; padding: 18px; border-radius: 8px; margin-bottom: 16px; border: 1px solid #1f2937;">
                <h3 style="color: #94a3b8; font-size: 12px; text-transform: uppercase; margin: 0 0 12px 0;">Contact Information</h3>
                <p style="margin: 6px 0;"><strong>Name:</strong> ${escapeHtml(inquiry.name)}</p>
                <p style="margin: 6px 0;"><strong>Email:</strong> <a href="mailto:${escapeHtml(inquiry.email)}" style="color: #38bdf8; text-decoration: none;">${escapeHtml(inquiry.email)}</a></p>
                <p style="margin: 6px 0;"><strong>Phone:</strong> ${escapeHtml(inquiry.phone)}</p>
                <p style="margin: 6px 0;"><strong>Company:</strong> ${escapeHtml(inquiry.company)}</p>
                <p style="margin: 6px 0;"><strong>Preferred Contact:</strong> <span style="text-transform: capitalize;">${escapeHtml(inquiry.preferred_contact)}</span></p>
              </div>
              <div style="background: #111827; padding: 18px; border-radius: 8px; margin-bottom: 16px; border: 1px solid #1f2937;">
                <h3 style="color: #94a3b8; font-size: 12px; text-transform: uppercase; margin: 0 0 12px 0;">Enquiry Details</h3>
                <p style="margin: 6px 0;"><strong>Category:</strong> <span style="color: #38bdf8; font-weight: 600;">${escapeHtml(inquiry.service_category)}</span></p>
                <p style="margin: 6px 0;"><strong>Subject / Title:</strong> ${escapeHtml(inquiry.title)}</p>
                <p style="margin: 6px 0;"><strong>Estimated Budget:</strong> ${escapeHtml(inquiry.budget_range)}</p>
                <p style="margin: 6px 0;"><strong>Preferred Timeline:</strong> ${escapeHtml(inquiry.timeline)}</p>
                <div style="margin-top: 14px;">
                  <strong style="color: #e2e8f0;">Requirements / Problem:</strong>
                  <div style="white-space: pre-wrap; background: #090d14; padding: 12px; border-radius: 6px; color: #cbd5e1; margin-top: 6px; font-size: 13px; line-height: 1.5; border: 1px solid #1e293b;">${escapeHtml(inquiry.problem_description)}</div>
                </div>
              </div>
              ${isValidCustomerEmail ? `
              <div style="margin: 20px 0;">
                <a href="mailto:${escapeHtml(inquiry.email)}?subject=Re:%20${encodeURIComponent(adminSubject)}" style="background: #0284c7; color: #ffffff; padding: 10px 18px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 13px; display: inline-block;">✉️ Reply via Email</a>
              </div>` : ''}
              <p style="font-size: 11px; color: #64748b; text-align: center; margin-top: 24px;">Sajid Innovations Inbound Enquiry Alert · ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</p>
            </div>
          `,
          text: `New Website Enquiry:\nRef ID: ${inquiry.ref_id}\nName: ${inquiry.name}\nEmail: ${inquiry.email}\nPhone: ${inquiry.phone}\nCompany: ${inquiry.company}\nCategory: ${categoryName}\nTitle: ${inquiry.title}\nBudget: ${inquiry.budget_range}\nTimeline: ${inquiry.timeline}\n\nDescription:\n${inquiry.problem_description}`
        };

        if (isValidCustomerEmail) {
          adminMailOptions.replyTo = `"${inquiry.name.replace(/[\r\n"<>]/g, '')}" <${inquiry.email}>`;
        }

        const adminResult = await transporter.sendMail(adminMailOptions);
        if (Array.isArray(adminResult.accepted) && adminResult.accepted.length > 0) {
          console.log(`[API Serverless] Notification successfully dispatched for enquiry ${inquiry.ref_id}`);
        } else {
          console.warn(`[API Serverless] Mail provider did not accept admin message for enquiry ${inquiry.ref_id}`);
        }

        // Customer confirmation email
        if (isValidCustomerEmail) {
          try {
            await transporter.sendMail({
              from: `"${SENDER_NAME}" <${SMTP_USER}>`,
              to: inquiry.email,
              replyTo: PUBLIC_SUPPORT_EMAIL,
              subject: `Enquiry Received: "${inquiry.title}" (Ref: ${inquiry.ref_id}) — Sajid Innovations`,
              html: `
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0b0f17; color: #f1f5f9; padding: 24px; border-radius: 12px; border: 1px solid #1e293b;">
                  <h2 style="color: #38bdf8; margin-top: 0;">Hello ${escapeHtml(inquiry.name)}!</h2>
                  <p style="color: #cbd5e1; line-height: 1.6;">Thank you for reaching out and sharing your enquiry for <strong>"${escapeHtml(inquiry.title)}"</strong>.</p>
                  <p style="color: #cbd5e1; line-height: 1.6;">We have received your details and will personally review them. We will follow up with you directly via email shortly.</p>
                  <div style="background: #111827; padding: 16px; border-radius: 8px; text-align: center; margin: 20px 0; border: 1px solid #1e293b;">
                    <div style="font-size: 11px; text-transform: uppercase; color: #94a3b8;">Your Enquiry Reference ID</div>
                    <div style="font-size: 20px; font-family: monospace; font-weight: bold; color: #38bdf8; margin-top: 6px;">${inquiry.ref_id}</div>
                  </div>
                  <p style="margin-top: 20px; font-size: 13px; color: #94a3b8;">
                    For any urgent queries, contact our support team at <a href="mailto:${PUBLIC_SUPPORT_EMAIL}" style="color: #38bdf8;">${PUBLIC_SUPPORT_EMAIL}</a>.
                  </p>
                  <p style="margin-top: 24px; font-size: 13px; color: #94a3b8;">
                    Warm regards,<br/>
                    <strong style="color: #ffffff;">Sajid Inamdar</strong><br/>
                    Sajid Innovations · Technology & Software Solutions
                  </p>
                </div>
              `,
              text: `Hello ${inquiry.name},\n\nThank you for reaching out to Sajid Innovations. We have received your enquiry for "${inquiry.title}". Your Reference ID is ${inquiry.ref_id}.\n\nWe will review your requirements and follow up with you via email shortly.\n\nSupport: ${PUBLIC_SUPPORT_EMAIL}\n\nWarm regards,\nSajid Inamdar\nSajid Innovations`
            });
          } catch (custErr: any) {
            console.warn('[API Serverless] Customer confirmation email dispatch notice:', custErr?.message || 'SMTP delivery issue');
          }
        }
      } catch (mailErr: any) {
        console.error('[API Serverless] Email dispatch warning:', mailErr?.message || 'SMTP delivery error');
      }
    } else {
      console.warn('[API Serverless] SMTP credentials not fully configured in environment. Skipping email dispatch.');
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

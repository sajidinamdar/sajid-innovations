import nodemailer, { type Transporter, type SendMailOptions } from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { ProjectInquiry } from '../types/index.ts';

// Ensure .env is loaded in development/server environments
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const PUBLIC_SUPPORT_EMAIL = 'contact@sajidinnovations.in';

function getSmtpConfig() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '465', 10);
  const user = process.env.SMTP_USER || '';
  const pass = process.env.SMTP_PASS || '';
  const recipient = process.env.NOTIFICATION_RECIPIENT || user || '';
  const senderName = process.env.SENDER_NAME || 'Sajid Innovations';
  const isTestMode = process.env.SMTP_TEST_MODE === 'true';

  return {
    host,
    port,
    user,
    pass,
    recipient,
    senderName,
    isConfigured: Boolean(user && pass) || isTestMode,
    isTestMode
  };
}

function isValidEmail(email?: string): boolean {
  if (!email || typeof email !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function sanitizeHeader(text: string): string {
  return (text || '').replace(/[\r\n"<>]/g, '').trim();
}

function escapeHtml(text: string): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export interface EmailDispatchDetails {
  accepted: string[];
  rejected: string[];
  response: string;
  messageId: string;
}

/**
 * Sends an email notification to the site owner for new enquiries,
 * and an automated receipt confirmation to the customer.
 */
export async function sendInquiryEmails(inquiry: ProjectInquiry): Promise<{
  adminEmailSent: boolean;
  customerEmailSent: boolean;
  adminDetails?: EmailDispatchDetails;
  customerDetails?: EmailDispatchDetails;
  error?: string;
}> {
  const config = getSmtpConfig();

  // If credentials are not configured and not in test mode, safely exit without error exposure
  if (!config.isConfigured) {
    console.warn('[Email Service] SMTP credentials not configured in environment variables. Email notification skipped.');
    return {
      adminEmailSent: false,
      customerEmailSent: false,
      error: 'SMTP credentials not configured on server.'
    };
  }

  // Safe Test Mode handler (for local automated testing without live network calls)
  if (config.isTestMode) {
    console.log(`[Email Service Test Mode] Simulated successful email dispatch for inquiry ${inquiry.ref_id}`);
    return {
      adminEmailSent: true,
      customerEmailSent: isValidEmail(inquiry.email)
    };
  }

  let transporter: Transporter;
  try {
    transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.port === 465,
      auth: {
        user: config.user,
        pass: config.pass
      }
    });
  } catch (err: any) {
    console.error('[Email Service] Failed to initialize mail transporter:', err?.message || 'Unknown error');
    return { adminEmailSent: false, customerEmailSent: false, error: 'Transporter initialization failed' };
  }

  let adminEmailSent = false;
  let customerEmailSent = false;
  let adminDetails: EmailDispatchDetails | undefined;
  let customerDetails: EmailDispatchDetails | undefined;

  const categoryName = inquiry.service_category || 'General';
  const cleanCustomerName = sanitizeHeader(inquiry.name) || 'Prospective Client';
  const validCustomerEmail = isValidEmail(inquiry.email) ? inquiry.email.trim() : null;

  // 1. Notification to Site Owner
  try {
    const adminSubject = `New Website Enquiry — [${categoryName}] (Ref: ${inquiry.ref_id})`;
    const adminHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Website Enquiry</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0f17; color: #f1f5f9; margin: 0; padding: 24px; }
    .card { max-width: 650px; margin: 0 auto; background-color: #111827; border: 1px solid #1e293b; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
    .header { background: linear-gradient(135deg, #0284c7, #2563eb); padding: 24px 32px; text-align: left; }
    .header h1 { margin: 0; color: #ffffff; font-size: 20px; font-weight: 700; letter-spacing: -0.02em; }
    .header p { margin: 6px 0 0; color: #e0f2fe; font-size: 13px; }
    .badge { display: inline-block; background-color: #0369a1; color: #ffffff; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-family: monospace; font-weight: bold; }
    .content { padding: 28px 32px; }
    .section-title { font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #94a3b8; margin: 0 0 12px; font-weight: 700; border-bottom: 1px solid #1e293b; padding-bottom: 6px; }
    .grid { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    .grid td { padding: 8px 0; font-size: 14px; vertical-align: top; }
    .grid td.label { color: #94a3b8; width: 160px; font-weight: 500; }
    .grid td.value { color: #f8fafc; font-weight: 600; }
    .grid td.value a { color: #38bdf8; text-decoration: none; }
    .problem-box { background-color: #0b0f17; border: 1px solid #1e293b; border-radius: 10px; padding: 16px; margin-bottom: 24px; }
    .problem-box p { margin: 0; font-size: 14px; line-height: 1.6; color: #cbd5e1; }
    .action-btn-email { display: inline-block; background-color: #0284c7; color: #ffffff !important; padding: 12px 22px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 13px; }
    .footer { padding: 16px 32px; background-color: #0b0f17; border-top: 1px solid #1e293b; text-align: center; font-size: 12px; color: #64748b; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
        <span class="badge">${inquiry.ref_id}</span>
      </div>
      <h1>New Website Enquiry Received</h1>
      <p>A new customer has submitted an enquiry on <strong>Sajid Innovations</strong>.</p>
    </div>

    <div class="content">
      <div class="section-title">Client Information</div>
      <table class="grid">
        <tr>
          <td class="label">Name:</td>
          <td class="value">${escapeHtml(inquiry.name)}</td>
        </tr>
        <tr>
          <td class="label">Email:</td>
          <td class="value">${validCustomerEmail ? `<a href="mailto:${escapeHtml(validCustomerEmail)}">${escapeHtml(validCustomerEmail)}</a>` : '<span style="color:#64748b;">Not provided</span>'}</td>
        </tr>
        <tr>
          <td class="label">Phone:</td>
          <td class="value">${inquiry.phone ? escapeHtml(inquiry.phone) : '<span style="color:#64748b;">Not provided</span>'}</td>
        </tr>
        <tr>
          <td class="label">Company:</td>
          <td class="value">${inquiry.company ? escapeHtml(inquiry.company) : '<span style="color:#64748b;">Not provided</span>'}</td>
        </tr>
        <tr>
          <td class="label">Preferred Contact:</td>
          <td class="value" style="text-transform: capitalize; color: #38bdf8;">${escapeHtml(inquiry.preferred_contact || 'email')}</td>
        </tr>
      </table>

      <div class="section-title">Enquiry Details</div>
      <table class="grid">
        <tr>
          <td class="label">Category:</td>
          <td class="value" style="color: #38bdf8;">${escapeHtml(categoryName)}</td>
        </tr>
        <tr>
          <td class="label">Subject / Title:</td>
          <td class="value">${escapeHtml(inquiry.title)}</td>
        </tr>
        ${inquiry.budget_range ? `
        <tr>
          <td class="label">Budget Range:</td>
          <td class="value" style="color: #34d399;">${escapeHtml(inquiry.budget_range)}</td>
        </tr>` : ''}
        ${inquiry.timeline ? `
        <tr>
          <td class="label">Timeline:</td>
          <td class="value">${escapeHtml(inquiry.timeline)}</td>
        </tr>` : ''}
      </table>

      <div class="section-title">Project / Requirements Description</div>
      <div class="problem-box">
        <p>${escapeHtml(inquiry.problem_description).replace(/\n/g, '<br/>')}</p>
      </div>

      ${validCustomerEmail ? `
      <div style="margin-top: 24px; text-align: left;">
        <a href="mailto:${escapeHtml(validCustomerEmail)}?subject=Re:%20${encodeURIComponent(adminSubject)}" class="action-btn-email">✉️ Reply to Customer via Email</a>
      </div>` : ''}
    </div>

    <div class="footer">
      Sajid Innovations Inbound Enquiry Alert · ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
    </div>
  </div>
</body>
</html>
    `;

    const adminMailOptions: SendMailOptions = {
      from: `"${config.senderName}" <${config.user}>`,
      to: config.recipient,
      subject: adminSubject,
      html: adminHtml,
      text: `New Website Enquiry:
Ref ID: ${inquiry.ref_id}
Name: ${inquiry.name}
Email: ${inquiry.email}
Phone: ${inquiry.phone || 'Not provided'}
Company: ${inquiry.company || 'Not provided'}
Category: ${categoryName}
Subject: ${inquiry.title}
Budget: ${inquiry.budget_range || 'N/A'}
Timeline: ${inquiry.timeline || 'N/A'}

Description:
${inquiry.problem_description}
`
    };

    // Set Reply-To only after validating customer email
    if (validCustomerEmail) {
      adminMailOptions.replyTo = `"${cleanCustomerName}" <${validCustomerEmail}>`;
    }

    const adminResult = await transporter.sendMail(adminMailOptions);
    // Provider confirmation check: only mark sent if accepted contains at least one recipient
    adminEmailSent = Array.isArray(adminResult.accepted) && adminResult.accepted.length > 0;
    adminDetails = {
      accepted: (adminResult.accepted || []) as string[],
      rejected: (adminResult.rejected || []) as string[],
      response: adminResult.response || '',
      messageId: adminResult.messageId || ''
    };
    if (adminEmailSent) {
      console.log(`[Email Service] Notification successfully delivered to owner for enquiry ${inquiry.ref_id}`);
    } else {
      console.warn(`[Email Service] Notification was not accepted by mail server for enquiry ${inquiry.ref_id}`);
    }
  } catch (err: any) {
    console.error('[Email Service] Failed to send owner notification email:', err?.message || 'SMTP delivery error');
  }

  // 2. Courtesy Confirmation to Customer (only if valid email provided)
  if (validCustomerEmail) {
    try {
      const customerSubject = `Enquiry Received: "${inquiry.title}" (Ref: ${inquiry.ref_id}) — Sajid Innovations`;
      const customerHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Enquiry Received</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0f17; color: #f1f5f9; margin: 0; padding: 24px; }
    .card { max-width: 600px; margin: 0 auto; background-color: #111827; border: 1px solid #1e293b; border-radius: 16px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #0284c7, #2563eb); padding: 28px 32px; text-align: left; }
    .header h1 { margin: 0; color: #ffffff; font-size: 20px; font-weight: 700; }
    .content { padding: 28px 32px; font-size: 14px; line-height: 1.6; color: #cbd5e1; }
    .ref-box { background-color: #0b0f17; border: 1px solid #1e293b; border-radius: 10px; padding: 16px; margin: 20px 0; text-align: center; }
    .ref-id { font-size: 18px; font-family: monospace; font-weight: bold; color: #38bdf8; letter-spacing: 0.05em; }
    .footer { padding: 16px 32px; background-color: #0b0f17; border-top: 1px solid #1e293b; text-align: center; font-size: 12px; color: #64748b; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>Hello ${escapeHtml(cleanCustomerName)},</h1>
      <p style="margin: 6px 0 0; color: #e0f2fe; font-size: 13px;">Thank you for getting in touch with Sajid Innovations.</p>
    </div>
    <div class="content">
      <p>We have received your enquiry regarding <strong>"${escapeHtml(inquiry.title)}"</strong>.</p>
      <p>I will personally review your requirements and follow up with you directly via email shortly.</p>

      <div class="ref-box">
        <div style="font-size: 11px; text-transform: uppercase; color: #94a3b8; margin-bottom: 4px;">Your Enquiry Reference ID</div>
        <div class="ref-id">${inquiry.ref_id}</div>
      </div>

      <p style="margin-top: 24px; font-size: 13px; color: #94a3b8;">
        For any immediate questions, you can contact our support address at <a href="mailto:${PUBLIC_SUPPORT_EMAIL}" style="color: #38bdf8;">${PUBLIC_SUPPORT_EMAIL}</a>.
      </p>

      <p style="margin-top: 24px; font-size: 13px;">
        Warm regards,<br/>
        <strong>Sajid Inamdar</strong><br/>
        <span style="color: #64748b;">Sajid Innovations · Technology & Software Solutions</span>
      </p>
    </div>
    <div class="footer">
      Automated confirmation from Sajid Innovations. Please retain your Reference ID for future correspondence.
    </div>
  </div>
</body>
</html>
      `;

      const customerMailOptions: SendMailOptions = {
        from: `"${config.senderName}" <${config.user}>`,
        to: validCustomerEmail,
        replyTo: PUBLIC_SUPPORT_EMAIL,
        subject: customerSubject,
        html: customerHtml,
        text: `Hello ${cleanCustomerName},\n\nThank you for reaching out to Sajid Innovations. We have received your enquiry for "${inquiry.title}". Your Reference ID is ${inquiry.ref_id}.\n\nWe will review your requirements and follow up with you via email shortly.\n\nSupport address: ${PUBLIC_SUPPORT_EMAIL}\n\nWarm regards,\nSajid Inamdar\nSajid Innovations`
      };

      const customerResult = await transporter.sendMail(customerMailOptions);
      customerEmailSent = Array.isArray(customerResult.accepted) && customerResult.accepted.length > 0;
      customerDetails = {
        accepted: (customerResult.accepted || []) as string[],
        rejected: (customerResult.rejected || []) as string[],
        response: customerResult.response || '',
        messageId: customerResult.messageId || ''
      };
      if (customerEmailSent) {
        console.log(`[Email Service] Confirmation receipt delivered to customer ${validCustomerEmail}`);
      }
    } catch (err: any) {
      console.warn('[Email Service] Customer confirmation email could not be delivered:', err?.message || 'SMTP error');
    }
  }

  return { adminEmailSent, customerEmailSent, adminDetails, customerDetails };
}

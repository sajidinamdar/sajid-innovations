import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { ProjectInquiry } from '../types/index.ts';

// Ensure .env is loaded
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '465', 10);
const SMTP_USER = process.env.SMTP_USER || 'inamdarsajid46@gmail.com';
const SMTP_PASS = process.env.SMTP_PASS || 'ikbbioruejuyqrnp';
const NOTIFICATION_RECIPIENT = process.env.NOTIFICATION_RECIPIENT || 'inamdarsajid46@gmail.com';
const SENDER_NAME = process.env.SENDER_NAME || 'Sajid Innovations Customer Inquiries';

// Create Nodemailer Transporter using Gmail SSL
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465, // true for port 465 (SSL)
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS
  }
});

/**
 * Sends an instant email notification to Sajid whenever a customer submits an inquiry,
 * and also sends an automatic receipt confirmation to the customer.
 */
export async function sendInquiryEmails(inquiry: ProjectInquiry): Promise<{
  adminEmailSent: boolean;
  customerEmailSent: boolean;
  error?: string;
}> {
  let adminEmailSent = false;
  let customerEmailSent = false;

  // 1. Notification to Sajid (Admin)
  try {
    const cleanPhone = inquiry.phone ? inquiry.phone.replace(/[^0-9+]/g, '') : '';
    const whatsappLink = cleanPhone ? `https://wa.me/${cleanPhone.replace('+', '')}` : '';

    const adminHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Project Inquiry</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0f17; color: #f1f5f9; margin: 0; padding: 24px; }
    .card { max-width: 650px; margin: 0 auto; background-color: #111827; border: 1px solid #1e293b; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
    .header { background: linear-gradient(135deg, #1d4ed8, #4338ca); padding: 24px 32px; text-align: left; }
    .header h1 { margin: 0; color: #ffffff; font-size: 20px; font-weight: 700; letter-spacing: -0.02em; }
    .header p { margin: 6px 0 0; color: #bfdbfe; font-size: 13px; }
    .badge { display: inline-block; background-color: #2563eb; color: #ffffff; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-family: monospace; font-weight: bold; }
    .content { padding: 28px 32px; }
    .section-title { font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #94a3b8; margin: 0 0 12px; font-weight: 700; border-bottom: 1px solid #1e293b; padding-bottom: 6px; }
    .grid { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    .grid td { padding: 8px 0; font-size: 14px; vertical-align: top; }
    .grid td.label { color: #94a3b8; width: 160px; font-weight: 500; }
    .grid td.value { color: #f8fafc; font-weight: 600; }
    .grid td.value a { color: #60a5fa; text-decoration: none; }
    .problem-box { background-color: #0b0f17; border: 1px solid #1e293b; border-radius: 10px; padding: 16px; margin-bottom: 24px; }
    .problem-box p { margin: 0; font-size: 14px; line-height: 1.6; color: #cbd5e1; }
    .action-btn { display: inline-block; background-color: #16a34a; color: #ffffff !important; padding: 12px 20px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 13px; margin-right: 12px; margin-top: 8px; }
    .action-btn-email { display: inline-block; background-color: #2563eb; color: #ffffff !important; padding: 12px 20px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 13px; margin-top: 8px; }
    .footer { padding: 16px 32px; background-color: #0b0f17; border-top: 1px solid #1e293b; text-align: center; font-size: 12px; color: #64748b; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
        <span class="badge">${inquiry.ref_id}</span>
      </div>
      <h1>🚀 New Customer Project Inquiry</h1>
      <p>A new customer has shared their project idea on <strong>Sajid Innovations</strong>.</p>
    </div>

    <div class="content">
      <div class="section-title">Client Information</div>
      <table class="grid">
        <tr>
          <td class="label">Client Name:</td>
          <td class="value">${escapeHtml(inquiry.name)}</td>
        </tr>
        <tr>
          <td class="label">Email Address:</td>
          <td class="value"><a href="mailto:${escapeHtml(inquiry.email)}">${escapeHtml(inquiry.email)}</a></td>
        </tr>
        <tr>
          <td class="label">Phone / WhatsApp:</td>
          <td class="value">${inquiry.phone ? `<a href="tel:${escapeHtml(inquiry.phone)}">${escapeHtml(inquiry.phone)}</a>` : '<span style="color:#64748b;">Not provided</span>'}</td>
        </tr>
        <tr>
          <td class="label">Company / Venture:</td>
          <td class="value">${inquiry.company ? escapeHtml(inquiry.company) : '<span style="color:#64748b;">Not provided</span>'}</td>
        </tr>
        <tr>
          <td class="label">Preferred Contact:</td>
          <td class="value" style="text-transform: capitalize; color: #38bdf8;">${escapeHtml(inquiry.preferred_contact)}</td>
        </tr>
      </table>

      <div class="section-title">Project Details</div>
      <table class="grid">
        <tr>
          <td class="label">Project Title:</td>
          <td class="value" style="color: #60a5fa;">${escapeHtml(inquiry.title)}</td>
        </tr>
        <tr>
          <td class="label">Service Category:</td>
          <td class="value">${escapeHtml(inquiry.service_category)}</td>
        </tr>
        <tr>
          <td class="label">Estimated Budget:</td>
          <td class="value" style="color: #34d399;">${escapeHtml(inquiry.budget_range || 'Not decided yet')}</td>
        </tr>
        <tr>
          <td class="label">Timeline Preference:</td>
          <td class="value">${escapeHtml(inquiry.timeline || 'Flexible')}</td>
        </tr>
        ${inquiry.target_users ? `
        <tr>
          <td class="label">Target Audience:</td>
          <td class="value">${escapeHtml(inquiry.target_users)}</td>
        </tr>` : ''}
        ${inquiry.existing_url ? `
        <tr>
          <td class="label">Current Website / App:</td>
          <td class="value"><a href="${escapeHtml(inquiry.existing_url)}" target="_blank">${escapeHtml(inquiry.existing_url)}</a></td>
        </tr>` : ''}
      </table>

      <div class="section-title">Problem & Idea Description</div>
      <div class="problem-box">
        <p>${escapeHtml(inquiry.problem_description).replace(/\n/g, '<br/>')}</p>
      </div>

      <div style="margin-top: 24px; text-align: left;">
        ${whatsappLink ? `<a href="${whatsappLink}" target="_blank" class="action-btn">💬 Chat on WhatsApp</a>` : ''}
        <a href="mailto:${escapeHtml(inquiry.email)}?subject=Re:%20${encodeURIComponent(inquiry.title)}%20(Ref:%20${inquiry.ref_id})" class="action-btn-email">✉️ Reply via Email</a>
      </div>
    </div>

    <div class="footer">
      Sajid Innovations Inbound Notification · Received on ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} (IST)
    </div>
  </div>
</body>
</html>
    `;

    await transporter.sendMail({
      from: `"${SENDER_NAME}" <${SMTP_USER}>`,
      to: NOTIFICATION_RECIPIENT,
      replyTo: `${inquiry.name} <${inquiry.email}>`,
      subject: `🚀 New Project Inquiry: "${inquiry.title}" from ${inquiry.name} (${inquiry.ref_id})`,
      html: adminHtml,
      text: `New Customer Inquiry:
Ref ID: ${inquiry.ref_id}
Name: ${inquiry.name}
Email: ${inquiry.email}
Phone: ${inquiry.phone || 'N/A'}
Company: ${inquiry.company || 'N/A'}
Title: ${inquiry.title}
Service: ${inquiry.service_category}
Budget: ${inquiry.budget_range || 'N/A'}
Timeline: ${inquiry.timeline || 'N/A'}
Preferred Contact: ${inquiry.preferred_contact}

Problem Description:
${inquiry.problem_description}
`
    });

    adminEmailSent = true;
    console.log(`[Email Service] Successfully dispatched alert to Sajid for inquiry ${inquiry.ref_id}`);
  } catch (err: any) {
    console.error('[Email Service] Failed to send admin alert email:', err?.message || err);
    return { adminEmailSent: false, customerEmailSent: false, error: err?.message || 'Failed to dispatch email' };
  }

  // 2. Courtesy Confirmation to the Customer
  try {
    const customerHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Inquiry Confirmation</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0f17; color: #f1f5f9; margin: 0; padding: 24px; }
    .card { max-width: 600px; margin: 0 auto; background-color: #111827; border: 1px solid #1e293b; border-radius: 16px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #1d4ed8, #2563eb); padding: 28px 32px; text-align: left; }
    .header h1 { margin: 0; color: #ffffff; font-size: 20px; font-weight: 700; }
    .content { padding: 28px 32px; font-size: 14px; line-height: 1.6; color: #cbd5e1; }
    .ref-box { background-color: #0b0f17; border: 1px solid #1e293b; border-radius: 10px; padding: 16px; margin: 20px 0; text-align: center; }
    .ref-id { font-size: 18px; font-family: monospace; font-weight: bold; color: #60a5fa; letter-spacing: 0.05em; }
    .whatsapp-btn { display: inline-block; background-color: #16a34a; color: #ffffff !important; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 13px; margin-top: 12px; }
    .footer { padding: 16px 32px; background-color: #0b0f17; border-top: 1px solid #1e293b; text-align: center; font-size: 12px; color: #64748b; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>Hello ${escapeHtml(inquiry.name)}!</h1>
      <p style="margin: 6px 0 0; color: #bfdbfe; font-size: 13px;">Your project idea has been received by Sajid Inamdar.</p>
    </div>
    <div class="content">
      <p>Thank you for reaching out and sharing your project concept for <strong>"${escapeHtml(inquiry.title)}"</strong>.</p>
      
      <p>I have received your details and will personally review the requirements. I will get in touch with you via your preferred channel (<strong>${escapeHtml(inquiry.preferred_contact)}</strong>) to discuss practical solutions and next steps.</p>

      <div class="ref-box">
        <div style="font-size: 11px; text-transform: uppercase; color: #94a3b8; margin-bottom: 4px;">Your Reference ID</div>
        <div class="ref-id">${inquiry.ref_id}</div>
      </div>

      <p style="font-size: 13px; color: #94a3b8;">
        Want to discuss it immediately? You can connect directly with me on WhatsApp:
      </p>

      <div style="text-align: center; margin: 16px 0;">
        <a href="https://wa.me/918329465339?text=${encodeURIComponent(`Hi Sajid! I just submitted an inquiry on your website for "${inquiry.title}". My reference ID is ${inquiry.ref_id}.`)}" target="_blank" class="whatsapp-btn">
          💬 Connect on WhatsApp (+91 8329465339)
        </a>
      </div>

      <p style="margin-top: 24px; font-size: 13px;">
        Warm regards,<br/>
        <strong>Sajid Inamdar</strong><br/>
        <span style="color: #64748b;">Sajid Innovations · Software Solutions & AI</span>
      </p>
    </div>
    <div class="footer">
      This is an automated confirmation from Sajid Innovations. You submitted this inquiry on ${new Date().toLocaleDateString('en-IN')}.
    </div>
  </div>
</body>
</html>
    `;

    await transporter.sendMail({
      from: `"Sajid Inamdar" <${SMTP_USER}>`,
      to: inquiry.email,
      subject: `Inquiry Received: "${inquiry.title}" (Ref: ${inquiry.ref_id}) — Sajid Innovations`,
      html: customerHtml,
      text: `Hello ${inquiry.name},\n\nThank you for sharing your project idea for "${inquiry.title}". Your Reference ID is ${inquiry.ref_id}.\n\nI have received your details and will get in touch via ${inquiry.preferred_contact} shortly.\n\nWarm regards,\nSajid Inamdar\nSajid Innovations`
    });

    customerEmailSent = true;
    console.log(`[Email Service] Dispatched confirmation receipt to customer ${inquiry.email}`);
  } catch (err: any) {
    console.warn('[Email Service] Customer confirmation email could not be sent:', err?.message || err);
  }

  return { adminEmailSent, customerEmailSent };
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

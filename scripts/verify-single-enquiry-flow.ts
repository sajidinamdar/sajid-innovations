import dotenv from 'dotenv';
import path from 'path';
import nodemailer from 'nodemailer';
import { fetchInquiryById, removeInquiry, getNeonSql } from '../src/server/db.ts';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function runSingleEnquiryVerification() {
  console.log('====================================================');
  console.log('🔍 Sajid Innovations — Single Controlled Enquiry & Email Audit');
  console.log('====================================================\n');

  // Step 1: Static Configuration & Transporter Handshake Check (0 emails sent)
  console.log('--- Step 1: SMTP Static Configuration & Handshake ---');
  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = parseInt(process.env.SMTP_PORT || '465', 10);
  const smtpUser = process.env.SMTP_USER || '';
  const smtpPass = process.env.SMTP_PASS || '';
  const notificationRecipient = process.env.NOTIFICATION_RECIPIENT || process.env.NOTIFICATION_EMAIL || smtpUser;

  console.log(`- SMTP Host: ${smtpHost}`);
  console.log(`- SMTP Port: ${smtpPort}`);
  console.log(`- SMTP User configured: ${Boolean(smtpUser && smtpUser.trim())}`);
  console.log(`- SMTP Pass configured: ${Boolean(smtpPass && smtpPass.trim())}`);
  console.log(`- Notification Recipient configured: ${Boolean(notificationRecipient && notificationRecipient.trim())}`);

  if (!smtpUser || !smtpPass) {
    console.error('❌ FAIL: SMTP credentials missing from .env');
    process.exit(1);
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: { user: smtpUser, pass: smtpPass }
  });

  try {
    const verified = await transporter.verify();
    console.log(`✅ PASS: SMTP Handshake & Authentication verified: ${verified}`);
  } catch (err: any) {
    console.error(`❌ FAIL: SMTP Handshake failed: ${err.message}`);
    process.exit(1);
  }

  // Step 2: Clean up any prior test records from previous script runs
  console.log('\n--- Step 2: Clean up old test records in Neon ---');
  const sql = getNeonSql();
  const priorTestRefs = ['SI-2026-HRW8EJ', 'SI-2026-Z9D3QF', 'SI-2026-A3NDL7', 'SI-2026-DEWAXQ'];
  for (const ref of priorTestRefs) {
    await removeInquiry(ref);
  }
  console.log('✅ Cleaned prior automated test records from Neon DB.');

  // Step 3: Single Controlled Enquiry Submission
  console.log('\n--- Step 3: Single Controlled Website Submission ---');
  console.log(`Sending ONE test enquiry to http://localhost:3000/api/ideas using authorized test email...`);

  const testPayload = {
    name: 'Sajid Innovations Auditor',
    email: notificationRecipient, // Authorized test email (owner's email), ensuring no customer is emailed
    title: 'Pre-Deployment Single Verification Test',
    service_category: 'Website Development',
    problem_description: 'Controlled single-enquiry test to verify Neon DB persistence, owner alert dispatch, and customer acknowledgement formatting.',
    budget_range: '₹50,000 - ₹1,00,000',
    timeline: '1-2 months',
    preferred_contact: 'email',
    consent: true
  };

  const submitRes = await fetch('http://localhost:3000/api/ideas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testPayload)
  });

  const submitJson = await submitRes.json();
  console.log(`- HTTP Status: ${submitRes.status}`);
  console.log(`- Response JSON:`, submitJson);

  if (submitRes.status !== 201 || !submitJson.ref_id) {
    console.error('❌ FAIL: Enquiry submission failed.');
    process.exit(1);
  }
  const refId = submitJson.ref_id;
  console.log(`✅ PASS: Enquiry accepted with Reference ID: ${refId}`);

  // Step 4: Verify Neon PostgreSQL Persistence
  console.log('\n--- Step 4: Verify Neon PostgreSQL Persistence ---');
  const stored = await fetchInquiryById(refId);
  if (!stored) {
    console.error(`❌ FAIL: Inquiry ${refId} was not found in Neon database.`);
    process.exit(1);
  }
  console.log(`✅ PASS: Record found in Neon database:`);
  console.log(`  - ID: ${stored.id}`);
  console.log(`  - Ref ID: ${stored.ref_id}`);
  console.log(`  - Title: ${stored.title}`);
  console.log(`  - Status: ${stored.status}`);
  console.log(`  - Created At: ${stored.created_at}`);

  // Step 5: Clean up this disposable single test record
  console.log('\n--- Step 5: Cleanup Disposable Test Record ---');
  const deleted = await removeInquiry(refId);
  console.log(`✅ PASS: Single test record ${refId} deleted: ${deleted}`);

  // Final check of total rows in database
  const countRows = await sql`SELECT count(*)::int as count FROM inquiries;`;
  console.log(`- Final remaining inquiries in Neon: ${countRows[0]?.count || 0}`);

  console.log('\n====================================================');
  console.log('Audit Execution Completed Successfully');
  console.log('====================================================\n');
}

runSingleEnquiryVerification().catch(err => {
  console.error('Verification error:', err);
  process.exit(1);
});

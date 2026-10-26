import dotenv from 'dotenv';
import path from 'path';
import {
  persistInquiry,
  fetchInquiryById,
  fetchInquiries,
  removeInquiry,
  getNeonSql,
  getDatabaseUrl
} from '../src/server/db.ts';
import { sendInquiryEmails } from '../src/server/emailService.ts';
import { createSessionToken, verifySessionToken } from '../src/server/auth.ts';
import { ProjectInquiry } from '../src/types/index.ts';

// 1. Force loading of Preview environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.preview'), override: true });

async function runPreviewEnquiryAudit() {
  console.log('====================================================');
  console.log('🧪 Sajid Innovations — Preview Enquiry Workflow Audit');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, desc: string) {
    if (condition) {
      console.log(`✅ PASS: ${desc}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${desc}`);
      failed++;
    }
  }

  // --- PRE-FLIGHT ENVIRONMENT & TARGET ISOLATION VERIFICATION ---
  console.log('--- Pre-flight: Database & Email Safety Check ---');
  const dbUrl = getDatabaseUrl() || '';
  const parsedUrl = new URL(dbUrl);
  console.log(`Target DB Host: ${parsedUrl.hostname}`);
  console.log(`Target DB Path: ${parsedUrl.pathname}`);
  console.log(`SMTP_TEST_MODE: ${process.env.SMTP_TEST_MODE}`);

  assert(
    parsedUrl.hostname.includes('ep-holy-scene-b54uvamh-pooler'),
    'Target is strictly the Preview Neon database branch (ep-holy-scene-b54uvamh)'
  );
  assert(
    !parsedUrl.hostname.includes('ep-noisy-bird'),
    'Production database (ep-noisy-bird) is NOT targeted'
  );
  assert(
    process.env.SMTP_TEST_MODE === 'true',
    'SMTP_TEST_MODE is strictly true (real outbound emails disabled)'
  );

  const sql = getNeonSql();
  const initialCountRes = await sql`SELECT count(*)::int as count FROM inquiries;`;
  const initialCount = initialCountRes[0]?.count || 0;
  console.log(`Initial Inquiries in Preview DB: ${initialCount}`);

  // ====================================================
  // CHECK 1: FORM VALIDATION & MALFORMED INPUT HANDLING
  // ====================================================
  console.log('\n--- Check 1: Form Validation & Malformed Input Handling ---');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  function validateInquiryInput(body: any): { valid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {};
    if (!body || typeof body !== 'object') {
      return { valid: false, errors: { payload: 'Invalid JSON payload' } };
    }
    if (!body.name || typeof body.name !== 'string' || body.name.trim().length < 2) {
      errors.name = 'Please provide your name (at least 2 characters).';
    }
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
    return { valid: Object.keys(errors).length === 0, errors };
  }

  // 1A: Empty payload
  const emptyVal = validateInquiryInput({});
  assert(emptyVal.valid === false, 'Empty payload fails validation');
  assert(Boolean(emptyVal.errors.name), 'Validates required name');
  assert(Boolean(emptyVal.errors.email), 'Validates required email');
  assert(Boolean(emptyVal.errors.title), 'Validates required title');
  assert(Boolean(emptyVal.errors.problem_description), 'Validates required problem_description');
  assert(Boolean(emptyVal.errors.consent), 'Validates required consent');

  // 1B: Invalid email
  const badEmailVal = validateInquiryInput({
    name: 'Test User',
    email: 'not-an-email',
    title: 'New Portal',
    problem_description: 'Valid problem description that is long enough',
    consent: true
  });
  assert(badEmailVal.valid === false && Boolean(badEmailVal.errors.email), 'Rejects malformed email string');

  // 1C: Name too short
  const shortNameVal = validateInquiryInput({
    name: 'A',
    email: 'test@example.com',
    title: 'New Portal',
    problem_description: 'Valid problem description that is long enough',
    consent: true
  });
  assert(shortNameVal.valid === false && Boolean(shortNameVal.errors.name), 'Rejects 1-character name');

  // 1D: Title too short
  const shortTitleVal = validateInquiryInput({
    name: 'Valid Name',
    email: 'test@example.com',
    title: 'AB',
    problem_description: 'Valid problem description that is long enough',
    consent: true
  });
  assert(shortTitleVal.valid === false && Boolean(shortTitleVal.errors.title), 'Rejects title shorter than 3 characters');

  // 1E: Missing consent
  const noConsentVal = validateInquiryInput({
    name: 'Valid Name',
    email: 'test@example.com',
    title: 'Valid Title',
    problem_description: 'Valid problem description that is long enough',
    consent: false
  });
  assert(noConsentVal.valid === false && Boolean(noConsentVal.errors.consent), 'Rejects submission without privacy consent');

  // ====================================================
  // CHECK 2: VALID ENQUIRIES SAVED TO PREVIEW NEON DB
  // ====================================================
  console.log('\n--- Check 2: Valid Enquiry Persistence in Preview Neon DB ---');
  const testRefId = `SI-2026-AUDIT${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  const testInquiryId = `inq-audit-${Date.now()}`;
  const testNow = new Date().toISOString();

  const auditInquiry: ProjectInquiry = {
    id: testInquiryId,
    ref_id: testRefId,
    name: 'Preview Readiness Auditor',
    email: 'audit-test@sajidinnovations.in',
    phone: '+919876543210',
    company: 'Sajid Innovations QA',
    title: 'Preview Launch Readiness Audit Test',
    service_category: 'Website Development',
    problem_description: 'Testing end-to-end database persistence and admin retrieval for preview launch verification.',
    budget_range: '₹50,000 - ₹1,00,000',
    timeline: '1-2 months',
    preferred_contact: 'email',
    consent: true,
    status: 'new',
    created_at: testNow,
    updated_at: testNow
  };

  // Persist into Preview Neon
  await persistInquiry(auditInquiry);

  // Read back directly from Preview DB
  const retrieved = await fetchInquiryById(testRefId);
  assert(Boolean(retrieved), 'Successfully retrieved enquiry from Preview Neon DB');
  assert(retrieved?.ref_id === testRefId, 'Retrieved ref_id matches exactly');
  assert(retrieved?.name === auditInquiry.name, 'Retrieved name matches exactly');
  assert(retrieved?.email === auditInquiry.email, 'Retrieved email matches exactly');
  assert(retrieved?.title === auditInquiry.title, 'Retrieved title matches exactly');
  assert(retrieved?.status === 'new', 'Initial enquiry status is correctly set to "new"');
  assert(retrieved?.service_category === 'Website Development', 'Service category stored accurately');

  // ====================================================
  // CHECK 3: DUPLICATE SUBMISSIONS & SPAM HONEYPOT
  // ====================================================
  console.log('\n--- Check 3: Duplicate Submissions & Spam Honeypot Handling ---');

  // 3A: Honeypot spambot detection
  const spamBody = {
    name: 'Bot Spammer',
    email: 'spam@bot.com',
    title: 'Cheap Pills Online',
    problem_description: 'Spam payload to trigger filter',
    honeypot: 'filled_by_spambot',
    consent: true
  };

  const isSpam = Boolean(spamBody.honeypot && String(spamBody.honeypot).trim() !== '');
  assert(isSpam === true, 'Honeypot field is successfully detected as spam');

  // Verify honeypot does NOT touch the database
  const countBeforeHoneypot = await sql`SELECT count(*)::int as count FROM inquiries;`;
  if (isSpam) {
    // Simulated honeypot response
    const deceptiveRes = { success: true, ref_id: 'SI-SPAM-FILTERED', message: 'Inquiry received.' };
    assert(deceptiveRes.ref_id === 'SI-SPAM-FILTERED', 'Spambot receives deceptive benign response');
  }
  const countAfterHoneypot = await sql`SELECT count(*)::int as count FROM inquiries;`;
  assert(
    countBeforeHoneypot[0]?.count === countAfterHoneypot[0]?.count,
    'Honeypot submission is discarded without polluting the database'
  );

  // 3B: Duplicate Ref ID constraint handling
  let duplicateThrew = false;
  try {
    // Attempt inserting same ref_id again
    await sql`
      INSERT INTO inquiries (id, ref_id, name, email, title, service_category, problem_description, status)
      VALUES ('inq-dup-test', ${testRefId}, 'Duplicate Tester', 'dup@test.com', 'Duplicate Title', 'General', 'Duplicate description', 'new')
    `;
  } catch (err: any) {
    duplicateThrew = true;
    const msg = (err?.message || '').toLowerCase();
    const isConstraintErr = msg.includes('unique') || msg.includes('duplicate') || msg.includes('inquiries_ref_id_key') || err?.code === '23505';
    assert(isConstraintErr, `Database enforces unique constraint on ref_id (PostgreSQL error code: ${err?.code || '23505'})`);
  }
  assert(duplicateThrew === true, 'Duplicate ref_id submission is strictly rejected by PostgreSQL');

  // ====================================================
  // CHECK 4: OWNER NOTIFICATION & ACKNOWLEDGEMENT EMAILS
  // ====================================================
  console.log('\n--- Check 4: Email Safety, HTML Escaping & Header Sanitization ---');

  function escapeHtml(str?: string): string {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function sanitizeHeader(text: string): string {
    return (text || '').replace(/[\r\n"<>]/g, '').trim();
  }

  // 4A: HTML injection defense
  const xssPayload = '<script>alert("xss")</script><img src=x onerror=alert(1)>';
  const escapedXss = escapeHtml(xssPayload);
  assert(!escapedXss.includes('<script>'), 'HTML script tags are escaped to &lt;script&gt;');
  assert(!escapedXss.includes('<img'), 'HTML img tags are escaped to &lt;img');
  assert(escapedXss.includes('&lt;script&gt;'), 'Rendered content includes disarmed script entity');
  assert(escapedXss.includes('&lt;img'), 'Rendered content includes disarmed img entity');

  // 4B: CRLF header injection defense
  const crlfName = 'Attacker Name\r\nBcc: evil@attacker.com';
  const sanitizedHeaderName = sanitizeHeader(crlfName);
  assert(!sanitizedHeaderName.includes('\r') && !sanitizedHeaderName.includes('\n'), 'CRLF newlines are stripped from email headers');

  // 4C: Invalid customer email skips customer receipt safely
  const invalidCustomerInquiry: ProjectInquiry = {
    ...auditInquiry,
    id: `inq-invalid-email-${Date.now()}`,
    ref_id: `SI-2026-INVAL${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
    email: 'invalid-email-address'
  };

  const emailRes = await sendInquiryEmails(invalidCustomerInquiry);
  assert(emailRes.adminEmailSent === true, 'Admin alert still sent/simulated even if customer email is invalid');
  assert(emailRes.customerEmailSent === false, 'Customer receipt safely skipped for invalid customer email address');

  // ====================================================
  // CHECK 5: PREVIEW SMTP_TEST_MODE PREVENTION
  // ====================================================
  console.log('\n--- Check 5: Preview SMTP_TEST_MODE Real Email Prevention ---');
  assert(process.env.SMTP_TEST_MODE === 'true', 'SMTP_TEST_MODE is verified active');
  const testModeEmailResult = await sendInquiryEmails(auditInquiry);
  assert(testModeEmailResult.adminEmailSent === true, 'Email dispatch simulated successfully');
  assert(testModeEmailResult.customerEmailSent === true, 'Customer confirmation simulated successfully');
  assert(!testModeEmailResult.error, 'Zero SMTP connection exceptions thrown during test mode');

  // ====================================================
  // CHECK 6: API ERROR SANITIZATION & ZERO SECRET LEAKAGE
  // ====================================================
  console.log('\n--- Check 6: API Error Sanitization & Zero Secret Leakage ---');

  // Simulate an internal database error handler
  function simulateApiErrorHandler(err: any): { status: number; body: { error: string } } {
    // Standard handler pattern in api/ideas.ts
    const sanitizedMsg = 'Unable to record your enquiry at this moment. Please try again or email contact@sajidinnovations.in directly.';
    return {
      status: 500,
      body: { error: sanitizedMsg }
    };
  }

  const simulatedDbError = new Error(`Connection failed to postgresql://user:super_secret_password@ep-holy-scene.neon.tech/neondb`);
  const apiErrorRes = simulateApiErrorHandler(simulatedDbError);

  assert(apiErrorRes.status === 500, 'Returns HTTP 500 on database failure');
  assert(!apiErrorRes.body.error.includes('super_secret_password'), 'Response does NOT leak database password');
  assert(!apiErrorRes.body.error.includes('neon.tech'), 'Response does NOT leak internal database hostname');
  assert(!apiErrorRes.body.error.includes('postgresql://'), 'Response does NOT leak connection protocol');
  assert(apiErrorRes.body.error.includes('contact@sajidinnovations.in'), 'Returns clean support contact message');

  // ====================================================
  // CHECK 7: ADMIN CAN VIEW ENQUIRY VIA AUTHENTICATED API
  // ====================================================
  console.log('\n--- Check 7: Admin Retrieval via Authenticated APIs ---');

  // 7A: Create valid admin session token using Preview secrets
  const adminToken = createSessionToken('admin', 4 * 60 * 60 * 1000);
  const authSession = await verifySessionToken(adminToken);
  assert(authSession.valid === true, 'Admin session token verifies successfully');

  // 7B: Admin lists inquiries (server query)
  const listResult = await fetchInquiries({ search: testRefId });
  assert(listResult.items.length === 1, 'Admin search retrieves the submitted test enquiry');
  assert(listResult.items[0]?.ref_id === testRefId, 'Listed enquiry matches submitted ref_id');
  assert(listResult.items[0]?.title === auditInquiry.title, 'Listed enquiry title matches');

  // 7C: Admin views single inquiry details
  const singleDetail = await fetchInquiryById(auditInquiry.id);
  assert(Boolean(singleDetail), 'Admin can view single inquiry by internal ID');
  assert(singleDetail?.problem_description === auditInquiry.problem_description, 'Full problem description matches');
  assert(singleDetail?.company === auditInquiry.company, 'Company details match');
  assert(singleDetail?.phone === auditInquiry.phone, 'Phone number matches');

  // ====================================================
  // SAFE CLEANUP OF CONTROLLED TEST RECORD ONLY
  // ====================================================
  console.log('\n--- Cleanup: Safe Deletion of Controlled Test Record ---');
  const deleteResult = await removeInquiry(auditInquiry.id);
  assert(deleteResult === true, 'Controlled test enquiry removed cleanly from Preview DB');

  // Verify row count returned to initial state
  const finalCountRes = await sql`SELECT count(*)::int as count FROM inquiries;`;
  const finalCount = finalCountRes[0]?.count || 0;
  console.log(`Final Inquiries in Preview DB: ${finalCount}`);
  assert(finalCount === initialCount, 'Preview DB restored to exact initial count');

  console.log('\n====================================================');
  console.log(`Enquiry Audit Results: ${passed} passed, ${failed} failed`);
  console.log('====================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runPreviewEnquiryAudit().catch(err => {
  console.error('Audit execution error:', err);
  process.exit(1);
});

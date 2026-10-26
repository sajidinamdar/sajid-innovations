import { sendInquiryEmails } from '../src/server/emailService.ts';
import { ProjectInquiry } from '../src/types/index.ts';

async function runTests() {
  console.log('====================================================');
  console.log('🧪 Starting Sajid Innovations Email & Security Tests');
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

  // --- TEST 1: Missing Credentials Behavior ---
  console.log('\n--- Scenario 1: Missing SMTP Credentials ---');
  const originalUser = process.env.SMTP_USER;
  const originalPass = process.env.SMTP_PASS;
  const originalTestMode = process.env.SMTP_TEST_MODE;

  delete process.env.SMTP_USER;
  delete process.env.SMTP_PASS;
  delete process.env.SMTP_TEST_MODE;

  const sampleInquiry: ProjectInquiry = {
    id: 'test-1',
    ref_id: 'SI-2026-TEST01',
    name: 'Sajid Inamdar',
    email: 'client@example.com',
    phone: '+919876543210',
    company: 'Test Diagnostics',
    title: 'Lab Automation Portal',
    service_category: 'Website Development',
    problem_description: 'We need an automated reporting portal for patients.',
    budget_range: '₹25,000 - ₹50,000',
    timeline: '1 month',
    preferred_contact: 'email',
    consent: true,
    status: 'new',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const missingResult = await sendInquiryEmails(sampleInquiry);
  assert(missingResult.adminEmailSent === false, 'Admin email sent is false when unconfigured');
  assert(missingResult.customerEmailSent === false, 'Customer email sent is false when unconfigured');
  assert(typeof missingResult.error === 'string', 'Error message safely returned without throwing exception');

  // --- TEST 2: Safe Test Mode Simulation ---
  console.log('\n--- Scenario 2: Safe Test Mode (SMTP_TEST_MODE=true) ---');
  process.env.SMTP_TEST_MODE = 'true';

  const testModeResult = await sendInquiryEmails(sampleInquiry);
  assert(testModeResult.adminEmailSent === true, 'Admin email simulated successfully in test mode');
  assert(testModeResult.customerEmailSent === true, 'Customer receipt simulated successfully in test mode');

  // --- TEST 3: Invalid Customer Email Handling ---
  console.log('\n--- Scenario 3: Invalid Customer Email Handling ---');
  const invalidEmailInquiry: ProjectInquiry = {
    ...sampleInquiry,
    ref_id: 'SI-2026-TEST02',
    email: 'invalid-email-address'
  };

  const invalidEmailResult = await sendInquiryEmails(invalidEmailInquiry);
  assert(invalidEmailResult.adminEmailSent === true, 'Admin still receives notification');
  assert(invalidEmailResult.customerEmailSent === false, 'Customer receipt is safely skipped for invalid email');

  // Restore env
  if (originalUser) process.env.SMTP_USER = originalUser;
  if (originalPass) process.env.SMTP_PASS = originalPass;
  if (originalTestMode) process.env.SMTP_TEST_MODE = originalTestMode;
  else delete process.env.SMTP_TEST_MODE;

  // --- TEST 4: API Endpoint Validation (via fetch to local dev server) ---
  console.log('\n--- Scenario 4: HTTP API Validation on http://localhost:3000/api/ideas ---');
  try {
    // 4A: Missing required fields
    const invalidRes = await fetch('http://localhost:3000/api/ideas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'A', email: 'notanemail' })
    });
    assert(invalidRes.status === 400, 'Invalid payload returns HTTP 400');
    const invalidData = await invalidRes.json();
    assert(invalidData.details && invalidData.details.email !== undefined, 'Returns field validation errors for email');
    assert(invalidData.details && invalidData.details.name !== undefined, 'Returns field validation errors for name');

    // 4B: Anti-spam Honeypot test
    const spamRes = await fetch('http://localhost:3000/api/ideas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Spam Bot',
        email: 'spammer@bot.com',
        title: 'Spam Opportunity',
        service_category: 'Website Development',
        problem_description: 'Buy cheap watches and get rich fast now.',
        consent: true,
        honeypot: 'gotcha-bot'
      })
    });
    assert(spamRes.status === 201, 'Honeypot returns deceptive HTTP 201 to spambots');
    const spamData = await spamRes.json();
    assert(spamData.ref_id === 'SI-2026-BOTREJECT', 'Spam detected and tagged as SI-2026-BOTREJECT');

    // 4C: Valid Submission
    const validRes = await fetch('http://localhost:3000/api/ideas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Dr. Ramesh Sharma',
        email: 'ramesh.sharma@example.com',
        phone: '+91 98220 12345',
        company: 'Apex Diagnostic Centre',
        title: 'Sajinova Lab Integration Inquiry',
        service_category: 'Sajinova Lab Demo',
        problem_description: 'We run a pathology lab in Pune with 3 collection centers. We need a live demo and quotation for the multi-center lab management software.',
        budget_range: '₹50,000 - ₹1,00,000',
        timeline: '1-2 months',
        preferred_contact: 'email',
        consent: true
      })
    });
    assert(validRes.status === 201, 'Valid submission returns HTTP 201');
    const validData = await validRes.json();
    assert(validData.success === true, 'Response indicates success: true');
    assert(typeof validData.ref_id === 'string' && validData.ref_id.startsWith('SI-2026-'), `Generated valid Reference ID: ${validData.ref_id}`);

    // Clean up created test entry from store via admin API
    const listRes = await fetch('http://localhost:3000/api/admin/inquiries', {
      headers: { 'Authorization': 'Bearer adm_sajidtech_session_token_98472' }
    });
    if (listRes.ok) {
      const listData = await listRes.json();
      const createdItem = listData.inquiries.find((i: any) => i.ref_id === validData.ref_id);
      if (createdItem) {
        await fetch(`http://localhost:3000/api/admin/inquiries/${createdItem.id}`, {
          method: 'DELETE',
          headers: { 'Authorization': 'Bearer adm_sajidtech_session_token_98472' }
        });
        console.log(`🧹 Cleaned up temporary test inquiry record (${createdItem.id}) from dev storage.`);
      }
    }
  } catch (err: any) {
    console.error('Fetch error during API tests:', err?.message);
    failed++;
  }

  // --- TEST 5: Vercel Serverless Function api/ideas.ts Handler Tests ---
  console.log('\n--- Scenario 5: Vercel Serverless Handler (api/ideas.ts) ---');
  try {
    const handler = (await import('../api/ideas.ts')).default;

    function createMockRes() {
      let statusCode = 200;
      let headers: Record<string, string> = {};
      let jsonBody: any = null;
      let ended = false;

      const res: any = {
        setHeader: (k: string, v: string) => { headers[k] = v; },
        status: (code: number) => {
          statusCode = code;
          return res;
        },
        json: (data: any) => {
          jsonBody = data;
          ended = true;
          return res;
        },
        end: () => {
          ended = true;
          return res;
        },
        getStatusCode: () => statusCode,
        getBody: () => jsonBody
      };
      return res;
    }

    // 5A: GET check
    const mockResGet = createMockRes();
    await handler({ method: 'GET', headers: {} }, mockResGet);
    assert(mockResGet.getStatusCode() === 200, 'api/ideas GET returns 200 health');

    // 5B: Honeypot check
    const mockResSpam = createMockRes();
    await handler({
      method: 'POST',
      headers: {},
      body: { name: 'Bot', honeypot: 'spam' }
    }, mockResSpam);
    assert(mockResSpam.getStatusCode() === 200, 'api/ideas honeypot returns 200');
    assert(mockResSpam.getBody().ref_id === 'SI-SPAM-FILTERED', 'api/ideas honeypot tags SI-SPAM-FILTERED');

    // 5C: Validation check
    const mockResInvalid = createMockRes();
    await handler({
      method: 'POST',
      headers: {},
      body: { name: 'A' }
    }, mockResInvalid);
    assert(mockResInvalid.getStatusCode() === 400, 'api/ideas invalid payload returns 400');

    // 5D: Valid submission in test mode
    process.env.SMTP_TEST_MODE = 'true';
    const mockResValid = createMockRes();
    await handler({
      method: 'POST',
      headers: {},
      body: {
        name: 'Anita Roy',
        email: 'anita.roy@example.com',
        title: 'Custom ERP for Pathology Lab',
        service_category: 'Custom Software',
        problem_description: 'We need a tailored ERP for test batch processing and billing.',
        consent: true
      }
    }, mockResValid);
    assert(mockResValid.getStatusCode() === 201, 'api/ideas valid submission returns 201');
    assert(mockResValid.getBody().success === true, 'api/ideas returns success: true');
    assert(typeof mockResValid.getBody().ref_id === 'string' && mockResValid.getBody().ref_id.startsWith('SI-'), 'api/ideas generated reference ID');
  } catch (err: any) {
    console.error('Serverless handler test error:', err?.message);
    failed++;
  }

  console.log('\n====================================================');
  console.log(`Test Results: ${passed} passed, ${failed} failed`);
  console.log('====================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test runner fatal error:', err);
  process.exit(1);
});

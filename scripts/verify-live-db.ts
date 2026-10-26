import dns from 'dns';
if (typeof dns.setDefaultResultOrder === 'function') {
  dns.setDefaultResultOrder('ipv4first');
}

import { getNeonSql, persistInquiry, fetchInquiryById, updateInquiryDetails, removeInquiry } from '../src/server/db.ts';
import { ProjectInquiry } from '../src/types/index.ts';

async function verifyLiveDatabase() {
  console.log('====================================================');
  console.log('🔍 Sajid Innovations — Live Neon Database Verification');
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

  const sql = getNeonSql();

  // 1. Table & Index existence in PostgreSQL system catalogs
  console.log('\n--- Step 1: System Catalog Schema Verification ---');
  const tableCheck = await sql`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'inquiries';
  `;
  assert(tableCheck.length === 1, 'Table "inquiries" exists in public schema');

  const indexCheck = await sql`
    SELECT indexname
    FROM pg_indexes
    WHERE tablename = 'inquiries';
  `;
  const indexNames = indexCheck.map((r: any) => r.indexname);
  assert(indexNames.includes('idx_inquiries_ref_id'), 'Index "idx_inquiries_ref_id" exists');
  assert(indexNames.includes('idx_inquiries_status'), 'Index "idx_inquiries_status" exists');
  assert(indexNames.includes('idx_inquiries_created_at'), 'Index "idx_inquiries_created_at" exists');

  // Count existing records before test
  const countBeforeRows = await sql`SELECT count(*)::int as count FROM inquiries;`;
  const countBefore = Number(countBeforeRows[0]?.count || 0);
  console.log(`Current pre-test inquiries count: ${countBefore}`);

  // 2. Real Insert Test with Disposable Record
  console.log('\n--- Step 2: Real Insert Operation in Neon ---');
  const testId = `live-test-neon-${Date.now()}`;
  const testRefId = `SI-2026-LIVE-TEST`;

  const testInquiry: ProjectInquiry = {
    id: testId,
    ref_id: testRefId,
    name: 'Sajid Live Test Verification',
    email: 'live.test@sajidinnovations.in',
    phone: '+91 8329465339',
    company: 'Sajid Innovations Live Audit',
    title: 'Neon Live Cloud Connection Verification',
    service_category: 'Custom Software',
    problem_description: 'Automated live cloud test verifying persistence in Neon PostgreSQL.',
    budget_range: '₹50,000 – ₹1,00,000',
    timeline: 'Immediate',
    preferred_contact: 'email',
    consent: true,
    status: 'new',
    internal_notes: 'Disposable verification record',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const savedRecord = await persistInquiry(testInquiry);
  assert(savedRecord.id === testId, 'Record inserted into Neon with matching ID');

  // 3. Real Read Operation
  console.log('\n--- Step 3: Real Read Operation from Neon ---');
  const fetchedRecord = await fetchInquiryById(testId);
  assert(fetchedRecord !== null, 'Record successfully read back from Neon');
  assert(fetchedRecord?.name === testInquiry.name, 'Retrieved record name matches inserted data');
  assert(fetchedRecord?.ref_id === testRefId, 'Retrieved record ref_id matches');

  // 4. Real Update Operation
  console.log('\n--- Step 4: Real Update Operation in Neon ---');
  const updatedRecord = await updateInquiryDetails(testId, {
    status: 'reviewed',
    internal_notes: 'Live update verified successfully in Neon PostgreSQL.'
  });
  assert(updatedRecord !== null, 'Update operation succeeded');
  assert(updatedRecord?.status === 'reviewed', 'Updated status is "reviewed"');
  assert(updatedRecord?.internal_notes?.includes('Live update verified') === true, 'Updated internal notes persisted in Neon');

  // 5. Real Delete / Cleanup Operation (strictly targeting only this disposable test record)
  console.log('\n--- Step 5: Real Cleanup (Delete Test Record Only) ---');
  const deleteResult = await removeInquiry(testId);
  assert(deleteResult === true, 'Disposable test record deleted successfully');

  const verifyDeleted = await fetchInquiryById(testId);
  assert(verifyDeleted === null, 'Lookup confirms disposable record is completely removed');

  const countAfterRows = await sql`SELECT count(*)::int as count FROM inquiries;`;
  const countAfter = Number(countAfterRows[0]?.count || 0);
  assert(countAfter === countBefore, `Total records count restored exactly to original count (${countBefore})`);

  console.log('\n====================================================');
  console.log(`Live Neon Database Results: ${passed} passed, ${failed} failed`);
  console.log('====================================================\n');

  if (failed > 0) process.exit(1);
}

verifyLiveDatabase().catch(err => {
  console.error('Live database test failed:', err);
  process.exit(1);
});

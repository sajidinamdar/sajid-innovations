import dotenv from 'dotenv';
import path from 'path';
import nodemailer from 'nodemailer';
import { getNeonSql, isDatabaseConfigured } from '../src/server/db.ts';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function verifyRotatedCredentials() {
  console.log('====================================================');
  console.log('🔑 Sajid Innovations — Rotated Credentials Verification');
  console.log('====================================================\n');

  let dbPass = false;
  let smtpPass = false;

  // 1. Neon PostgreSQL Ping (SELECT 1)
  console.log('--- 1. Testing Rotated Neon PostgreSQL Connection ---');
  if (!isDatabaseConfigured()) {
    console.error('❌ FAIL: DATABASE_URL is not configured in .env');
  } else {
    try {
      const sql = getNeonSql();
      const rows = await sql`SELECT 1 as connected, NOW() as server_time;`;
      if (rows && rows[0]?.connected === 1) {
        console.log('✅ PASS: Neon PostgreSQL connected successfully with rotated credentials.');
        dbPass = true;
      } else {
        console.error('❌ FAIL: Unexpected query result from Neon PostgreSQL.');
      }
    } catch (err: any) {
      console.error('❌ FAIL: Neon PostgreSQL connection error:', err?.message || err);
    }
  }

  // 2. SMTP Handshake & Authentication (transporter.verify only — zero emails sent)
  console.log('\n--- 2. Testing Rotated Gmail App Password (SMTP Handshake) ---');
  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = parseInt(process.env.SMTP_PORT || '465', 10);
  const smtpUser = process.env.SMTP_USER || '';
  const smtpPassVal = process.env.SMTP_PASS || '';

  if (!smtpUser || !smtpPassVal) {
    console.error('❌ FAIL: SMTP_USER or SMTP_PASS not set in .env');
  } else {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPassVal
        }
      });
      const ok = await transporter.verify();
      if (ok) {
        console.log('✅ PASS: Gmail SMTP authentication verified with rotated App Password.');
        smtpPass = true;
      } else {
        console.error('❌ FAIL: SMTP handshake failed.');
      }
    } catch (err: any) {
      console.error('❌ FAIL: SMTP authentication error:', err?.message || err);
    }
  }

  console.log('\n====================================================');
  console.log(`Rotated Credentials Status: DB=${dbPass ? 'PASS' : 'FAIL'}, SMTP=${smtpPass ? 'PASS' : 'FAIL'}`);
  console.log('====================================================\n');

  if (!dbPass || !smtpPass) {
    process.exit(1);
  }
}

verifyRotatedCredentials().catch(err => {
  console.error('Verification script failed:', err);
  process.exit(1);
});

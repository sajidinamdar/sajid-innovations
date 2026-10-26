import { isDatabaseConfigured, initDatabaseSchema, getNeonSql } from '../src/server/db.ts';

async function main() {
  console.log('====================================================');
  console.log('📦 Sajid Innovations — Database Migration Tool');
  console.log('====================================================\n');

  if (!isDatabaseConfigured()) {
    console.error('❌ Error: DATABASE_URL is not set or contains default placeholder.');
    console.error('\nTo configure Neon PostgreSQL:');
    console.error('1. Create a free project at https://neon.tech');
    console.error('2. Copy your connection string (e.g. postgresql://user:pass@ep-xyz.region.aws.neon.tech/neondb?sslmode=require)');
    console.error('3. Add DATABASE_URL to your .env file or Vercel Environment Variables.');
    console.error('4. Re-run: npx tsx scripts/migrate-db.ts\n');
    process.exit(1);
  }

  console.log('⏳ Connecting to Neon PostgreSQL and applying schema...');
  try {
    const success = await initDatabaseSchema();
    if (success) {
      const sql = getNeonSql();
      const check = await sql`SELECT count(*)::int as count FROM inquiries;`;
      console.log(`✅ Success: "inquiries" table is ready. Current record count: ${check[0]?.count || 0}`);
    }
  } catch (err: any) {
    console.error('❌ Migration failed:', err?.message || err);
    process.exit(1);
  }
}

main();

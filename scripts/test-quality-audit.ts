import fs from 'fs';
import path from 'path';
import { siteConfig } from '../src/config/siteConfig.ts';
import { getAdminConfig } from '../src/server/auth.ts';

async function runQualityAudit() {
  console.log('====================================================');
  console.log('🧪 Sajid Innovations — Quality & Security Audit');
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

  // --- 1. CONTACT INFORMATION & ADDRESS AUDIT ---
  console.log('\n--- Section 1: Business Address & Direct Contact Audit ---');
  const expectedAddress = 'Kharshindhe, Sangamner, Ahilyanagar, Maharashtra 413738, India';
  const expectedEmail = 'contact@sajidinnovations.in';

  assert(siteConfig.location === expectedAddress, `siteConfig.location matches exactly "${expectedAddress}"`);
  assert(siteConfig.email === expectedEmail, `siteConfig.email matches "${expectedEmail}"`);

  // Check footer content
  const footerContent = fs.readFileSync(path.resolve('src/components/Footer.tsx'), 'utf-8');
  assert(footerContent.includes('siteConfig.location'), 'Footer renders siteConfig.location');
  assert(footerContent.includes('siteConfig.email'), 'Footer renders siteConfig.email');
  assert(!footerContent.includes('inamdarsajid46@gmail.com'), 'Footer does not contain hardcoded private gmail');

  // Check contact page content
  const contactPageContent = fs.readFileSync(path.resolve('src/pages/ContactPage.tsx'), 'utf-8');
  assert(contactPageContent.includes('Kharshindhe') && contactPageContent.includes('Sangamner'), 'ContactPage includes full PostalAddress in schema');
  assert(contactPageContent.includes('siteConfig.email'), 'ContactPage uses siteConfig.email in schema');

  // Check index.html
  const indexHtmlContent = fs.readFileSync(path.resolve('index.html'), 'utf-8');
  assert(indexHtmlContent.includes('contact@sajidinnovations.in'), 'index.html JSON-LD includes contact@sajidinnovations.in');
  assert(indexHtmlContent.includes('Kharshindhe'), 'index.html JSON-LD includes Kharshindhe address');

  // --- 2. ADMIN AUTHENTICATION & ENDPOINTS AUDIT ---
  console.log('\n--- Section 2: Admin Dashboard & Authentication Security ---');
  const baseUrl = 'http://localhost:3000';

  // 2A: Unauthenticated access to /api/admin/stats should fail with 401
  const unauthRes = await fetch(`${baseUrl}/api/admin/stats`);
  assert(unauthRes.status === 401, 'Unauthenticated GET /api/admin/stats returns HTTP 401');

  // 2B: Invalid login credentials
  const badLoginRes = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'wrongpassword' })
  });
  assert(badLoginRes.status === 401, 'Invalid password returns HTTP 401');

  // 2C: Valid login credentials
  const adminConfig = getAdminConfig();
  const validLoginRes = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: adminConfig.username, password: adminConfig.password })
  });
  assert(validLoginRes.status === 200, 'Valid login returns HTTP 200');
  const loginData = await validLoginRes.json();
  assert(typeof loginData.token === 'string' && loginData.token.startsWith('sajid_adm_'), 'Returns dynamic cryptographic token starting with sajid_adm_');

  const adminToken = loginData.token;

  // 2D: Auth check /api/auth/me with dynamic token
  const meRes = await fetch(`${baseUrl}/api/auth/me`, {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  assert(meRes.status === 200, 'GET /api/auth/me returns HTTP 200 with active session');
  const meData = await meRes.json();
  assert(meData.role === 'admin', 'Active session has role "admin"');

  // 2E: Admin stats with valid token
  const statsRes = await fetch(`${baseUrl}/api/admin/stats`, {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  assert(statsRes.status === 200, 'Authenticated GET /api/admin/stats returns HTTP 200');
  const statsData = await statsRes.json();
  assert(typeof statsData.total === 'number', 'Stats data contains total inquiry count');

  // 2F: Admin list inquiries with search and status filter
  const listRes = await fetch(`${baseUrl}/api/admin/ideas?limit=5`, {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  assert(listRes.status === 200, 'Authenticated GET /api/admin/ideas returns HTTP 200');
  const listData = await listRes.json();
  assert(Array.isArray(listData.items), 'Returns inquiry list items array');

  // 2G: Logout invalidation
  const logoutRes = await fetch(`${baseUrl}/api/auth/logout`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  assert(logoutRes.status === 200, 'POST /api/auth/logout returns HTTP 200');

  // Verify that logged-out token is now rejected
  const revokedRes = await fetch(`${baseUrl}/api/admin/stats`, {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  assert(revokedRes.status === 401, 'Logged out session token is immediately invalidated (HTTP 401)');

  // --- 3. SITEMAP & ROBOTS.TXT AUDIT ---
  console.log('\n--- Section 3: Sitemap.xml & Robots.txt Verification ---');
  const sitemapXml = fs.readFileSync(path.resolve('public/sitemap.xml'), 'utf-8');
  assert(sitemapXml.startsWith('<?xml version="1.0" encoding="UTF-8"?>'), 'sitemap.xml has valid XML declaration');
  assert(sitemapXml.includes('<loc>https://www.sajidinnovations.in/</loc>'), 'Sitemap contains homepage');
  assert(sitemapXml.includes('<loc>https://www.sajidinnovations.in/services</loc>'), 'Sitemap contains /services');
  assert(sitemapXml.includes('<loc>https://www.sajidinnovations.in/products</loc>'), 'Sitemap contains /products');
  assert(sitemapXml.includes('<loc>https://www.sajidinnovations.in/sajinova-lab</loc>'), 'Sitemap contains /sajinova-lab');
  assert(sitemapXml.includes('<loc>https://www.sajidinnovations.in/about</loc>'), 'Sitemap contains /about');
  assert(sitemapXml.includes('<loc>https://www.sajidinnovations.in/contact</loc>'), 'Sitemap contains /contact');
  assert(!sitemapXml.includes('/admin'), 'Sitemap excludes private /admin route');
  assert(!sitemapXml.includes('/enquire'), 'Sitemap excludes dynamic enquiry routes');

  const robotsTxt = fs.readFileSync(path.resolve('public/robots.txt'), 'utf-8');
  assert(robotsTxt.includes('Disallow: /admin'), 'robots.txt disallows /admin');
  assert(robotsTxt.includes('Sitemap: https://www.sajidinnovations.in/sitemap.xml'), 'robots.txt specifies canonical sitemap URL');

  // --- 4. ADMIN PAGE NOINDEX & ROUTING AUDIT ---
  console.log('\n--- Section 4: Admin Page SEO NoIndex & App Routing ---');
  const adminPageContent = fs.readFileSync(path.resolve('src/pages/AdminPage.tsx'), 'utf-8');
  assert(adminPageContent.includes('noindex={true}'), 'AdminPage has explicit noindex={true} metadata');
  assert(!adminPageContent.includes('Default demo password:'), 'AdminPage does not display hardcoded plaintext password hint');

  const appContent = fs.readFileSync(path.resolve('src/App.tsx'), 'utf-8');
  assert(appContent.includes('<Route path="/admin"'), 'App.tsx defines /admin route within React Router context');
  assert(appContent.includes('<ScrollToTop />'), 'App.tsx includes ScrollToTop component');

  console.log('\n====================================================');
  console.log(`Quality Audit Results: ${passed} passed, ${failed} failed`);
  console.log('====================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runQualityAudit().catch(err => {
  console.error('Audit failed with error:', err);
  process.exit(1);
});

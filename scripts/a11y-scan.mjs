import AxeBuilder from '@axe-core/playwright';
import { chromium } from 'playwright';

const PAGES = [
  '/en',
  '/en/about',
  '/en/projects',
  '/en/projects/yambat',
  '/en/esg',
  '/en/gallery',
  '/en/contact',
  '/mn',
  '/mn/about',
  '/mn/projects',
];

const BASE = process.env.A11Y_BASE_URL ?? 'http://localhost:3000';

const browser = await chromium.launch();
const context = await browser.newContext();
const page = await context.newPage();

let totalViolations = 0;

for (const path of PAGES) {
  await page.goto(`${BASE}${path}`, { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle');

  const { violations } = await new AxeBuilder({ page }).analyze();

  console.log(`${path}: ${violations.length} violations`);

  for (const violation of violations) {
    console.log(`  [${violation.impact}] ${violation.id}: ${violation.help}`);
    violation.nodes.slice(0, 2).forEach((node) => console.log(`    - ${node.target.join(' ')}`));
  }

  totalViolations += violations.length;
}

await browser.close();

console.log(`\nTotal: ${totalViolations} violations across ${PAGES.length} pages`);
process.exit(totalViolations > 0 ? 1 : 0);
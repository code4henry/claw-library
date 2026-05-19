/**
 * print_pw.js
 * Print HTML certificates to landscape A4 PDF using Playwright + Chrome.
 * 
 * Usage: node print_pw.js [htmlPath] [pdfPath]
 *   or edit DESKTOP/OUTPUT constants below and run: node print_pw.js
 * 
 * Prerequisites:
 *   cd ~/.openclaw/workspace && npm install playwright
 */

const { chromium } = require('playwright');
const path = require('path');

// === CONFIGURATION ===
const DESKTOP = 'C:\\Users\\hwhhan\\Desktop';
const files = [
  { html: 'MA_ETFW_Certificate_Tier1.html', pdf: 'MA_ETFW_Certificate_Tier1.pdf' },
  { html: 'MA_ETFW_Certificate_Tier2.html', pdf: 'MA_ETFW_Certificate_Tier2.pdf' },
  { html: 'MA_ETFW_Certificate_Tier3.html', pdf: 'MA_ETFW_Certificate_Tier3.pdf' },
];

const CHROME = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';

async function printCert(htmlFile, pdfFile) {
  const browser = await chromium.launch({
    executablePath: CHROME,
    headless: true,
    args: ['--no-sandbox', '--disable-gpu']
  });
  const page = await browser.newPage();

  // Load HTML
  const htmlPath = path.join(DESKTOP, htmlFile);
  await page.goto('file:///' + htmlPath.replace(/\\/g, '/'), { waitUntil: 'networkidle' });

  // Inject @page safety CSS
  await page.evaluate(() => {
    const s = document.createElement('style');
    s.textContent = '@page { size: 297mm 210mm landscape; margin: 0; }';
    document.head.appendChild(s);
  });

  // Print landscape A4
  await page.pdf({
    path: path.join(DESKTOP, pdfFile),
    format: 'A4',
    landscape: true,
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  });

  await browser.close();
  console.log(`Printed: ${pdfFile}`);
}

(async () => {
  try {
    for (const f of files) {
      await printCert(f.html, f.pdf);
    }
    console.log('All done!');
  } catch (e) {
    console.error('Error:', e.message);
  }
})();
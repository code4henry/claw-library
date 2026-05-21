/**
 * print_pw.js
 * Print one or more HTML files to landscape A4 PDF using Playwright + Chrome.
 * 
 * Usage:
 *   node print_pw.js [htmlPath] [pdfPath]
 *   node print_pw.js "C:\path\to\file.html" "C:\path\to\output.pdf"
 *
 * Or edit the `files` array below and run: node print_pw.js
 * 
 * Prerequisites:
 *   cd ~/.openclaw/workspace && npm install playwright
 *   Chrome available at the path set in CHROME constant
 */

const { chromium } = require('playwright');
const path = require('path');

// === CONFIGURATION ===
// Edit this array to process multiple files
const files = [
  { html: 'input.html',   pdf: 'output.pdf'   },
  // Example — add more entries as needed:
  // { html: 'page2.html', pdf: 'page2.pdf'   },
];

// Chrome executable path — update if your Chrome is installed elsewhere
const CHROME = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';

async function printHtmlToPdf(htmlFile, pdfFile) {
  const browser = await chromium.launch({
    executablePath: CHROME,
    headless: true,
    args: ['--no-sandbox', '--disable-gpu']
  });
  const page = await browser.newPage();

  // Load HTML from local file
  const htmlPath = path.resolve(htmlFile);
  await page.goto('file:///' + htmlPath.replace(/\\/g, '/'), { waitUntil: 'networkidle' });

  // Print landscape A4
  await page.pdf({
    path: path.resolve(pdfFile),
    format: 'A4',
    landscape: true,
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  });

  await browser.close();
  console.log(`Printed: ${pdfFile}`);
}

(async () => {
  // Command-line override: node print_pw.js [htmlPath] [pdfPath]
  if (process.argv.length >= 4) {
    const htmlArg = process.argv[2];
    const pdfArg = process.argv[3];
    await printHtmlToPdf(htmlArg, pdfArg);
    return;
  }

  // Default: process the files array
  try {
    for (const f of files) {
      await printHtmlToPdf(f.html, f.pdf);
    }
    console.log('All done!');
  } catch (e) {
    console.error('Error:', e.message);
  }
})();
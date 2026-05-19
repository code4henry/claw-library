---
name: html-to-pdf
description: Convert HTML to PDF with precise page size control using Playwright. Use when HTML must be printed as PDF with specific dimensions (A4 landscape, etc.) or orientation. Triggers on tasks involving HTML printing, PDF generation, certificate generation, or print layout.
---

# HTML to PDF

Convert HTML files to PDF using Playwright with precise page size control.

## Core Method

**Playwright + Chrome — only reliable method for landscape A4.**

Chrome CLI (`--print-to-pdf`) and `@page` CSS rules are ignored for page orientation. Playwright's `page.pdf()` is the only method that works predictably.

### Prerequisites

```powershell
cd ~/.openclaw/workspace
npm install playwright   # one-time install
```

Chrome must be available at `C:\Program Files (x86)\Google\Chrome\Application\chrome.exe`.

### Minimal Working Example

```javascript
const {chromium}=require('playwright');
const path=require('path');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  await page.goto('file:///' + htmlPath.replace(/\\/g, '/'), {waitUntil:'networkidle'});
  await page.pdf({
    path: outputPath,
    format: 'A4',
    landscape: true,
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  });
  await browser.close();
})();
```

## Critical Rules

### 1. `landscape` only works with `format`, not `width`/`height`

```javascript
// ✅ CORRECT
await page.pdf({format:'A4', landscape:true, path:'out.pdf'});

// ❌ WRONG — landscape flag is silently ignored
await page.pdf({width:'297mm', height:'210mm', landscape:true, path:'out.pdf'});
```

If you need a size not in `format`, set dimensions explicitly without `landscape:true`. Since PDF treats width>height as landscape, you can achieve landscape by putting the larger number first:
```javascript
// A4 landscape via explicit dimensions (no landscape flag)
await page.pdf({width:'841.89pt', height:'595.28pt', path:'out.pdf'});
```

### 2. `printBackground: true` is required for background colors/images

Without it, background colors and images are omitted in the PDF.

## Common Issues

| Problem | Cause | Fix |
|---------|-------|-----|
| Output is portrait instead of landscape | Mixed `landscape:true` with `width`/`height` | Use `format:'A4'` + `landscape:true` only |
| Background color/image missing | Forgot `printBackground:true` | Add `printBackground:true` |
| EBUSY — cannot overwrite PDF | PDF is open in Adobe Reader or other app | Close the app, or write to a new filename first |
| EBUSY persists after closing | Reader process still running | `Stop-Process -Name Acrobat -Force` then retry |

## Common Formats

| Format | Portrait (pt) | Landscape (pt) |
|--------|--------------|----------------|
| A4 | 595.28 × 841.89 | 841.89 × 595.28 |
| Letter | 612 × 792 | 792 × 612 |

## Windows File Paths

For `file:///` URLs on Windows, escape backslashes:
```javascript
await page.goto('file:///' + path.join(DESKTOP, 'file.html').replace(/\\/g, '/'))
```

## Scripts

- `scripts/print_pw.js` — reusable script for batch printing multiple HTML files to landscape A4 PDF

## References

- `references/playwright-pdf.md` — full Playwright `page.pdf()` API reference
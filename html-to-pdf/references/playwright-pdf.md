# Playwright PDF API Reference

## page.pdf(options)

**Required:** `path` or `printBackground` (at least one)

### Key Options

| Option | Type | Notes |
|--------|------|-------|
| `path` | string | Output PDF path |
| `width` / `height` | string | e.g. `'297mm'`, `'842.88pt'`. Do NOT combine with `landscape:true` |
| `format` | string | `'A4'`, `'Letter'`, `'Legal'`, `'Tabloid'` |
| `landscape` | boolean | `true` = landscape. **Only works with `format`, not `width`/`height`** |
| `printBackground` | boolean | Default `false` — set `true` to print background colors/images |
| `margin` | object | `{top,right,bottom,left}` inpx or string |
| `scale` | number | `0-2`, default `1`. Scale factor |

### Critical Rule

**`landscape` option only works when using `format`, NOT when using `width`+`height`:**

```javascript
// ✅ CORRECT — landscape with format
await page.pdf({format:'A4', landscape:true, path:'out.pdf'});

// ✅ CORRECT — portrait with format
await page.pdf({format:'A4', landscape:false, path:'out.pdf'});

// ❌ WRONG — mixing width/height with landscape:true is ignored
await page.pdf({width:'297mm', height:'210mm', landscape:true, path:'out.pdf'});
```

For custom landscape dimensions without `format`, swap the numbers:
```javascript
// A4 landscape: width=297mm, height=210mm → but in points: width > height means landscape
await page.pdf({width:'841.89pt', height:'595.28pt', path:'out.pdf'}); // landscape without flag
```

### Page Size Equivalents

| Size | Portrait (pt) | Landscape (pt) |
|------|--------------|----------------|
| A4 | 595.28 × 841.89 | 841.89 × 595.28 |
| Letter | 612 × 792 | 792 × 612 |

### Launch Options (Windows Chrome)

```javascript
await chromium.launch({
  executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  headless: true,
  args: ['--no-sandbox', '--disable-gpu']
});
```

### Injecting CSS Before Print

```javascript
await page.goto('file:///' + htmlPath.replace(/\\/g, '/'), {waitUntil:'networkidle'});
await page.evaluate(() => {
  const s = document.createElement('style');
  s.textContent = '@page { size: A4 landscape; margin: 0; }';
  document.head.appendChild(s);
});
```

### Multi-file Loop Pattern

```javascript
const files = ['Tier1','Tier2','Tier3'];
for (const t of files) {
  const page = await browser.newPage();
  await page.goto('file:///' + path.join(dir, `cert_${t}.html`).replace(/\\/g, '/'), {waitUntil:'networkidle'});
  await page.pdf({path: path.join(dir, `cert_${t}.pdf`), format:'A4', landscape:true, printBackground:true, margin:{top:0,right:0,bottom:0,left:0}});
  await page.close();
}
```
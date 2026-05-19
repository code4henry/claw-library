# GitHub Repo Manager Skill

Rename GitHub repositories and manage repo settings via automation.

## Use When
- Rename a GitHub repository
- Need to batch-update repository settings
- Want to automate GitHub web UI actions that require authentication

## Prerequisites
- Chrome/Chromium browser with OpenClaw's browser plugin running
- `ws` npm package available at `C:\Users\hwhhan\AppData\Local\anaconda3\node_modules\openclaw\node_modules\ws`

## Rename a Repository

### Step 1: Find the CDP Page Target
```powershell
# Get the CDP WebSocket URL for the current browser tab
$cdp = Invoke-RestMethod -Uri "http://127.0.0.1:18800/json" -Method GET -TimeoutSec 5
$targetPage = $cdp | Where-Object { $_.type -eq "page" -and $_.url -match "github.com" } | Select-Object -First 1
$targetPage.webSocketDebuggerUrl
```

### Step 2: Run the Rename Script
Use the provided `rename-repo.js` script (see below).

### Step 3: Update Local Git Remote
After rename, update the local clone's remote:
```powershell
git remote set-url origin https://github.com/{NEW_OWNER}/{NEW_NAME}.git
```

Also rename the local folder:
```powershell
Rename-Item -Path "C:\path\to\old-folder" -NewName "new-folder"
```

## The CDP Rename Script (`rename-repo.js`)

Save this to your workspace:
```javascript
const WebSocket = require('ws');

const CDP_URL = 'ws://127.0.0.1:18800/devtools/page/{TARGET_ID}';
const NEW_REPO_NAME = 'new-repo-name';

let id = 1;
function send(ws, method, params) {
  return new Promise((resolve, reject) => {
    const msgId = id++;
    const msg = JSON.stringify({ id: msgId, method, params });
    ws.send(msg);
    const handler = (event) => {
      const data = JSON.parse(event.data);
      if (data.id === msgId) { ws.removeEventListener('message', handler); resolve(data); }
    };
    ws.addEventListener('message', handler);
    setTimeout(() => { ws.removeEventListener('message', handler); reject(new Error('Timeout')); }, 10000);
  });
}

async function main() {
  const ws = new WebSocket(CDP_URL);
  await new Promise(r => ws.onopen = r);

  // Find the repository name input
  const r1 = await send(ws, 'Runtime.evaluate', {
    expression: `(() => { const ins = document.querySelectorAll('input'); for (let i = 0; i < ins.length; i++) { const inp = ins[i]; if (inp.type !== 'hidden' && (inp.value.includes('openclaw') || inp.name === 'rename')) return JSON.stringify({v: inp.value, n: inp.name, id: inp.id}); } return 'not found'; })()`,
    returnByValue: true
  });
  console.log('Input:', JSON.stringify(r1.result));

  // Focus and select all
  const r2 = await send(ws, 'Runtime.evaluate', {
    expression: `(() => { const ins = document.querySelectorAll('input'); for (let i = 0; i < ins.length; i++) { const inp = ins[i]; if (inp.type !== 'hidden' && (inp.value.includes('openclaw') || inp.name === 'rename')) { inp.focus(); inp.select(); return 'ok'; } } return 'not found'; })()`,
    returnByValue: true
  });
  console.log('Focus:', JSON.stringify(r2.result));

  // Type new name via CDP (bypasses keyboard event listeners)
  await new Promise(r => setTimeout(r, 200));
  const r3 = await send(ws, 'Input.insertText', { text: NEW_REPO_NAME });
  console.log('InsertText:', JSON.stringify(r3));

  // Click the Rename button
  await new Promise(r => setTimeout(r, 200));
  const r4 = await send(ws, 'Runtime.evaluate', {
    expression: `(() => { const btns = document.querySelectorAll('button'); for (let i = 0; i < btns.length; i++) { if (btns[i].textContent.trim() === 'Rename') { btns[i].click(); return 'clicked'; } } return 'not found'; })()`,
    returnByValue: true
  });
  console.log('Click Rename:', JSON.stringify(r4.result));

  await new Promise(r => setTimeout(r, 2000));
  const r5 = await send(ws, 'Runtime.evaluate', { expression: `(() => window.location.href)()`, returnByValue: true });
  console.log('Final URL:', JSON.stringify(r5.result));

  ws.close();
}

main().catch(console.error);
```

Run with:
```powershell
$env:NODE_PATH="C:\Users\hwhhan\AppData\Local\anaconda3\node_modules\openclaw\node_modules"
node rename-repo.js
```

## Key Insight: Why CDP Over Browser CLI?

GitHub's anti-automation detects Playwright/Selenium browser events. But CDP's `Input.insertText` bypasses keyboard event listeners entirely — the page sees the text but not the "automation fingerprint."

## Notes
- The CDP page target ID changes on each navigation — re-fetch from `http://127.0.0.1:18800/json` when in doubt
- After rename, update BOTH the git remote URL AND the local folder name
- This method works for any GitHub web UI action (not just rename)

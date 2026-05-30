---
name: chrome-mcp-control
description: "Control user's signed-in Chrome via DevTools MCP for Gmail, Google services, and logged-in web automation."
---

# Chrome MCP Control

Use when the user wants you to operate their real Chrome browser (logged-in sessions, Gmail, Google Drive, etc.) via Chrome DevTools MCP. This bypasses the isolated `openclaw` profile and reuses the user's existing login state.

## Prerequisites

- Chrome/Chromium **v144+** with remote debugging enabled at `chrome://inspect/#remote-debugging`
- User must approve the MCP attach consent prompt in Chrome
- User at computer for the initial connect

## Required Config (one-time)

In `~/.openclaw/openclaw.json`, add or ensure:

```json
{
  "tools": {
    "profile": "coding",
    "alsoAllow": ["browser"]
  },
  "browser": {
    "enabled": true,
    "ssrfPolicy": {
      "dangerouslyAllowPrivateNetwork": true,
      "hostnameAllowlist": [
        "*.google.com",
        "*.googleapis.com",
        "*.gstatic.com",
        "google.com"
      ]
    }
  }
}
```

**Why**: `alsoAllow: ["browser"]` activates the browser tool under the `coding` profile. `ssrfPolicy` unblocks navigation — without it every `open`/`navigate` call returns `browser navigation blocked by policy`.

On **Windows**, if the bundled MCP server fails (`spawn npx ENOENT`), add absolute path:

```json
"mcp": {
  "servers": {
    "chrome-devtools": {
      "command": "C:\\Program Files\\nodejs\\npx.cmd",
      "args": ["chrome-devtools-mcp@latest", "--autoConnect"]
    }
  }
}
```

After any config change: **restart the gateway** (`openclaw gateway restart`).

## Connection Flow

1. Start the user profile browser:

```json
browser action="start" profile="user"
```

2. Works because `user` profile uses `driver: "existing-session"` + `transport: "chrome-mcp"`, which attaches to the running Chrome without launching a separate instance.

3. Verify with `browser action="tabs" profile="user"` — should show the user's real Chrome tabs.

## Navigation

**`open` / `navigate` require gateway restart after SSRF config changes.** If persistently blocked, confirm `dangerouslyAllowPrivateNetwork: true` is set and gateway was restarted.

```json
browser action="open" url="https://mail.google.com" label="gmail" profile="user"
```

Use `label` for stable targeting across the session.

## Reading Pages

Snapshot returns the accessible page structure:

```json
browser action="snapshot" profile="user" targetId="17"
```

Always use the **raw numeric `targetId`** returned by `open` (e.g. `"17"`), not labels or tabIds, for snapshot and act operations on existing-session profiles.

## Interacting

Click buttons, links, or UI elements using refs from the snapshot:

```json
browser action="act" kind="click" ref="1_47" targetId="17" profile="user"
```

- Ref `eNN` style refs come from aria snapshots; `NN_NN` style from AI snapshots
- Re-snapshot after navigation or modal changes before clicking
- If action fails with `action targetId must match request targetId`, use the raw numeric targetId

## Gmail Workflow

1. Open Gmail: `browser open "https://mail.google.com" profile="user"`
2. Snapshot inbox to read email list
3. To search: click the search box (`ref` from snapshot), type query, press Enter
4. Email dates appear in the gridcell row — scan for target date
5. Click an email row to open and read full content

## Chrome MCP Limitations

- **No `navigate`** — use `open` for new tabs instead
- **No CSS selectors** — all actions need snapshot refs
- **No `slowly` on type** — use `press` or `fill` instead
- **No `networkidle` wait** — use text/URL wait conditions
- **No PDF export, download interception, or `responsebody`**
- Screenshots work for pages and ref-based elements

## Common Issues

| Symptom | Fix |
|---------|-----|
| `browser navigation blocked by policy` | Gateway restart after SSRF config change |
| `BrowserProfileUnavailableError: timed out` | User's Chrome closed or MCP not accepting; restart `browser start profile="user"` |
| `action targetId must match request targetId` | Use raw numeric targetId from `open` response, not label |
| `spawn npx ENOENT` on Windows | Use absolute path to `npx.cmd` in MCP server config |
| Tabs show empty URLs | Normal for Chrome MCP — page titles/URLs resolve after snapshot |

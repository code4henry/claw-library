---
name: chrome-mcp-control
description: "⚠️ DEPRECATED — merged into browser-automation. Use the built-in browser-automation skill instead, which now includes full Chrome MCP (profile=\"user\") support."
---

# ⚠️ DEPRECATED

This skill has been **merged into [`browser-automation`](https://github.com/openclaw/openclaw)** — the built-in browser automation skill that ships with OpenClaw.

## Why

`chrome-mcp-control` covered Chrome MCP user-browser automation (Gmail, Google services, logged-in sessions). This content is now a dedicated section inside `browser-automation`, which covers **both** profiles in one skill:

| Profile | Browser | Login State | Use When |
|---------|---------|-------------|----------|
| Default / `profile="openclaw"` | Isolated sandbox | None | General web browsing |
| `profile="user"` | Chrome MCP (user's real Chrome) | User's sessions | Gmail, Google Drive, etc. |

## Migration

1. Ensure `browser-automation` is in your agent's skill list (it ships with OpenClaw by default)
2. If you were using Chrome MCP features, configure as before:
   - `tools.alsoAllow: ["browser"]`
   - `browser.ssrfPolicy.dangerouslyAllowPrivateNetwork: true`
   - `mcp.servers.chrome-devtools` with `npx chrome-devtools-mcp@latest --autoConnect`
3. Use `profile="user"` for logged-in scenarios

For the full guide, see the `browser-automation` skill's **"User Chrome MCP"** section.

---

*This directory is kept as a migration pointer. All functionality lives in `browser-automation` now.*

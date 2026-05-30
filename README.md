# claw-library

A public skill library for [OpenClaw](https://github.com/openclaw/openclaw) — reusable automation skills anyone can use.

> claw-library = claw + library. A library of skills for the claw. 🐾

---

## 📚 Available Skills

| Skill | Description |
|-------|-------------|
| [`html-to-pdf`](html-to-pdf/) | Convert HTML to PDF with precise page size control using Playwright |
| [`github-repo-manager`](github-repo-manager/) | Rename and manage GitHub repositories via browser (CDP) or GitHub API |
| [`workspace-init`](workspace-init/) | Create a dedicated project workspace folder for complex multi-file tasks |
| [`chrome-mcp-control`](chrome-mcp-control/) | ⚠️ Deprecated — merged into built-in `browser-automation` skill |

---

## 🔧 How to Use

Skills are standalone modules. Copy a skill folder into your OpenClaw skills directory:

```
~/.openclaw/skills/<skill-name>/
└── SKILL.md
```

OpenClaw automatically loads skills from this directory.

---

## 🌐 Internationalization

This repository is **English-first**. Skills are written in English, with comments and documentation in English, so they can be shared with the global OpenClaw community.

---

## 📁 Repository Structure

```
claw-library/
├── README.md              # This file
├── README-zh.md           # Chinese version
├── html-to-pdf/           # HTML → PDF conversion (Playwright)
├── github-repo-manager/   # GitHub repo operations (CDP + API)
├── chrome-mcp-control/    # ⚠️ Deprecated — merged into browser-automation
└── workspace-init/        # Project workspace setup
```

---

## 🤝 Contributing

When adding a skill:
- Write `SKILL.md` in English
- Include `## Use When` section
- Include `## Prerequisites` section
- Include step-by-step instructions with code samples
- Do NOT include personal, project-specific, or private information

---

## 📄 License

Open for public use. Skills are provided as-is.
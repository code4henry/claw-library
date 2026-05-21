---
name: workspace-init
description: Create a dedicated project workspace folder when starting a complex or multi-file task. Use when the task involves multiple files, scripts, assets, or will span multiple sessions. Notify the user after creating the folder.
---

# Workspace Init

When starting a complex task, automatically create a dedicated workspace subfolder.

## When to Use

- Task involves 3+ files or scripts
- Task spans multiple sessions or days
- Task has distinct assets (logos, fonts, data)
- Task requires tools/scripts that will be reused
- The task needs a shared working directory for this project

## SOP

1. **Create folder** at `~/.openclaw/workspace/<project-name>/`
2. **Move/copy** all related files into it
3. **Notify the user** — share the folder path and what went in
4. **Store scripts** and assets for this task inside the folder

## Folder Naming

Use hyphen-case, descriptive:
- `ma-cert-2026` — MA certificate project
- `logo-project` — logo design work
- `pdf-tool` — PDF conversion scripts

## Note

Simple one-off tasks (< 10 min, 1-2 files) don't need a folder — use workspace root directly.

This skill is generic and does not belong to any specific project. Scripts that are project-specific should be placed inside the project folder, not here.
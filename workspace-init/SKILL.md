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

## SOP

1. **Create folder** in `~/.openclaw/workspace/`
2. **Move/copy** all related files into it
3. **Notify Henry** — "已创建工作区文件夹 `[folder name]`，相关文件都在里面"
4. **Store scripts** for this task inside the folder

## Folder Naming

Use hyphen-case, descriptive: `ma-cert-2026`, `logo-project`, `pdf-tool`

## Note

Simple one-off tasks (< 10 min, 1-2 files) don't need a folder — use workspace root directly.
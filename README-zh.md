# claw-library

开放给社区使用的 [OpenClaw](https://github.com/openclaw/openclaw) 技能库 — 可复用的自动化技能合集。

> claw-library = claw + library。给 claw 用的技能库。🐾

---

## 📚 现有技能

| 技能 | 说明 |
|-------|------|
| [`html-to-pdf`](html-to-pdf/) | 使用 Playwright 将 HTML 转换为 PDF，精准控制页面尺寸 |
| [`github-repo-manager`](github-repo-manager/) | 通过浏览器（CDP）或 GitHub API 重命名和管理 GitHub 仓库 |
| [`workspace-init`](workspace-init/) | 为复杂多文件任务创建专用项目工作区文件夹 |

---

## 🔧 如何使用

技能是独立模块。将技能文件夹复制到 OpenClaw 的 plugin-skills 目录：

```
~/.openclaw/plugin-skills/<技能名称>/
└── SKILL.md
```

OpenClaw 会自动加载此目录下的技能。

---

## 🌐 国际化

本仓库以**英文为首选语言**。技能使用英文编写，方便与全球 OpenClaw 社区分享。

---

## 📁 仓库结构

```
claw-library/
├── README.md              # 本文件
├── README-zh.md           # 中文版说明
├── html-to-pdf/           # HTML 转 PDF（Playwright）
├── github-repo-manager/   # GitHub 仓库操作（CDP + API）
└── workspace-init/        # 项目工作区初始化
```

---

## 🤝 贡献规范

新增技能时：
- `SKILL.md` 使用英文编写
- 必须包含 `## Use When` 小节
- 必须包含 `## Prerequisites` 小节
- 必须包含分步说明和代码示例
- **禁止**包含个人、项目相关或私密信息

---

## 📄 许可证

公开使用。技能按现状提供。
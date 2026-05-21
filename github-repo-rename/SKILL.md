---
name: github-repo-rename
description: Rename a GitHub repository via API using Windows Credential Manager token. Handles embedded git repos (submodules vs separate repos), credential retrieval, branch unification, and default branch switching.
---

# GitHub Repo Rename Skill

## When to Use

When you need to rename a GitHub repository from the command line without user interaction.

## Prerequisites

1. **GitHub token stored in Windows Credential Manager** under target `git:https://github.com`
2. **Write access** to the repository
3. Understand if the repo is a **standalone repo** or an **embedded git repo** (submodule within a parent workspace)

## Step-by-Step Process

### Step 1: Retrieve GitHub Token

```powershell
$sig = @"
using System;
using System.Runtime.InteropServices;
using System.Text;
public class Cred {
    [DllImport("advapi32.dll", SetLastError=true, CharSet=CharSet.Unicode)]
    public static extern bool CredRead(string target, int type, int flags, out IntPtr cred);
    [DllImport("advapi32.dll")]
    public static extern void CredFree(IntPtr cred);
    [StructLayout(LayoutKind.Sequential, CharSet=CharSet.Unicode)]
    public struct CREDENTIAL {
        public int Flags;
        public int Type;
        public string TargetName;
        public string Comment;
        public System.Runtime.InteropServices.ComTypes.FILETIME LastWritten;
        public int CredentialBlobSize;
        public IntPtr CredentialBlob;
        public int Persist;
        public int AttributeCount;
        public IntPtr Attributes;
        public string TargetAlias;
        public string UserName;
    }
    public static string GetPassword(string target) {
        IntPtr credPtr;
        if (CredRead(target, 1, 0, out credPtr)) {
            CREDENTIAL cred = (CREDENTIAL)Marshal.PtrToStructure(credPtr, typeof(CREDENTIAL));
            string password = Marshal.PtrToStringUni(cred.CredentialBlob, cred.CredentialBlobSize / 2);
            CredFree(credPtr);
            return password;
        }
        return null;
    }
}
"@
Add-Type -TypeDefinition $sig -ErrorAction SilentlyContinue
$token = [Cred]::GetPassword("git:https://github.com")
```

### Step 2: Rename Repository via API

```powershell
$headers = @{
    "Authorization" = "token $token"
    "Accept" = "application/vnd.github+json"
}
$body = '{"name":"new-repo-name","description":"Your description"}'
$result = Invoke-RestMethod -Method PATCH `
    -Uri "https://api.github.com/repos/OWNER/old-repo-name" `
    -Headers $headers `
    -Body ([System.Text.Encoding]::UTF8.GetBytes($body)) `
    -ContentType "application/json"
$result | Select-Object name, full_name
```

### Step 3: Update Local Remote URL

```powershell
git remote set-url origin "https://github.com/OWNER/new-repo-name.git"
```

### Step 4: Handle Embedded vs Standalone Repos

**Embedded git repos** (already tracked inside another workspace git) — do NOT add as separate git repo, they have their own remotes.

**Standalone repos** — update remote URL and push to confirm.

## Common Failure Patterns

### "Repository not found" after rename
- Cause: Updated remote URL to new name before rename completed on GitHub
- Fix: Revert to old name, do rename, wait for confirmation, then update URL

### 401 Unauthorized
- Cause: Token is invalid or expired
- Fix: Token must come from Windows Credential Manager, not hardcoded or env vars

### Push fails with "Everything up-to-date" but remote doesn't have files
- Cause: Local branch and remote branch diverged, or push went to wrong branch
- Fix: Use `git push origin branch --force` after verifying remote URL

### Multiple branches on remote (main + master)
- Cause: Previous pushes created different branches
- Fix: Create a unified branch, merge related branches, push unified, set as default

## Key Lesson from Past Failure

**Initial failure reason:** When rename failed (repo didn't exist under new name), immediately told user they needed to do it manually instead of:
1. Reverting remote URL to working state
2. Retrying push to old repo name
3. Verifying files were actually on remote before attempting rename

**Correct approach:** Always maintain a working state — if something fails, return to known good state before reporting failure.

## Repository Structure for This Skill

```
claw-library/                  # Public skill repo (claw-library)
├── github-repo-rename/
│   └── SKILL.md              # This file
├── html-to-pdf/
└── workspace-init/
```
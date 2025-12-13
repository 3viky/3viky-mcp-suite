# Git Submodules Developer Guide

This monorepo uses **git submodules** to manage 7 independent MCP service repositories while maintaining a unified plugin distribution. This guide covers everything you need to work effectively with this setup.

---

## Table of Contents

- [Why Submodules?](#why-submodules)
- [Initial Clone](#initial-clone)
- [Daily Workflow](#daily-workflow)
- [Working on a Service](#working-on-a-service)
- [Updating Submodule References](#updating-submodule-references)
- [Common Tasks](#common-tasks)
- [Troubleshooting](#troubleshooting)
- [Architecture](#architecture)

---

## Why Submodules?

**Git submodules** allow us to:
- ✅ Preserve individual service histories and repositories
- ✅ Enable independent versioning and releases for each service
- ✅ Allow services to be used standalone or as part of the plugin suite
- ✅ Maintain clean separation while sharing common infrastructure

**Alternative considered**: Unified monorepo with single history (rejected to preserve existing service repos)

---

## Initial Clone

### Clone with All Submodules

```bash
# Method 1: Clone and initialize in one command
git clone --recurse-submodules git@github.com:3viky/3viky-mcp-suite.git

# Method 2: Clone first, then initialize submodules
git clone git@github.com:3viky/3viky-mcp-suite.git
cd 3viky-mcp-suite
git submodule update --init --recursive
```

### Install Dependencies

```bash
pnpm install
```

This installs dependencies for:
- The monorepo root
- All 7 service submodules
- The plugin package

---

## Daily Workflow

### Pull Latest Changes (Monorepo + Submodules)

```bash
# Update parent repo
git pull origin master

# Update all submodules to their latest commits
git submodule update --remote --recursive

# Install any new dependencies
pnpm install
```

### Check Status Across All Submodules

```bash
# See which submodules have uncommitted changes
git submodule foreach 'git status'

# See which submodules are on different commits than tracked
git submodule status
```

---

## Working on a Service

### 1. Navigate to the Submodule

```bash
cd mcp-opener  # or any other service
```

### 2. Check Status and Branch

```bash
git status
git branch
```

**Important**: Submodules are in **detached HEAD** state by default. You should create/checkout a branch before making changes.

### 3. Create or Checkout a Branch

```bash
# Create new branch for your work
git checkout -b feature/my-feature

# Or checkout existing branch
git checkout main  # or master, depending on the service
```

### 4. Make Changes and Commit

```bash
# Make your changes to the service
vim src/index.ts

# Stage and commit within the submodule
git add .
git commit -m "feat: add new feature

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

### 5. Push Submodule Changes

```bash
# Push to the service's own repository
git push origin feature/my-feature

# Or if on main/master branch
git push origin main
```

### 6. Update Parent Repo to Track New Commit

```bash
# Return to monorepo root
cd ..

# Stage the updated submodule reference
git add mcp-opener

# Commit the submodule pointer update
git commit -m "chore: update mcp-opener to include new feature

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"

# Push monorepo changes
git push origin master
```

---

## Updating Submodule References

The parent repo stores a **commit hash** for each submodule, not a branch reference. When a service is updated, you must update the parent repo's pointer.

### Update Single Submodule

```bash
# Navigate to submodule
cd mcp-domain-checker

# Pull latest changes
git pull origin main

# Return to parent repo
cd ..

# Stage the new commit hash
git add mcp-domain-checker
git commit -m "chore: update mcp-domain-checker to v1.2.3"
```

### Update All Submodules to Latest

```bash
# Update all submodules to their remote branches' latest commits
git submodule update --remote --recursive

# Stage all updated submodule references
git add .

# Commit the updates
git commit -m "chore: update all submodules to latest versions"
```

---

## Common Tasks

### Build All Services

```bash
pnpm -r --filter "./mcp-*" build
```

### Build Single Service

```bash
cd mcp-opener
pnpm build
```

### Test All Services

```bash
pnpm -r --filter "./mcp-*" test
```

### Bundle the Plugin

```bash
cd plugin
pnpm bundle
```

This creates `plugin/servers/` with all services and their production dependencies.

### Check Dependency Versions

```bash
pnpm version:check
```

Detects version inconsistencies across packages.

### Add a New Submodule

```bash
# From monorepo root
git submodule add git@github.com:3viky/mcp-new-service.git mcp-new-service

# Initialize and update
git submodule update --init --recursive

# Add to pnpm workspace (already using wildcards, so automatic)
# Update plugin/plugin.json to include new service
# Update plugin/scripts/bundle.js if special files needed

# Commit the new submodule
git add .gitmodules mcp-new-service plugin/
git commit -m "feat: add mcp-new-service as submodule"
```

### Remove a Submodule

```bash
# Remove from .gitmodules
git config -f .gitmodules --remove-section submodule.mcp-service-name

# Remove from .git/config
git config -f .git/config --remove-section submodule.mcp-service-name

# Remove tracking
git rm --cached mcp-service-name

# Remove the directory
rm -rf mcp-service-name

# Commit the removal
git add .gitmodules
git commit -m "chore: remove mcp-service-name submodule"
```

---

## Troubleshooting

### Submodule is Empty After Clone

**Problem**: Cloned repo but submodule directories are empty.

**Solution**:
```bash
git submodule update --init --recursive
```

### Detached HEAD State in Submodule

**Problem**: `git status` in submodule shows "HEAD detached at [commit]"

**Why**: Submodules don't track branches by default, they track specific commits.

**Solution**:
```bash
cd mcp-service
git checkout main  # or master
# Make changes, commit, push
# Then update parent repo reference (see "Working on a Service" above)
```

### Submodule Changes Not Showing in Parent Repo

**Problem**: Made changes in submodule, but `git status` in parent shows nothing.

**Why**: You need to commit in the submodule first, then update the parent reference.

**Solution**:
```bash
# In submodule
cd mcp-service
git add .
git commit -m "changes"
git push origin main

# In parent repo
cd ..
git add mcp-service
git commit -m "update mcp-service"
```

### "reference is not a tree" Error

**Problem**: Error when running `git submodule update`

**Cause**: Parent repo references a commit that doesn't exist in the submodule (e.g., commit was force-pushed away)

**Solution**:
```bash
cd mcp-service
git fetch origin
git checkout origin/main  # or the correct branch
cd ..
git add mcp-service
git commit -m "fix: update submodule to valid commit"
```

### Conflicts When Pulling Submodule Updates

**Problem**: `git pull` in parent repo shows conflicts in `.gitmodules` or submodule references

**Solution**:
```bash
# Accept incoming changes
git checkout --theirs .gitmodules
git submodule sync
git submodule update --init --recursive
git add .gitmodules
git commit -m "chore: resolve submodule conflicts"
```

### Authentication Failures When Cloning

**Problem**: Permission denied when cloning submodules

**Cause**: Submodules use SSH URLs (git@github.com:...) and you may not have SSH configured

**Solution**:
```bash
# Check if SSH key is configured
ls ~/.ssh/id_*

# If needed, use specific SSH key
GIT_SSH_COMMAND="ssh -i ~/.ssh/id_ed25519_3viky_apricot" git submodule update --init --recursive
```

### pnpm Install Fails in Submodules

**Problem**: `pnpm install` fails because submodules aren't initialized

**Solution**:
```bash
# Initialize submodules first
git submodule update --init --recursive

# Then install dependencies
pnpm install
```

---

## Architecture

### Submodule Structure

```
@mcp/                           # Monorepo root
├── .gitmodules                 # Submodule configuration
├── .gitignore                  # Root gitignore
├── package.json                # Root package (pnpm overrides)
├── pnpm-workspace.yaml         # Workspace config
├── tsconfig.base.json          # Shared TS config
├── README.md                   # Main documentation
├── SUBMODULES.md               # This file
│
├── mcp-common/                 # Submodule → git@github.com:3viky/mcp-common.git
├── mcp-domain-checker/         # Submodule → git@github.com:3viky/mcp-domain-checker.git
├── mcp-domain-checker-price/   # Submodule → git@github.com:3viky/mcp-domain-checker-price.git
├── mcp-gitlab-ci/              # Submodule → git@github.com:3viky/mcp-gitlab-ci.git
├── mcp-opener/                 # Submodule → git@github.com:3viky/mcp-opener.git
├── mcp-stream-workflow/        # Submodule → git@github.com:3viky/mcp-stream-workflow.git
├── mcp-stream-workflow-status/ # Submodule → git@github.com:3viky/mcp-stream-workflow-status.git
│
├── plugin/                     # Claude Code plugin package
│   ├── plugin.json             # Plugin manifest
│   ├── package.json            # npm package config
│   ├── scripts/bundle.js       # Automated bundler
│   └── servers/                # Generated by bundler (gitignored)
│
└── scripts/                    # Monorepo utilities
    └── check-versions.js       # Version consistency checker
```

### How Submodules Work

1. **`.gitmodules`** - Tracks submodule repository URLs and local paths
2. **Commit References** - Parent repo stores a specific commit hash for each submodule (visible in `git submodule status`)
3. **Independent Repos** - Each submodule has its own `.git` directory and can be developed independently
4. **Two-Step Updates** - Changes require commits in both the submodule and parent repo

### Dependency Flow

```
Root package.json (overrides)
    ↓
pnpm workspace protocol
    ↓
Individual services (workspace:*)
    ↓
mcp-common utilities
```

### Plugin Bundling Process

```
plugin/scripts/bundle.js
    ↓
1. Initialize submodules (git submodule update --init)
2. Build all services (pnpm -r build)
3. Deploy with pnpm deploy --prod --legacy
4. Copy extra files (prompts, templates, dashboard)
    ↓
plugin/servers/ (self-contained deployments)
```

---

## Best Practices

1. **Always commit in submodule first** before updating parent repo reference
2. **Use branches in submodules** to avoid detached HEAD state
3. **Test locally** before pushing submodule changes that update the parent
4. **Update submodules regularly** to avoid drift (`git submodule update --remote`)
5. **Check submodule status** before pulling parent repo (`git submodule status`)
6. **Use `--recurse-submodules`** when cloning to avoid missing submodules
7. **Document breaking changes** when updating submodule references in parent commits

---

## Resources

- [Git Submodules Official Documentation](https://git-scm.com/book/en/v2/Git-Tools-Submodules)
- [Pro Git: Submodules](https://git-scm.com/docs/git-submodule)
- [pnpm Workspaces](https://pnpm.io/workspaces)
- [Claude Code Plugin System](https://docs.anthropic.com/claude-code/plugins)

---

**Last Updated**: 2025-12-13
**Monorepo Version**: 1.0.0
**Services Count**: 7

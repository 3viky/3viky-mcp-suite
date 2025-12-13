# MCP Services Monorepo

Complete suite of productivity MCP (Model Context Protocol) servers for Claude Code, packaged as both individual services and a unified plugin.

## 📦 Package Overview

This monorepo contains 7 packages:

### Shared Utilities
- **mcp-common** - Shared utilities for all MCP servers (version reporting, data directories, common types)

### MCP Servers
- **mcp-domain-checker** - Domain availability checking via WHOIS/DNS
- **mcp-domain-checker-price** - Domain pricing information
- **mcp-gitlab-ci** - GitLab CI/CD pipeline monitoring
- **mcp-opener** - Cross-platform file, folder, and browser opening
- **mcp-stream-workflow** - Git worktree workflow automation
- **mcp-stream-workflow-status** - Stream status tracking with web dashboard

### Distribution
- **plugin** - Claude Code plugin bundling all services

---

## 🚀 Quick Start

> **⚠️ Important:** This monorepo uses git submodules. See [SUBMODULES.md](./SUBMODULES.md) for detailed workflow documentation.

### Initial Clone

```bash
# Clone with all submodules
git clone --recurse-submodules git@github.com:3viky/3viky-mcp-suite.git

# Or if already cloned, initialize submodules
git submodule update --init --recursive
```

### Development Setup

```bash
# Install dependencies
pnpm install

# Build all services
pnpm build

# Run tests
pnpm test

# Type check all packages
pnpm typecheck

# Check version consistency
pnpm version:check
```

### Working on a Service

```bash
# Navigate to service
cd mcp-opener

# Build
pnpm build

# Watch mode
pnpm dev

# Test
pnpm test
```

---

## 🔧 Monorepo Architecture

### Workspace Structure

```
@mcp/
├── package.json              # Root workspace config
├── pnpm-workspace.yaml       # Workspace package definitions
├── tsconfig.base.json        # Shared TypeScript config
├── scripts/
│   └── check-versions.js     # Dependency version checker
├── mcp-common/               # Shared utilities
├── mcp-domain-checker/       # Individual MCP servers
├── mcp-domain-checker-price/
├── mcp-gitlab-ci/
├── mcp-opener/
├── mcp-stream-workflow/
├── mcp-stream-workflow-status/
└── plugin/                   # Claude Code plugin
    ├── plugin.json           # Plugin manifest
    ├── package.json          # Plugin package
    ├── scripts/
    │   └── bundle.js         # Bundler script
    └── servers/              # Bundled services (generated)
```

### Dependency Graph

```
mcp-common (shared utilities)
    ↓
    ├─→ mcp-domain-checker
    ├─→ mcp-domain-checker-price
    ├─→ mcp-gitlab-ci
    ├─→ mcp-opener
    ├─→ mcp-stream-workflow
    └─→ mcp-stream-workflow-status
```

All services depend on `@3viky/mcp-common` via workspace protocol during development, resolved to specific versions when published.

---

## 📚 Scripts Reference

### Root-Level Scripts

| Script | Command | Description |
|--------|---------|-------------|
| **build** | `pnpm build` | Build all MCP services |
| **test** | `pnpm test` | Run all tests |
| **typecheck** | `pnpm typecheck` | Type check all packages |
| **clean** | `pnpm clean` | Clean all build artifacts |
| **version:check** | `pnpm version:check` | Check dependency version consistency |

### Service-Level Scripts (Each Package)

| Script | Description |
|--------|-------------|
| `pnpm build` | Compile TypeScript to JavaScript |
| `pnpm dev` | Watch mode for development |
| `pnpm test` | Run vitest tests |
| `pnpm typecheck` | Type check without emitting |
| `pnpm clean` | Remove dist folder |

---

## 🎯 Publishing

### Option 1: Publish Individual Packages

Each service is published independently to GitHub Packages:

```bash
# Publish a single service
cd mcp-opener
pnpm build
pnpm publish

# Or publish all services
pnpm -r --filter './mcp-*' publish
```

### Option 2: Publish Claude Code Plugin

The plugin bundles all services into a single installable package:

```bash
# Build the plugin
cd plugin
pnpm build  # Runs bundle.js script

# Publish to GitHub Packages
pnpm publish
```

**Bundle Process:**
1. Builds all MCP services
2. Deploys each service with production dependencies (using `pnpm deploy --legacy`)
3. Copies additional assets (prompts, templates, dashboard)
4. Creates self-contained bundle (~258MB with all dependencies)

### GitHub Packages Configuration

Before publishing, configure npm authentication:

```bash
# Add to ~/.npmrc
echo "@3viky:registry=https://npm.pkg.github.com" >> ~/.npmrc
echo "//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN" >> ~/.npmrc
```

---

## 🔒 Version Management

### SDK Version Standardization

The root `package.json` enforces consistent versions via pnpm overrides:

```json
{
  "pnpm": {
    "overrides": {
      "@modelcontextprotocol/sdk": "^1.24.3",
      "@types/node": "^22.10.1",
      "typescript": "^5.7.2",
      "vitest": "^2.1.5"
    }
  }
}
```

This ensures all services use compatible versions despite individual `package.json` declarations.

### Version Consistency Checking

Run `pnpm version:check` to detect inconsistencies:

```bash
pnpm version:check
# ✅ All dependency versions are consistent across packages
```

---

## 🏗️ TypeScript Configuration

### Base Configuration

The root `tsconfig.base.json` provides shared compiler options:

- **Target:** ES2022
- **Module:** ESNext
- **Strict mode:** Enabled
- **Declaration:** Enabled (with source maps)

### Service-Specific Configs

Services extend the base config and add service-specific options:

```json
{
  "extends": "../tsconfig.base.json",
  "compilerOptions": {
    "isolatedModules": true
  },
  "include": ["src/**/*"]
}
```

---

## 📖 Service Documentation

### mcp-common

**Purpose:** Shared utilities for all MCP servers

**Exports:**
- `createVersionInfo()` - Generate version info object
- `getPackageJsonPath()` - Locate package.json
- `getMCPServicesCacheDir()` - Get cache directory path
- `getMCPServiceDataDir()` - Get data directory path

### mcp-domain-checker

**Purpose:** Domain availability checking via WHOIS and DNS

**Tools:**
- `check_domain` - Check single domain
- `check_domains_batch` - Batch checking
- `suggest_domains` - Generate suggestions
- `get_version` - Version info

**Dependencies:** whoiser, playwright

### mcp-gitlab-ci

**Purpose:** GitLab CI/CD pipeline monitoring

**Configuration:**
- `GITLAB_URL` - GitLab instance URL
- `GITLAB_TOKEN` - API token

### mcp-opener

**Purpose:** Cross-platform file/folder/browser opening

**Features:**
- Linux: xdg-open with Flatpak support
- macOS: Finder integration
- Windows: Explorer integration

### mcp-stream-workflow

**Purpose:** Git worktree workflow automation

**Features:**
- Version-scoped stream IDs
- AI-powered conflict resolution
- Template-based tool usage guides

**Tools:** 6 workflow management tools

### mcp-stream-workflow-status

**Purpose:** Real-time stream status tracking

**Features:**
- SQLite database for persistence
- Express.js API server
- React dashboard (port 3000)

**Tools:** 6 status tracking tools

---

## 🤝 Contributing

### Adding a New Service

1. Create package directory: `mkdir mcp-new-service`
2. Initialize package.json with workspace dependencies
3. Add to `pnpm-workspace.yaml` (automatic with `mcp-*` glob)
4. Create `tsconfig.json` extending base config
5. Implement MCP server in `src/`
6. Update `plugin/scripts/bundle.js` to include new service
7. Update `plugin/plugin.json` manifest

### Code Quality Standards

- **TypeScript:** Strict mode, strong typing
- **ESM only:** All packages use `"type": "module"`
- **Error handling:** Validate inputs, meaningful error messages
- **Testing:** Use vitest for unit tests
- **Documentation:** README per service

### Commit Guidelines

- Build before committing: `pnpm build`
- Run tests: `pnpm test`
- Check types: `pnpm typecheck`
- Verify versions: `pnpm version:check`

---

## 📊 Bundle Analysis

### Plugin Bundle Size Breakdown

| Service | Size | Primary Dependencies |
|---------|------|---------------------|
| domain-checker | 51MB | whoiser, playwright |
| domain-checker-price | 38MB | playwright |
| gitlab-ci | 38MB | @modelcontextprotocol/sdk |
| opener | 38MB | @modelcontextprotocol/sdk |
| stream-workflow | 39MB | simple-git, zod |
| stream-workflow-status | 53MB | better-sqlite3, express |
| **Total** | **~258MB** | Production dependencies only |

### Optimization Opportunities

1. **Playwright removal:** Consider HTTP-only alternatives for domain checking
2. **Dependency deduplication:** Share common packages across services
3. **Bundling:** Use esbuild to create single-file executables
4. **Lazy loading:** Load services on-demand instead of at startup

---

## 📖 Documentation

- **[SUBMODULES.md](./SUBMODULES.md)** - Complete guide to working with git submodules in this monorepo
- **[plugin/README.md](./plugin/README.md)** - Claude Code plugin usage and installation

## 🔗 Links

- **GitHub:** https://github.com/3viky/3viky-mcp-suite
- **MCP Protocol:** https://modelcontextprotocol.io
- **Claude Code:** https://code.claude.com

---

## 📄 License

MIT

## 👤 Author

Victoria Lackey <VictoriaLackey@pm.me>

---

## 🆘 Troubleshooting

### Build Failures

```bash
# Clean all build artifacts
pnpm clean

# Reinstall dependencies
rm -rf node_modules
pnpm install

# Rebuild
pnpm build
```

### Version Conflicts

```bash
# Check for inconsistencies
pnpm version:check

# Apply overrides
pnpm install
```

### Plugin Bundle Issues

```bash
# Clean plugin servers
cd plugin
rm -rf servers

# Rebuild bundle
pnpm build
```

---

**Last Updated:** 2025-12-11

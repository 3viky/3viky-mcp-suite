# @3viky/mcp-suite

Complete suite of productivity MCP servers for Claude Code.

## Installation

### Via GitHub Packages

```bash
# Configure npm to use GitHub Packages for @3viky scope
echo "@3viky:registry=https://npm.pkg.github.com" >> ~/.npmrc

# Install the plugin
npm install -g @3viky/mcp-suite

# Or use with Claude Code (if plugin system supports GitHub Packages)
claude plugin install @3viky/mcp-suite
```

## Included MCP Servers

### 1. domain-checker
Domain availability checking via WHOIS and DNS lookups.

**Tools:**
- `check_domain` - Check single domain availability
- `check_domains_batch` - Batch domain checking
- `suggest_domains` - Generate domain suggestions

### 2. domain-checker-price
Domain pricing information via Joker.com.

**Tools:**
- Domain pricing queries
- Affiliate purchase links

### 3. gitlab-ci
GitLab CI/CD pipeline monitoring and management.

**Tools:**
- Pipeline status checking
- Job log retrieval
- Build failure analysis

**Configuration:**
- `GITLAB_URL` - Your GitLab instance URL
- `GITLAB_TOKEN` - GitLab API token

### 4. opener
Cross-platform file, folder, and browser opening.

**Tools:**
- `open_file` - Open files with default applications
- `open_folder` - Open folders in file manager
- `open_browser` - Open URLs in web browser

### 5. stream-workflow
Git worktree workflow automation with AI-powered conflict resolution.

**Tools:**
- `start_stream` - Initialize new development stream
- `verify_location` - Enforce worktree-only development
- `prepare_merge` - Merge main into worktree with AI conflict resolution
- `complete_merge` - Fast-forward main from worktree
- `complete_stream` - Archive and cleanup
- `get_version` - Version information

### 6. stream-workflow-status
Real-time stream status tracking with web dashboard.

**Tools:**
- `add_stream` - Register new stream
- `update_stream` - Update stream status/progress
- `add_commit` - Record commits to streams
- `remove_stream` - Remove stream tracking
- `get_stream_stats` - Get stream statistics

**Configuration:**
- `API_ENABLED` - Enable web API (default: true)
- `API_PORT` - API server port (default: 3000)

**Dashboard:**
Access at `http://localhost:3000` when API is enabled.

## Individual Installation

Each MCP server is also available as an individual package:

```bash
npm install -g @3viky/mcp-domain-checker
npm install -g @3viky/mcp-gitlab-ci
npm install -g @3viky/mcp-opener
npm install -g @3viky/mcp-stream-workflow
npm install -g @3viky/mcp-stream-workflow-status
```

## License

MIT

## Author

Victoria Lackey <VictoriaLackey@pm.me>

## Repository

https://github.com/3viky/mcp-suite

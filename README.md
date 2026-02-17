# Connect AI to Your Bitbucket Repositories

Transform how you work with Bitbucket by connecting Claude, Cursor AI, and other AI assistants directly to your repositories, pull requests, and code. Get instant insights, automate code reviews, and streamline your development workflow.

[![NPM Version](https://img.shields.io/npm/v/@aashari/mcp-server-atlassian-bitbucket)](https://www.npmjs.com/package/@aashari/mcp-server-atlassian-bitbucket)
[![License](https://img.shields.io/npm/l/@aashari/mcp-server-atlassian-bitbucket)](https://github.com/aashari/mcp-server-atlassian-bitbucket/blob/main/LICENSE)

## What You Can Do

- **Ask AI about your code**: "What's the latest commit in my main repository?"
- **Get PR insights**: "Show me all open pull requests that need review"
- **Search your codebase**: "Find all JavaScript files that use the authentication function"
- **Review code changes**: "Compare the differences between my feature branch and main"
- **Manage pull requests**: "Create a PR for my new-feature branch"
- **Automate workflows**: "Add a comment to PR #123 with the test results"

## Perfect For

- **Developers** who want AI assistance with code reviews and repository management
- **Team Leads** needing quick insights into project status and pull request activity
- **DevOps Engineers** automating repository workflows and branch management
- **Anyone** who wants to interact with Bitbucket using natural language

## Requirements

- **Node.js** 18.0.0 or higher
- **Bitbucket Cloud** account (not Bitbucket Server/Data Center)
- **Authentication credentials**: Scoped API Token (recommended) or App Password (legacy)

## Quick Start

Get up and running in 2 minutes:

### 1. Get Your Bitbucket Credentials

> **IMPORTANT**: Bitbucket App Passwords are being deprecated and will be removed by **June 2026**. We recommend using **Scoped API Tokens** for new setups.

#### Option A: Scoped API Token (Recommended - Future-Proof)

**Bitbucket is deprecating app passwords**. Use the new scoped API tokens instead:

1. Go to [Atlassian API Tokens](https://id.atlassian.com/manage-profile/security/api-tokens)
2. Click **"Create API token with scopes"**
3. Select **"Bitbucket"** as the product
4. Choose the appropriate scopes:
   - **For read-only access**: `repository`, `workspace`
   - **For full functionality**: `repository`, `workspace`, `pullrequest`
5. Copy the generated token (starts with `ATATT`)
6. Use with your Atlassian email as the username

#### Option B: App Password (Legacy - Will be deprecated)

Generate a Bitbucket App Password (legacy method):
1. Go to [Bitbucket App Passwords](https://bitbucket.org/account/settings/app-passwords/)
2. Click "Create app password"
3. Give it a name like "AI Assistant"
4. Select these permissions:
   - **Workspaces**: Read
   - **Repositories**: Read (and Write if you want AI to create PRs/comments)
   - **Pull Requests**: Read (and Write for PR management)

### 2. Try It Instantly

```bash
# Set your credentials (choose one method)

# Method 1: Scoped API Token (recommended - future-proof)
export ATLASSIAN_USER_EMAIL="your.email@company.com"
export ATLASSIAN_API_TOKEN="your_scoped_api_token"  # Token starting with ATATT

# OR Method 2: Legacy App Password (will be deprecated June 2026)
export ATLASSIAN_BITBUCKET_USERNAME="your_username"
export ATLASSIAN_BITBUCKET_APP_PASSWORD="your_app_password"

# List your workspaces
npx -y @aashari/mcp-server-atlassian-bitbucket get --path "/workspaces"

# List repositories in a workspace
npx -y @aashari/mcp-server-atlassian-bitbucket get --path "/repositories/your-workspace"

# Get pull requests for a repository
npx -y @aashari/mcp-server-atlassian-bitbucket get --path "/repositories/your-workspace/your-repo/pullrequests"

# Get repository details with JMESPath filtering
npx -y @aashari/mcp-server-atlassian-bitbucket get --path "/repositories/your-workspace/your-repo" --jq "{name: name, language: language}"
```

## Connect to AI Assistants

### For Claude Desktop Users

Add this to your Claude configuration file (`~/.claude/claude_desktop_config.json`):

**Option 1: Scoped API Token (recommended - future-proof)**
```json
{
  "mcpServers": {
    "bitbucket": {
      "command": "npx",
      "args": ["-y", "@aashari/mcp-server-atlassian-bitbucket"],
      "env": {
        "ATLASSIAN_USER_EMAIL": "your.email@company.com",
        "ATLASSIAN_API_TOKEN": "your_scoped_api_token"
      }
    }
  }
}
```

**Option 2: Legacy App Password (will be deprecated June 2026)**
```json
{
  "mcpServers": {
    "bitbucket": {
      "command": "npx",
      "args": ["-y", "@aashari/mcp-server-atlassian-bitbucket"],
      "env": {
        "ATLASSIAN_BITBUCKET_USERNAME": "your_username",
        "ATLASSIAN_BITBUCKET_APP_PASSWORD": "your_app_password"
      }
    }
  }
}
```

Restart Claude Desktop, and you'll see the bitbucket server in the status bar.

### For Other AI Assistants

Most AI assistants support MCP. You can either:

**Option 1: Use npx (recommended - always latest version):**
Configure your AI assistant to run: `npx -y @aashari/mcp-server-atlassian-bitbucket`

**Option 2: Install globally:**
```bash
npm install -g @aashari/mcp-server-atlassian-bitbucket
```

Then configure your AI assistant to use the MCP server with STDIO transport.

**Supported AI assistants:**
- Claude Desktop (official support)
- Cursor AI
- Continue.dev
- Cline
- Any MCP-compatible client

### Alternative: Configuration File

Create `~/.mcp/configs.json` for system-wide configuration:

**Option 1: Scoped API Token (recommended - future-proof)**
```json
{
  "bitbucket": {
    "environments": {
      "ATLASSIAN_USER_EMAIL": "your.email@company.com",
      "ATLASSIAN_API_TOKEN": "your_scoped_api_token",
      "BITBUCKET_DEFAULT_WORKSPACE": "your_main_workspace"
    }
  }
}
```

**Option 2: Legacy App Password (will be deprecated June 2026)**
```json
{
  "bitbucket": {
    "environments": {
      "ATLASSIAN_BITBUCKET_USERNAME": "your_username",
      "ATLASSIAN_BITBUCKET_APP_PASSWORD": "your_app_password",
      "BITBUCKET_DEFAULT_WORKSPACE": "your_main_workspace"
    }
  }
}
```

**Alternative config keys:** The system also accepts `"atlassian-bitbucket"`, `"@aashari/mcp-server-atlassian-bitbucket"`, or `"mcp-server-atlassian-bitbucket"` instead of `"bitbucket"`.

## Available Tools

This MCP server provides 6 generic tools that can access any Bitbucket API endpoint:

| Tool | Description | Parameters |
|------|-------------|------------|
| `bb_get` | GET any Bitbucket API endpoint (read data) | `path`, `queryParams?`, `jq?`, `outputFormat?` |
| `bb_post` | POST to any endpoint (create resources) | `path`, `body`, `queryParams?`, `jq?`, `outputFormat?` |
| `bb_put` | PUT to any endpoint (replace resources) | `path`, `body`, `queryParams?`, `jq?`, `outputFormat?` |
| `bb_patch` | PATCH any endpoint (partial updates) | `path`, `body`, `queryParams?`, `jq?`, `outputFormat?` |
| `bb_delete` | DELETE any endpoint (remove resources) | `path`, `queryParams?`, `jq?`, `outputFormat?` |
| `bb_clone` | Clone a repository locally | `workspaceSlug?`, `repoSlug`, `targetPath` |

### Tool Parameters

All API tools support these common parameters:

- **`path`** (required): API endpoint path starting with `/` (the `/2.0` prefix is added automatically)
- **`queryParams`** (optional): Key-value pairs for query parameters (e.g., `{"pagelen": "25", "page": "2"}`)
- **`jq`** (optional): JMESPath expression to filter/transform the response - **highly recommended** to reduce token costs
- **`outputFormat`** (optional): `"toon"` (default, 30-60% fewer tokens) or `"json"`
- **`body`** (required for POST/PUT/PATCH): Request body as JSON object

### Common API Paths

All paths automatically have `/2.0` prepended. Full Bitbucket Cloud REST API 2.0 reference: https://developer.atlassian.com/cloud/bitbucket/rest/

**Workspaces & Repositories:**
- `/workspaces` - List all workspaces
- `/repositories/{workspace}` - List repos in workspace
- `/repositories/{workspace}/{repo}` - Get repo details
- `/repositories/{workspace}/{repo}/refs/branches` - List branches
- `/repositories/{workspace}/{repo}/refs/branches/{branch_name}` - Get/delete branch
- `/repositories/{workspace}/{repo}/commits` - List commits
- `/repositories/{workspace}/{repo}/commits/{commit}` - Get commit details
- `/repositories/{workspace}/{repo}/src/{commit}/{filepath}` - Get file content

**Pull Requests:**
- `/repositories/{workspace}/{repo}/pullrequests` - List PRs (GET) or create PR (POST)
- `/repositories/{workspace}/{repo}/pullrequests/{id}` - Get/update/delete PR
- `/repositories/{workspace}/{repo}/pullrequests/{id}/diff` - Get PR diff
- `/repositories/{workspace}/{repo}/pullrequests/{id}/comments` - List/add PR comments
- `/repositories/{workspace}/{repo}/pullrequests/{id}/approve` - Approve PR (POST) or remove approval (DELETE)
- `/repositories/{workspace}/{repo}/pullrequests/{id}/request-changes` - Request changes (POST)
- `/repositories/{workspace}/{repo}/pullrequests/{id}/merge` - Merge PR (POST)
- `/repositories/{workspace}/{repo}/pullrequests/{id}/decline` - Decline PR (POST)

**Comparisons:**
- `/repositories/{workspace}/{repo}/diff/{source}..{destination}` - Compare branches/commits

**Other Resources:**
- `/repositories/{workspace}/{repo}/issues` - List/manage issues
- `/repositories/{workspace}/{repo}/downloads` - List/manage downloads
- `/repositories/{workspace}/{repo}/pipelines` - Access Bitbucket Pipelines
- `/repositories/{workspace}/{repo}/deployments` - View deployments

### TOON Output Format

**What is TOON?** Token-Oriented Object Notation is a format optimized for LLMs that reduces token consumption by 30-60% compared to JSON. It uses tabular arrays and minimal syntax while preserving all data.

**Default behavior:** All tools return TOON format by default. You can override this with `outputFormat: "json"` if needed.

**Example comparison:**
```
JSON (verbose):
{
  "values": [
    {"name": "repo1", "slug": "repo-1"},
    {"name": "repo2", "slug": "repo-2"}
  ]
}

TOON (efficient):
values:
  name  | slug
  repo1 | repo-1
  repo2 | repo-2
```

Learn more: https://github.com/toon-format/toon

### JMESPath Filtering

All tools support optional JMESPath (`jq`) filtering to extract specific data and reduce token costs further:

**Important:** Always use `jq` to filter responses! Unfiltered API responses can be very large and expensive in terms of tokens.

```bash
# Get just repository names
npx -y @aashari/mcp-server-atlassian-bitbucket get \
  --path "/repositories/myworkspace" \
  --jq "values[].name"

# Get PR titles and states (custom object shape)
npx -y @aashari/mcp-server-atlassian-bitbucket get \
  --path "/repositories/myworkspace/myrepo/pullrequests" \
  --jq "values[].{title: title, state: state, author: author.display_name}"

# Get first result only
npx -y @aashari/mcp-server-atlassian-bitbucket get \
  --path "/repositories/myworkspace" \
  --jq "values[0]"

# Explore schema with one item first, then filter
npx -y @aashari/mcp-server-atlassian-bitbucket get \
  --path "/workspaces" \
  --query-params '{"pagelen": "1"}'
```

**Common JMESPath patterns:**
- `values[*].fieldName` - Extract single field from all items
- `values[*].{key1: field1, key2: field2}` - Create custom object shape
- `values[0]` - Get first item only
- `values[:5]` - Get first 5 items
- `values[?state=='OPEN']` - Filter by condition

Full JMESPath reference: https://jmespath.org

## Real-World Examples

### Explore Your Repositories

Ask your AI assistant:
- *"List all repositories in my main workspace"*
- *"Show me details about the backend-api repository"*
- *"What's the commit history for the feature-auth branch?"*
- *"Get the content of src/config.js from the main branch"*

### Manage Pull Requests

Ask your AI assistant:
- *"Show me all open pull requests that need review"*
- *"Get details about pull request #42 including the code changes"*
- *"Create a pull request from feature-login to main branch"*
- *"Add a comment to PR #15 saying the tests passed"*
- *"Approve pull request #33"*

### Work with Branches and Code

Ask your AI assistant:
- *"Compare my feature branch with the main branch"*
- *"List all branches in the user-service repository"*
- *"Show me the differences between commits abc123 and def456"*

## Advanced Usage

### Cost Optimization Tips

1. **Always use JMESPath filtering** - Extract only needed fields to minimize token usage
2. **Use pagination wisely** - Set `pagelen` query parameter to limit results (e.g., `{"pagelen": "10"}`)
3. **Explore schema first** - Fetch one item without filters to see available fields, then filter subsequent calls
4. **Leverage TOON format** - Default TOON format saves 30-60% tokens vs JSON
5. **Query parameters for filtering** - Use Bitbucket's `q` parameter for server-side filtering before results are returned

### Query Parameter Examples

```bash
# Filter PRs by state
npx -y @aashari/mcp-server-atlassian-bitbucket get \
  --path "/repositories/workspace/repo/pullrequests" \
  --query-params '{"state": "OPEN", "pagelen": "5"}' \
  --jq "values[*].{id: id, title: title}"

# Search PRs by title
npx -y @aashari/mcp-server-atlassian-bitbucket get \
  --path "/repositories/workspace/repo/pullrequests" \
  --query-params '{"q": "title~\"bug\""}' \
  --jq "values[*].{id: id, title: title}"

# Filter repositories by role
npx -y @aashari/mcp-server-atlassian-bitbucket get \
  --path "/repositories/workspace" \
  --query-params '{"role": "owner", "pagelen": "10"}'

# Sort by updated date
npx -y @aashari/mcp-server-atlassian-bitbucket get \
  --path "/repositories/workspace/repo/pullrequests" \
  --query-params '{"sort": "-updated_on"}' \
  --jq "values[*].{id: id, title: title, updated: updated_on}"
```

### Working with Large Responses

When dealing with APIs that return large payloads:

1. **Use sparse fieldsets** - Add `fields` query parameter: `{"fields": "values.name,values.slug"}`
2. **Paginate results** - Use `pagelen` and `page` parameters
3. **Filter at the source** - Use Bitbucket's `q` parameter for server-side filtering
4. **Post-process with JQ** - Further filter the response with JMESPath

Example combining all techniques:
```bash
npx -y @aashari/mcp-server-atlassian-bitbucket get \
  --path "/repositories/workspace/repo/pullrequests" \
  --query-params '{"state": "OPEN", "pagelen": "10", "fields": "values.id,values.title,values.state"}' \
  --jq "values[*].{id: id, title: title}"
```

### Best Practices for AI Interactions

1. **Be specific with paths** - Use exact workspace/repo slugs (case-sensitive)
2. **Test with CLI first** - Verify paths and authentication before using in AI context
3. **Use descriptive JQ filters** - Extract meaningful field names for better AI understanding
4. **Enable DEBUG for troubleshooting** - See exactly what's being sent to Bitbucket API
5. **Check API limits** - Bitbucket Cloud has rate limits; use filtering to reduce calls

## CLI Commands

The CLI mirrors the MCP tools for direct terminal access. All commands return JSON output (not TOON - TOON is only for MCP mode).

### Available Commands

```bash
# Get help
npx -y @aashari/mcp-server-atlassian-bitbucket --help

# GET request
npx -y @aashari/mcp-server-atlassian-bitbucket get \
  --path "/workspaces" \
  --jq "values[*].{name: name, slug: slug}"

# GET with query parameters
npx -y @aashari/mcp-server-atlassian-bitbucket get \
  --path "/repositories/myworkspace/myrepo/pullrequests" \
  --query-params '{"state": "OPEN", "pagelen": "10"}' \
  --jq "values[*].{id: id, title: title}"

# POST request (create a PR)
npx -y @aashari/mcp-server-atlassian-bitbucket post \
  --path "/repositories/myworkspace/myrepo/pullrequests" \
  --body '{"title": "My PR", "source": {"branch": {"name": "feature"}}, "destination": {"branch": {"name": "main"}}}' \
  --jq "{id: id, title: title}"

# POST with query parameters
npx -y @aashari/mcp-server-atlassian-bitbucket post \
  --path "/repositories/myworkspace/myrepo/pullrequests/42/comments" \
  --body '{"content": {"raw": "Looks good!"}}' \
  --query-params '{"fields": "id,content"}' \
  --jq "{id: id, content: content.raw}"

# PUT request (replace resource)
npx -y @aashari/mcp-server-atlassian-bitbucket put \
  --path "/repositories/myworkspace/myrepo" \
  --body '{"description": "Updated description", "is_private": true}'

# PATCH request (partial update)
npx -y @aashari/mcp-server-atlassian-bitbucket patch \
  --path "/repositories/myworkspace/myrepo/pullrequests/123" \
  --body '{"title": "Updated PR title"}'

# DELETE request
npx -y @aashari/mcp-server-atlassian-bitbucket delete \
  --path "/repositories/myworkspace/myrepo/refs/branches/old-branch"

# Clone repository
npx -y @aashari/mcp-server-atlassian-bitbucket clone \
  --workspace-slug myworkspace \
  --repo-slug myrepo \
  --target-path /absolute/path/to/parent/directory
```

### CLI Options

**For `get` and `delete` commands:**
- `-p, --path <path>` (required) - API endpoint path
- `-q, --query-params <json>` (optional) - Query parameters as JSON string
- `--jq <expression>` (optional) - JMESPath filter expression

**For `post`, `put`, and `patch` commands:**
- `-p, --path <path>` (required) - API endpoint path
- `-b, --body <json>` (required) - Request body as JSON string
- `-q, --query-params <json>` (optional) - Query parameters as JSON string
- `--jq <expression>` (optional) - JMESPath filter expression

**For `clone` command:**
- `--workspace-slug <slug>` (optional) - Workspace slug (uses default if not provided)
- `--repo-slug <slug>` (required) - Repository slug
- `--target-path <path>` (required) - Absolute path to parent directory where repo will be cloned

## Debugging

### Enable Debug Mode

Set the `DEBUG` environment variable to see detailed logging:

```bash
# For CLI testing
DEBUG=true npx -y @aashari/mcp-server-atlassian-bitbucket get --path "/workspaces"

# For Claude Desktop - add to config
{
  "mcpServers": {
    "bitbucket": {
      "command": "npx",
      "args": ["-y", "@aashari/mcp-server-atlassian-bitbucket"],
      "env": {
        "DEBUG": "true",
        "ATLASSIAN_USER_EMAIL": "...",
        "ATLASSIAN_API_TOKEN": "..."
      }
    }
  }
}
```

**Log files:** When running in MCP mode, logs are written to `~/.mcp/data/@aashari-mcp-server-atlassian-bitbucket.[session-id].log`

### Test with HTTP Mode

For interactive debugging, run the server in HTTP mode and use the MCP Inspector:

```bash
# Set credentials first
export ATLASSIAN_USER_EMAIL="your.email@company.com"
export ATLASSIAN_API_TOKEN="your_token"
export DEBUG=true

# Start HTTP server with MCP Inspector
npx -y @aashari/mcp-server-atlassian-bitbucket
# Then in another terminal:
PORT=3000 npm run mcp:inspect
```

This opens a visual interface to test tools and see request/response data.

### Common Issues

**Server not appearing in Claude Desktop:**
1. Check config file syntax (valid JSON)
2. Restart Claude Desktop completely
3. Check Claude Desktop logs: `~/Library/Logs/Claude/mcp*.log` (macOS)

**Tools not working:**
1. Enable DEBUG mode to see detailed errors
2. Test with CLI first to isolate MCP vs credentials issues
3. Verify API paths are correct (case-sensitive)

## Troubleshooting

### "Authentication failed" or "403 Forbidden"

1. **Choose the right authentication method**:
   - **Standard Atlassian method** (recommended): Use your Atlassian account email + API token (works with any Atlassian service)
   - **Bitbucket-specific method** (legacy): Use your Bitbucket username + App password (Bitbucket only)

2. **For Scoped API Tokens** (recommended):
   - Go to [Atlassian API Tokens](https://id.atlassian.com/manage-profile/security/api-tokens)
   - Make sure your token is still active and has the right scopes
   - Required scopes: `repository`, `workspace` (add `pullrequest` for PR management)
   - Token should start with `ATATT`

3. **For Bitbucket App Passwords** (legacy):
   - Go to [Bitbucket App Passwords](https://bitbucket.org/account/settings/app-passwords/)
   - Make sure your app password has the right permissions
   - Remember: App passwords will be deprecated by June 2026

4. **Verify your credentials**:
   ```bash
   # Test credentials with CLI
   export ATLASSIAN_USER_EMAIL="your.email@company.com"
   export ATLASSIAN_API_TOKEN="your_token"
   npx -y @aashari/mcp-server-atlassian-bitbucket get --path "/workspaces"
   ```

5. **Environment variable naming**:
   - Use `ATLASSIAN_USER_EMAIL` + `ATLASSIAN_API_TOKEN` for scoped tokens
   - Use `ATLASSIAN_BITBUCKET_USERNAME` + `ATLASSIAN_BITBUCKET_APP_PASSWORD` for app passwords
   - Don't use `ATLASSIAN_SITE_NAME` - it's not needed for Bitbucket Cloud

### "Resource not found" or "404"

1. **Check the API path**:
   - Paths are case-sensitive
   - Use workspace slug (from URL), not display name
   - Example: If your repo URL is `https://bitbucket.org/myteam/my-repo`, use `myteam` and `my-repo`

2. **Verify the resource exists**:
   ```bash
   # List workspaces to find the correct slug
   npx -y @aashari/mcp-server-atlassian-bitbucket get --path "/workspaces"
   ```

### Claude Desktop Integration Issues

1. **Restart Claude Desktop** after updating the config file
2. **Verify config file location**:
   - macOS: `~/.claude/claude_desktop_config.json`
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`

### Getting Help

If you're still having issues:
1. Run a simple test command to verify everything works
2. Check the [GitHub Issues](https://github.com/aashari/mcp-server-atlassian-bitbucket/issues) for similar problems
3. Create a new issue with your error message and setup details

## Frequently Asked Questions

### What permissions do I need?

**For Scoped API Tokens** (recommended):
- Required scopes: `repository`, `workspace`
- Add `pullrequest` for PR management

**For Bitbucket App Passwords** (legacy):
- For **read-only access**: Workspaces: Read, Repositories: Read, Pull Requests: Read
- For **full functionality**: Add "Write" permissions for Repositories and Pull Requests

### Can I use this with private repositories?

Yes! This works with both public and private repositories. You just need the appropriate permissions through your credentials.

### What AI assistants does this work with?

Any AI assistant that supports the Model Context Protocol (MCP):
- Claude Desktop
- Cursor AI
- Continue.dev
- Many others

### Is my data secure?

Yes! This tool:
- Runs entirely on your local machine
- Uses your own Bitbucket credentials
- Never sends your data to third parties
- Only accesses what you give it permission to access

## Migration from v1.x

Version 2.0 represents a major architectural change. If you're upgrading from v1.x:

**Before (v1.x) - 20+ specific tools:**
```
bb_ls_workspaces, bb_get_workspace, bb_ls_repos, bb_get_repo,
bb_list_branches, bb_add_branch, bb_get_commit_history, bb_get_file,
bb_ls_prs, bb_get_pr, bb_add_pr, bb_update_pr, bb_approve_pr, bb_reject_pr,
bb_ls_pr_comments, bb_add_pr_comment, bb_diff_branches, bb_diff_commits, bb_search
```

**After (v2.0+) - 6 generic tools:**
```
bb_get, bb_post, bb_put, bb_patch, bb_delete, bb_clone
```

### Migration Examples

| v1.x Tool | v2.0+ Equivalent |
|-----------|------------------|
| `bb_ls_workspaces()` | `bb_get(path: "/workspaces")` |
| `bb_ls_repos(workspace: "myteam")` | `bb_get(path: "/repositories/myteam")` |
| `bb_get_repo(workspace: "myteam", repo: "myrepo")` | `bb_get(path: "/repositories/myteam/myrepo")` |
| `bb_list_branches(workspace: "myteam", repo: "myrepo")` | `bb_get(path: "/repositories/myteam/myrepo/refs/branches")` |
| `bb_add_branch(...)` | `bb_post(path: "/repositories/.../refs/branches", body: {...})` |
| `bb_ls_prs(workspace: "myteam", repo: "myrepo")` | `bb_get(path: "/repositories/myteam/myrepo/pullrequests")` |
| `bb_get_pr(workspace: "myteam", repo: "myrepo", id: 42)` | `bb_get(path: "/repositories/myteam/myrepo/pullrequests/42")` |
| `bb_add_pr(...)` | `bb_post(path: "/repositories/.../pullrequests", body: {...})` |
| `bb_update_pr(...)` | `bb_patch(path: "/repositories/.../pullrequests/42", body: {...})` |
| `bb_approve_pr(workspace: "myteam", repo: "myrepo", id: 42)` | `bb_post(path: "/repositories/myteam/myrepo/pullrequests/42/approve", body: {})` |
| `bb_diff_branches(...)` | `bb_get(path: "/repositories/.../diff/branch1..branch2")` |

### Key Changes
1. **All tools now require explicit paths** - more verbose but more flexible
2. **Use JMESPath filtering** - extract only what you need to reduce tokens
3. **TOON format by default** - 30-60% fewer tokens (can override with `outputFormat: "json"`)
4. **Direct Bitbucket API access** - any API endpoint works, no code changes needed for new features

## Support

Need help? Here's how to get assistance:

1. **Check the troubleshooting section above** - most common issues are covered there
2. **Visit our GitHub repository** for documentation and examples: [github.com/aashari/mcp-server-atlassian-bitbucket](https://github.com/aashari/mcp-server-atlassian-bitbucket)
3. **Report issues** at [GitHub Issues](https://github.com/aashari/mcp-server-atlassian-bitbucket/issues)
4. **Start a discussion** for feature requests or general questions

---

*Made with care for developers who want to bring AI into their Bitbucket workflow.*

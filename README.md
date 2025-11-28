# Connect AI to Your Bitbucket Repositories

Transform how you work with Bitbucket by connecting Claude, Cursor AI, and other AI assistants directly to your repositories, pull requests, and code. Get instant insights, automate code reviews, and streamline your development workflow.

[![NPM Version](https://img.shields.io/npm/v/@aashari/mcp-server-atlassian-bitbucket)](https://www.npmjs.com/package/@aashari/mcp-server-atlassian-bitbucket)

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

Most AI assistants support MCP. Install the server globally:

```bash
npm install -g @aashari/mcp-server-atlassian-bitbucket
```

Then configure your AI assistant to use the MCP server with STDIO transport.

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

| Tool | Description |
|------|-------------|
| `bb_get` | GET any Bitbucket API endpoint (read data) |
| `bb_post` | POST to any endpoint (create resources) |
| `bb_put` | PUT to any endpoint (replace resources) |
| `bb_patch` | PATCH any endpoint (partial updates) |
| `bb_delete` | DELETE any endpoint (remove resources) |
| `bb_clone` | Clone a repository locally |

### Common API Paths

**Workspaces & Repositories:**
- `/workspaces` - List all workspaces
- `/repositories/{workspace}` - List repos in workspace
- `/repositories/{workspace}/{repo}` - Get repo details
- `/repositories/{workspace}/{repo}/refs/branches` - List branches
- `/repositories/{workspace}/{repo}/commits` - List commits
- `/repositories/{workspace}/{repo}/src/{commit}/{filepath}` - Get file content

**Pull Requests:**
- `/repositories/{workspace}/{repo}/pullrequests` - List PRs
- `/repositories/{workspace}/{repo}/pullrequests/{id}` - Get PR details
- `/repositories/{workspace}/{repo}/pullrequests/{id}/diff` - Get PR diff
- `/repositories/{workspace}/{repo}/pullrequests/{id}/comments` - List PR comments
- `/repositories/{workspace}/{repo}/pullrequests/{id}/approve` - Approve PR (POST)
- `/repositories/{workspace}/{repo}/pullrequests/{id}/merge` - Merge PR (POST)

**Comparisons:**
- `/repositories/{workspace}/{repo}/diff/{source}..{destination}` - Compare branches/commits

### JMESPath Filtering

All tools support optional JMESPath (`jq`) filtering to extract specific data:

```bash
# Get just repository names
npx -y @aashari/mcp-server-atlassian-bitbucket get \
  --path "/repositories/myworkspace" \
  --jq "values[].name"

# Get PR titles and states
npx -y @aashari/mcp-server-atlassian-bitbucket get \
  --path "/repositories/myworkspace/myrepo/pullrequests" \
  --jq "values[].{title: title, state: state}"
```

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

## CLI Commands

The CLI mirrors the MCP tools for direct terminal access:

```bash
# GET request
npx -y @aashari/mcp-server-atlassian-bitbucket get --path "/workspaces"

# POST request (create a PR)
npx -y @aashari/mcp-server-atlassian-bitbucket post \
  --path "/repositories/myworkspace/myrepo/pullrequests" \
  --body '{"title": "My PR", "source": {"branch": {"name": "feature"}}, "destination": {"branch": {"name": "main"}}}'

# PUT request (update resource)
npx -y @aashari/mcp-server-atlassian-bitbucket put \
  --path "/repositories/myworkspace/myrepo" \
  --body '{"description": "Updated description"}'

# PATCH request (partial update)
npx -y @aashari/mcp-server-atlassian-bitbucket patch \
  --path "/repositories/myworkspace/myrepo/pullrequests/123" \
  --body '{"title": "Updated PR title"}'

# DELETE request
npx -y @aashari/mcp-server-atlassian-bitbucket delete \
  --path "/repositories/myworkspace/myrepo/refs/branches/old-branch"

# Clone repository
npx -y @aashari/mcp-server-atlassian-bitbucket clone \
  --workspace myworkspace \
  --repo myrepo \
  --target-dir ./my-local-clone
```

## Troubleshooting

### "Authentication failed" or "403 Forbidden"

1. **Choose the right authentication method**:
   - **Standard Atlassian method**: Use your Atlassian account email + API token (works with any Atlassian service)
   - **Bitbucket-specific method**: Use your Bitbucket username + App password (Bitbucket only)

2. **For Scoped API Tokens** (recommended):
   - Go to [Atlassian API Tokens](https://id.atlassian.com/manage-profile/security/api-tokens)
   - Make sure your token is still active and has the right scopes
   - Required scopes: `repository`, `workspace` (add `pullrequest` for PR management)

3. **For Bitbucket App Passwords** (legacy):
   - Go to [Bitbucket App Passwords](https://bitbucket.org/account/settings/app-passwords/)
   - Make sure your app password has the right permissions

4. **Verify your credentials**:
   ```bash
   npx -y @aashari/mcp-server-atlassian-bitbucket get --path "/workspaces"
   ```

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

Version 2.0 replaces 20+ specific tools with 6 generic HTTP method tools. If you're upgrading from v1.x:

**Before (v1.x):**
```
bb_ls_workspaces, bb_get_workspace, bb_ls_repos, bb_get_repo,
bb_list_branches, bb_get_commit_history, bb_get_file,
bb_ls_prs, bb_get_pr, bb_add_pr, bb_approve_pr, ...
```

**After (v2.0):**
```
bb_get, bb_post, bb_put, bb_patch, bb_delete, bb_clone
```

**Migration examples:**
- `bb_ls_workspaces` → `bb_get` with path `/workspaces`
- `bb_ls_repos` → `bb_get` with path `/repositories/{workspace}`
- `bb_get_pr` → `bb_get` with path `/repositories/{workspace}/{repo}/pullrequests/{id}`
- `bb_add_pr` → `bb_post` with path `/repositories/{workspace}/{repo}/pullrequests`
- `bb_approve_pr` → `bb_post` with path `/repositories/{workspace}/{repo}/pullrequests/{id}/approve`

## Support

Need help? Here's how to get assistance:

1. **Check the troubleshooting section above** - most common issues are covered there
2. **Visit our GitHub repository** for documentation and examples: [github.com/aashari/mcp-server-atlassian-bitbucket](https://github.com/aashari/mcp-server-atlassian-bitbucket)
3. **Report issues** at [GitHub Issues](https://github.com/aashari/mcp-server-atlassian-bitbucket/issues)
4. **Start a discussion** for feature requests or general questions

---

*Made with care for developers who want to bring AI into their Bitbucket workflow.*

# Connect AI to Your Bitbucket Repositories

Transform how you work with Bitbucket by connecting Claude, Cursor AI, and other AI assistants directly to your repositories, pull requests, and code. Get instant insights, automate code reviews, and streamline your development workflow.

[![NPM Version](https://img.shields.io/npm/v/@aashari/mcp-server-atlassian-bitbucket)](https://www.npmjs.com/package/@aashari/mcp-server-atlassian-bitbucket)

## What You Can Do

✅ **Ask AI about your code**: "What's the latest commit in my main repository?"  
✅ **Get PR insights**: "Show me all open pull requests that need review"  
✅ **Search your codebase**: "Find all JavaScript files that use the authentication function"  
✅ **Review code changes**: "Compare the differences between my feature branch and main"  
✅ **Manage pull requests**: "Create a PR for my new-feature branch"  
✅ **Automate workflows**: "Add a comment to PR #123 with the test results"  

## Perfect For

- **Developers** who want AI assistance with code reviews and repository management
- **Team Leads** needing quick insights into project status and pull request activity  
- **DevOps Engineers** automating repository workflows and branch management
- **Anyone** who wants to interact with Bitbucket using natural language

## Quick Start

Get up and running in 2 minutes:

### 1. Get Your Bitbucket Credentials

> ⚠️ **IMPORTANT**: Bitbucket App Passwords are being deprecated and will be removed by **June 2026**. We recommend using **Scoped API Tokens** for new setups.

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
npx -y @aashari/mcp-server-atlassian-bitbucket ls-workspaces

# List repositories in your workspace
npx -y @aashari/mcp-server-atlassian-bitbucket ls-repos --workspace-slug your-workspace

# Get details about a specific repository  
npx -y @aashari/mcp-server-atlassian-bitbucket get --path "/repositories/your-workspace/your-repo" --jq "{name: name, default_branch: mainbranch.name}"
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

Restart Claude Desktop, and you'll see "🔗 bitbucket" in the status bar.

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

## Real-World Examples

### 🔍 Explore Your Repositories

Ask your AI assistant:
- *"List all repositories in my main workspace"*
- *"Show me details about the backend-api repository"*
- *"What's the commit history for the feature-auth branch?"*
- *"Get the content of src/config.js from the main branch"*

### 📋 Manage Pull Requests

Ask your AI assistant:
- *"Show me all open pull requests that need review"*
- *"Get details about pull request #42 including the code changes"*
- *"Create a pull request from feature-login to main branch"*
- *"Add a comment to PR #15 saying the tests passed"*
- *"Approve pull request #33"*

### 🔧 Work with Branches and Code

Ask your AI assistant:
- *"Compare my feature branch with the main branch"*
- *"Create a new branch called hotfix-login from the main branch"*
- *"List all branches in the user-service repository"*
- *"Show me the differences between commits abc123 and def456"*

### 🔎 Search and Discovery

Ask your AI assistant:
- *"Search for JavaScript files that contain 'authentication'"*
- *"Find all pull requests related to the login feature"*
- *"Search for repositories in the mobile project"*
- *"Show me code files that use the React framework"*

## Troubleshooting

### "Authentication failed" or "403 Forbidden"

1. **Choose the right authentication method**:
   - **Standard Atlassian method**: Use your Atlassian account email + API token (works with any Atlassian service)
   - **Bitbucket-specific method**: Use your Bitbucket username + App password (Bitbucket only)

2. **For Bitbucket App Passwords** (if using Option 2):
   - Go to [Bitbucket App Passwords](https://bitbucket.org/account/settings/app-passwords/)
   - Make sure your app password has the right permissions (Workspaces: Read, Repositories: Read, Pull Requests: Read)

3. **For Scoped API Tokens** (recommended):
   - Go to [Atlassian API Tokens](https://id.atlassian.com/manage-profile/security/api-tokens)
   - Make sure your token is still active and has the right scopes
   - Update your `~/.mcp/configs.json` file to use the new scoped API token format:
   ```json
   {
     "@aashari/mcp-server-atlassian-bitbucket": {
       "environments": {
         "ATLASSIAN_USER_EMAIL": "your.email@company.com",
         "ATLASSIAN_API_TOKEN": "ATATT3xFfGF0..."
       }
     }
   }
   ```

4. **Verify your credentials**:
   ```bash
   # Test your credentials work
   npx -y @aashari/mcp-server-atlassian-bitbucket ls-workspaces
   ```

### "Workspace not found" or "Repository not found"

1. **Check your workspace slug**:
   ```bash
   # List your workspaces to see the correct slugs
   npx -y @aashari/mcp-server-atlassian-bitbucket ls-workspaces
   ```

2. **Use the exact slug from Bitbucket URL**:
   - If your repo URL is `https://bitbucket.org/myteam/my-repo`
   - Workspace slug is `myteam`
   - Repository slug is `my-repo`

### "No default workspace configured"

Set a default workspace to avoid specifying it every time:
```bash
export BITBUCKET_DEFAULT_WORKSPACE="your-main-workspace-slug"
```

### Claude Desktop Integration Issues

1. **Restart Claude Desktop** after updating the config file
2. **Check the status bar** for the "🔗 bitbucket" indicator
3. **Verify config file location**:
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
- Your regular Atlassian account with access to Bitbucket
- Scoped API token created at [id.atlassian.com/manage-profile/security/api-tokens](https://id.atlassian.com/manage-profile/security/api-tokens)
- Required scopes: `repository`, `workspace` (add `pullrequest` for PR management)

**For Bitbucket App Passwords** (legacy - being deprecated):
- For **read-only access** (viewing repos, PRs, commits):
  - Workspaces: Read
  - Repositories: Read  
  - Pull Requests: Read
- For **full functionality** (creating PRs, commenting):
  - Add "Write" permissions for Repositories and Pull Requests

### Can I use this with private repositories?

Yes! This works with both public and private repositories. You just need the appropriate permissions through your Bitbucket App Password.

### Do I need to specify workspace every time?

No! Set `BITBUCKET_DEFAULT_WORKSPACE` in your environment or config file, and it will be used automatically when you don't specify one.

### What AI assistants does this work with?

Any AI assistant that supports the Model Context Protocol (MCP):
- Claude Desktop (most popular)
- Cursor AI
- Continue.dev
- Many others

### Is my data secure?

Yes! This tool:
- Runs entirely on your local machine
- Uses your own Bitbucket credentials
- Never sends your data to third parties
- Only accesses what you give it permission to access

### Can I use this for multiple Bitbucket accounts?

Currently, each installation supports one set of credentials. For multiple accounts, you'd need separate configurations.

## Support

Need help? Here's how to get assistance:

1. **Check the troubleshooting section above** - most common issues are covered there
2. **Visit our GitHub repository** for documentation and examples: [github.com/aashari/mcp-server-atlassian-bitbucket](https://github.com/aashari/mcp-server-atlassian-bitbucket)
3. **Report issues** at [GitHub Issues](https://github.com/aashari/mcp-server-atlassian-bitbucket/issues)
4. **Start a discussion** for feature requests or general questions

---

*Made with ❤️ for developers who want to bring AI into their Bitbucket workflow.*

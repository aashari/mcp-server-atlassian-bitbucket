[![MseeP.ai Security Assessment Badge](https://mseep.net/pr/aashari-mcp-server-atlassian-bitbucket-badge.png)](https://mseep.ai/app/aashari-mcp-server-atlassian-bitbucket)

# Atlassian Bitbucket MCP Server

A Node.js/TypeScript Model Context Protocol (MCP) server for Atlassian Bitbucket Cloud. Enables AI systems (e.g., LLMs like Claude or Cursor AI) to securely interact with your repositories, pull requests, workspaces, and code in real time.

[![NPM Version](https://img.shields.io/npm/v/@aashari/mcp-server-atlassian-bitbucket)](https://www.npmjs.com/package/@aashari/mcp-server-atlassian-bitbucket)
[![Build Status](https://img.shields.io/github/workflow/status/aashari/mcp-server-atlassian-bitbucket/CI)](https://github.com/aashari/mcp-server-atlassian-bitbucket/actions)

## Why Use This Server?

- **Minimal Input, Maximum Output**: Simple identifiers provide comprehensive details without requiring extra flags.
- **Rich Code Visualization**: Get detailed insights into code changes with file statistics, diff views, and smart context.
- **Secure Local Authentication**: Run locally with your credentials, never storing tokens on remote servers.
- **Intuitive Markdown Responses**: Well-structured, consistent Markdown formatting for all outputs.
- **Full Bitbucket Integration**: Access workspaces, repositories, pull requests, comments, code search, and more.

## What is MCP?

Model Context Protocol (MCP) is an open standard for securely connecting AI systems to external tools and data sources. This server implements MCP for Bitbucket Cloud, enabling AI assistants to interact with your Bitbucket data programmatically.

## Prerequisites

- **Node.js** (>=18.x): [Download](https://nodejs.org/)
- **Bitbucket Cloud Account**

## Setup

### Step 1: Authenticate

Choose one of the following authentication methods:

#### Option A: Bitbucket App Password (Recommended)

Generate one from [Bitbucket App Passwords](https://bitbucket.org/account/settings/app-passwords/). Minimum permissions:
- Workspaces: Read
- Repositories: Read
- Pull Requests: Read

You can also set `BITBUCKET_DEFAULT_WORKSPACE` to specify a default workspace when not explicitly provided.

#### Option B: Atlassian API Token

Generate one from [Atlassian API Tokens](https://id.atlassian.com/manage-profile/security/api-tokens).

**Note:** Bitbucket App Passwords are strongly recommended as they provide more granular, Bitbucket-specific permissions.

### Step 2: Configure Credentials

#### Option A: MCP Config File (Recommended)

Edit or create `~/.mcp/configs.json`:

**Using Bitbucket App Password:**
```json
{
	"bitbucket": {
		"environments": {
			"ATLASSIAN_BITBUCKET_USERNAME": "<your_username>",
			"ATLASSIAN_BITBUCKET_APP_PASSWORD": "<your_app_password>"
		}
	}
}
```

**Using Atlassian API Token:**
```json
{
	"bitbucket": {
		"environments": {
			"ATLASSIAN_SITE_NAME": "bitbucket",
			"ATLASSIAN_USER_EMAIL": "<your_email>",
			"ATLASSIAN_API_TOKEN": "<your_api_token>"
		}
	}
}
```

#### Option B: Environment Variables

```bash
export ATLASSIAN_BITBUCKET_USERNAME="<your_username>"
export ATLASSIAN_BITBUCKET_APP_PASSWORD="<your_app_password>"
```

### Step 3: Install and Run

#### Quick Start with `npx`

```bash
npx -y @aashari/mcp-server-atlassian-bitbucket ls-workspaces
```

#### Global Installation

```bash
npm install -g @aashari/mcp-server-atlassian-bitbucket
mcp-atlassian-bitbucket ls-workspaces
```

## Transport Modes

This server supports two transport modes for different integration scenarios:

### STDIO Transport (Default for MCP)
- Traditional subprocess communication via stdin/stdout
- Ideal for local AI assistant integrations (Claude Desktop, Cursor AI)
- Uses pipe-based communication for direct MCP protocol exchange

```bash
# Run with STDIO transport (default for AI assistants)
TRANSPORT_MODE=stdio npx @aashari/mcp-server-atlassian-bitbucket

# Using npm scripts (after installation)
npm run mcp:stdio
```

### HTTP Transport (Default for Server Mode)
- Modern HTTP-based transport with Server-Sent Events (SSE)
- Supports multiple concurrent connections
- Better for web-based integrations and development
- Runs on port 3000 by default (configurable via PORT env var)
- Endpoint: `http://localhost:3000/mcp`
- Health check: `http://localhost:3000/`

```bash
# Run with HTTP transport (default when no CLI args)
TRANSPORT_MODE=http npx @aashari/mcp-server-atlassian-bitbucket

# Using npm scripts (after installation)
npm run mcp:http

# Test with MCP Inspector
npm run mcp:inspect
```

### Environment Variables

**Transport Configuration:**
- `TRANSPORT_MODE`: Set to `stdio` or `http` (default: `http` for server mode, `stdio` for MCP clients)
- `PORT`: HTTP server port (default: `3000`)
- `DEBUG`: Enable debug logging (default: `false`)

**Authentication:**
- `ATLASSIAN_BITBUCKET_USERNAME`: Your Bitbucket username
- `ATLASSIAN_BITBUCKET_APP_PASSWORD`: Your Bitbucket app password
- `ATLASSIAN_API_TOKEN`: Alternative API token
- `BITBUCKET_DEFAULT_WORKSPACE`: Default workspace (optional)

### Step 4: Connect to AI Assistant

Configure your MCP-compatible client (e.g., Claude, Cursor AI):

```json
{
	"mcpServers": {
		"bitbucket": {
			"command": "npx",
			"args": ["-y", "@aashari/mcp-server-atlassian-bitbucket"]
		}
	}
}
```

## MCP Tools

MCP tools use `snake_case` names, `camelCase` parameters, and return Markdown-formatted responses.

- **bb_ls_workspaces**: Lists available workspaces (`query`: str opt). Use: View accessible workspaces.
- **bb_get_workspace**: Gets workspace details (`workspaceSlug`: str req). Use: View workspace information.
- **bb_ls_repos**: Lists repositories (`workspaceSlug`: str opt, `projectKey`: str opt, `query`: str opt, `role`: str opt). Use: Find repositories.
- **bb_get_repo**: Gets repository details (`workspaceSlug`: str req, `repoSlug`: str req). Use: Access repo information.
- **bb_search**: Searches Bitbucket content (`workspaceSlug`: str req, `query`: str req, `scope`: str opt, `language`: str opt, `extension`: str opt). Use: Find code or PRs.
- **bb_ls_prs**: Lists pull requests (`workspaceSlug`: str req, `repoSlug`: str req, `state`: str opt). Use: View open or merged PRs.
- **bb_get_pr**: Gets PR details (`workspaceSlug`: str req, `repoSlug`: str req, `prId`: str req). Use: View PR details with diffs.
- **bb_ls_pr_comments**: Lists PR comments (`workspaceSlug`: str req, `repoSlug`: str req, `prId`: str req). Use: View PR discussions.
- **bb_add_pr_comment**: Adds comment to PR (`workspaceSlug`: str req, `repoSlug`: str req, `prId`: str req, `content`: str req, `inline`: obj opt). Use: Add feedback to PRs.
- **bb_add_pr**: Creates a PR (`workspaceSlug`: str req, `repoSlug`: str req, `title`: str req, `sourceBranch`: str req, `targetBranch`: str opt). Use: Create new PRs.
- **bb_add_branch**: Creates a branch (`workspaceSlug`: str req, `repoSlug`: str req, `newBranchName`: str req, `sourceBranchOrCommit`: str opt). Use: Create a feature branch.
- **bb_clone_repo**: Clones a repository (`workspaceSlug`: str req, `repoSlug`: str req, `targetPath`: str req). Use: Clone code locally.
- **bb_get_commit_history**: Gets commit history (`workspaceSlug`: str req, `repoSlug`: str req, `revision`: str opt, `path`: str opt). Use: View code history.
- **bb_get_file**: Gets file content (`workspaceSlug`: str req, `repoSlug`: str req, `filePath`: str req, `revision`: str opt). Use: View specific file.
- **bb_diff_branches**: Shows diff between branches (`workspaceSlug`: str req, `repoSlug`: str req, `sourceBranch`: str req, `targetBranch`: str req). Use: Compare branches.
- **bb_diff_commits**: Shows diff between commits (`workspaceSlug`: str req, `repoSlug`: str req, `sourceCommit`: str req, `targetCommit`: str req). Use: Compare commits.
- **bb_list_branches**: Lists branches (`workspaceSlug`: str req, `repoSlug`: str req, `query`: str opt, `sort`: str opt). Use: View all branches.

<details>
<summary><b>MCP Tool Examples (Click to expand)</b></summary>

### `bb_ls_workspaces`

**List All Workspaces:**
```json
{}
```

**Search Workspaces:**
```json
{ "query": "devteam" }
```

### `bb_get_workspace`

**Get Workspace Details:**
```json
{ "workspaceSlug": "acme-corp" }
```

### `bb_ls_repos`

**List Repos in Workspace:**
```json
{ "workspaceSlug": "acme-corp", "projectKey": "PROJ" }
```

**List Repos Using Default Workspace:**
```json
{ "projectKey": "PROJ" }
```

### `bb_get_repo`

**Get Repository Details:**
```json
{ "workspaceSlug": "acme-corp", "repoSlug": "backend-api" }
```

### `bb_search`

**Search Code:**
```json
{
	"workspaceSlug": "acme-corp",
	"query": "Logger",
	"scope": "code",
	"language": "typescript"
}
```

### `bb_ls_prs`

**List Open PRs:**
```json
{ "workspaceSlug": "acme-corp", "repoSlug": "frontend-app", "state": "OPEN" }
```

### `bb_get_pr`

**Get PR Details:**
```json
{ "workspaceSlug": "acme-corp", "repoSlug": "frontend-app", "prId": "42" }
```

### `bb_ls_pr_comments`

**List PR Comments:**
```json
{ "workspaceSlug": "acme-corp", "repoSlug": "frontend-app", "prId": "42" }
```

### `bb_add_pr_comment`

**Add General Comment:**
```json
{
	"workspaceSlug": "acme-corp",
	"repoSlug": "frontend-app",
	"prId": "42",
	"content": "Looks good."
}
```

**Add Inline Comment:**
```json
{
	"workspaceSlug": "acme-corp",
	"repoSlug": "frontend-app",
	"prId": "42",
	"content": "Consider refactoring.",
	"inline": { "path": "src/utils.js", "line": 42 }
}
```

### `bb_add_pr`

**Create Pull Request:**
```json
{
	"workspaceSlug": "acme-corp",
	"repoSlug": "frontend-app",
	"title": "Add login screen",
	"sourceBranch": "feature/login"
}
```

### `bb_add_branch`

**Create New Branch:**
```json
{
	"workspaceSlug": "acme-corp",
	"repoSlug": "frontend-app",
	"newBranchName": "feature/new-feature",
	"sourceBranchOrCommit": "main"
}
```

### `bb_clone_repo`

**Clone Repository:**
```json
{
	"workspaceSlug": "acme-corp",
	"repoSlug": "backend-api",
	"targetPath": "/Users/me/projects"
}
```

### `bb_get_commit_history`

**View Commit History:**
```json
{
	"workspaceSlug": "acme-corp",
	"repoSlug": "backend-api"
}
```

**Filtered Commit History:**
```json
{
	"workspaceSlug": "acme-corp",
	"repoSlug": "backend-api",
	"revision": "develop",
	"path": "src/main/java/com/acme/service/UserService.java"
}
```

### `bb_get_file`

**Get File Content:**
```json
{
	"workspaceSlug": "acme-corp",
	"repoSlug": "backend-api",
	"filePath": "src/main/java/com/acme/service/Application.java",
	"revision": "main"
}
```

### `bb_diff_branches`

**Compare Branches:**
```json
{
	"workspaceSlug": "acme-corp",
	"repoSlug": "web-app",
	"sourceBranch": "develop",
	"targetBranch": "main"
}
```

### `bb_diff_commits`

**Compare Commits:**
```json
{
	"workspaceSlug": "acme-corp",
	"repoSlug": "web-app",
	"sourceCommit": "a1b2c3d",
	"targetCommit": "e4f5g6h"
}
```

### `bb_list_branches`

**List All Branches:**
```json
{
	"workspaceSlug": "acme-corp",
	"repoSlug": "frontend-app"
}
```

**Filtered Branches:**
```json
{
	"workspaceSlug": "acme-corp",
	"repoSlug": "frontend-app",
	"query": "feature/",
	"sort": "name"
}
```

</details>

## CLI Commands

CLI commands use `kebab-case`. Run `--help` for details (e.g., `mcp-atlassian-bitbucket ls-workspaces --help`).

- **ls-workspaces**: Lists workspaces (`--query`). Ex: `mcp-atlassian-bitbucket ls-workspaces`.
- **get-workspace**: Gets workspace details (`--workspace-slug`). Ex: `mcp-atlassian-bitbucket get-workspace --workspace-slug acme-corp`.
- **ls-repos**: Lists repos (`--workspace-slug`, `--project-key`, `--query`). Ex: `mcp-atlassian-bitbucket ls-repos --workspace-slug acme-corp`.
- **get-repo**: Gets repo details (`--workspace-slug`, `--repo-slug`). Ex: `mcp-atlassian-bitbucket get-repo --workspace-slug acme-corp --repo-slug backend-api`.
- **search**: Searches code (`--workspace-slug`, `--query`, `--scope`, `--language`). Ex: `mcp-atlassian-bitbucket search --workspace-slug acme-corp --query "auth"`.
- **ls-prs**: Lists PRs (`--workspace-slug`, `--repo-slug`, `--state`). Ex: `mcp-atlassian-bitbucket ls-prs --workspace-slug acme-corp --repo-slug backend-api`.
- **get-pr**: Gets PR details (`--workspace-slug`, `--repo-slug`, `--pr-id`). Ex: `mcp-atlassian-bitbucket get-pr --workspace-slug acme-corp --repo-slug backend-api --pr-id 42`.
- **ls-pr-comments**: Lists PR comments (`--workspace-slug`, `--repo-slug`, `--pr-id`). Ex: `mcp-atlassian-bitbucket ls-pr-comments --workspace-slug acme-corp --repo-slug backend-api --pr-id 42`.
- **add-pr-comment**: Adds PR comment (`--workspace-slug`, `--repo-slug`, `--pr-id`, `--content`). Ex: `mcp-atlassian-bitbucket add-pr-comment --workspace-slug acme-corp --repo-slug backend-api --pr-id 42 --content "Looks good"`.
- **add-pr**: Creates PR (`--workspace-slug`, `--repo-slug`, `--title`, `--source-branch`). Ex: `mcp-atlassian-bitbucket add-pr --workspace-slug acme-corp --repo-slug backend-api --title "New feature" --source-branch feature/login`.
- **get-file**: Gets file content (`--workspace-slug`, `--repo-slug`, `--file-path`). Ex: `mcp-atlassian-bitbucket get-file --workspace-slug acme-corp --repo-slug backend-api --file-path src/main.js`.
- **add-branch**: Creates branch (`--workspace-slug`, `--repo-slug`, `--new-branch-name`). Ex: `mcp-atlassian-bitbucket add-branch --workspace-slug acme-corp --repo-slug backend-api --new-branch-name feature/new`.

<details>
<summary><b>CLI Command Examples (Click to expand)</b></summary>

### List and View Workspaces/Repos

```bash
# List all workspaces
mcp-atlassian-bitbucket ls-workspaces

# Get details of a specific workspace
mcp-atlassian-bitbucket get-workspace --workspace-slug acme-corp

# List repositories in a workspace
mcp-atlassian-bitbucket ls-repos --workspace-slug acme-corp --project-key PROJ

# Get details of a specific repository
mcp-atlassian-bitbucket get-repo --workspace-slug acme-corp --repo-slug backend-api
```

### Working with Pull Requests

```bash
# List open pull requests in a repository
mcp-atlassian-bitbucket ls-prs --workspace-slug acme-corp --repo-slug frontend-app --state OPEN

# Get details of a specific pull request with code changes
mcp-atlassian-bitbucket get-pr --workspace-slug acme-corp --repo-slug frontend-app --pr-id 42

# List comments on a pull request
mcp-atlassian-bitbucket ls-pr-comments --workspace-slug acme-corp --repo-slug frontend-app --pr-id 42

# Add a comment to a pull request
mcp-atlassian-bitbucket add-pr-comment --workspace-slug acme-corp --repo-slug frontend-app --pr-id 42 --content "Looks good to merge."

# Create a new pull request
mcp-atlassian-bitbucket add-pr --workspace-slug acme-corp --repo-slug frontend-app --title "Add login screen" --source-branch feature/login
```

### Code and Commits

```bash
# Search for code
mcp-atlassian-bitbucket search --workspace-slug acme-corp --query "Logger" --scope code --language typescript

# View commit history
mcp-atlassian-bitbucket get-commit-history --workspace-slug acme-corp --repo-slug backend-api --revision develop

# Get file content
mcp-atlassian-bitbucket get-file --workspace-slug acme-corp --repo-slug backend-api --file-path "src/Application.java" --revision main

# Compare branches
mcp-atlassian-bitbucket diff-branches --workspace-slug acme-corp --repo-slug web-app --source-branch develop --target-branch main

# Compare commits
mcp-atlassian-bitbucket diff-commits --workspace-slug acme-corp --repo-slug web-app --source-commit a1b2c3d --target-commit e4f5g6h
```

### Branch Management

```bash
# List branches
mcp-atlassian-bitbucket list-branches --workspace-slug acme-corp --repo-slug frontend-app --query "feature/" --sort name

# Create a new branch
mcp-atlassian-bitbucket add-branch --workspace-slug acme-corp --repo-slug frontend-app --new-branch-name feature/new-feature --source-branch-or-commit main

# Clone a repository
mcp-atlassian-bitbucket clone --workspace-slug acme-corp --repo-slug backend-api --target-path ./cloned-projects
```

</details>

## Response Format

All responses are Markdown-formatted, including:

- **Title**: Operation performed or entity viewed.
- **Context**: Workspace, repository, pull request, or branch information.
- **Content**: Primary data such as file content, PR details, or search results.
- **Metadata**: Timestamps, authors, and statistics.
- **Diffs**: Code changes with syntax highlighting for diffs between branches/commits.

<details>
<summary><b>Response Format Examples (Click to expand)</b></summary>

### Repository Details

```markdown
# Repository: backend-api

**Workspace:** acme-corp
**Full Name:** acme-corp/backend-api
**Language:** Java
**Created:** 2024-01-15 by John Smith
**Updated:** 2025-05-10 (2 days ago)

## Overview
Spring Boot backend API for the ACME product suite.

## Statistics
- **Default Branch:** main
- **Size:** 24.5 MB
- **Commits:** 358
- **Open PRs:** 4
- **Forks:** 3

## Recent Activity
- PR #42: "Add OAuth2 support" by Jane Doe (Open)
- PR #41: "Fix pagination bug" by Alex Kim (Merged)
- PR #40: "Update dependencies" by John Smith (Merged)

*Repository URL: https://bitbucket.org/acme-corp/backend-api*
```

### Pull Request Review

```markdown
# Pull Request #42: Add OAuth2 support

**Repository:** acme-corp/backend-api
**Author:** Jane Doe
**State:** OPEN
**Created:** 2025-05-15 (4 days ago)
**Updated:** 2025-05-18 (yesterday)

## Description
Implements OAuth2 authentication flow with support for:
- Authorization code grant
- Refresh tokens
- Token caching

## Changes
- **Files changed:** 7
- **Additions:** 245 lines
- **Deletions:** 32 lines

## Diff for src/auth/OAuthService.java


	@@ -10,6 +10,25 @@ public class OAuthService {
		private final TokenRepository tokenRepository;
		private final HttpClient httpClient;
	
	+    @Autowired
	+    public OAuthService(
	+            TokenRepository tokenRepository,
	+            HttpClient httpClient) {
	+        this.tokenRepository = tokenRepository;
	+        this.httpClient = httpClient;
	+    }
	+
	+    public TokenResponse refreshToken(String refreshToken) {
	+        // Validate refresh token
	+        if (StringUtils.isEmpty(refreshToken)) {
	+            throw new InvalidTokenException("Refresh token cannot be empty");
	+        }
	+        
	+        // Call OAuth server for new access token
	+        return httpClient.post("/oauth/token")
	+            .body(Map.of("grant_type", "refresh_token", "refresh_token", refreshToken))
	+            .execute()
	+            .as(TokenResponse.class);
	+    }

## Comments (3)
1. **John Smith** (2 days ago):
   > Please add unit tests for the refresh token flow

2. **Jane Doe** (yesterday):
   > Added tests in the latest commit

3. **Approval by:** Alex Kim (yesterday)

*Pull Request URL: https://bitbucket.org/acme-corp/backend-api/pull-requests/42*
```

</details>

## Development

```bash
# Clone repository
git clone https://github.com/aashari/mcp-server-atlassian-bitbucket.git
cd mcp-server-atlassian-bitbucket

# Install dependencies
npm install

# Run in development mode
npm run dev:server

# Run tests
npm test
```

## Contributing

Contributions are welcome! Please:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/xyz`).
3. Commit changes (`git commit -m "Add xyz feature"`).
4. Push to the branch (`git push origin feature/xyz`).
5. Open a pull request.

See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## License

[ISC License](LICENSE)

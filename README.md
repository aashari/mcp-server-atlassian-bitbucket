[![MseeP.ai Security Assessment Badge](https://mseep.net/pr/aashari-mcp-server-atlassian-bitbucket-badge.png)](https://mseep.ai/app/aashari-mcp-server-atlassian-bitbucket)

# Atlassian Bitbucket MCP Server

This project provides a Model Context Protocol (MCP) server that acts as a bridge between AI assistants (like Anthropic's Claude, Cursor AI, or other MCP-compatible clients) and your Atlassian Bitbucket instance. It allows AI to securely access and interact with your repositories, pull requests, and workspaces in real time.

---

# Overview

## What is MCP?

Model Context Protocol (MCP) is an open standard that allows AI systems to securely and contextually connect with external tools and data sources.

This server implements MCP specifically for Bitbucket Cloud, bridging your Bitbucket data with AI assistants.

## Why Use This Server?

- **Minimal Input, Maximum Output Philosophy**: Simple identifiers like `workspaceSlug` and `repoSlug` are all you need. Each tool returns comprehensive details without requiring extra flags.

- **Rich Code Visualization**: Get detailed insights into repositories and code changes with file statistics, diff views, and smart context around code modifications.

- **Secure Local Authentication**: Credentials are never stored in the server. The server runs locally, so your tokens never leave your machine and you can request only the permissions you need.

- **Intuitive Markdown Responses**: All responses use well-structured Markdown for readability with consistent formatting and navigational links.

- **Full Bitbucket Integration**: Access workspaces, repositories, pull requests, comments, code search, and more through a unified interface.

---

# Getting Started

## Prerequisites

- **Node.js** (>=18.x): [Download](https://nodejs.org/)
- **Bitbucket Cloud Account**

---

## Step 1: Authenticate

Choose one of the following authentication methods:

### Option A: Bitbucket App Password (Recommended)

Generate one from [Bitbucket App Passwords](https://bitbucket.org/account/settings/app-passwords/). Minimum permissions:

- Workspaces: Read
- Repositories: Read
- Pull Requests: Read

### Option B: Atlassian API Token

Generate one from [Atlassian API Tokens](https://id.atlassian.com/manage-profile/security/api-tokens).

**Note:** While the server _may_ function using an Atlassian API Token (via the standard `ATLASSIAN_*` variables) due to the shared Atlassian account system, **Bitbucket App Passwords are the strongly recommended and officially supported method** for this integration. App Passwords allow for more granular, Bitbucket-specific permission scopes, enhancing security compared to potentially broader-scoped API Tokens.

---

## Step 2: Configure Credentials

### Method A: MCP Config File (Recommended)

Create or edit `~/.mcp/configs.json`:

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

**Note:** For backward compatibility, the server will also recognize configurations under the full package name (`@aashari/mcp-server-atlassian-bitbucket`), the unscoped package name (`mcp-server-atlassian-bitbucket`), or the `atlassian-bitbucket` format if the recommended `bitbucket` key is not found. However, using the short `bitbucket` key is preferred for new configurations.

### Method B: Environment Variables

Pass credentials directly when running the server:

```bash
ATLASSIAN_BITBUCKET_USERNAME="<your_username>" \
ATLASSIAN_BITBUCKET_APP_PASSWORD="<your_app_password>" \
npx -y @aashari/mcp-server-atlassian-bitbucket
```

---

## Step 3: Connect Your AI Assistant

Configure your MCP-compatible client to launch this server.

**Claude / Cursor Configuration:**

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

This configuration launches the server automatically at runtime.

---

# Tools

This section covers the MCP tools available when using this server with an AI assistant. Note that MCP tools use `snake_case` for tool names and `camelCase` for parameters.

## `bb_ls_workspaces`

List available Bitbucket workspaces.

```json
{}
```

_or:_

```json
{ "query": "devteam" }
```

> "Show me all my Bitbucket workspaces."

---

## `bb_get_workspace`

Get full details for a specific workspace.

```json
{ "workspaceSlug": "acme-corp" }
```

> "Tell me more about the 'acme-corp' workspace."

---

## `bb_ls_repos`

Lists repositories in a workspace. Filters by `role`, `projectKey`, `query` (name/description). Supports sorting and pagination.

```json
{ "workspaceSlug": "acme-corp", "projectKey": "PROJ" }
```

> "List repositories in 'acme-corp' for project PROJ."

---

## `bb_get_repo`

Get details of a specific repository, including owner, main branch name, comment/task counts, and recent PRs.

```json
{ "workspaceSlug": "acme-corp", "repoSlug": "backend-api" }
```

> "Show me the 'backend-api' repository in 'acme-corp'."

---

## `bb_search`

Search Bitbucket content. Scope with `scope` ('repositories', 'pullrequests', 'commits', 'code', 'all'). Code scope supports `language` and `extension` filters. The 'all' scope includes a header indicating which scope returned results.

**Code (filtered):**

```json
{
	"workspaceSlug": "acme-corp",
	"query": "Logger",
	"scope": "code",
	"language": "typescript"
}
```

> "Search for 'Logger' in TypeScript files within the 'acme-corp' workspace."

---

## `bb_ls_prs`

List pull requests in a repository.

```json
{ "workspaceSlug": "acme-corp", "repoSlug": "frontend-app", "state": "OPEN" }
```

> "Show open PRs in 'frontend-app'."

---

## `bb_get_pr`

Get full details of a pull request, including code diffs, file changes, comment/task counts.

```json
{ "workspaceSlug": "acme-corp", "repoSlug": "frontend-app", "prId": "42" }
```

> "Get PR #42 from 'frontend-app' with all code changes."

---

## `bb_ls_pr_comments`

List comments on a specific pull request. Inline comments include code snippets.

```json
{ "workspaceSlug": "acme-corp", "repoSlug": "frontend-app", "prId": "42" }
```

> "Show me all comments on PR #42, including code context for inline comments."

---

## `bb_create_pr_comment`

Add a comment to a pull request.

**General:**

```json
{
	"workspaceSlug": "acme-corp",
	"repoSlug": "frontend-app",
	"prId": "42",
	"content": "Looks good."
}
```

**Inline:**

```json
{
	"workspaceSlug": "acme-corp",
	"repoSlug": "frontend-app",
	"prId": "42",
	"content": "Consider refactoring.",
	"inline": { "path": "src/utils.js", "line": 42 }
}
```

> "Add a comment to PR #42 on line 42."

---

## `bb_create_pr`

Create a new pull request.

```json
{
	"workspaceSlug": "acme-corp",
	"repoSlug": "frontend-app",
	"title": "Add login screen",
	"sourceBranch": "feature/login"
}
```

> "Create a PR from 'feature/login' to 'main'."

---

## `bb_create_branch`

Create a new branch from a source branch or commit.

```json
{
	"workspaceSlug": "acme-corp",
	"repoSlug": "frontend-app",
	"newBranchName": "feature/new-feature",
	"sourceBranchOrCommit": "main"
}
```

> "Create branch 'feature/new-feature' from 'main' in 'frontend-app'."

---

## `bb_clone_repo`

Clones a Bitbucket repository identified by `workspaceSlug` and `repoSlug`. The `targetPath` argument specifies the parent directory where the repository will be cloned.

**IMPORTANT:** `targetPath` **MUST be an absolute path** (e.g., `/Users/me/projects`). The repository will be cloned into a subdirectory named after the repository slug under this directory.

```json
{
	"workspaceSlug": "acme-corp",
	"repoSlug": "backend-api",
	"targetPath": "/Users/me/projects"
}
```

> "Clone the 'backend-api' repo into '/Users/me/projects'."

---

## `bb_get_commit_history`

Retrieve the commit history for a repository.

```json
{
	"workspaceSlug": "acme-corp",
	"repoSlug": "backend-api"
}
```

_or (filter by branch and path):_

```json
{
	"workspaceSlug": "acme-corp",
	"repoSlug": "backend-api",
	"revision": "develop",
	"path": "src/main/java/com/acme/service/UserService.java"
}
```

> "Show me the commit history for the 'backend-api' repository."
> "Get commits on the develop branch for UserService.java."

---

## `bb_get_file`

Retrieves the content of a file from a Bitbucket repository.

**Parameters:**

- `workspaceSlug` (string, required): Workspace slug containing the repository.
- `repoSlug` (string, required): Repository slug containing the file.
- `filePath` (string, required): Path to the file within the repository (e.g., "src/app.js", "README.md").
- `revision` (string, optional): Branch name, tag, or commit hash to retrieve the file from. If omitted, the repository's default branch is used.

**Example:**

```json
{
	"workspaceSlug": "acme-corp",
	"repoSlug": "backend-api",
	"filePath": "src/main/java/com/acme/service/Application.java",
	"revision": "main"
}
```

> "Get the content of Application.java from the main branch of backend-api in acme-corp."
> "Show me the pom.xml from the latest commit on the develop branch in the 'coda-payments/api-gateway' repository."

Requires Bitbucket credentials.

---

# Command-Line Interface (CLI)

The CLI uses kebab-case for commands (e.g., `ls-workspaces`) and options (e.g., `--workspace-slug`).

## Quick Use with `npx`

```bash
npx -y @aashari/mcp-server-atlassian-bitbucket ls-workspaces
npx -y @aashari/mcp-server-atlassian-bitbucket get-repo \
  --workspace-slug acme-corp \
  --repo-slug backend-api
npx -y @aashari/mcp-server-atlassian-bitbucket ls-prs \
  --workspace-slug acme-corp \
  --repo-slug frontend-app \
  --state OPEN
npx -y @aashari/mcp-server-atlassian-bitbucket create-pr-comment \
  --workspace-slug acme-corp \
  --repo-slug frontend-app \
  --pr-id 42 \
  --content "Looks good to merge."
npx -y @aashari/mcp-server-atlassian-bitbucket get-commit-history \
  --workspace-slug acme-corp \
  --repo-slug backend-api \
  --revision develop
npx -y @aashari/mcp-server-atlassian-bitbucket create-branch \
  --workspace-slug acme-corp \
  --repo-slug frontend-app \
  --new-branch-name feature/new-stuff \
  --source-branch-or-commit main
npx -y @aashari/mcp-server-atlassian-bitbucket clone \
  --workspace-slug acme-corp \
  --repo-slug backend-api \
  --target-path ./cloned-projects
npx -y @aashari/mcp-server-atlassian-bitbucket get-file \
  --workspace-slug acme-corp \
  --repo-slug backend-api \
  --file-path "src/main/java/com/acme/service/Application.java" \
  --revision main
```

## Install Globally

```bash
npm install -g @aashari/mcp-server-atlassian-bitbucket
```

Then run directly:

```bash
mcp-atlassian-bitbucket ls-workspaces
mcp-atlassian-bitbucket get-repo --workspace-slug acme-corp --repo-slug backend-api
```

## Discover More CLI Options

Use `--help` to see flags and usage for all available commands:

```bash
mcp-atlassian-bitbucket --help
```

Or get detailed help for a specific command:

```bash
mcp-atlassian-bitbucket ls-workspaces --help
mcp-atlassian-bitbucket get-workspace --help
mcp-atlassian-bitbucket ls-repos --help
mcp-atlassian-bitbucket get-repo --help
mcp-atlassian-bitbucket ls-prs --help
mcp-atlassian-bitbucket get-pr --help
mcp-atlassian-bitbucket ls-pr-comments --help
mcp-atlassian-bitbucket create-pr-comment --help
mcp-atlassian-bitbucket create-pr --help
mcp-atlassian-bitbucket search --help
mcp-atlassian-bitbucket get-commit-history --help
mcp-atlassian-bitbucket create-branch --help
mcp-atlassian-bitbucket clone --help
mcp-atlassian-bitbucket get-file --help
```

---

# License

[ISC License](https://opensource.org/licenses/ISC)

# Atlassian Bitbucket MCP Server

This project provides a Model Context Protocol (MCP) server that acts as a bridge between AI assistants (like Anthropic's Claude, Cursor AI, or other MCP-compatible clients) and your Atlassian Bitbucket instance. It allows AI to securely access and interact with your repositories, pull requests, and workspaces in real-time.

## What is MCP and Why Use This Server?

Model Context Protocol (MCP) is an open standard enabling AI models to connect securely to external tools and data sources. This server implements MCP specifically for Bitbucket Cloud.

**Benefits:**

- **Real-time Access:** Your AI assistant can directly access up-to-date Bitbucket data (repositories, PRs, etc.).
- **Eliminate Copy/Paste:** No need to manually transfer information between Bitbucket and your AI assistant.
- **Enhanced AI Capabilities:** Enables AI to analyze repositories, review pull requests, understand code context, and work directly with your version control system.
- **Security:** You control access via API credentials (Atlassian API Token or Bitbucket App Password). The AI interacts through the server, and sensitive operations remain contained.

## Available Tools

This MCP server provides the following tools for your AI assistant:

- **List Workspaces (`list-workspaces`)**

    - **Purpose:** Discover available Bitbucket workspaces you have access to and find their 'slugs' (unique identifiers).
    - **Use When:** You need to know which workspaces are available or find the slug for a specific workspace to use with other tools.
    - **Conversational Example:** "Show me all my Bitbucket workspaces."
    - **Parameter Example:** `{}` (no parameters needed for basic list) or `{ query: "devteam" }` (to filter).

- **Get Workspace (`get-workspace`)**

    - **Purpose:** Retrieve detailed information about a _specific_ workspace using its slug.
    - **Use When:** You know the workspace slug and need its full details or links to its contents.
    - **Conversational Example:** "Tell me more about the 'acme-corp' workspace."
    - **Parameter Example:** `{ workspaceSlug: "acme-corp" }`

- **List Repositories (`list-repositories`)**

    - **Purpose:** List repositories within a specific workspace and find their 'slugs'. Requires the workspace slug.
    - **Use When:** You need to find repositories within a known workspace or get the slug for a specific repository.
    - **Conversational Example:** "List the repositories in the 'acme-corp' workspace."
    - **Parameter Example:** `{ workspaceSlug: "acme-corp" }` or `{ workspaceSlug: "acme-corp", query: "backend" }` (to filter).

- **Get Repository (`get-repository`)**

    - **Purpose:** Retrieve detailed information about a _specific_ repository using its workspace and repository slugs.
    - **Use When:** You know the workspace and repository slugs and need full details like description, language, owner, etc.
    - **Conversational Example:** "Show me details for the 'backend-api' repository in the 'acme-corp' workspace."
    - **Parameter Example:** `{ workspaceSlug: "acme-corp", repoSlug: "backend-api" }`

- **List Pull Requests (`list-pull-requests`)**

    - **Purpose:** List pull requests within a specific repository. Requires workspace and repository slugs.
    - **Use When:** You need to find open/merged/etc. pull requests in a known repository or get the ID for a specific PR.
    - **Conversational Example:** "Show me the open pull requests for the 'acme-corp/frontend-app' repository."
    - **Parameter Example:** `{ workspaceSlug: "acme-corp", repoSlug: "frontend-app", state: "OPEN" }`

- **Get Pull Request (`get-pull-request`)**
    - **Purpose:** Retrieve detailed information about a _specific_ pull request using its workspace slug, repository slug, and PR ID.
    - **Use When:** You know the identifiers for a specific PR and need its full description, reviewers, status, branches, etc.
    - **Conversational Example:** "Get the details for pull request #42 in the 'acme-corp/frontend-app' repo."
    - **Parameter Example:** `{ workspaceSlug: "acme-corp", repoSlug: "frontend-app", prId: "42" }`

## Interface Philosophy: Simple Input, Rich Output

This server follows a "Minimal Interface, Maximal Detail" approach:

1.  **Simple Tools:** Ask for only essential identifiers (like `workspaceSlug`, `repoSlug`, `prId`).
2.  **Rich Details:** When you ask for a specific item (like `get-repository`), the server provides all relevant information by default (description, owner, links, etc.) without needing extra flags.

## Prerequisites

- **Node.js and npm:** Ensure you have Node.js (which includes npm) installed. Download from [nodejs.org](https://nodejs.org/).
- **Bitbucket Account:** An active Bitbucket Cloud account with access to the workspaces and repositories you want to connect to.

<a href="https://glama.ai/mcp/servers/@aashari/mcp-server-atlassian-bitbucket">
  <img width="380" height="200" src="https://glama.ai/mcp/servers/@aashari/mcp-server-atlassian-bitbucket/badge" alt="Atlassian Bitbucket Server MCP server" />
</a>

## Quick Start Guide

Follow these steps to connect your AI assistant to Bitbucket:

### Step 1: Set Up Authentication

You have two options for authenticating with Bitbucket:

#### Option A: Bitbucket App Password (Recommended for Bitbucket-only use)

**Important:** Treat your App Password like a password. Do not share it or commit it to version control.

1.  Navigate to your Bitbucket personal settings:
    [https://bitbucket.org/account/settings/app-passwords/](https://bitbucket.org/account/settings/app-passwords/)
2.  Click **Create app password**.
3.  Give it a **Label** (e.g., `mcp-bitbucket-access`).
4.  Grant the following **Permissions** (at minimum):
    - `Workspaces`: `Read`
    - `Repositories`: `Read`
    - `Pull requests`: `Read`
5.  Click **Create**.
6.  **Immediately copy the generated App Password.** You won't be able to see it again. Store it securely.

#### Option B: Atlassian API Token (Use if connecting other Atlassian tools like Jira/Confluence)

**Important:** Treat your API token like a password.

1.  Go to your Atlassian API token management page:
    [https://id.atlassian.com/manage-profile/security/api-tokens](https://id.atlassian.com/manage-profile/security/api-tokens)
2.  Click **Create API token**.
3.  Give it a descriptive **Label** (e.g., `mcp-bitbucket-access`).
4.  Click **Create**.
5.  **Immediately copy the generated API token.** Store it securely.

### Step 2: Configure the Server Credentials

Choose **one** of the following methods:

#### Method A: Global MCP Config File (Recommended)

This keeps credentials separate and organized.

1.  **Create the directory** (if needed): `~/.mcp/`
2.  **Create/Edit the file:** `~/.mcp/configs.json`
3.  **Add the configuration:** Paste **one** of the following JSON structures, corresponding to your chosen authentication method, replacing the placeholders:

    **Using Bitbucket App Password:**

    ```json
    {
    	"@aashari/mcp-server-atlassian-bitbucket": {
    		"environments": {
    			"ATLASSIAN_BITBUCKET_USERNAME": "<YOUR_BITBUCKET_USERNAME>",
    			"ATLASSIAN_BITBUCKET_APP_PASSWORD": "<YOUR_COPIED_APP_PASSWORD>"
    		}
    	}
    	// Add other servers here if needed
    }
    ```

    - `<YOUR_BITBUCKET_USERNAME>`: Your Bitbucket username.
    - `<YOUR_COPIED_APP_PASSWORD>`: The App Password from Step 1B.

    **Using Atlassian API Token:**

    ```json
    {
    	"@aashari/mcp-server-atlassian-bitbucket": {
    		"environments": {
    			"ATLASSIAN_SITE_NAME": "<YOUR_ATLASSIAN_SITE_NAME_UNUSED_BUT_NEEDED>",
    			"ATLASSIAN_USER_EMAIL": "<YOUR_ATLASSIAN_EMAIL>",
    			"ATLASSIAN_API_TOKEN": "<YOUR_COPIED_API_TOKEN>"
    		}
    	}
    	// Add other servers here if needed
    }
    ```

    - `<YOUR_ATLASSIAN_SITE_NAME_UNUSED_BUT_NEEDED>`: Enter any value (like `bitbucket`). This field is required by the underlying transport but not used for Bitbucket API auth when using an API token.
    - `<YOUR_ATLASSIAN_EMAIL>`: Your Atlassian account email.
    - `<YOUR_COPIED_API_TOKEN>`: The API token from Step 1B.

#### Method B: Environment Variables (Alternative)

Set environment variables when running the server. Choose the set matching your authentication:

**Using Bitbucket App Password:**

```bash
ATLASSIAN_BITBUCKET_USERNAME="<YOUR_USERNAME>" \
ATLASSIAN_BITBUCKET_APP_PASSWORD="<YOUR_APP_PASSWORD>" \
npx -y @aashari/mcp-server-atlassian-bitbucket
```

**Using Atlassian API Token:**

```bash
ATLASSIAN_SITE_NAME="bitbucket" \
ATLASSIAN_USER_EMAIL="<YOUR_EMAIL>" \
ATLASSIAN_API_TOKEN="<YOUR_API_TOKEN>" \
npx -y @aashari/mcp-server-atlassian-bitbucket
```

### Step 3: Connect Your AI Assistant

Configure your MCP client (Claude Desktop, Cursor, etc.) to run this server.

#### Claude Desktop

1.  Open Settings (gear icon) > Edit Config.
2.  Add or merge into `mcpServers`:

    ```json
    {
    	"mcpServers": {
    		"aashari/mcp-server-atlassian-bitbucket": {
    			"command": "npx",
    			"args": ["-y", "@aashari/mcp-server-atlassian-bitbucket"]
    		}
    		// ... other servers
    	}
    }
    ```

3.  Save and **Restart Claude Desktop**.
4.  **Verify:** Click the "Tools" (hammer) icon; Bitbucket tools should be listed.

#### Cursor AI

1.  Command Palette (`Cmd+Shift+P` / `Ctrl+Shift+P`) > **Cursor Settings > MCP**.
2.  Click **+ Add new MCP server**.
3.  Enter:
    - Name: `aashari/mcp-server-atlassian-bitbucket`
    - Type: `command`
    - Command: `npx -y @aashari/mcp-server-atlassian-bitbucket`
4.  Click **Add**.
5.  **Verify:** Wait for the indicator next to the server name to turn green.

### Step 4: Using the Tools

You can now ask your AI assistant questions related to your Bitbucket instance:

- "List all the Bitbucket workspaces I have access to."
- "Show me all repositories in the 'dev-team' workspace."
- "Get information about the 'main-api' repository in the 'dev-team' workspace."
- "Show me open pull requests for the 'dev-team/main-api' repository."
- "Summarize pull request #42 in the 'dev-team/main-api' repository."

## Using as a Command-Line Tool (CLI)

You can also use this package directly from your terminal. Ensure credentials are set first (Method A or B above).

#### Quick Use with `npx`

```bash
npx -y @aashari/mcp-server-atlassian-bitbucket list-workspaces
npx -y @aashari/mcp-server-atlassian-bitbucket get-repository --workspace my-team --repository my-api
npx -y @aashari/mcp-server-atlassian-bitbucket list-pull-requests --workspace my-team --repository my-api --state OPEN
```

#### Global Installation (Optional)

1.  `npm install -g @aashari/mcp-server-atlassian-bitbucket`
2.  Use the `mcp-bitbucket` command:

```bash
mcp-bitbucket list-workspaces --limit 5
mcp-bitbucket get-pull-request --workspace my-team --repository my-api --pull-request 42
mcp-bitbucket --help # See all commands
```

## Troubleshooting

- **Authentication Errors (401/403):**
    - Double-check your credentials in `~/.mcp/configs.json` or environment variables. Ensure you used the correct set (App Password OR API Token).
    - Verify the App Password or API Token is correct, valid, and has not been revoked.
    - Ensure your account has permission to access the specific Bitbucket resources.
- **Server Not Connecting (in AI Client):**
    - Ensure the command (`npx ...`) is correct in your client's config.
    - Check that Node.js/npm are installed and in your PATH.
    - Run the `npx` command directly in your terminal to see errors.
- **Resource Not Found (404):**
    - Verify workspace/repository slugs and PR IDs are correct (slugs are case-sensitive).
    - Check your permissions for the specific resource.
- **Enable Debug Logs:** Set the `DEBUG` environment variable to `true` (e.g., add `"DEBUG": "true"` in `configs.json` or run `DEBUG=true npx ...`).

## For Developers: Contributing

Contributions are welcome! If you'd like to contribute, please consider the following:

- **Architecture:** The server uses a layered approach (CLI/Tool -> Controller -> Service). See the `.cursorrules` file or code comments for more details.
- **Setup:** Clone the repo, run `npm install`. Use `npm run dev:server` to run with hot-reloading or `npm run dev:cli -- <command>` to test CLI commands.
- **Code Style:** Run `npm run lint` and `npm run format`.
- **Tests:** Add tests for new features (`npm test`).
- **Consistency:** Ensure new tools/commands follow the "Minimal Interface, Maximal Detail" philosophy and match existing patterns.

## Versioning Note

This project (`@aashari/mcp-server-atlassian-bitbucket`) follows Semantic Versioning and is versioned independently from other `@aashari/mcp-server-*` packages.

## License

[ISC](https://opensource.org/licenses/ISC)
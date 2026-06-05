# Bitbucket MCP Server

Connect AI assistants (Claude, Cursor, etc.) to Bitbucket Cloud via the REST API 2.0.

[![NPM Version](https://img.shields.io/npm/v/@aashari/mcp-server-atlassian-bitbucket)](https://www.npmjs.com/package/@aashari/mcp-server-atlassian-bitbucket)
[![License](https://img.shields.io/npm/l/@aashari/mcp-server-atlassian-bitbucket)](https://github.com/aashari/mcp-server-atlassian-bitbucket/blob/main/LICENSE)

## Quick Start

### 1. Get Credentials

**Option A — Atlassian API Token (recommended):**
1. Go to [Atlassian API Tokens](https://id.atlassian.com/manage-profile/security/api-tokens)
2. Create a token with scopes `repository`, `workspace`, `pullrequest`
3. Use your email + token (starts with `ATATT`)

**Option B — Bitbucket App Password (legacy):**
1. Go to [App Passwords](https://bitbucket.org/account/settings/app-passwords/)
2. Grant: Workspaces (Read), Repositories (Read/Write), Pull Requests (Read/Write)
3. Use your Bitbucket username + the generated password

> App passwords are being deprecated. Use Option A for new setups.

### 2. Set Env Vars

```bash
export ATLASSIAN_USER_EMAIL="your.email@company.com"
export ATLASSIAN_API_TOKEN="ATATT..."
# OR
export ATLASSIAN_BITBUCKET_USERNAME="your_username"
export ATLASSIAN_BITBUCKET_APP_PASSWORD="your_app_password"
```

### 3. Test It

```bash
npx -y @aashari/mcp-server-atlassian-bitbucket get --path "/workspaces"
npx -y @aashari/mcp-server-atlassian-bitbucket get --path "/repositories/your-workspace"
```

## Configure Your Editor

### Claude Desktop

Add to `~/.claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "bitbucket": {
      "command": "npx",
      "args": ["-y", "@aashari/mcp-server-atlassian-bitbucket"],
      "env": {
        "ATLASSIAN_USER_EMAIL": "your.email@company.com",
        "ATLASSIAN_API_TOKEN": "your_token"
      }
    }
  }
}
```

### Other Editors

Works with any MCP-compatible client (Cursor, Continue, Cline). Configure it to run:
```
npx -y @aashari/mcp-server-atlassian-bitbucket
```

## Tools

| Tool | Params | Description |
|------|--------|-------------|
| `bb_get` | `path`, `queryParams?`, `jq?`, `outputFormat?` | Read resources |
| `bb_post` | `path`, `body`, `queryParams?`, `jq?`, `outputFormat?` | Create resources |
| `bb_put` | `path`, `body`, `queryParams?`, `jq?`, `outputFormat?` | Full replace |
| `bb_patch` | `path`, `body`, `queryParams?`, `jq?`, `outputFormat?` | Partial update |
| `bb_delete` | `path`, `queryParams?`, `jq?`, `outputFormat?` | Delete resources |
| `bb_clone` | `workspaceSlug?`, `repoSlug`, `targetPath` | Clone repo locally |

All paths get `/2.0` prepended automatically. Full API reference: https://developer.atlassian.com/cloud/bitbucket/rest/

### Common Parameters

- **`path`** — API endpoint starting with `/`
- **`queryParams`** — e.g. `{"pagelen": "25", "q": "state=\"OPEN\""}`
- **`jq`** — JMESPath expression to filter response. Always use this to save tokens.
- **`outputFormat`** — `"toon"` (default, saves 30-60% tokens) or `"json"`
- **`body`** — JSON body for POST/PUT/PATCH

### Common API Paths

| Path | Methods |
|------|---------|
| `/workspaces` | GET |
| `/repositories/{ws}` | GET |
| `/repositories/{ws}/{repo}` | GET/PUT |
| `/repositories/{ws}/{repo}/refs/branches` | GET |
| `/repositories/{ws}/{repo}/refs/branches/{name}` | GET/DELETE |
| `/repositories/{ws}/{repo}/commits` | GET |
| `/repositories/{ws}/{repo}/src/{commit}/{path}` | GET |
| `/repositories/{ws}/{repo}/diff/{src}..{dst}` | GET |
| `/repositories/{ws}/{repo}/pullrequests` | GET/POST |
| `/repositories/{ws}/{repo}/pullrequests/{id}` | GET/PATCH/DELETE |
| `/repositories/{ws}/{repo}/pullrequests/{id}/diff` | GET |
| `/repositories/{ws}/{repo}/pullrequests/{id}/comments` | GET/POST |
| `/repositories/{ws}/{repo}/pullrequests/{id}/comments/{cid}` | PATCH/DELETE |
| `/repositories/{ws}/{repo}/pullrequests/{id}/approve` | POST/DELETE |
| `/repositories/{ws}/{repo}/pullrequests/{id}/request-changes` | POST |
| `/repositories/{ws}/{repo}/pullrequests/{id}/merge` | POST |
| `/repositories/{ws}/{repo}/pullrequests/{id}/decline` | POST |
| `/repositories/{ws}/{repo}/issues` | GET/POST |
| `/repositories/{ws}/{repo}/pipelines` | GET/POST |

### TOON Format

By default responses use TOON (token-efficient format). Override with `outputFormat: "json"`.

```
TOON:
values:
  name  | slug
  repo1 | repo-1
  repo2 | repo-2
```

### JMESPath Filtering

The `jq` param uses JMESPath, not the `jq` CLI. Common patterns:

| Pattern | Effect |
|---------|--------|
| `values[*].name` | One field from all items |
| `values[*].{id:id, title:title}` | Custom shape |
| `values[0]` | First item |
| `values[?state=='OPEN']` | Filter |

Explore schema first with `pagelen=1` and no `jq`, then re-fetch with filters.

### CLI

```bash
# GET
npx -y @aashari/mcp-server-atlassian-bitbucket get --path "/workspaces" --jq "values[*].{name:name, slug:slug}"

# POST (create PR)
npx -y @aashari/mcp-server-atlassian-bitbucket post \
  --path "/repositories/myws/myrepo/pullrequests" \
  --body '{"title":"My PR","source":{"branch":{"name":"feature"}},"destination":{"branch":{"name":"main"}}}'

# POST inline comment
npx -y @aashari/mcp-server-atlassian-bitbucket post \
  --path "/repositories/myws/myrepo/pullrequests/42/comments" \
  --body '{"content":{"raw":"Fix this."},"inline":{"path":"src/auth/login.ts","to":37}}'

# Approve, merge, decline
npx -y @aashari/mcp-server-atlassian-bitbucket post --path "/repositories/myws/myrepo/pullrequests/42/approve" --body '{}'
npx -y @aashari/mcp-server-atlassian-bitbucket post --path "/repositories/myws/myrepo/pullrequests/42/merge" --body '{"merge_strategy":"squash"}'

# Other operations
npx -y @aashari/mcp-server-atlassian-bitbucket delete --path "/repositories/myws/myrepo/refs/branches/old-branch"
npx -y @aashari/mcp-server-atlassian-bitbucket clone --workspace-slug myws --repo-slug myrepo --target-path /abs/path
```

#### CLI Flags

`get`/`delete`: `-p --path`, `-q --query-params`, `--jq`
`post`/`put`/`patch`: same + `-b --body`
`clone`: `--workspace-slug`, `--repo-slug`, `--target-path`

## Agent Skill

This repo includes an agent skill (`SKILL.md`) — install it so your AI knows how to use the tools effectively:

```bash
npx skills add aashari/mcp-server-atlassian-bitbucket
```

## Debugging

```bash
DEBUG=true npx -y @aashari/mcp-server-atlassian-bitbucket get --path "/workspaces"
```

Logs written to `~/.mcp/data/@aashari-mcp-server-atlassian-bitbucket.*.log`

## Troubleshooting

**Auth fails:** Verify env var names match exactly (`ATLASSIAN_*`, not `BITBUCKET_*`). Token should start with `ATATT`. Workspace slug is case-sensitive.

**404:** Paths are case-sensitive. Use slugs from the URL, not display names.

**Editor not connecting:** Restart your editor after changing config. Check MCP logs.

## Migration from v1.x

v2.0 moved from 20+ specific tools (`bb_ls_workspaces`, `bb_get_repo`, etc.) to 6 generic tools (`bb_get`, `bb_post`, ...). Map old tools to API paths — examples in the [repo wiki](https://github.com/aashari/mcp-server-atlassian-bitbucket).

## Requirements

- Node.js 18+
- Bitbucket Cloud account

---

MIT

---
name: bitbucket-mcp-server
description: 'Agent skill for @aashari/mcp-server-atlassian-bitbucket — the MCP server that connects AI assistants to Bitbucket Cloud REST API 2.0. Covers all 6 pass-through tools (bb_get, bb_post, bb_put, bb_patch, bb_delete, bb_clone), authentication, common API paths for repos/PRs/branches/commits, request body patterns, TOON output, JMESPath filtering via the jq parameter, query params, cost optimization, and example workflows including inline PR comments. Use when asked to interact with Bitbucket Cloud via MCP — list PRs, create/merge/approve/decline PRs, add inline code-level comments, list branches, create repos, clone repos, or perform any Bitbucket API operation.'
license: MIT
metadata:
  author: aashari
  version: "1.0.0"
allowed-tools: Bash
---

# Bitbucket MCP Server

Full reference for the `@aashari/mcp-server-atlassian-bitbucket` MCP server — 6 pass-through tools that map directly to the Bitbucket Cloud REST API 2.0.

**Install:** `npx skills add aashari/mcp-server-atlassian-bitbucket`
**API:** `https://api.bitbucket.org` (server adds `/2.0` prefix automatically)
**Reference:** https://developer.atlassian.com/cloud/bitbucket/rest/

---

## Authentication

Configure via env vars (see `.env.example`):

**Option A — Atlassian API Token (recommended):**
- Generate at https://id.atlassian.com/manage-profile/security/api-tokens
- `ATLASSIAN_USER_EMAIL` + `ATLASSIAN_API_TOKEN` (starts with `ATATT`)
- Required scopes: `repository`, `workspace`, `pullrequest`

**Option B — Bitbucket App Password (legacy):**
- Generate at https://bitbucket.org/account/settings/app-passwords/
- `ATLASSIAN_BITBUCKET_USERNAME` + `ATLASSIAN_BITBUCKET_APP_PASSWORD`
- Required permissions: Workspaces (Read), Repositories (Read/Write), Pull Requests (Read/Write)

> App passwords are being deprecated — prefer Option A for new setups.

---

## Tools

| Tool | Params | Description |
|---|---|---|
| `bb_get` | `path`, `queryParams?`, `jq?`, `outputFormat?` | Read any Bitbucket resource |
| `bb_post` | `path`, `body`, `queryParams?`, `jq?`, `outputFormat?` | Create a resource |
| `bb_put` | `path`, `body`, `queryParams?`, `jq?`, `outputFormat?` | Full replace |
| `bb_patch` | `path`, `body`, `queryParams?`, `jq?`, `outputFormat?` | Partial update |
| `bb_delete` | `path`, `queryParams?`, `jq?`, `outputFormat?` | Delete (usually 204) |
| `bb_clone` | `repoSlug`, `targetPath` | Clone repo via SSH/HTTPS |

**Common params:**
- `path` — API endpoint (e.g. `/workspaces`, `/repositories/{ws}/{repo}/pullrequests`)
- `queryParams` — `{"pagelen": "10", "q": "state=\"OPEN\""}`
- `jq` — JMESPath expression to filter response (not the `jq` CLI tool)
- `outputFormat` — `"toon"` (default, 30-60% fewer tokens) or `"json"`
- `body` (POST/PUT/PATCH) — JSON request body

---

## Common API Paths

| Path | Methods | Purpose |
|---|---|---|
| `/workspaces` | GET | List workspaces |
| `/repositories/{workspace}` | GET | List repos |
| `/repositories/{ws}/{repo}` | GET/PUT | Get/update repo |
| `/repositories/{ws}/{repo}/refs/branches` | GET | List branches |
| `/repositories/{ws}/{repo}/refs/branches/{name}` | GET/DELETE | Get/delete branch |
| `/repositories/{ws}/{repo}/commits` | GET | List commits |
| `/repositories/{ws}/{repo}/src/{commit}/{path}` | GET | File at commit |
| `/repositories/{ws}/{repo}/diff/{src}..{dst}` | GET | Compare branches |
| `/repositories/{ws}/{repo}/pullrequests` | GET/POST | List/create PRs |
| `/repositories/{ws}/{repo}/pullrequests/{id}` | GET/PATCH/DELETE | Get/update/delete PR |
| `/repositories/{ws}/{repo}/pullrequests/{id}/diff` | GET | PR diff |
| `/repositories/{ws}/{repo}/pullrequests/{id}/comments` | GET/POST | List/add comments |
| `/repositories/{ws}/{repo}/pullrequests/{id}/comments/{cid}` | PATCH/DELETE | Edit/delete comment |
| `/repositories/{ws}/{repo}/pullrequests/{id}/approve` | POST/DELETE | Approve/remove |
| `/repositories/{ws}/{repo}/pullrequests/{id}/request-changes` | POST | Request changes |
| `/repositories/{ws}/{repo}/pullrequests/{id}/merge` | POST | Merge PR |
| `/repositories/{ws}/{repo}/pullrequests/{id}/decline` | POST | Decline PR |
| `/repositories/{ws}/{repo}/pullrequests/{id}/activity` | GET | Activity log |
| `/repositories/{ws}/{repo}/issues` | GET/POST | List/create issues |
| `/repositories/{ws}/{repo}/pipelines` | GET/POST | List/trigger pipelines |
| `/repositories/{ws}/{repo}/deployments` | GET | List deployments |

---

## Request Body Reference

**Create PR:**
```json
{"title": "My feature", "source": {"branch": {"name": "feature"}}, "destination": {"branch": {"name": "main"}}, "description": "...", "reviewers": [{"uuid": "..."}], "close_source_branch": true, "draft": false}
```

**General PR comment:**
```json
{"content": {"raw": "Looks good!"}}
```

**Inline PR comment** (anchored to a file/line in the diff):
```json
{"content": {"raw": "Fix this."}, "inline": {"path": "src/auth/login.ts", "to": 37}}
```
- `to` — line in new file (added/changed code)
- `from` — line in old file (deleted code)
- **Never use `from` + `to` together** — Bitbucket ignores `to` when `from` is present
- Get the diff first: `bb_get → /repositories/{ws}/{repo}/pullrequests/{id}/diff`

**Approve / Request changes / Decline:**
```json
{}
```

**Merge:**
```json
{"merge_strategy": "squash"}
```
Strategies: `merge_commit`, `squash`, `fast_forward`

**Update PR:**
```json
{"title": "New title", "description": "Updated"}
```

**Update reviewers:**
```json
{"reviewers": [{"uuid": "..."}]}
```

**Edit comment:**
```json
{"content": {"raw": "Updated"}}
```

---

## Response Filtering (`jq`)

The `jq` param uses **JMESPath** expressions (not the `jq` CLI). Always use it to reduce token costs.

| Pattern | Effect |
|---|---|
| `values[*].slug` | Extract one field |
| `values[*].{id:id, title:title}` | Custom object |
| `values[0]` | First item |
| `values[?state=='OPEN']` | Filter |
| `{id:id, content:content.raw}` | Single reshape |

## Query Params

| Param | Description |
|---|---|
| `pagelen` | Page size |
| `page` | Page number |
| `q` | Server-side filter (`state="OPEN"`) |
| `sort` | Sort field (`-updated_on`) |
| `fields` | Sparse fieldset (`values.id,values.title`) |

## Cost Optimization

1. **Always use `jq`** — unfiltered responses burn tokens
2. **Set `pagelen`** — don't fetch more than needed
3. **Use `q` filtering** — reduce payload server-side
4. **Use `fields`** — sparse fields at the API level
5. **TOON is default** — don't switch to JSON unless necessary

## Schema Discovery

Fetch one item with no `jq` to see available fields, then re-fetch with `jq` targeting only what you need.

---

## Example Workflows

### PR operations
```text
bb_get    → /repositories/myws/myrepo/pullrequests              ?pagelen=10 & jq=values[*].{id,title,state}
bb_get    → /repositories/myws/myrepo/pullrequests/42/diff
bb_post   → /repositories/myws/myrepo/pullrequests              body={"title":"My PR","source":{"branch":{"name":"feature"}},"destination":{"branch":{"name":"main"}}}
bb_post   → /repositories/myws/myrepo/pullrequests/42/approve   body={}
bb_post   → /repositories/myws/myrepo/pullrequests/42/merge     body={"merge_strategy":"squash"}
```

### PR comments
```text
bb_post   → /repositories/myws/myrepo/pullrequests/42/comments   body={"content":{"raw":"Looks good!"}}
bb_post   → /repositories/myws/myrepo/pullrequests/42/comments   body={"content":{"raw":"Fix this."},"inline":{"path":"src/auth/login.ts","to":37}}
```

### Branches & repos
```text
bb_get    → /repositories/myws/myrepo/refs/branches              jq=values[*].{name,target:target.hash}
bb_delete → /repositories/myws/myrepo/refs/branches/old-feature
bb_get    → /repositories/myws/myrepo                           jq={name,slug,mainbranch:mainbranch.name}
bb_get    → /repositories/myws/myrepo/commits                   ?include=feature&pagelen=5 & jq=values[*].{hash,message,date}
bb_clone  → repoSlug=myrepo, targetPath=/home/user/projects
```

---

## CLI Usage (npx)

```bash
# GET
npx -y @aashari/mcp-server-atlassian-bitbucket get --path "/repositories/myws/myrepo/pullrequests" --jq "values[*].{id:id,title:title}"

# POST
npx -y @aashari/mcp-server-atlassian-bitbucket post --path "/repositories/myws/myrepo/pullrequests" --body '{"title":"My PR","source":{"branch":{"name":"feature"}}}'

# POST with query params
npx -y @aashari/mcp-server-atlassian-bitbucket post --path "/repositories/myws/myrepo/pullrequests/42/comments" --body '{"content":{"raw":"Looks good!"}}' --query-params '{"fields":"id,content"}' --jq "{id:id,content:content.raw}"
```

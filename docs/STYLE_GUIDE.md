# MCP Server Style Guide

Based on the MCP SDK v1.22.0+ best practices and observed patterns, this guide ensures consistency across all MCP servers.

## Naming Conventions

| Element              | Convention                                                                                                                                    | Rationale / Examples                                                                                                                              |
| :------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------ |
| **CLI Commands**     | `verb-noun` in `kebab-case`. Use the shortest unambiguous verb (`ls`, `get`, `create`, `add`, `exec`, `search`).                              | `ls-repos`, `get-pr`, `create-comment`, `exec-command`                                                                                            |
| **CLI Options**      | `--kebab-case`. Be specific (e.g., `--workspace-slug`, not just `--slug`).                                                                    | `--project-key-or-id`, `--source-branch`                                                                                                          |
| **MCP Tool Names**   | `<namespace>_<verb>_<noun>` in `snake_case`. Use a concise 2-4 char namespace. Avoid noun repetition.                                         | `bb_ls_repos` (Bitbucket list repos), `conf_get_page` (Confluence get page), `aws_exec_command` (AWS execute command). Avoid `ip_ip_get_details`. |
| **MCP Resource Names**| `kebab-case`. Descriptive identifier for the resource type.                                                                                  | `ip-lookup`, `user-profile`, `config-data`                                                                                                        |
| **MCP Arguments**    | `camelCase`. Suffix identifiers consistently (e.g., `Id`, `Key`, `Slug`). Avoid abbreviations unless universal.                               | `workspaceSlug`, `pullRequestId`, `sourceBranch`, `pageId`.                                                                                       |
| **Boolean Args**     | Use verb prefixes for clarity (`includeXxx`, `launchBrowser`). Avoid bare adjectives (`--https`).                                             | `includeExtendedData: boolean`, `launchBrowser: boolean`                                                                                          |
| **Array Args**       | Use plural names (`spaceIds`, `labels`, `statuses`).                                                                                          | `spaceIds: string[]`, `labels: string[]`                                                                                                          |
| **Descriptions**     | **Start with an imperative verb.** Keep the first sentence concise (≤120 chars). Add 1-2 sentences detail. Mention pre-requisites/notes last. | `List available Confluence spaces. Filters by type, status, or query. Returns formatted list including ID, key, name.`                            |
| **Arg Descriptions** | Start lowercase, explain purpose clearly. Mention defaults or constraints.                                                                    | `numeric ID of the page to retrieve (e.g., "456789"). Required.`                                                                                  |
| **ID/Key Naming**    | Use consistent suffixes like `Id`, `Key`, `Slug`, `KeyOrId` where appropriate.                                                                | `pageId`, `projectKeyOrId`, `workspaceSlug`                                                                                                       |

## SDK Best Practices (v1.22.0+)

### Title vs Name

All registrations (`registerTool`, `registerResource`, `registerPrompt`) support both `name` and `title`:

| Field | Purpose | Example |
| :---- | :------ | :------ |
| `name` | Unique identifier for programmatic use | `bb_get` |
| `title` | Human-readable display name for UI | `Bitbucket GET Request` |

**Always provide both** - `name` for code, `title` for user interfaces.

### Modern Registration APIs

Use the modern `register*` methods instead of deprecated alternatives:

| Deprecated | Modern (SDK v1.22.0+) |
| :--------- | :-------------------- |
| `server.tool()` | `server.registerTool()` |
| `server.resource()` | `server.registerResource()` |
| `server.prompt()` | `server.registerPrompt()` |

### Resource Templates

Use `ResourceTemplate` for parameterized resource URIs:

```typescript
import { ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';

// Static resource - fixed URI
server.registerResource('config', 'config://app', { ... }, handler);

// Dynamic resource - parameterized URI
server.registerResource(
    'user-profile',
    new ResourceTemplate('users://{userId}/profile', { list: undefined }),
    { title: 'User Profile', description: '...' },
    async (uri, variables) => {
        const userId = variables.userId as string;
        // ...
    }
);
```

### Error Handling

Use `isError: true` for tool execution failures:

```typescript
return {
    content: [{ type: 'text', text: 'Error: Something went wrong' }],
    isError: true
};
```

Adopting this guide will make the tools more predictable and easier for both humans and AI agents to understand and use correctly.

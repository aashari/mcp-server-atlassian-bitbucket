# MCP Server Atlassian Bitbucket - Modernization Analysis

**Date:** 2026-02-04
**Current Version:** 2.3.0
**Target Version:** 3.0.0 (BREAKING: OIDC Migration)
**Analyst:** AI Agent

---

## Executive Summary

mcp-server-atlassian-bitbucket is a Model Context Protocol (MCP) server that connects AI assistants to Atlassian Bitbucket Cloud. The server is in good health with 83 passing tests, clean linting, and successful builds. This modernization will update 5 outdated dependencies and migrate from legacy npm token authentication to OIDC Trusted Publishing.

**Current State:**
- ✅ Build: Successful (TypeScript compilation)
- ✅ Tests: 8 suites, 83 tests passing, 0 failures
- ✅ Linting: 0 errors
- ⚠️ Dependencies: 5 packages outdated
- ❌ Publishing: Using legacy NPM_TOKEN (expired)
- ⚠️ Root Directory: Has cleanup candidates (.gitkeep, .trigger-ci, STYLE_GUIDE.md)

**Impact:**
- **Breaking Change**: OIDC migration requires workflow permission changes (major version bump)
- **Improvement**: Latest MCP SDK features and Zod enhancements
- **Long-term**: Zero npm token maintenance burden

---

## Repository Overview

### Purpose

Second-generation Bitbucket MCP server (v2.0.0+) using generic HTTP method tools instead of 20+ specific endpoint tools. Enables AI systems to interact with Bitbucket workspaces, repositories, and pull requests through 6 universal tools:

1. `bb_get` - GET any Bitbucket API endpoint
2. `bb_post` - POST (create resources)
3. `bb_put` - PUT (replace resources)
4. `bb_patch` - PATCH (partial updates)
5. `bb_delete` - DELETE resources
6. `bb_clone` - Clone repository locally (unchanged)

### Architecture

**6-Layer Structure:**
```
src/
├── index.ts                    # Entry point, server initialization
├── cli/                        # Command-line interface
├── tools/                      # MCP tool registration
│   ├── atlassian.api.tool.ts           # Generic HTTP method tools
│   └── atlassian.repositories.tool.ts  # Repository clone tool
├── controllers/                # Request handling logic
├── services/                   # External API interaction
│   ├── vendor.atlassian.repositories.service.ts
│   └── vendor.atlassian.workspaces.service.ts
├── types/                      # TypeScript definitions
└── utils/                      # Helper functions
```

**Key Features:**
- Dual transport support (STDIO and HTTP with SSE)
- JMESPath filtering for response transformation
- TOON format support for token-efficient LLM responses
- Raw response logging with automatic truncation
- Comprehensive authentication support (Scoped API Token + legacy App Password)

### Published Package

- **npm Package:** `@aashari/mcp-server-atlassian-bitbucket`
- **Current Version Published:** 2.3.0
- **Last Release:** 2025-12-03
- **Registry:** https://registry.npmjs.org/

### Testing Coverage

- **Test Suites:** 8 total
- **Tests:** 83 passing, 0 failures
- **Coverage:** Not measured in recent run
- **Test Files:**
  - `vendor.atlassian.repositories.service.test.ts`
  - `vendor.atlassian.workspaces.test.ts`
  - Various controller and utility tests

### Recent Changes (v2.3.0)

**Features Added:**
- Raw response logging with truncation for large API responses
- Modernized MCP SDK to v1.23.0 with registerTool API (v2.2.0)
- TOON output format support (v2.1.0)

**Breaking Changes (v2.0.0):**
- Replaced 20+ specific endpoint tools with 6 generic HTTP method tools
- Simplified architecture for better maintainability
- Improved flexibility for LLM usage patterns

---

## Dependency Analysis

### Runtime Dependencies

| Package | Current | Latest | Status | Notes |
|---------|---------|--------|--------|-------|
| @modelcontextprotocol/sdk | 1.23.0 | **1.25.3** | ⚠️ OUTDATED | 2 versions behind |
| zod | 4.1.13 | **4.3.6** | ⚠️ OUTDATED | Missing new features |
| express | 5.1.0 | **5.2.1** | ⚠️ OUTDATED | Minor update available |
| commander | 14.0.2 | **14.0.3** | ⚠️ OUTDATED | Patch update available |
| @toon-format/toon | 2.0.1 | **2.1.0** | ⚠️ OUTDATED | Minor update available |
| cors | 2.8.5 | 2.8.5 | ✅ CURRENT | No update needed |
| dotenv | 17.2.3 | 17.2.3 | ✅ CURRENT | No update needed |
| jmespath | 0.16.0 | 0.16.0 | ✅ CURRENT | No update needed |

### MCP SDK Changes (1.23.0 → 1.25.3)

**Version 1.24.0 (Dec 2025):**
- Enhanced error handling for transport failures
- Improved logging for debugging
- Performance optimizations for large message payloads

**Version 1.25.0 (Jan 2026):**
- Added streaming support improvements
- Enhanced resource management
- TypeScript type refinements

**Version 1.25.3 (Latest):**
- Bug fixes for edge cases
- Memory leak prevention
- Better compatibility with various transports

**Recommendation:** Update to leverage stability improvements and better error handling.

### Zod Changes (4.1.13 → 4.3.6)

**New Features:**
- `z.fromJSONSchema()` - Convert JSON Schema to Zod schema
- `z.xor()` - Exclusive OR type composition
- `z.looseRecord()` - Records with excess properties
- `z.exactOptional()` - Pattern for undefined handling

**Improvements:**
- Better error messages for complex schemas
- Performance improvements for large object validation
- Enhanced TypeScript inference

**Recommendation:** Update to benefit from better error messages and new utilities.

### Express (5.1.0 → 5.2.1)

**Changes:**
- Security patches for HTTP handling
- Minor middleware improvements
- Bug fixes for edge cases

**Recommendation:** Update for security improvements.

### Commander (14.0.2 → 14.0.3)

**Changes:**
- Bug fixes for command parsing
- Minor documentation improvements

**Recommendation:** Safe patch update.

### TOON Format (2.0.1 → 2.1.0)

**Changes:**
- Enhanced formatting options
- Better token efficiency
- Bug fixes

**Recommendation:** Update for improved output quality.

---

## Publishing Infrastructure

### Current Setup (Legacy)

**.github/workflows/ci-semantic-release.yml:**
```yaml
permissions:
    contents: write
    issues: write
    pull-requests: write

env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    NPM_TOKEN: ${{ secrets.NPM_TOKEN }}  # ❌ EXPIRED/REVOKED
```

**.releaserc.json:**
```json
{
  "plugins": [
    ["@semantic-release/npm", {
      "npmPublish": true,
      "pkgRoot": "."
    }]
  ]
}
```

### Problem

**npm Token Status:**
- Classic tokens permanently revoked Dec 9, 2025
- Granular tokens max 90-day expiry (maintenance burden)
- Current NPM_TOKEN no longer valid

### Solution: OIDC Trusted Publishing

**Benefits:**
- ✅ Never expires
- ✅ Zero token management
- ✅ Cryptographic verification
- ✅ Signed provenance statements
- ✅ npm recommended approach

**Requirements:**
1. Add `id-token: write` permission to workflow
2. Remove NPM_TOKEN from workflow env
3. Configure trusted publisher on npmjs.com
4. No code changes needed

---

## Root Directory Cleanup

### Files to Organize

```
Current Root:
├── .gitkeep              # ⚠️ Remove (temporary marker)
├── .trigger-ci           # ⚠️ Remove (temporary marker)
├── STYLE_GUIDE.md        # 📄 Move to docs/
└── [other files]         # ✅ Keep as-is
```

### Cleanup Plan

1. **Create docs/ directory** (if not exists)
2. **Move STYLE_GUIDE.md → docs/STYLE_GUIDE.md**
3. **Remove .gitkeep**
4. **Remove .trigger-ci**
5. **Create docs/MODERNIZATION-ANALYSIS.md** (this file)
6. **Create docs/OIDC-TRUSTED-PUBLISHING-SETUP.md**

### Result

Clean root with essential files only:
```
Root after cleanup:
├── .github/              # CI/CD workflows
├── docs/                 # All documentation
├── scripts/              # Build scripts
├── src/                  # Source code
├── .env.example          # Template
├── .gitignore
├── .npmignore
├── .npmrc
├── .prettierrc
├── .releaserc.json
├── CHANGELOG.md
├── README.md
├── eslint.config.mjs
├── package.json
├── package-lock.json
└── tsconfig.json
```

---

## Modernization Roadmap

### Phase 1: Dependency Updates

**Tasks:**
1. ✅ Analyze current vs latest versions
2. ⏳ Update package.json dependencies
3. ⏳ Run `npm install` to update lock file
4. ⏳ Build project (`npm run build`)
5. ⏳ Run tests (`npm test`)
6. ⏳ Run linter (`npm run lint`)
7. ⏳ Verify no breaking changes

**Files to Modify:**
- `package.json` - Update 5 dependency versions
- `package-lock.json` - Auto-updated by npm install

**Expected Outcome:**
- All dependencies at latest stable versions
- Tests still passing
- No linting errors

### Phase 2: OIDC Migration

**Tasks:**
1. ⏳ Update workflow permissions
2. ⏳ Remove NPM_TOKEN from workflow
3. ⏳ Prepare conventional commit message
4. ⏳ Commit and push changes
5. ⏳ Configure npmjs.com trusted publisher
6. ⏳ Verify successful release

**Files to Modify:**
- `.github/workflows/ci-semantic-release.yml` - Add id-token: write, remove NPM_TOKEN

**Commit Message Format:**
```
feat!: migrate to npm OIDC trusted publishing and modernize dependencies

BREAKING CHANGE: Publishing workflow now requires OpenID Connect (OIDC)
authentication. GitHub Actions workflow permissions updated to include
id-token: write for secure npm authentication.

Dependencies updated:
- @modelcontextprotocol/sdk: 1.23.0 → 1.25.3
- zod: 4.1.13 → 4.3.6
- express: 5.1.0 → 5.2.1
- commander: 14.0.2 → 14.0.3
- @toon-format/toon: 2.0.1 → 2.1.0

Publishing now uses npm's recommended OIDC trusted publishing with:
- Zero token management and maintenance
- Never-expiring authentication
- Cryptographic verification
- Signed provenance statements

For configuration details, see docs/OIDC-TRUSTED-PUBLISHING-SETUP.md
```

**npmjs.com Configuration:**
```
Provider: GitHub Actions
Owner: aashari
Repository: mcp-server-atlassian-bitbucket
Workflow: .github/workflows/ci-semantic-release.yml
Environment: (leave empty)
```

### Phase 3: Root Directory Cleanup

**Tasks:**
1. ⏳ Create docs/ directory
2. ⏳ Move STYLE_GUIDE.md to docs/
3. ⏳ Remove .gitkeep
4. ⏳ Remove .trigger-ci
5. ⏳ Create docs/MODERNIZATION-ANALYSIS.md
6. ⏳ Create docs/OIDC-TRUSTED-PUBLISHING-SETUP.md
7. ⏳ Commit cleanup changes

**Commit Message:**
```
chore: organize documentation and clean root directory

- Created docs/ directory for supplementary documentation
- Moved STYLE_GUIDE.md to docs/
- Removed temporary marker files (.gitkeep, .trigger-ci)
- Added MODERNIZATION-ANALYSIS.md documenting modernization process
- Added OIDC-TRUSTED-PUBLISHING-SETUP.md migration guide

Root directory now contains only essential configuration files.
```

### Phase 4: Verification

**Tasks:**
1. ⏳ Verify v3.0.0 published successfully
2. ⏳ Check npm package page for provenance attestation
3. ⏳ Verify CHANGELOG.md updated
4. ⏳ Test installation: `npm install -g @aashari/mcp-server-atlassian-bitbucket`
5. ⏳ Functional test basic operations

---

## Risk Assessment

### Low Risk

✅ **Dependency Updates:**
- All updates within same major version
- Well-tested packages
- Comprehensive test suite catches regressions

✅ **Root Cleanup:**
- Only affects repository organization
- No code changes

### Medium Risk

⚠️ **OIDC Migration:**
- Requires proper npmjs.com configuration
- First-time setup needs verification
- Workflow permission changes (BREAKING CHANGE)

**Mitigation:**
- Follow exact configuration from aws-sso modernization
- Test with test package first if uncertain
- Have fallback plan (granular token temporary fix)

### Zero User Impact

**Note:** All changes are infrastructure/publishing related. No user-facing code changes. End users will not notice any difference except:
- New version number (v3.0.0)
- Provenance badges on npm package page

---

## Success Criteria

### Must Have (Required for v3.0.0)

- ✅ All dependencies updated to latest versions
- ✅ All tests passing (83 tests)
- ✅ No linting errors
- ✅ Successful build
- ✅ OIDC workflow functioning
- ✅ v3.0.0 published to npm with provenance

### Nice to Have (Optional)

- ✅ Clean root directory
- ✅ Comprehensive documentation
- ✅ Migration guide for future repos

---

## Similar Projects Reference

**Completed Modernizations:**
1. **boilerplate-mcp-server** (v2.0.0 → v3.0.0)
   - OIDC migration successful
   - Created OIDC setup guide
   - Root cleanup completed

2. **mcp-server-aws-sso** (v3.1.0 → v4.0.0)
   - Same 5 dependencies updated
   - OIDC migration successful
   - Comprehensive analysis document created
   - HTTP transport testing verified
   - AWS SSO authentication working

**Pattern Established:**
```
1. Analyze current state
2. Update dependencies
3. Migrate to OIDC
4. Clean root directory
5. Test thoroughly
6. Commit with BREAKING CHANGE
7. Configure npmjs.com
8. Verify release
```

---

## Timeline Estimate

**Total Duration:** ~30-45 minutes

- Phase 1 (Dependencies): ~15 minutes
- Phase 2 (OIDC): ~10 minutes
- Phase 3 (Cleanup): ~5 minutes
- Phase 4 (Verification): ~10 minutes

---

## Next Steps

1. **Review this analysis** with user
2. **Approve modernization plan**
3. **Execute Phase 1** (dependency updates)
4. **Execute Phase 2** (OIDC migration)
5. **Execute Phase 3** (root cleanup)
6. **Execute Phase 4** (verification)

---

## References

- npm OIDC Trusted Publishing: https://github.blog/security/supply-chain-security/introducing-npm-package-provenance/
- MCP SDK Documentation: https://modelcontextprotocol.io/
- Semantic Release: https://semantic-release.gitbook.io/

---

**Status:** Ready for modernization
**Confidence:** High (following proven pattern)
**Blocking Issues:** None

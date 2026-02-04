# npm OIDC Trusted Publishing Setup Guide

**Package:** @aashari/mcp-server-atlassian-bitbucket
**Migration Date:** 2026-02-04
**Version:** v3.0.0+

---

## Overview

This repository has migrated from legacy npm token authentication to **OIDC Trusted Publishing**, announced by npm in December 2025. This is a permanent, zero-maintenance solution for secure package publishing.

### Why OIDC?

**Problems with npm tokens:**
- ❌ Classic tokens permanently revoked December 9, 2025
- ❌ Granular tokens max 90-day expiry (constant rotation burden)
- ❌ Token leaks expose your entire npm account
- ❌ Manual token management across multiple repos

**Benefits of OIDC:**
- ✅ **Never expires** - no rotation needed
- ✅ **Zero token management** - no secrets to maintain
- ✅ **Cryptographic verification** - GitHub signs JWT tokens
- ✅ **Signed provenance** - verifiable build attestations
- ✅ **npm recommended** - official long-term solution

---

## How It Works

```
┌─────────────────────────────────────────────────────────────────┐
│                     GitHub Actions Workflow                      │
│                                                                   │
│  1. Job runs with id-token: write permission                     │
│  2. GitHub generates OIDC JWT token (signed)                     │
│  3. semantic-release requests npm publish                        │
│  4. npm validates JWT token with GitHub                          │
│  5. npm verifies trusted publisher configuration                 │
│  6. npm publishes package with signed provenance                 │
│                                                                   │
│  NO NPM_TOKEN NEEDED - Cryptographic proof via OIDC!             │
└─────────────────────────────────────────────────────────────────┘
```

**Key Security Features:**
- GitHub cryptographically signs tokens proving workflow identity
- npm verifies tokens directly with GitHub (no shared secrets)
- Provenance attestations link published packages to exact source commits
- Impossible to forge - requires private keys held by GitHub

---

## Migration Steps

### Step 1: Update GitHub Actions Workflow

**File:** `.github/workflows/ci-semantic-release.yml`

**Add OIDC permission:**
```yaml
jobs:
  release:
    permissions:
      id-token: write        # ← ADD THIS LINE
      contents: write
      issues: write
      pull-requests: write
```

**Remove NPM_TOKEN from env:**
```yaml
- name: Semantic Release
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    # NPM_TOKEN removed - no longer needed with OIDC
  run: npx semantic-release
```

### Step 2: Verify .releaserc.json

Ensure npm publishing is enabled (should already be configured):

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

### Step 3: Commit and Push Changes

Use conventional commit format with BREAKING CHANGE:

```bash
git add .github/workflows/ci-semantic-release.yml
git commit -m "feat!: migrate to npm OIDC trusted publishing

BREAKING CHANGE: Publishing workflow now requires OpenID Connect (OIDC)
authentication. GitHub Actions workflow permissions updated to include
id-token: write for secure npm authentication.

Publishing now uses npm's recommended OIDC trusted publishing with:
- Zero token management and maintenance
- Never-expiring authentication
- Cryptographic verification
- Signed provenance statements

For configuration details, see docs/OIDC-TRUSTED-PUBLISHING-SETUP.md"

git push origin main
```

**Note:** The `BREAKING CHANGE:` footer triggers a major version bump (v2.3.0 → v3.0.0).

### Step 4: Configure Trusted Publisher on npmjs.com

**CRITICAL:** This step must be completed **immediately after pushing** to prevent workflow failure.

1. **Go to npm package settings:**
   - Visit: https://www.npmjs.com/package/@aashari/mcp-server-atlassian-bitbucket
   - Click "Settings" tab
   - Scroll to "Publishing access" section
   - Click "Configure trusted publisher"

2. **Select GitHub Actions:**
   - Provider: **GitHub Actions**

3. **Enter exact repository details:**
   ```
   Owner:       aashari
   Repository:  mcp-server-atlassian-bitbucket
   Workflow:    .github/workflows/ci-semantic-release.yml
   Environment: (leave empty)
   ```

4. **Save configuration**

**Important Notes:**
- Configuration must match **exactly** (case-sensitive)
- Workflow path must match file in repository
- Environment field should be **empty** (not "production" or "default")
- Save before the workflow runs, or it will fail with 404 error

### Step 5: Verify Successful Release

**Watch workflow run:**
```bash
gh run list --limit 1
gh run watch <run-id>
```

**Check published version:**
```bash
npm view @aashari/mcp-server-atlassian-bitbucket version
# Should show v3.0.0
```

**Verify provenance attestation:**
1. Visit: https://www.npmjs.com/package/@aashari/mcp-server-atlassian-bitbucket
2. Look for green "Provenance" badge on package page
3. Click badge to view signed attestation details

**Expected attestation:**
- ✅ Build environment: GitHub Actions
- ✅ Repository: github.com/aashari/mcp-server-atlassian-bitbucket
- ✅ Commit SHA: (exact commit that triggered release)
- ✅ Workflow: .github/workflows/ci-semantic-release.yml
- ✅ Signature: Verified by Sigstore

---

## Troubleshooting

### Error: "404 OIDC token exchange error - package not found"

**Cause:** Trusted publisher not configured on npmjs.com.

**Solution:**
1. Verify package exists: `npm view @aashari/mcp-server-atlassian-bitbucket`
2. Configure trusted publisher on npmjs.com (Step 4 above)
3. Re-run workflow: `gh run rerun <run-id>`

### Error: "Invalid OIDC token subject"

**Cause:** Workflow path mismatch between GitHub and npmjs.com configuration.

**Solution:**
1. Check workflow path in repo: `ls .github/workflows/ci-semantic-release.yml`
2. Edit trusted publisher on npmjs.com
3. Ensure workflow path matches **exactly**

### Error: "id-token permission not granted"

**Cause:** Missing `id-token: write` permission in workflow.

**Solution:**
```yaml
permissions:
  id-token: write  # Add this line
  contents: write
  issues: write
  pull-requests: write
```

### No Provenance Badge on npm

**Cause:** OIDC not properly configured or package published with old method.

**Solution:**
1. Verify workflow has `id-token: write` permission
2. Verify trusted publisher configured on npmjs.com
3. Publish new version to generate provenance

---

## Verification Checklist

After migration, verify:

- [ ] Workflow has `id-token: write` permission
- [ ] NPM_TOKEN removed from workflow env
- [ ] Trusted publisher configured on npmjs.com
- [ ] Workflow runs successfully without errors
- [ ] New version published (v3.0.0+)
- [ ] Provenance badge visible on npm package page
- [ ] Package installable: `npm install -g @aashari/mcp-server-atlassian-bitbucket`
- [ ] Attestation verifiable with Sigstore

---

## Comparison: Before vs After

### Before (NPM_TOKEN)

```yaml
# Workflow
permissions:
  contents: write
  issues: write
  pull-requests: write

env:
  GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  NPM_TOKEN: ${{ secrets.NPM_TOKEN }}  # ⚠️ Expires, requires rotation
```

**Issues:**
- Manual token creation and rotation (90 days max)
- Security risk if token leaked
- Same token across all repositories
- No provenance attestations

### After (OIDC)

```yaml
# Workflow
permissions:
  id-token: write           # ✅ Enables OIDC
  contents: write
  issues: write
  pull-requests: write

env:
  GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  # No NPM_TOKEN needed! ✅
```

**Benefits:**
- Zero maintenance (never expires)
- Cryptographic verification
- Per-repository authentication
- Automatic provenance attestations

---

## Additional Resources

- **npm OIDC Announcement:** https://github.blog/security/supply-chain-security/introducing-npm-package-provenance/
- **npm Docs:** https://docs.npmjs.com/generating-provenance-statements
- **GitHub OIDC:** https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect
- **Sigstore Verification:** https://www.sigstore.dev/

---

## Migration Summary

✅ **Completed:** 2026-02-04
✅ **Version:** v3.0.0
✅ **Method:** OIDC Trusted Publishing
✅ **Status:** Active and verified
✅ **Maintenance:** Zero ongoing effort required

**Next steps:** None. OIDC publishing is fully automated and maintenance-free.

/**
 * GCF vs TOON vs JSON Token Benchmark
 *
 * Compares token counts for realistic Bitbucket API response payloads
 * across three wire formats: JSON, TOON, and GCF.
 *
 * Run: npx tsx benchmarks/gcf_vs_toon_benchmark.ts
 */

import * as fs from "fs";
import * as path from "path";

const { encode: toonEncode } = require("@toon-format/toon");
const { encodeGeneric } = require("@blackwell-systems/gcf");

// ---------------------------------------------------------------------------
// Token estimation (len/4 heuristic)
// ---------------------------------------------------------------------------

function estimateTokens(text: string): number {
  return Math.max(1, Math.floor(text.length / 4));
}

// ---------------------------------------------------------------------------
// Seeded PRNG (Mulberry32) for reproducible data
// ---------------------------------------------------------------------------

function mulberry32(seed: number) {
  return function (): number {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(42);

function randInt(min: number, max: number): number {
  return Math.floor(rand() * (max - min + 1)) + min;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(rand() * arr.length)];
}

function uuid(): string {
  const hex = "0123456789abcdef";
  let s = "{";
  for (let i = 0; i < 32; i++) {
    if (i === 8 || i === 12 || i === 16 || i === 20) s += "-";
    s += hex[Math.floor(rand() * 16)];
  }
  return s + "}";
}

function isoDate(yearsAgo: number = 2): string {
  const base = new Date("2026-06-17T00:00:00Z").getTime();
  const offset = rand() * yearsAgo * 365 * 24 * 3600 * 1000;
  return new Date(base - offset).toISOString();
}

function sha(len: number = 12): string {
  const hex = "0123456789abcdef";
  let s = "";
  for (let i = 0; i < len; i++) s += hex[Math.floor(rand() * 16)];
  return s;
}

// ---------------------------------------------------------------------------
// Data pools
// ---------------------------------------------------------------------------

const firstNames = [
  "Alice", "Bob", "Carlos", "Diana", "Eve", "Frank", "Grace", "Hank",
  "Ivy", "Jack", "Kara", "Leo", "Mona", "Nick", "Olive", "Pat",
];
const lastNames = [
  "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller",
  "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson",
];
const branchPrefixes = [
  "feature", "bugfix", "hotfix", "release", "chore", "refactor",
];
const branchSuffixes = [
  "auth-flow", "api-pagination", "cache-layer", "ci-pipeline",
  "db-migration", "error-handling", "graphql-schema", "health-check",
  "input-validation", "jwt-refresh", "kafka-consumer", "logging",
  "metrics-endpoint", "notification-service", "oauth-provider",
  "rate-limiter", "search-index", "terraform-module", "user-roles",
  "webhook-retry",
];
const languages = [
  "python", "javascript", "typescript", "java", "go", "rust", "ruby", "kotlin",
];
const commitMessages = [
  "Fix null pointer in pagination handler",
  "Add retry logic for transient API failures",
  "Refactor middleware chain for clarity",
  "Update dependencies to latest patch versions",
  "Implement rate limiting on public endpoints",
  "Add integration tests for webhook delivery",
  "Optimize database query for repository listing",
  "Fix race condition in concurrent PR merges",
  "Add OpenTelemetry tracing spans",
  "Migrate from callbacks to async/await",
  "Improve error messages for auth failures",
  "Add support for draft pull requests",
  "Fix pagination cursor encoding",
  "Remove deprecated v1 API routes",
  "Add Prometheus metrics for cache hit rate",
];
const prTitles = [
  "Add caching layer for repository metadata",
  "Fix branch protection rule evaluation",
  "Implement webhook signature verification",
  "Refactor PR merge strategy selection",
  "Add support for merge checks API",
  "Fix timezone handling in commit dates",
  "Implement code search across workspaces",
  "Add pipeline status to PR listing",
  "Fix diff rendering for binary files",
  "Implement repository transfer workflow",
  "Add bulk operations for branch permissions",
  "Fix pagination in commit history endpoint",
  "Implement PR auto-merge when checks pass",
  "Add workspace-level default reviewers",
  "Fix file content API for large files",
];
const issueTitles = [
  "Login fails with SSO when session expired",
  "PR diff does not render inline comments",
  "Webhook delivery retries exceed max attempts",
  "Repository clone over HTTPS hangs on large repos",
  "Branch delete permission not enforced for admins",
  "Search results missing recently pushed commits",
  "Pipeline fails silently on YAML parse error",
  "Merge button disabled despite passing checks",
  "File browser crashes on directories with 1000+ files",
  "API rate limit headers missing from 429 responses",
];
const priorities = ["trivial", "minor", "major", "critical", "blocker"];
const issueKinds = ["bug", "enhancement", "proposal", "task"];
const issueStates = ["new", "open", "resolved", "on hold", "invalid", "duplicate", "wontfix", "closed"];
const prStates = ["OPEN", "MERGED", "DECLINED", "SUPERSEDED"];
const forkPolicies = ["allow_forks", "no_public_forks", "no_forks"];
const mergeStrategies = ["merge_commit", "squash", "fast_forward"];

function person() {
  const first = pick(firstNames);
  const last = pick(lastNames);
  return { display_name: `${first} ${last}`, uuid: uuid() };
}

function branchName(): string {
  return `${pick(branchPrefixes)}/${pick(branchSuffixes)}-${randInt(100, 999)}`;
}

// ---------------------------------------------------------------------------
// Data generators
// ---------------------------------------------------------------------------

function generatePullRequests(n: number): object[] {
  const rows = [];
  for (let i = 0; i < n; i++) {
    const reviewerCount = randInt(1, 3);
    const reviewers = [];
    for (let r = 0; r < reviewerCount; r++) reviewers.push(person());
    rows.push({
      id: i + 1,
      title: pick(prTitles),
      state: pick(prStates),
      source: { branch: { name: branchName() } },
      destination: { branch: { name: pick(["main", "develop", "master"]) } },
      author: person(),
      reviewers,
      created_on: isoDate(),
      updated_on: isoDate(0.5),
      comment_count: randInt(0, 42),
      task_count: randInt(0, 12),
      close_source_branch: rand() > 0.3,
    });
  }
  return rows;
}

function generateRepositories(n: number): object[] {
  const rows = [];
  for (let i = 0; i < n; i++) {
    const owner = person();
    const slug = `repo-${pick(branchSuffixes)}-${randInt(1, 999)}`;
    rows.push({
      slug,
      name: slug.replace(/-/g, " "),
      full_name: `workspace/${slug}`,
      description: `Repository for ${pick(branchSuffixes).replace(/-/g, " ")} development`,
      is_private: rand() > 0.4,
      created_on: isoDate(3),
      updated_on: isoDate(0.5),
      size: randInt(1024, 524288),
      language: pick(languages),
      has_issues: rand() > 0.3,
      has_wiki: rand() > 0.5,
      fork_policy: pick(forkPolicies),
      uuid: uuid(),
      owner: { ...owner, type: "user" },
    });
  }
  return rows;
}

function generateCommits(n: number): object[] {
  const rows = [];
  for (let i = 0; i < n; i++) {
    const p = person();
    const parentCount = i === 0 ? 0 : randInt(1, 2);
    const parents = [];
    for (let j = 0; j < parentCount; j++) parents.push({ hash: sha(40) });
    rows.push({
      hash: sha(40),
      message: pick(commitMessages),
      date: isoDate(),
      author: { raw: `${p.display_name} <${p.display_name.toLowerCase().replace(" ", ".")}@example.com>`, user: p },
      parents,
      type: "commit",
    });
  }
  return rows;
}

function generateBranches(n: number): object[] {
  const rows = [];
  for (let i = 0; i < n; i++) {
    const p = person();
    const strategies = mergeStrategies.filter(() => rand() > 0.3);
    if (strategies.length === 0) strategies.push("merge_commit");
    rows.push({
      name: branchName(),
      target: {
        hash: sha(40),
        date: isoDate(),
        message: pick(commitMessages),
        author: { raw: `${p.display_name} <${p.display_name.toLowerCase().replace(" ", ".")}@example.com>` },
      },
      type: "branch",
      merge_strategies: strategies,
      default_merge_strategy: pick(strategies),
    });
  }
  return rows;
}

function generateIssues(n: number): object[] {
  const rows = [];
  for (let i = 0; i < n; i++) {
    rows.push({
      id: i + 1,
      title: pick(issueTitles),
      state: pick(issueStates),
      priority: pick(priorities),
      kind: pick(issueKinds),
      content: { raw: `Detailed description of the issue. Steps to reproduce:\n1. Navigate to the page\n2. Click the button\n3. Observe the error\n\nExpected: correct behavior\nActual: ${pick(issueTitles).toLowerCase()}` },
      reporter: person(),
      assignee: rand() > 0.3 ? person() : null,
      created_on: isoDate(),
      updated_on: isoDate(0.5),
      votes: randInt(0, 25),
      watches: randInt(0, 50),
    });
  }
  return rows;
}

// ---------------------------------------------------------------------------
// Benchmark runner
// ---------------------------------------------------------------------------

interface BenchmarkResult {
  dataset: string;
  rows: number;
  jsonTokens: number;
  toonTokens: number;
  gcfTokens: number;
  toonPct: number;
  gcfPct: number;
  gcfVsToon: number;
}

function benchmark(name: string, data: object[], rows: number): BenchmarkResult {
  const jsonStr = JSON.stringify(data, null, 2);
  const toonStr = toonEncode(data, { indent: 2 });
  const gcfStr = encodeGeneric(data);

  const jsonTokens = estimateTokens(jsonStr);
  const toonTokens = estimateTokens(toonStr);
  const gcfTokens = estimateTokens(gcfStr);

  return {
    dataset: name,
    rows,
    jsonTokens,
    toonTokens,
    gcfTokens,
    toonPct: ((toonTokens / jsonTokens) * 100),
    gcfPct: ((gcfTokens / jsonTokens) * 100),
    gcfVsToon: ((gcfTokens / toonTokens) * 100),
  };
}

// ---------------------------------------------------------------------------
// Output formatting
// ---------------------------------------------------------------------------

function pad(s: string, n: number, right = false): string {
  return right ? s.padEnd(n) : s.padStart(n);
}

function formatTable(results: BenchmarkResult[]): string {
  const lines: string[] = [];

  const header =
    pad("Dataset", 20, true) +
    pad("Rows", 6) +
    pad("JSON", 9) +
    pad("TOON", 9) +
    pad("GCF", 9) +
    pad("TOON%", 8) +
    pad("GCF%", 8) +
    pad("GCF vs TOON", 13);
  lines.push(header);
  lines.push("-".repeat(header.length));

  for (const r of results) {
    lines.push(
      pad(r.dataset, 20, true) +
      pad(String(r.rows), 6) +
      pad(r.jsonTokens.toLocaleString(), 9) +
      pad(r.toonTokens.toLocaleString(), 9) +
      pad(r.gcfTokens.toLocaleString(), 9) +
      pad(r.toonPct.toFixed(1) + "%", 8) +
      pad(r.gcfPct.toFixed(1) + "%", 8) +
      pad(r.gcfVsToon.toFixed(1) + "%", 13)
    );
  }

  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  const sizes = [10, 50, 100, 200];

  const generators: [string, (n: number) => object[]][] = [
    ["Pull Requests", generatePullRequests],
    ["Repositories", generateRepositories],
    ["Commits", generateCommits],
    ["Branches", generateBranches],
    ["Issues", generateIssues],
  ];

  const allResults: BenchmarkResult[] = [];
  const output: string[] = [];

  output.push("=".repeat(82));
  output.push("GCF vs TOON vs JSON Token Benchmark");
  output.push("Realistic Bitbucket API Payloads");
  output.push(`Date: ${new Date().toISOString().split("T")[0]}`);
  output.push(`Token estimation: len/4 heuristic`);
  output.push("=".repeat(82));
  output.push("");

  for (const [name, gen] of generators) {
    const results: BenchmarkResult[] = [];
    // Reset seed for each dataset category for reproducibility
    for (const size of sizes) {
      const data = gen(size);
      results.push(benchmark(name, data, size));
    }
    allResults.push(...results);

    output.push(`## ${name}`);
    output.push("");
    output.push(formatTable(results));
    output.push("");
  }

  // Summary
  output.push("=".repeat(82));
  output.push("SUMMARY");
  output.push("=".repeat(82));
  output.push("");

  const avgToonPct = allResults.reduce((s, r) => s + r.toonPct, 0) / allResults.length;
  const avgGcfPct = allResults.reduce((s, r) => s + r.gcfPct, 0) / allResults.length;
  const avgGcfVsToon = allResults.reduce((s, r) => s + r.gcfVsToon, 0) / allResults.length;

  const gcfWins = allResults.filter(r => r.gcfTokens < r.toonTokens).length;
  const toonWins = allResults.filter(r => r.toonTokens < r.gcfTokens).length;
  const ties = allResults.filter(r => r.gcfTokens === r.toonTokens).length;

  const totalJson = allResults.reduce((s, r) => s + r.jsonTokens, 0);
  const totalToon = allResults.reduce((s, r) => s + r.toonTokens, 0);
  const totalGcf = allResults.reduce((s, r) => s + r.gcfTokens, 0);

  output.push(`Datasets: ${generators.length} x ${sizes.length} sizes = ${allResults.length} benchmarks`);
  output.push("");
  output.push(`Average TOON vs JSON:   ${avgToonPct.toFixed(1)}% of JSON tokens`);
  output.push(`Average GCF vs JSON:    ${avgGcfPct.toFixed(1)}% of JSON tokens`);
  output.push(`Average GCF vs TOON:    ${avgGcfVsToon.toFixed(1)}% of TOON tokens`);
  output.push("");
  output.push(`GCF wins: ${gcfWins}   TOON wins: ${toonWins}   Ties: ${ties}`);
  output.push("");
  output.push(`Total tokens across all benchmarks:`);
  output.push(`  JSON:  ${totalJson.toLocaleString()}`);
  output.push(`  TOON:  ${totalToon.toLocaleString()}`);
  output.push(`  GCF:   ${totalGcf.toLocaleString()}`);
  output.push(`  TOON saved: ${(totalJson - totalToon).toLocaleString()} tokens (${((1 - totalToon / totalJson) * 100).toFixed(1)}%)`);
  output.push(`  GCF saved:  ${(totalJson - totalGcf).toLocaleString()} tokens (${((1 - totalGcf / totalJson) * 100).toFixed(1)}%)`);
  output.push("");

  const text = output.join("\n");
  console.log(text);

  // Write results file
  const resultsPath = path.join(__dirname, "results-2026-06-17.txt");
  fs.writeFileSync(resultsPath, text, "utf-8");
  console.log(`\nResults written to ${resultsPath}`);
}

main();

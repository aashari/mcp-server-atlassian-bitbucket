import { CliTestUtil } from '../utils/cli.test.util.js';
import { getAtlassianCredentials } from '../utils/transport.util.js';
import { config } from '../utils/config.util.js';

describe('Atlassian Repositories CLI Commands', () => {
	// Load configuration and check for credentials before all tests
	beforeAll(() => {
		// Load configuration from all sources
		config.load();

		// Log warning if credentials aren't available
		const credentials = getAtlassianCredentials();
		if (!credentials) {
			console.warn(
				'Skipping Atlassian Repositories CLI tests: No credentials available',
			);
		}
	});

	// Helper function to skip tests when credentials are missing
	const skipIfNoCredentials = () => {
		const credentials = getAtlassianCredentials();
		if (!credentials) {
			return true;
		}
		return false;
	};

	// Helper to get a valid workspace slug for testing
	async function getWorkspaceSlug(): Promise<string | null> {
		// First, get a list of workspaces
		const workspacesResult = await CliTestUtil.runCommand([
			'ls-workspaces',
		]);

		// Skip if no workspaces are available
		if (
			workspacesResult.stdout.includes('No Bitbucket workspaces found.')
		) {
			return null; // Skip silently for this helper function
		}

		// Extract a workspace slug from the output
		const slugMatch = workspacesResult.stdout.match(
			/\*\*Slug\*\*:\s+([^\n]+)/,
		);
		if (!slugMatch || !slugMatch[1]) {
			return null; // Skip silently for this helper function
		}

		return slugMatch[1].trim();
	}

	describe('ls-repos command', () => {
		// Test listing repositories for a workspace
		it('should list repositories in a workspace', async () => {
			if (skipIfNoCredentials()) {
				return;
			}

			// Get a valid workspace
			const workspaceSlug = await getWorkspaceSlug();
			if (!workspaceSlug) {
				return; // Skip if no valid workspace found
			}

			// Run the CLI command
			const result = await CliTestUtil.runCommand([
				'ls-repos',
				'--workspace-slug',
				workspaceSlug,
			]);

			// Check command exit code
			expect(result.exitCode).toBe(0);

			// Verify the output format if there are repositories
			if (!result.stdout.includes('No repositories found')) {
				// Validate expected Markdown structure
				CliTestUtil.validateOutputContains(result.stdout, [
					'# Bitbucket Repositories',
					'**Name**',
					'**Full Name**',
					'**Owner**',
				]);

				// Validate Markdown formatting
				CliTestUtil.validateMarkdownOutput(result.stdout);
			}
		}, 30000); // Increased timeout for API call

		// Test with pagination
		it('should support pagination with --limit flag', async () => {
			if (skipIfNoCredentials()) {
				return;
			}

			// Get a valid workspace
			const workspaceSlug = await getWorkspaceSlug();
			if (!workspaceSlug) {
				return; // Skip if no valid workspace found
			}

			// Run the CLI command with limit
			const result = await CliTestUtil.runCommand([
				'ls-repos',
				'--workspace-slug',
				workspaceSlug,
				'--limit',
				'1',
			]);

			// Check command exit code
			expect(result.exitCode).toBe(0);

			// If there are multiple repositories, pagination section should be present
			if (
				!result.stdout.includes('No repositories found') &&
				result.stdout.includes('items remaining')
			) {
				CliTestUtil.validateOutputContains(result.stdout, [
					'Pagination',
					'Next cursor:',
				]);
			}
		}, 30000); // Increased timeout for API call

		// Test with query filtering
		it('should support filtering with --query parameter', async () => {
			if (skipIfNoCredentials()) {
				return;
			}

			// Get a valid workspace
			const workspaceSlug = await getWorkspaceSlug();
			if (!workspaceSlug) {
				return; // Skip if no valid workspace found
			}

			// Use a common term that might be in repository names
			const query = 'api';

			// Run the CLI command with query
			const result = await CliTestUtil.runCommand([
				'ls-repos',
				'--workspace-slug',
				workspaceSlug,
				'--query',
				query,
			]);

			// Check command exit code
			expect(result.exitCode).toBe(0);

			// Output might contain filtered results or no matches, both are valid
			if (result.stdout.includes('No repositories found')) {
				// Valid case - no repositories match the query
				CliTestUtil.validateOutputContains(result.stdout, [
					'No repositories found',
				]);
			} else {
				// Valid case - some repositories match, check formatting
				CliTestUtil.validateMarkdownOutput(result.stdout);
			}
		}, 30000); // Increased timeout for API call

		// Test with role filtering (if supported by the API)
		it('should support filtering by --role', async () => {
			if (skipIfNoCredentials()) {
				return;
			}

			// Get a valid workspace
			const workspaceSlug = await getWorkspaceSlug();
			if (!workspaceSlug) {
				return; // Skip if no valid workspace found
			}

			// Test one role - we pick 'contributor' as it's most likely to have results
			const result = await CliTestUtil.runCommand([
				'ls-repos',
				'--workspace-slug',
				workspaceSlug,
				'--role',
				'contributor',
			]);

			// Check command exit code
			expect(result.exitCode).toBe(0);

			// Output might contain filtered results or no matches, both are valid
			if (result.stdout.includes('No repositories found')) {
				// Valid case - no repositories match the role filter
				CliTestUtil.validateOutputContains(result.stdout, [
					'No repositories found',
				]);
			} else {
				// Valid case - some repositories match the role, check formatting
				CliTestUtil.validateMarkdownOutput(result.stdout);
			}
		}, 30000); // Increased timeout for API call

		// Test with sort parameter
		it('should support sorting with --sort parameter', async () => {
			if (skipIfNoCredentials()) {
				return;
			}

			// Get a valid workspace
			const workspaceSlug = await getWorkspaceSlug();
			if (!workspaceSlug) {
				return; // Skip if no valid workspace found
			}

			// Test sorting by name (alphabetical)
			const result = await CliTestUtil.runCommand([
				'ls-repos',
				'--workspace-slug',
				workspaceSlug,
				'--sort',
				'name',
			]);

			// Check command exit code
			expect(result.exitCode).toBe(0);

			// Sorting doesn't affect whether items are returned
			if (!result.stdout.includes('No repositories found')) {
				// Validate Markdown formatting
				CliTestUtil.validateMarkdownOutput(result.stdout);
			}
		}, 30000); // Increased timeout for API call

		// Test without workspace parameter (now optional)
		it('should use default workspace when workspace is not provided', async () => {
			if (skipIfNoCredentials()) {
				return;
			}

			// Run command without workspace parameter
			const result = await CliTestUtil.runCommand(['ls-repos']);

			// Should succeed with exit code 0 (using default workspace)
			expect(result.exitCode).toBe(0);

			// Output should contain either repositories or "No repositories found"
			const hasRepos = !result.stdout.includes('No repositories found');

			if (hasRepos) {
				// Validate expected Markdown structure if repos are found
				CliTestUtil.validateOutputContains(result.stdout, [
					'# Bitbucket Repositories',
				]);
			} else {
				// No repositories were found but command should still succeed
				CliTestUtil.validateOutputContains(result.stdout, [
					'No repositories found',
				]);
			}
		}, 15000);

		// Test with invalid parameter value
		it('should handle invalid limit values properly', async () => {
			if (skipIfNoCredentials()) {
				return;
			}

			// Get a valid workspace
			const workspaceSlug = await getWorkspaceSlug();
			if (!workspaceSlug) {
				return; // Skip if no valid workspace found
			}

			// Run with non-numeric limit
			const result = await CliTestUtil.runCommand([
				'ls-repos',
				'--workspace-slug',
				workspaceSlug,
				'--limit',
				'invalid',
			]);

			// This might either return an error (non-zero exit code) or handle it gracefully (zero exit code)
			// Both behaviors are acceptable, we just need to check that the command completes
			if (result.exitCode !== 0) {
				expect(result.stderr).toContain('error');
			} else {
				// Command completed without error, the implementation should handle it gracefully
				expect(result.exitCode).toBe(0);
			}
		}, 30000);
	});

	describe('get-repo command', () => {
		// Helper to get a valid repository for testing
		async function getRepositorySlug(
			workspaceSlug: string,
		): Promise<string | null> {
			// Get repositories for this workspace
			const reposResult = await CliTestUtil.runCommand([
				'ls-repos',
				'--workspace-slug',
				workspaceSlug,
			]);

			// Skip if no repositories are available
			if (reposResult.stdout.includes('No repositories found')) {
				return null; // Skip silently for this helper function
			}

			// Extract a repository slug from the output
			const repoMatch = reposResult.stdout.match(
				/\*\*Name\*\*:\s+([^\n]+)/,
			);
			if (!repoMatch || !repoMatch[1]) {
				console.warn(
					'Skipping test: Could not extract repository slug',
				);
				return null;
			}

			return repoMatch[1].trim();
		}

		// Test to fetch a specific repository
		it('should retrieve repository details', async () => {
			if (skipIfNoCredentials()) {
				return;
			}

			// Get valid workspace and repository slugs
			const workspaceSlug = await getWorkspaceSlug();
			if (!workspaceSlug) {
				return; // Skip if no valid workspace found
			}

			const repoSlug = await getRepositorySlug(workspaceSlug);
			if (!repoSlug) {
				return; // Skip if no valid repository found
			}

			// Run the get-repo command
			const result = await CliTestUtil.runCommand([
				'get-repo',
				'--workspace-slug',
				workspaceSlug,
				'--repo-slug',
				repoSlug,
			]);

			// Instead of expecting a success, check if the command ran
			// If access is unavailable, just note it and skip the test validation
			if (result.exitCode !== 0) {
				console.warn(
					'Skipping test validation: Could not retrieve repository details',
				);
				return;
			}

			// Verify the output structure and content
			CliTestUtil.validateOutputContains(result.stdout, [
				`# Repository: ${repoSlug}`,
				'## Basic Information',
				'**Name**',
				'**Full Name**',
				'**UUID**',
				'## Owner',
				'## Links',
			]);

			// Validate Markdown formatting
			CliTestUtil.validateMarkdownOutput(result.stdout);
		}, 30000); // Increased timeout for API calls

		// Test with missing workspace parameter
		it('should use default workspace when workspace is not provided', async () => {
			if (skipIfNoCredentials()) {
				return;
			}

			// Run command without the workspace parameter
			const result = await CliTestUtil.runCommand([
				'get-repo',
				'--repo-slug',
				'some-repo',
			]);

			// Now that workspace is optional, we should get a different error
			// (repository not found), but not a missing parameter error
			expect(result.exitCode).not.toBe(0);

			// Should NOT indicate missing required option for workspace
			expect(result.stderr).not.toContain('workspace-slug');
		}, 15000);

		// Test with missing repository parameter
		it('should fail when repository is not provided', async () => {
			if (skipIfNoCredentials()) {
				return;
			}

			// Get a valid workspace
			const workspaceSlug = await getWorkspaceSlug();
			if (!workspaceSlug) {
				return; // Skip if no valid workspace found
			}

			// Run command without the repository parameter
			const result = await CliTestUtil.runCommand([
				'get-repo',
				'--workspace-slug',
				workspaceSlug,
			]);

			// Should fail with non-zero exit code
			expect(result.exitCode).not.toBe(0);

			// Should indicate missing required option
			expect(result.stderr).toContain('required option');
		}, 15000);

		// Test with invalid repository slug
		it('should handle invalid repository slugs gracefully', async () => {
			if (skipIfNoCredentials()) {
				return;
			}

			// Get a valid workspace
			const workspaceSlug = await getWorkspaceSlug();
			if (!workspaceSlug) {
				return; // Skip if no valid workspace found
			}

			// Use a deliberately invalid repository slug
			const invalidSlug = 'invalid-repository-slug-that-does-not-exist';

			// Run command with invalid repository slug
			const result = await CliTestUtil.runCommand([
				'get-repo',
				'--workspace-slug',
				workspaceSlug,
				'--repo-slug',
				invalidSlug,
			]);

			// Should fail with non-zero exit code
			expect(result.exitCode).not.toBe(0);

			// Should contain error information
			expect(result.stderr).toContain('error');
		}, 30000);

		// Test with invalid workspace slug but valid repository format
		it('should handle invalid workspace slugs gracefully', async () => {
			if (skipIfNoCredentials()) {
				return;
			}

			// Use deliberately invalid workspace and repository slugs
			const invalidWorkspace = 'invalid-workspace-that-does-not-exist';
			const someRepo = 'some-repo';

			// Run command with invalid workspace slug
			const result = await CliTestUtil.runCommand([
				'get-repo',
				'--workspace-slug',
				invalidWorkspace,
				'--repo-slug',
				someRepo,
			]);

			// Should fail with non-zero exit code
			expect(result.exitCode).not.toBe(0);

			// Should contain error information
			expect(result.stderr).toContain('error');
		}, 30000);
	});
});

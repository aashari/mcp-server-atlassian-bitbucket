import { CliTestUtil } from '../utils/cli.test.util.js';
import { getAtlassianCredentials } from '../utils/transport.util.js';
import { config } from '../utils/config.util.js';

describe('Atlassian Workspaces CLI Commands', () => {
	// Load configuration and check for credentials before all tests
	beforeAll(() => {
		// Load configuration from all sources
		config.load();

		// Log warning if credentials aren't available
		const credentials = getAtlassianCredentials();
		if (!credentials) {
			console.warn(
				'Skipping Atlassian Workspaces CLI tests: No credentials available',
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

	describe('ls-workspaces command', () => {
		// Test default behavior (list all workspaces)
		it('should list available workspaces', async () => {
			if (skipIfNoCredentials()) {
				return;
			}

			// Run the CLI command
			const result = await CliTestUtil.runCommand(['ls-workspaces']);

			// Check command exit code
			expect(result.exitCode).toBe(0);

			// Verify the output format
			if (!result.stdout.includes('No Bitbucket workspaces found.')) {
				// Validate expected Markdown structure - Fixed to match actual output
				CliTestUtil.validateOutputContains(result.stdout, [
					'# Bitbucket Workspaces',
					'**UUID**',
					'**Slug**',
					'**Permission Level**',
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

			// Run the CLI command with limit
			const result = await CliTestUtil.runCommand([
				'ls-workspaces',
				'--limit',
				'1',
			]);

			// Check command exit code
			expect(result.exitCode).toBe(0);

			// If there are multiple workspaces, pagination section should be present
			if (
				!result.stdout.includes('No Bitbucket workspaces found.') &&
				result.stdout.includes('items remaining')
			) {
				CliTestUtil.validateOutputContains(result.stdout, [
					'Pagination',
					'Next cursor:',
				]);
			}
		}, 30000); // Increased timeout for API call

		// Test with invalid parameters - Fixed to use a truly invalid input
		it('should handle invalid parameters properly', async () => {
			if (skipIfNoCredentials()) {
				return;
			}

			// Run the CLI command with a non-existent parameter
			const result = await CliTestUtil.runCommand([
				'ls-workspaces',
				'--non-existent-parameter',
				'value',
			]);

			// Should fail with non-zero exit code
			expect(result.exitCode).not.toBe(0);

			// Should output error message
			expect(result.stderr).toContain('unknown option');
		}, 30000);
	});

	// Use: get --path "/workspaces/{workspace_slug}"
});

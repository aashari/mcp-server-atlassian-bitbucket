import { CliTestUtil } from '../utils/cli.test.util';
import { getAtlassianCredentials } from '../utils/transport.util';

describe('Atlassian Search CLI Commands', () => {
	beforeAll(() => {
		// Check if credentials are available
		const credentials = getAtlassianCredentials();
		if (!credentials) {
			console.warn(
				'WARNING: No Atlassian credentials available. Live API tests will be skipped.',
			);
		}
	});

	/**
	 * Helper function to skip tests if Atlassian credentials are not available
	 */
	const skipIfNoCredentials = () => {
		const credentials = getAtlassianCredentials();
		if (!credentials) {
			return true;
		}
		return false;
	};

	describe('search command', () => {
		it('should search repositories and return success exit code', async () => {
			if (skipIfNoCredentials()) {
				return; // Skip silently - no credentials available
			}

			const { stdout, exitCode } = await CliTestUtil.runCommand([
				'search',
				'--query',
				'test',
			]);

			expect(exitCode).toBe(0);
			CliTestUtil.validateMarkdownOutput(stdout);
			CliTestUtil.validateOutputContains(stdout, ['## Search Results']);
		}, 60000);

		it('should support searching with query parameter', async () => {
			if (skipIfNoCredentials()) {
				return; // Skip silently - no credentials available
			}

			const { stdout, exitCode } = await CliTestUtil.runCommand([
				'search',
				'--query',
				'api',
			]);

			expect(exitCode).toBe(0);
			CliTestUtil.validateMarkdownOutput(stdout);
			CliTestUtil.validateOutputContains(stdout, ['## Search Results']);
		}, 60000);

		it('should support pagination with limit flag', async () => {
			if (skipIfNoCredentials()) {
				return; // Skip silently - no credentials available
			}

			const { stdout, exitCode } = await CliTestUtil.runCommand([
				'search',
				'--query',
				'test',
				'--limit',
				'2',
			]);

			expect(exitCode).toBe(0);
			CliTestUtil.validateMarkdownOutput(stdout);
			// Check for pagination markers
			CliTestUtil.validateOutputContains(stdout, [
				/Showing \d+ results/,
				/Next page:|No more results/,
			]);
		}, 60000);

		it('should require the query parameter', async () => {
			const { stderr, exitCode } = await CliTestUtil.runCommand([
				'search',
			]);

			expect(exitCode).not.toBe(0);
			expect(stderr).toMatch(
				/required option|missing required|specify a query/i,
			);
		}, 30000);

		it('should handle invalid limit value gracefully', async () => {
			if (skipIfNoCredentials()) {
				return; // Skip silently - no credentials available
			}

			const { stdout, exitCode } = await CliTestUtil.runCommand([
				'search',
				'--query',
				'test',
				'--limit',
				'not-a-number',
			]);

			expect(exitCode).not.toBe(0);
			CliTestUtil.validateOutputContains(stdout, [
				/Error|Invalid|Failed/i,
			]);
		}, 60000);

		it('should handle help flag correctly', async () => {
			const { stdout, exitCode } = await CliTestUtil.runCommand([
				'search',
				'--help',
			]);

			expect(exitCode).toBe(0);
			expect(stdout).toMatch(/Usage|Options|Description/i);
			expect(stdout).toContain('search');
		}, 15000);
	});
});

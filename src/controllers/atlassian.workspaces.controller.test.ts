import atlassianWorkspacesController from './atlassian.workspaces.controller.js';
import { getAtlassianCredentials } from '../utils/transport.util.js';
import { config } from '../utils/config.util.js';

describe('Atlassian Workspaces Controller', () => {
	// Load configuration and check for credentials before all tests
	beforeAll(() => {
		config.load(); // Ensure config is loaded
		const credentials = getAtlassianCredentials();
		if (!credentials) {
			console.warn(
				'Skipping Atlassian Workspaces Controller tests: No credentials available',
			);
		}
	});

	// Helper function to skip tests when credentials are missing
	const skipIfNoCredentials = () => !getAtlassianCredentials();

	describe('list', () => {
		it('should return a formatted list of workspaces in Markdown', async () => {
			if (skipIfNoCredentials()) return;

			const result = await atlassianWorkspacesController.list({});

			// Verify the response structure
			expect(result).toHaveProperty('content');
			expect(typeof result.content).toBe('string');

			// Basic Markdown content checks
			if (result.content !== 'No Bitbucket workspaces found.') {
				expect(result.content).toMatch(/^# Bitbucket Workspaces/m);
				expect(result.content).toContain('**UUID**');
				expect(result.content).toContain('**Slug**');
				expect(result.content).toContain('**Permission Level**');

				// Check for pagination information in the content string
				expect(result.content).toMatch(
					/---\s*[\s\S]*\*Showing \d+ (of \d+ total items|\S+ items?)[\s\S]*\*/,
				);
			}
		}, 30000); // Increased timeout

		it('should handle pagination options (limit/cursor)', async () => {
			if (skipIfNoCredentials()) return;

			// Fetch first page
			const result1 = await atlassianWorkspacesController.list({
				limit: 1,
			});

			// Extract pagination info from content
			const countMatch1 = result1.content.match(
				/\*Showing (\d+) items?\.\*/,
			);
			const count1 = countMatch1 ? parseInt(countMatch1[1], 10) : 0;
			expect(count1).toBeLessThanOrEqual(1);

			// Extract cursor from content
			const cursorMatch1 = result1.content.match(
				/\*Next cursor: `(\d+)`\*/,
			);
			const nextCursor = cursorMatch1 ? cursorMatch1[1] : null;

			// Check if pagination indicates more results
			const hasMoreResults = result1.content.includes(
				'More results are available.',
			);

			// If there's a next page, fetch it
			if (hasMoreResults && nextCursor) {
				const result2 = await atlassianWorkspacesController.list({
					limit: 1,
					cursor: nextCursor,
				});

				// Ensure content is different (or handle case where only 1 item exists)
				if (
					result1.content !== 'No Bitbucket workspaces found.' &&
					result2.content !== 'No Bitbucket workspaces found.'
				) {
					// Only compare if we actually have multiple workspaces
					expect(result1.content).not.toEqual(result2.content);
				}
			} else {
				console.warn(
					'Skipping cursor part of pagination test: Only one page of workspaces found.',
				);
			}
		}, 30000);
	});

	// Note: 'get' functionality has been replaced by the generic bb_get tool
	// Use: bb_get({ path: "/workspaces/{workspace_slug}" })
});

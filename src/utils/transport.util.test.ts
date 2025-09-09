import { getAtlassianCredentials, fetchAtlassian } from './transport.util.js';
import { config } from './config.util.js';

/**
 * Generic response type for testing
 */
interface TestResponse {
	values: Array<Record<string, unknown>>;
	next?: string;
	total?: number;
}

// NOTE: We are no longer mocking fetch or logger, using real implementations instead

describe('Transport Utility', () => {
	// Load configuration before all tests
	beforeAll(() => {
		// Load configuration from all sources
		config.load();
	});

	describe('getAtlassianCredentials', () => {
		it('should return credentials when environment variables are set', () => {
			// This test will be skipped if credentials are not available
			const credentials = getAtlassianCredentials();
			if (!credentials) {
				return; // Skip silently - no credentials available for testing
			}

			// Check if the credentials are for standard Atlassian or Bitbucket-specific
			if (credentials.useBitbucketAuth) {
				// Verify the Bitbucket-specific credentials
				expect(credentials).toHaveProperty('bitbucketUsername');
				expect(credentials).toHaveProperty('bitbucketAppPassword');
				expect(credentials).toHaveProperty('useBitbucketAuth');

				// Verify the credentials are not empty
				expect(credentials.bitbucketUsername).toBeTruthy();
				expect(credentials.bitbucketAppPassword).toBeTruthy();
				expect(credentials.useBitbucketAuth).toBe(true);
			} else {
				// Verify the standard Atlassian credentials
				expect(credentials).toHaveProperty('userEmail');
				expect(credentials).toHaveProperty('apiToken');

				// Verify the credentials are not empty
				expect(credentials.userEmail).toBeTruthy();
				expect(credentials.apiToken).toBeTruthy();
				// Note: siteName is optional for API tokens
			}
		});

		it('should return null and log a warning when environment variables are missing', () => {
			// Store original environment variables
			const originalEnv = { ...process.env };

			// Clear relevant environment variables to simulate missing credentials
			delete process.env.ATLASSIAN_SITE_NAME;
			delete process.env.ATLASSIAN_USER_EMAIL;
			delete process.env.ATLASSIAN_API_TOKEN;
			delete process.env.ATLASSIAN_BITBUCKET_USERNAME;
			delete process.env.ATLASSIAN_BITBUCKET_APP_PASSWORD;

			// Force reload configuration
			config.load();

			// Call the function
			const credentials = getAtlassianCredentials();

			// Verify the result is null
			expect(credentials).toBeNull();

			// Restore original environment
			process.env = originalEnv;

			// Reload config with original environment
			config.load();
		});
	});

	describe('fetchAtlassian', () => {
		it('should successfully fetch data from the Atlassian API', async () => {
			// This test will be skipped if credentials are not available
			const credentials = getAtlassianCredentials();
			if (!credentials) {
				return; // Skip silently - no credentials available for testing
			}

			// Make a call to a real API endpoint
			// For Bitbucket, we'll use the workspaces endpoint
			const result = await fetchAtlassian<TestResponse>(
				credentials,
				'/2.0/workspaces',
				{
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
					},
				},
			);

			// Verify the response structure from real API
			expect(result).toHaveProperty('values');
			expect(Array.isArray(result.values)).toBe(true);
			// Different property names than mocked data to match actual API response
			if (result.values.length > 0) {
				// Verify an actual workspace result
				const workspace = result.values[0];
				expect(workspace).toHaveProperty('uuid');
				expect(workspace).toHaveProperty('name');
				expect(workspace).toHaveProperty('slug');
			}
		}, 15000); // Increased timeout for real API call

		it('should handle API errors correctly', async () => {
			// This test will be skipped if credentials are not available
			const credentials = getAtlassianCredentials();
			if (!credentials) {
				return; // Skip silently - no credentials available for testing
			}

			// Call a non-existent endpoint and expect it to throw
			await expect(
				fetchAtlassian(credentials, '/2.0/non-existent-endpoint'),
			).rejects.toThrow();
		}, 15000); // Increased timeout for real API call

		it('should normalize paths that do not start with a slash', async () => {
			// This test will be skipped if credentials are not available
			const credentials = getAtlassianCredentials();
			if (!credentials) {
				return; // Skip silently - no credentials available for testing
			}

			// Call the function with a path that doesn't start with a slash
			const result = await fetchAtlassian<TestResponse>(
				credentials,
				'2.0/workspaces',
				{
					method: 'GET',
				},
			);

			// Verify the response structure from real API
			expect(result).toHaveProperty('values');
			expect(Array.isArray(result.values)).toBe(true);
		}, 15000); // Increased timeout for real API call

		it('should support custom request options', async () => {
			// This test will be skipped if credentials are not available
			const credentials = getAtlassianCredentials();
			if (!credentials) {
				return; // Skip silently - no credentials available for testing
			}

			// Custom request options with pagination
			const options = {
				method: 'GET' as const,
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
			};

			// Call a real endpoint with pagination parameter
			const result = await fetchAtlassian<TestResponse>(
				credentials,
				'/2.0/workspaces?pagelen=1',
				options,
			);

			// Verify the response structure from real API
			expect(result).toHaveProperty('values');
			expect(Array.isArray(result.values)).toBe(true);
			expect(result.values.length).toBeLessThanOrEqual(1); // Should respect pagelen=1
		}, 15000); // Increased timeout for real API call
	});
});

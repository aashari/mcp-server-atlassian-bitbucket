import { Logger } from './logger.util.js';
import { config } from './config.util.js';
import {
	createAuthInvalidError,
	createApiError,
	createUnexpectedError,
	McpError,
} from './error.util.js';

/**
 * Interface for Atlassian API credentials
 */
export interface AtlassianCredentials {
	// Standard Atlassian credentials
	siteName?: string;
	userEmail?: string;
	apiToken?: string;
	// Bitbucket-specific credentials (alternative approach)
	bitbucketUsername?: string;
	bitbucketAppPassword?: string;
	// Indicates which auth method to use
	useBitbucketAuth?: boolean;
}

/**
 * Interface for HTTP request options
 */
export interface RequestOptions {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
	headers?: Record<string, string>;
	body?: unknown;
}

// Create a contextualized logger for this file
const transportLogger = Logger.forContext('utils/transport.util.ts');

// Log transport utility initialization
transportLogger.debug('Transport utility initialized');

/**
 * Get Atlassian credentials from environment variables
 * @returns AtlassianCredentials object or null if credentials are missing
 */
export function getAtlassianCredentials(): AtlassianCredentials | null {
	const methodLogger = Logger.forContext(
		'utils/transport.util.ts',
		'getAtlassianCredentials',
	);

	// First try standard Atlassian credentials (preferred for consistency)
	const siteName = config.get('ATLASSIAN_SITE_NAME');
	const userEmail = config.get('ATLASSIAN_USER_EMAIL');
	const apiToken = config.get('ATLASSIAN_API_TOKEN');

	// If standard credentials are available, use them
	if (siteName && userEmail && apiToken) {
		methodLogger.debug('Using standard Atlassian credentials');
		return {
			siteName,
			userEmail,
			apiToken,
			useBitbucketAuth: false,
		};
	}

	// If standard credentials are not available, try Bitbucket-specific credentials
	const bitbucketUsername = config.get('ATLASSIAN_BITBUCKET_USERNAME');
	const bitbucketAppPassword = config.get('ATLASSIAN_BITBUCKET_APP_PASSWORD');

	if (bitbucketUsername && bitbucketAppPassword) {
		methodLogger.debug('Using Bitbucket-specific credentials');
		return {
			bitbucketUsername,
			bitbucketAppPassword,
			useBitbucketAuth: true,
		};
	}

	// If neither set of credentials is available, return null
	methodLogger.warn(
		'Missing Atlassian credentials. Please set either ATLASSIAN_SITE_NAME, ATLASSIAN_USER_EMAIL, and ATLASSIAN_API_TOKEN environment variables, or ATLASSIAN_BITBUCKET_USERNAME and ATLASSIAN_BITBUCKET_APP_PASSWORD for Bitbucket-specific auth.',
	);
	return null;
}

/**
 * Fetch data from Atlassian API
 * @param credentials Atlassian API credentials
 * @param path API endpoint path (without base URL)
 * @param options Request options
 * @returns Response data
 */
export async function fetchAtlassian<T>(
	credentials: AtlassianCredentials,
	path: string,
	options: RequestOptions = {},
): Promise<T> {
	const methodLogger = Logger.forContext(
		'utils/transport.util.ts',
		'fetchAtlassian',
	);

	// Set up base URL and auth headers based on credential type
	let baseUrl: string;
	let authHeader: string;

	if (credentials.useBitbucketAuth) {
		// Bitbucket API uses a different base URL and auth format
		baseUrl = 'https://api.bitbucket.org';
		if (
			!credentials.bitbucketUsername ||
			!credentials.bitbucketAppPassword
		) {
			throw createAuthInvalidError(
				'Missing Bitbucket username or app password',
			);
		}
		authHeader = `Basic ${Buffer.from(
			`${credentials.bitbucketUsername}:${credentials.bitbucketAppPassword}`,
		).toString('base64')}`;
	} else {
		// Standard Atlassian API (Jira, Confluence)
		if (
			!credentials.siteName ||
			!credentials.userEmail ||
			!credentials.apiToken
		) {
			throw createAuthInvalidError('Missing Atlassian credentials');
		}
		baseUrl = `https://${credentials.siteName}.atlassian.net`;
		authHeader = `Basic ${Buffer.from(
			`${credentials.userEmail}:${credentials.apiToken}`,
		).toString('base64')}`;
	}

	// Ensure path starts with a slash
	const normalizedPath = path.startsWith('/') ? path : `/${path}`;

	// Construct the full URL
	const url = `${baseUrl}${normalizedPath}`;

	// Set up authentication and headers
	const headers = {
		Authorization: authHeader,
		'Content-Type': 'application/json',
		Accept: 'application/json',
		...options.headers,
	};

	// Prepare request options
	const requestOptions: RequestInit = {
		method: options.method || 'GET',
		headers,
		body: options.body ? JSON.stringify(options.body) : undefined,
	};

	methodLogger.debug(`Calling Atlassian API: ${url}`);

	try {
		const response = await fetch(url, requestOptions);

		// Log the raw response status and headers
		methodLogger.debug(
			`Raw response received: ${response.status} ${response.statusText}`,
			{
				url,
				status: response.status,
				statusText: response.statusText,
				headers: Object.fromEntries(response.headers.entries()),
			},
		);

		if (!response.ok) {
			const errorText = await response.text();
			methodLogger.error(
				`API error: ${response.status} ${response.statusText}`,
				errorText,
			);

			// Try to parse the error response
			let errorMessage = `${response.status} ${response.statusText}`;
			let parsedError = null;

			try {
				if (
					errorText &&
					(errorText.startsWith('{') || errorText.startsWith('['))
				) {
					parsedError = JSON.parse(errorText);

					// Extract specific error details from various Atlassian API response formats
					if (
						parsedError.errors &&
						Array.isArray(parsedError.errors) &&
						parsedError.errors.length > 0
					) {
						// Format: {"errors":[{"status":400,"code":"INVALID_REQUEST_PARAMETER","title":"..."}]}
						const atlassianError = parsedError.errors[0];
						if (atlassianError.title) {
							errorMessage = atlassianError.title;
						}
					} else if (parsedError.message) {
						// Format: {"message":"Some error message"}
						errorMessage = parsedError.message;
					} else if (parsedError.error && parsedError.error.message) {
						// Bitbucket specific format: {"error": {"message": "..."}}
						errorMessage = parsedError.error.message;
					}
				}
			} catch (parseError) {
				methodLogger.debug(`Error parsing error response:`, parseError);
				// Fall back to the default error message
			}

			// Classify HTTP errors based on status code
			if (response.status === 401 || response.status === 403) {
				throw createAuthInvalidError('Invalid Atlassian credentials');
			} else if (response.status === 404) {
				throw createApiError(`Resource not found`, 404, errorText);
			} else {
				// For other API errors, preserve the original error message from Atlassian API
				throw createApiError(errorMessage, response.status, errorText);
			}
		}

		// Check if the response is expected to be plain text
		const contentType = response.headers.get('content-type') || '';
		if (contentType.includes('text/plain')) {
			// If we're expecting text (like a diff), return the raw text
			const textResponse = await response.text();
			methodLogger.debug(
				`Text response received (truncated)`,
				textResponse.substring(0, 200) + '...',
			);
			return textResponse as unknown as T;
		}

		// For JSON responses, proceed as before
		// Clone the response to log its content without consuming it
		const clonedResponse = response.clone();
		try {
			const responseJson = await clonedResponse.json();
			methodLogger.debug(`Response body:`, responseJson);
		} catch {
			methodLogger.debug(
				`Could not parse response as JSON, returning raw content`,
			);
		}

		return response.json() as Promise<T>;
	} catch (error) {
		methodLogger.error(`Request failed`, error);

		// If it's already an McpError, just rethrow it
		if (error instanceof McpError) {
			throw error;
		}

		// Handle network or parsing errors
		if (error instanceof TypeError || error instanceof SyntaxError) {
			throw createApiError(
				`Network or parsing error: ${error instanceof Error ? error.message : String(error)}`,
				500,
				error,
			);
		}

		throw createUnexpectedError(
			`Unexpected error while calling Atlassian API: ${error instanceof Error ? error.message : String(error)}`,
			error,
		);
	}
}

/**
 * Application constants
 *
 * This file contains constants used throughout the application.
 * Centralizing these values makes them easier to maintain and update.
 */

/**
 * Current application version
 * This should match the version in package.json
 */
export const VERSION = '3.1.0';

/**
 * Package name with scope
 * Used for initialization and identification
 */
export const PACKAGE_NAME = '@aashari/mcp-server-atlassian-bitbucket';

/**
 * CLI command name
 * Used for binary name and CLI help text
 */
export const CLI_NAME = 'mcp-atlassian-bitbucket';

/**
 * Network timeout constants (in milliseconds)
 */
export const NETWORK_TIMEOUTS = {
	/** Default timeout for API requests (30 seconds) */
	DEFAULT_REQUEST_TIMEOUT: 30 * 1000,

	/** Timeout for large file operations like diffs (60 seconds) */
	LARGE_REQUEST_TIMEOUT: 60 * 1000,

	/** Timeout for search operations (45 seconds) */
	SEARCH_REQUEST_TIMEOUT: 45 * 1000,
} as const;

/**
 * Data limits to prevent excessive resource consumption (CWE-770)
 */
export const DATA_LIMITS = {
	/** Maximum response size in bytes (10MB) */
	MAX_RESPONSE_SIZE: 10 * 1024 * 1024,

	/** Maximum items per page for paginated requests */
	MAX_PAGE_SIZE: 100,

	/** Default page size when not specified */
	DEFAULT_PAGE_SIZE: 50,
} as const;

import { Logger } from './logger.util.js';
import { formatSeparator } from './formatter.util.js';

/**
 * Error types for MCP errors
 */
export type McpErrorType =
	| 'AUTHENTICATION_REQUIRED'
	| 'NOT_FOUND'
	| 'VALIDATION_ERROR'
	| 'RATE_LIMIT_EXCEEDED'
	| 'API_ERROR'
	| 'UNEXPECTED_ERROR';

/**
 * Error types for classification
 */
export enum ErrorType {
	AUTH_MISSING = 'AUTH_MISSING',
	AUTH_INVALID = 'AUTH_INVALID',
	API_ERROR = 'API_ERROR',
	UNEXPECTED_ERROR = 'UNEXPECTED_ERROR',
}

/**
 * Custom error class with type classification
 */
export class McpError extends Error {
	type: ErrorType;
	errorType?: McpErrorType; // Add errorType property used by error-handler.util.ts
	statusCode?: number;
	originalError?: unknown;

	constructor(
		message: string,
		type: ErrorType,
		statusCode?: number,
		originalError?: unknown,
	) {
		super(message);
		this.name = 'McpError';
		this.type = type;
		this.statusCode = statusCode;
		this.originalError = originalError;

		// Set errorType based on type
		switch (type) {
			case ErrorType.AUTH_MISSING:
			case ErrorType.AUTH_INVALID:
				this.errorType = 'AUTHENTICATION_REQUIRED';
				break;
			case ErrorType.API_ERROR:
				this.errorType =
					statusCode === 404
						? 'NOT_FOUND'
						: statusCode === 429
							? 'RATE_LIMIT_EXCEEDED'
							: 'API_ERROR';
				break;
			case ErrorType.UNEXPECTED_ERROR:
			default:
				this.errorType = 'UNEXPECTED_ERROR';
				break;
		}
	}
}

/**
 * Helper to unwrap nested McpErrors and return the deepest original error.
 * This is useful when an McpError contains another McpError as `originalError`
 * which in turn may wrap the vendor (Bitbucket) error text or object.
 */
export function getDeepOriginalError(error: unknown): unknown {
	if (!error) {
		return error;
	}

	let current = error;
	let depth = 0;
	const maxDepth = 10; // Prevent infinite recursion

	while (
		depth < maxDepth &&
		current instanceof Error &&
		'originalError' in current &&
		current.originalError
	) {
		current = current.originalError;
		depth++;
	}

	return current;
}

/**
 * Create an authentication missing error
 */
export function createAuthMissingError(
	message: string = 'Authentication credentials are missing',
	originalError?: unknown,
): McpError {
	return new McpError(
		message,
		ErrorType.AUTH_MISSING,
		undefined,
		originalError,
	);
}

/**
 * Create an authentication invalid error
 */
export function createAuthInvalidError(
	message: string = 'Authentication credentials are invalid',
	originalError?: unknown,
): McpError {
	return new McpError(message, ErrorType.AUTH_INVALID, 401, originalError);
}

/**
 * Create an API error
 */
export function createApiError(
	message: string,
	statusCode?: number,
	originalError?: unknown,
): McpError {
	return new McpError(
		message,
		ErrorType.API_ERROR,
		statusCode,
		originalError,
	);
}

/**
 * Create an unexpected error
 */
export function createUnexpectedError(
	message: string = 'An unexpected error occurred',
	originalError?: unknown,
): McpError {
	return new McpError(
		message,
		ErrorType.UNEXPECTED_ERROR,
		undefined,
		originalError,
	);
}

/**
 * Ensure an error is an McpError
 */
export function ensureMcpError(error: unknown): McpError {
	if (error instanceof McpError) {
		return error;
	}

	if (error instanceof Error) {
		return createUnexpectedError(error.message, error);
	}

	return createUnexpectedError(String(error));
}

/**
 * Format error for MCP tool response
 * Includes raw error details in the text content so AI can see the full context
 */
export function formatErrorForMcpTool(error: unknown): {
	content: Array<{ type: 'text'; text: string }>;
	isError: boolean;
} {
	const methodLogger = Logger.forContext(
		'utils/error.util.ts',
		'formatErrorForMcpTool',
	);
	const mcpError = ensureMcpError(error);
	methodLogger.error(`${mcpError.type} error`, mcpError);

	// Get the deep original error for additional context
	const originalError = getDeepOriginalError(mcpError.originalError);

	// Build error text with full details visible to AI
	let errorText = `Error: ${mcpError.message}`;

	// Add status code if available
	if (mcpError.statusCode) {
		errorText += `\nHTTP Status: ${mcpError.statusCode}`;
	}

	// Add raw error details if available (this is the actual Bitbucket API response)
	if (originalError && originalError !== mcpError.message) {
		if (typeof originalError === 'object') {
			errorText += `\n\nRaw API Response:\n${JSON.stringify(originalError, null, 2)}`;
		} else if (typeof originalError === 'string') {
			errorText += `\n\nRaw API Response:\n${originalError}`;
		}
	}

	return {
		content: [
			{
				type: 'text' as const,
				text: errorText,
			},
		],
		isError: true,
	};
}

/**
 * Format error for MCP resource response
 */
export function formatErrorForMcpResource(
	error: unknown,
	uri: string,
): {
	contents: Array<{
		uri: string;
		text: string;
		mimeType: string;
		description?: string;
	}>;
} {
	const methodLogger = Logger.forContext(
		'utils/error.util.ts',
		'formatErrorForMcpResource',
	);
	const mcpError = ensureMcpError(error);
	methodLogger.error(`${mcpError.type} error`, mcpError);

	return {
		contents: [
			{
				uri,
				text: `Error: ${mcpError.message}`,
				mimeType: 'text/plain',
				description: `Error: ${mcpError.type}`,
			},
		],
	};
}

/**
 * Handle error in CLI context with improved user feedback
 */
export function handleCliError(error: unknown): never {
	const methodLogger = Logger.forContext(
		'utils/error.util.ts',
		'handleCliError',
	);
	const mcpError = ensureMcpError(error);
	methodLogger.error(`${mcpError.type} error`, mcpError);

	// Get the deep original error for more context
	const originalError = getDeepOriginalError(mcpError.originalError);

	// Build a well-formatted CLI output using markdown-style helpers
	const cliLines: string[] = [];

	// Primary error headline
	cliLines.push(`Error: ${mcpError.message}`);

	// Status code (if any)
	if (mcpError.statusCode) {
		cliLines.push(`HTTP Status: ${mcpError.statusCode}`);
	}

	// Separator
	cliLines.push(formatSeparator());

	// Provide helpful context based on error type
	if (mcpError.type === ErrorType.AUTH_MISSING) {
		cliLines.push(
			'Tip: Make sure to set up your Atlassian credentials in the configuration file or environment variables:',
		);
		cliLines.push(
			'- ATLASSIAN_SITE_NAME, ATLASSIAN_USER_EMAIL, and ATLASSIAN_API_TOKEN; or',
		);
		cliLines.push(
			'- ATLASSIAN_BITBUCKET_USERNAME and ATLASSIAN_BITBUCKET_APP_PASSWORD',
		);
	} else if (mcpError.type === ErrorType.AUTH_INVALID) {
		cliLines.push(
			'Tip: Check that your Atlassian API token or app password is correct and has not expired.',
		);
		cliLines.push(
			'Also verify that the configured user has access to the requested resource.',
		);
	} else if (mcpError.type === ErrorType.API_ERROR) {
		if (mcpError.statusCode === 429) {
			cliLines.push(
				'Tip: You may have exceeded your Bitbucket API rate limits. Try again later.',
			);
		}
	}

	// Vendor error details (if available)
	if (originalError) {
		cliLines.push('Bitbucket API Error:');
		cliLines.push('```');
		if (typeof originalError === 'object' && originalError !== null) {
			// Try to extract the most useful parts of Bitbucket's error response
			const origErr = originalError as Record<string, unknown>;
			if (origErr.error && typeof origErr.error === 'object') {
				// Format {"error": {"message": "..."}} structure
				const bitbucketError = origErr.error as Record<string, unknown>;
				cliLines.push(
					`Message: ${bitbucketError.message || 'Unknown error'}`,
				);
				if (bitbucketError.detail)
					cliLines.push(`Detail: ${bitbucketError.detail}`);
			} else if (origErr.message) {
				// Simple message
				cliLines.push(`${String(origErr.message)}`);
			} else {
				// Fall back to JSON representation for anything else
				cliLines.push(JSON.stringify(originalError, null, 2));
			}
		} else {
			cliLines.push(String(originalError).trim());
		}
		cliLines.push('```');
	}

	// Display DEBUG tip
	if (!process.env.DEBUG || !process.env.DEBUG.includes('mcp:')) {
		cliLines.push(
			'For more detailed error information, run with DEBUG=mcp:* environment variable.',
		);
	}

	console.error(cliLines.join('\n'));
	process.exit(1);
}

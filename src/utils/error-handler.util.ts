import { createApiError } from './error.util.js';
import { Logger } from './logger.util.js';
import { getDeepOriginalError } from './error.util.js';

/**
 * Standard error codes for consistent handling
 */
export enum ErrorCode {
	NOT_FOUND = 'NOT_FOUND',
	INVALID_CURSOR = 'INVALID_CURSOR',
	ACCESS_DENIED = 'ACCESS_DENIED',
	VALIDATION_ERROR = 'VALIDATION_ERROR',
	UNEXPECTED_ERROR = 'UNEXPECTED_ERROR',
	NETWORK_ERROR = 'NETWORK_ERROR',
	RATE_LIMIT_ERROR = 'RATE_LIMIT_ERROR',
	PRIVATE_IP_ERROR = 'PRIVATE_IP_ERROR',
	RESERVED_RANGE_ERROR = 'RESERVED_RANGE_ERROR',
}

/**
 * Context information for error handling
 */
export interface ErrorContext {
	/**
	 * Source of the error (e.g., file path and function)
	 */
	source?: string;

	/**
	 * Type of entity being processed (e.g., 'Repository', 'PullRequest')
	 */
	entityType?: string;

	/**
	 * Identifier of the entity being processed
	 */
	entityId?: string | Record<string, string>;

	/**
	 * Operation being performed (e.g., 'listing', 'creating')
	 */
	operation?: string;

	/**
	 * Additional information for debugging
	 */
	additionalInfo?: Record<string, unknown>;
}

/**
 * Helper function to create a consistent error context object
 * @param entityType Type of entity being processed
 * @param operation Operation being performed
 * @param source Source of the error (typically file path and function)
 * @param entityId Optional identifier of the entity
 * @param additionalInfo Optional additional information for debugging
 * @returns A formatted ErrorContext object
 */
export function buildErrorContext(
	entityType: string,
	operation: string,
	source: string,
	entityId?: string | Record<string, string>,
	additionalInfo?: Record<string, unknown>,
): ErrorContext {
	return {
		entityType,
		operation,
		source,
		...(entityId && { entityId }),
		...(additionalInfo && { additionalInfo }),
	};
}

/**
 * Detect specific error types from raw errors
 * @param error The error to analyze
 * @param context Context information for better error detection
 * @returns Object containing the error code and status code
 */
export function detectErrorType(
	error: unknown,
	context: ErrorContext = {},
): { code: ErrorCode; statusCode: number } {
	const methodLogger = Logger.forContext(
		'utils/error-handler.util.ts',
		'detectErrorType',
	);
	methodLogger.debug(`Detecting error type`, { error, context });

	const errorMessage = error instanceof Error ? error.message : String(error);
	const statusCode =
		error instanceof Error && 'statusCode' in error
			? (error as { statusCode: number }).statusCode
			: undefined;

	// PR ID validation error detection
	if (
		errorMessage.includes('Invalid pull request ID') ||
		errorMessage.includes('Pull request ID must be a positive integer')
	) {
		return { code: ErrorCode.VALIDATION_ERROR, statusCode: 400 };
	}

	// Network error detection
	if (
		errorMessage.includes('network error') ||
		errorMessage.includes('fetch failed') ||
		errorMessage.includes('ECONNREFUSED') ||
		errorMessage.includes('ENOTFOUND') ||
		errorMessage.includes('Failed to fetch') ||
		errorMessage.includes('Network request failed')
	) {
		return { code: ErrorCode.NETWORK_ERROR, statusCode: 500 };
	}

	// Network error detection in originalError
	if (
		error instanceof Error &&
		'originalError' in error &&
		error.originalError
	) {
		// Check for TypeError in originalError (common for network issues)
		if (error.originalError instanceof TypeError) {
			return { code: ErrorCode.NETWORK_ERROR, statusCode: 500 };
		}

		// Check for network error messages in originalError
		if (
			error.originalError instanceof Error &&
			(error.originalError.message.includes('fetch') ||
				error.originalError.message.includes('network') ||
				error.originalError.message.includes('ECON'))
		) {
			return { code: ErrorCode.NETWORK_ERROR, statusCode: 500 };
		}
	}

	// Rate limiting detection
	if (
		errorMessage.includes('rate limit') ||
		errorMessage.includes('too many requests') ||
		statusCode === 429
	) {
		return { code: ErrorCode.RATE_LIMIT_ERROR, statusCode: 429 };
	}

	// Bitbucket-specific error detection
	if (
		error instanceof Error &&
		'originalError' in error &&
		error.originalError
	) {
		const originalError = getDeepOriginalError(error.originalError);

		if (originalError && typeof originalError === 'object') {
			const oe = originalError as Record<string, unknown>;

			// Check for Bitbucket API error structure
			if (oe.error && typeof oe.error === 'object') {
				const bbError = oe.error as Record<string, unknown>;
				const errorMsg = String(bbError.message || '').toLowerCase();
				const errorDetail = bbError.detail
					? String(bbError.detail).toLowerCase()
					: '';

				methodLogger.debug('Found Bitbucket error structure', {
					message: errorMsg,
					detail: errorDetail,
				});

				// Repository not found / Does not exist errors
				if (
					errorMsg.includes('repository not found') ||
					errorMsg.includes('does not exist') ||
					errorMsg.includes('no such resource') ||
					errorMsg.includes('not found')
				) {
					return { code: ErrorCode.NOT_FOUND, statusCode: 404 };
				}

				// Access and permission errors
				if (
					errorMsg.includes('access') ||
					errorMsg.includes('permission') ||
					errorMsg.includes('credentials') ||
					errorMsg.includes('unauthorized') ||
					errorMsg.includes('forbidden') ||
					errorMsg.includes('authentication')
				) {
					return { code: ErrorCode.ACCESS_DENIED, statusCode: 403 };
				}

				// Validation errors
				if (
					errorMsg.includes('invalid') ||
					(errorMsg.includes('parameter') &&
						errorMsg.includes('error')) ||
					errorMsg.includes('input') ||
					errorMsg.includes('validation') ||
					errorMsg.includes('required field') ||
					errorMsg.includes('bad request')
				) {
					return {
						code: ErrorCode.VALIDATION_ERROR,
						statusCode: 400,
					};
				}

				// Rate limiting errors
				if (
					errorMsg.includes('rate limit') ||
					errorMsg.includes('too many requests') ||
					errorMsg.includes('throttled')
				) {
					return {
						code: ErrorCode.RATE_LIMIT_ERROR,
						statusCode: 429,
					};
				}
			}

			// Check for alternate Bitbucket error structure: {"type": "error", ...}
			if (oe.type === 'error') {
				methodLogger.debug('Found Bitbucket type:error structure', oe);

				// Check for status code if available in the error object
				if (typeof oe.status === 'number') {
					if (oe.status === 404) {
						return { code: ErrorCode.NOT_FOUND, statusCode: 404 };
					}
					if (oe.status === 403 || oe.status === 401) {
						return {
							code: ErrorCode.ACCESS_DENIED,
							statusCode: oe.status,
						};
					}
					if (oe.status === 400) {
						return {
							code: ErrorCode.VALIDATION_ERROR,
							statusCode: 400,
						};
					}
					if (oe.status === 429) {
						return {
							code: ErrorCode.RATE_LIMIT_ERROR,
							statusCode: 429,
						};
					}
				}
			}

			// Check for Bitbucket error structure: {"errors": [{...}]}
			if (Array.isArray(oe.errors) && oe.errors.length > 0) {
				const firstError = oe.errors[0] as Record<string, unknown>;
				methodLogger.debug(
					'Found Bitbucket errors array structure',
					firstError,
				);

				if (typeof firstError.status === 'number') {
					if (firstError.status === 404) {
						return { code: ErrorCode.NOT_FOUND, statusCode: 404 };
					}
					if (
						firstError.status === 403 ||
						firstError.status === 401
					) {
						return {
							code: ErrorCode.ACCESS_DENIED,
							statusCode: firstError.status,
						};
					}
					if (firstError.status === 400) {
						return {
							code: ErrorCode.VALIDATION_ERROR,
							statusCode: 400,
						};
					}
					if (firstError.status === 429) {
						return {
							code: ErrorCode.RATE_LIMIT_ERROR,
							statusCode: 429,
						};
					}
				}

				// Look for error messages in the title or message fields
				if (firstError.title || firstError.message) {
					const errorText = String(
						firstError.title || firstError.message,
					).toLowerCase();
					if (errorText.includes('not found')) {
						return { code: ErrorCode.NOT_FOUND, statusCode: 404 };
					}
					if (
						errorText.includes('access') ||
						errorText.includes('permission')
					) {
						return {
							code: ErrorCode.ACCESS_DENIED,
							statusCode: 403,
						};
					}
					if (
						errorText.includes('invalid') ||
						errorText.includes('required')
					) {
						return {
							code: ErrorCode.VALIDATION_ERROR,
							statusCode: 400,
						};
					}
					if (
						errorText.includes('rate limit') ||
						errorText.includes('too many requests')
					) {
						return {
							code: ErrorCode.RATE_LIMIT_ERROR,
							statusCode: 429,
						};
					}
				}
			}
		}
	}

	// Not Found detection
	if (
		errorMessage.includes('not found') ||
		errorMessage.includes('does not exist') ||
		statusCode === 404
	) {
		return { code: ErrorCode.NOT_FOUND, statusCode: 404 };
	}

	// Access Denied detection
	if (
		errorMessage.includes('access') ||
		errorMessage.includes('permission') ||
		errorMessage.includes('authorize') ||
		errorMessage.includes('authentication') ||
		statusCode === 401 ||
		statusCode === 403
	) {
		return { code: ErrorCode.ACCESS_DENIED, statusCode: statusCode || 403 };
	}

	// Invalid Cursor detection
	if (
		(errorMessage.includes('cursor') ||
			errorMessage.includes('startAt') ||
			errorMessage.includes('page')) &&
		(errorMessage.includes('invalid') || errorMessage.includes('not valid'))
	) {
		return { code: ErrorCode.INVALID_CURSOR, statusCode: 400 };
	}

	// Validation Error detection
	if (
		errorMessage.includes('validation') ||
		errorMessage.includes('invalid') ||
		errorMessage.includes('required') ||
		statusCode === 400 ||
		statusCode === 422
	) {
		return {
			code: ErrorCode.VALIDATION_ERROR,
			statusCode: statusCode || 400,
		};
	}

	// Default to unexpected error
	return {
		code: ErrorCode.UNEXPECTED_ERROR,
		statusCode: statusCode || 500,
	};
}

/**
 * Create user-friendly error messages based on error type and context
 * @param code The error code
 * @param context Context information for better error messages
 * @param originalMessage The original error message
 * @returns User-friendly error message
 */
export function createUserFriendlyErrorMessage(
	code: ErrorCode,
	context: ErrorContext = {},
	originalMessage?: string,
): string {
	const methodLogger = Logger.forContext(
		'utils/error-handler.util.ts',
		'createUserFriendlyErrorMessage',
	);
	const { entityType, entityId, operation } = context;

	// Format entity ID for display
	let entityIdStr = '';
	if (entityId) {
		if (typeof entityId === 'string') {
			entityIdStr = entityId;
		} else {
			// Handle object entityId (like ProjectIdentifier)
			entityIdStr = Object.values(entityId).join('/');
		}
	}

	// Determine entity display name
	const entity = entityType
		? `${entityType}${entityIdStr ? ` ${entityIdStr}` : ''}`
		: 'Resource';

	let message = '';

	switch (code) {
		case ErrorCode.NOT_FOUND:
			message = `${entity} not found${entityIdStr ? `: ${entityIdStr}` : ''}. Verify the ID is correct and that you have access to this ${entityType?.toLowerCase() || 'resource'}.`;

			// Bitbucket-specific guidance
			if (
				entityType === 'Repository' ||
				entityType === 'PullRequest' ||
				entityType === 'Branch'
			) {
				message += ` Make sure the workspace and ${entityType.toLowerCase()} names are spelled correctly and that you have permission to access it.`;
			}
			break;

		case ErrorCode.ACCESS_DENIED:
			message = `Access denied for ${entity.toLowerCase()}${entityIdStr ? ` ${entityIdStr}` : ''}. Verify your credentials and permissions.`;

			// Bitbucket-specific guidance
			message += ` Ensure your Bitbucket API token/app password has sufficient privileges and hasn't expired. If using a workspace/repository name, check that it's spelled correctly.`;
			break;

		case ErrorCode.INVALID_CURSOR:
			message = `Invalid pagination cursor. Use the exact cursor string returned from previous results.`;

			// Bitbucket-specific guidance
			message += ` Bitbucket pagination typically uses page numbers. Check that the page number is valid and within range.`;
			break;

		case ErrorCode.VALIDATION_ERROR:
			message =
				originalMessage ||
				`Invalid data provided for ${operation || 'operation'} ${entity.toLowerCase()}.`;

			// The originalMessage already includes error details for VALIDATION_ERROR
			break;

		case ErrorCode.NETWORK_ERROR:
			message = `Network error while ${operation || 'connecting to'} the Bitbucket API. Please check your internet connection and try again.`;
			break;

		case ErrorCode.RATE_LIMIT_ERROR:
			message = `Bitbucket API rate limit exceeded. Please wait a moment and try again, or reduce the frequency of requests.`;

			// Bitbucket-specific guidance
			message += ` Bitbucket's API has rate limits per IP address and additional limits for authenticated users.`;
			break;

		default:
			message = `An unexpected error occurred while ${operation || 'processing'} ${entity.toLowerCase()}.`;
	}

	// Include original message details if available and appropriate
	if (
		originalMessage &&
		code !== ErrorCode.NOT_FOUND &&
		code !== ErrorCode.ACCESS_DENIED
	) {
		message += ` Error details: ${originalMessage}`;
	}

	methodLogger.debug(`Created user-friendly message: ${message}`, {
		code,
		context,
	});
	return message;
}

/**
 * Handle controller errors consistently
 * @param error The error to handle
 * @param context Context information for better error messages
 * @returns Never returns, always throws an error
 */
export function handleControllerError(
	error: unknown,
	context: ErrorContext = {},
): never {
	const methodLogger = Logger.forContext(
		'utils/error-handler.util.ts',
		'handleControllerError',
	);

	// Extract error details
	const errorMessage = error instanceof Error ? error.message : String(error);
	const statusCode =
		error instanceof Error && 'statusCode' in error
			? (error as { statusCode: number }).statusCode
			: undefined;

	// Detect error type using utility
	const { code, statusCode: detectedStatus } = detectErrorType(
		error,
		context,
	);

	// Combine detected status with explicit status
	const finalStatusCode = statusCode || detectedStatus;

	// Format entity information for logging
	const { entityType, entityId, operation } = context;
	const entity = entityType || 'resource';
	const entityIdStr = entityId
		? typeof entityId === 'string'
			? entityId
			: JSON.stringify(entityId)
		: '';
	const actionStr = operation || 'processing';

	// Log detailed error information
	methodLogger.error(
		`Error ${actionStr} ${entity}${
			entityIdStr ? `: ${entityIdStr}` : ''
		}: ${errorMessage}`,
		error,
	);

	// Create user-friendly error message for the response
	const message =
		code === ErrorCode.VALIDATION_ERROR
			? errorMessage
			: createUserFriendlyErrorMessage(code, context, errorMessage);

	// Throw an appropriate API error with the user-friendly message
	throw createApiError(message, finalStatusCode, error);
}

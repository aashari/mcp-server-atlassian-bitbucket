import { describe, expect, test } from '@jest/globals';
import {
	ErrorType,
	McpError,
	createApiError,
	createAuthMissingError,
	createAuthInvalidError,
	createUnexpectedError,
	ensureMcpError,
	formatErrorForMcpTool,
	formatErrorForMcpResource,
	getDeepOriginalError,
} from './error.util.js';

describe('Error Utilities', () => {
	describe('Error creation functions', () => {
		test('createAuthMissingError creates an error with AUTH_MISSING type', () => {
			const error = createAuthMissingError('Missing credentials');
			expect(error).toBeInstanceOf(McpError);
			expect(error.type).toBe(ErrorType.AUTH_MISSING);
			expect(error.message).toBe('Missing credentials');
			expect(error.statusCode).toBeUndefined();
		});

		test('createAuthInvalidError creates an error with AUTH_INVALID type and 401 status', () => {
			const error = createAuthInvalidError('Invalid token');
			expect(error).toBeInstanceOf(McpError);
			expect(error.type).toBe(ErrorType.AUTH_INVALID);
			expect(error.message).toBe('Invalid token');
			expect(error.statusCode).toBe(401);
		});

		test('createApiError creates an error with API_ERROR type and specified status', () => {
			const error = createApiError('Not found', 404, {
				details: 'Resource missing',
			});
			expect(error).toBeInstanceOf(McpError);
			expect(error.type).toBe(ErrorType.API_ERROR);
			expect(error.message).toBe('Not found');
			expect(error.statusCode).toBe(404);
			expect(error.originalError).toEqual({
				details: 'Resource missing',
			});
		});

		test('createUnexpectedError creates an error with UNEXPECTED_ERROR type', () => {
			const originalError = new Error('Original error');
			const error = createUnexpectedError(
				'Something went wrong',
				originalError,
			);
			expect(error).toBeInstanceOf(McpError);
			expect(error.type).toBe(ErrorType.UNEXPECTED_ERROR);
			expect(error.message).toBe('Something went wrong');
			expect(error.statusCode).toBeUndefined();
			expect(error.originalError).toBe(originalError);
		});
	});

	describe('ensureMcpError function', () => {
		test('returns the error if it is already an McpError', () => {
			const error = createApiError('API error', 500);
			expect(ensureMcpError(error)).toBe(error);
		});

		test('wraps a standard Error with McpError', () => {
			const stdError = new Error('Standard error');
			const mcpError = ensureMcpError(stdError);
			expect(mcpError).toBeInstanceOf(McpError);
			expect(mcpError.message).toBe('Standard error');
			expect(mcpError.type).toBe(ErrorType.UNEXPECTED_ERROR);
			expect(mcpError.originalError).toBe(stdError);
		});

		test('wraps a string with McpError', () => {
			const mcpError = ensureMcpError('Error message');
			expect(mcpError).toBeInstanceOf(McpError);
			expect(mcpError.message).toBe('Error message');
			expect(mcpError.type).toBe(ErrorType.UNEXPECTED_ERROR);
		});

		test('wraps other types with McpError', () => {
			const mcpError = ensureMcpError({ message: 'Object error' });
			expect(mcpError).toBeInstanceOf(McpError);
			expect(mcpError.message).toBe('[object Object]');
			expect(mcpError.type).toBe(ErrorType.UNEXPECTED_ERROR);
		});
	});

	describe('getDeepOriginalError function', () => {
		test('returns the deepest error in a chain', () => {
			const deepestError = { message: 'Root cause' };
			const level3 = createApiError('Level 3', 500, deepestError);
			const level2 = createApiError('Level 2', 500, level3);
			const level1 = createApiError('Level 1', 500, level2);

			expect(getDeepOriginalError(level1)).toEqual(deepestError);
		});

		test('handles non-McpError values', () => {
			const originalValue = 'Original error text';
			expect(getDeepOriginalError(originalValue)).toBe(originalValue);
		});

		test('stops traversing at maximum depth', () => {
			// Create a circular error chain that would cause infinite recursion
			const circular1: any = new McpError(
				'Circular 1',
				ErrorType.API_ERROR,
			);
			const circular2: any = new McpError(
				'Circular 2',
				ErrorType.API_ERROR,
			);
			circular1.originalError = circular2;
			circular2.originalError = circular1;

			// Should not cause infinite recursion
			const result = getDeepOriginalError(circular1);

			// Expect either circular1 or circular2 depending on max depth
			expect([circular1, circular2]).toContain(result);
		});
	});

	describe('formatErrorForMcpTool function', () => {
		test('formats an McpError for MCP tool response with raw error details', () => {
			const originalError = {
				code: 'NOT_FOUND',
				message: 'Repository does not exist',
			};
			const error = createApiError(
				'Resource not found',
				404,
				originalError,
			);

			const formatted = formatErrorForMcpTool(error);

			expect(formatted).toHaveProperty('content');
			expect(formatted).toHaveProperty('isError', true);
			expect(formatted.content[0].type).toBe('text');
			// Should contain the error message
			expect(formatted.content[0].text).toContain(
				'Error: Resource not found',
			);
			// Should contain HTTP status
			expect(formatted.content[0].text).toContain('HTTP Status: 404');
			// Should contain raw API response with original error details
			expect(formatted.content[0].text).toContain('Raw API Response:');
			expect(formatted.content[0].text).toContain('NOT_FOUND');
			expect(formatted.content[0].text).toContain(
				'Repository does not exist',
			);
		});

		test('formats a non-McpError for MCP tool response', () => {
			const error = new Error('Standard error');

			const formatted = formatErrorForMcpTool(error);

			expect(formatted).toHaveProperty('content');
			expect(formatted).toHaveProperty('isError', true);
			expect(formatted.content[0].type).toBe('text');
			expect(formatted.content[0].text).toContain(
				'Error: Standard error',
			);
		});

		test('extracts detailed error information from nested errors', () => {
			const deepError = {
				message: 'API quota exceeded',
				type: 'RateLimitError',
			};
			const midError = createApiError(
				'Rate limit exceeded',
				429,
				deepError,
			);
			const topError = createApiError('API error', 429, midError);

			const formatted = formatErrorForMcpTool(topError);

			expect(formatted.content[0].text).toContain('Error: API error');
			// Should include the deep error details in raw response
			expect(formatted.content[0].text).toContain('API quota exceeded');
			expect(formatted.content[0].text).toContain('RateLimitError');
		});
	});

	describe('formatErrorForMcpResource', () => {
		it('should format an error for MCP resource response', () => {
			const error = createApiError('API error');
			const response = formatErrorForMcpResource(error, 'test://uri');

			expect(response).toHaveProperty('contents');
			expect(response.contents).toHaveLength(1);
			expect(response.contents[0]).toHaveProperty('uri', 'test://uri');
			expect(response.contents[0]).toHaveProperty(
				'text',
				'Error: API error',
			);
			expect(response.contents[0]).toHaveProperty(
				'mimeType',
				'text/plain',
			);
			expect(response.contents[0]).toHaveProperty(
				'description',
				'Error: API_ERROR',
			);
		});
	});
});

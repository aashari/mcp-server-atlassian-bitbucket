import {
	fetchAtlassian,
	getAtlassianCredentials,
} from '../utils/transport.util.js';
import { Logger } from '../utils/logger.util.js';
import { handleControllerError } from '../utils/error-handler.util.js';
import { ControllerResponse } from '../types/common.types.js';
import {
	GetApiToolArgsType,
	RequestWithBodyArgsType,
} from '../tools/atlassian.api.types.js';
import { applyJqFilter, toOutputString } from '../utils/jq.util.js';
import { createAuthMissingError } from '../utils/error.util.js';

// Logger instance for this module
const logger = Logger.forContext('controllers/atlassian.api.controller.ts');

/**
 * Supported HTTP methods for API requests
 */
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * Output format type
 */
type OutputFormat = 'toon' | 'json';

/**
 * Base options for all API requests
 */
interface BaseRequestOptions {
	path: string;
	queryParams?: Record<string, string>;
	jq?: string;
	outputFormat?: OutputFormat;
}

/**
 * Options for requests that include a body (POST, PUT, PATCH)
 */
interface RequestWithBodyOptions extends BaseRequestOptions {
	body?: Record<string, unknown>;
}

/**
 * Normalizes the API path by ensuring it starts with /2.0
 * @param path - The raw path provided by the user
 * @returns Normalized path with /2.0 prefix
 */
function normalizePath(path: string): string {
	let normalizedPath = path;
	if (!normalizedPath.startsWith('/')) {
		normalizedPath = '/' + normalizedPath;
	}
	if (!normalizedPath.startsWith('/2.0')) {
		normalizedPath = '/2.0' + normalizedPath;
	}
	return normalizedPath;
}

/**
 * Appends query parameters to a path
 * @param path - The base path
 * @param queryParams - Optional query parameters
 * @returns Path with query string appended
 */
function appendQueryParams(
	path: string,
	queryParams?: Record<string, string>,
): string {
	if (!queryParams || Object.keys(queryParams).length === 0) {
		return path;
	}
	const queryString = new URLSearchParams(queryParams).toString();
	return path + (path.includes('?') ? '&' : '?') + queryString;
}

/**
 * Shared handler for all HTTP methods
 *
 * @param method - HTTP method (GET, POST, PUT, PATCH, DELETE)
 * @param options - Request options including path, queryParams, body (for non-GET), and jq filter
 * @returns Promise with raw JSON response (optionally filtered)
 */
async function handleRequest(
	method: HttpMethod,
	options: RequestWithBodyOptions,
): Promise<ControllerResponse> {
	const methodLogger = logger.forMethod(`handle${method}`);

	try {
		methodLogger.debug(`Making ${method} request`, {
			path: options.path,
			...(options.body && { bodyKeys: Object.keys(options.body) }),
		});

		// Get credentials
		const credentials = getAtlassianCredentials();
		if (!credentials) {
			throw createAuthMissingError();
		}

		// Normalize path and append query params
		let path = normalizePath(options.path);
		path = appendQueryParams(path, options.queryParams);

		methodLogger.debug(`${method}ing: ${path}`);

		const fetchOptions: {
			method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
			body?: Record<string, unknown>;
		} = {
			method,
		};

		// Add body for methods that support it
		if (options.body && ['POST', 'PUT', 'PATCH'].includes(method)) {
			fetchOptions.body = options.body;
		}

		const response = await fetchAtlassian<unknown>(
			credentials,
			path,
			fetchOptions,
		);
		methodLogger.debug('Successfully received response');

		// Apply JQ filter if provided, otherwise return raw data
		const result = applyJqFilter(response, options.jq);

		// Convert to output format (TOON by default, JSON if requested)
		const useToon = options.outputFormat !== 'json';
		const content = await toOutputString(result, useToon);

		return {
			content,
		};
	} catch (error) {
		throw handleControllerError(error, {
			entityType: 'API',
			operation: `${method} request`,
			source: `controllers/atlassian.api.controller.ts@handle${method}`,
			additionalInfo: { path: options.path },
		});
	}
}

/**
 * Generic GET request to Bitbucket API
 *
 * @param options - Options containing path, queryParams, and optional jq filter
 * @returns Promise with raw JSON response (optionally filtered)
 */
export async function handleGet(
	options: GetApiToolArgsType,
): Promise<ControllerResponse> {
	return handleRequest('GET', options);
}

/**
 * Generic POST request to Bitbucket API
 *
 * @param options - Options containing path, body, queryParams, and optional jq filter
 * @returns Promise with raw JSON response (optionally filtered)
 */
export async function handlePost(
	options: RequestWithBodyArgsType,
): Promise<ControllerResponse> {
	return handleRequest('POST', options);
}

/**
 * Generic PUT request to Bitbucket API
 *
 * @param options - Options containing path, body, queryParams, and optional jq filter
 * @returns Promise with raw JSON response (optionally filtered)
 */
export async function handlePut(
	options: RequestWithBodyArgsType,
): Promise<ControllerResponse> {
	return handleRequest('PUT', options);
}

/**
 * Generic PATCH request to Bitbucket API
 *
 * @param options - Options containing path, body, queryParams, and optional jq filter
 * @returns Promise with raw JSON response (optionally filtered)
 */
export async function handlePatch(
	options: RequestWithBodyArgsType,
): Promise<ControllerResponse> {
	return handleRequest('PATCH', options);
}

/**
 * Generic DELETE request to Bitbucket API
 *
 * @param options - Options containing path, queryParams, and optional jq filter
 * @returns Promise with raw JSON response (optionally filtered)
 */
export async function handleDelete(
	options: GetApiToolArgsType,
): Promise<ControllerResponse> {
	return handleRequest('DELETE', options);
}

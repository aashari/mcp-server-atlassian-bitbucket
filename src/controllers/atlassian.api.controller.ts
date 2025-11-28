import {
	fetchAtlassian,
	getAtlassianCredentials,
} from '../utils/transport.util.js';
import { Logger } from '../utils/logger.util.js';
import { handleControllerError } from '../utils/error-handler.util.js';
import { ControllerResponse } from '../types/common.types.js';
import {
	GetApiToolArgsType,
	PostApiToolArgsType,
} from '../tools/atlassian.api.types.js';
import { applyJqFilter, toJsonString } from '../utils/jq.util.js';
import { createAuthMissingError } from '../utils/error.util.js';

// Logger instance for this module
const logger = Logger.forContext('controllers/atlassian.api.controller.ts');

/**
 * Generic GET request to Bitbucket API
 *
 * @param options - Options containing path, queryParams, and optional jq filter
 * @returns Promise with raw JSON response (optionally filtered)
 */
export async function handleGet(
	options: GetApiToolArgsType,
): Promise<ControllerResponse> {
	const methodLogger = logger.forMethod('handleGet');

	try {
		methodLogger.debug('Making GET request', options);

		// Get credentials
		const credentials = getAtlassianCredentials();
		if (!credentials) {
			throw createAuthMissingError();
		}

		// Ensure path starts with /
		let path = options.path;
		if (!path.startsWith('/')) {
			path = '/' + path;
		}

		// Ensure path starts with /2.0 for Bitbucket API versioning
		if (!path.startsWith('/2.0')) {
			path = '/2.0' + path;
		}

		// Build query string if queryParams provided
		if (
			options.queryParams &&
			Object.keys(options.queryParams).length > 0
		) {
			const queryString = new URLSearchParams(
				options.queryParams,
			).toString();
			path = path + (path.includes('?') ? '&' : '?') + queryString;
		}

		methodLogger.debug(`Fetching: ${path}`);
		const response = await fetchAtlassian<unknown>(credentials, path, {
			method: 'GET',
		});
		methodLogger.debug('Successfully retrieved response');

		// Apply JQ filter if provided, otherwise return raw data
		const result = applyJqFilter(response, options.jq);

		return {
			content: toJsonString(result),
		};
	} catch (error) {
		throw handleControllerError(error, {
			entityType: 'API',
			operation: 'GET request',
			source: 'controllers/atlassian.api.controller.ts@handleGet',
			additionalInfo: { options },
		});
	}
}

/**
 * Generic POST request to Bitbucket API
 *
 * @param options - Options containing path, body, queryParams, and optional jq filter
 * @returns Promise with raw JSON response (optionally filtered)
 */
export async function handlePost(
	options: PostApiToolArgsType,
): Promise<ControllerResponse> {
	const methodLogger = logger.forMethod('handlePost');

	try {
		methodLogger.debug('Making POST request', {
			path: options.path,
			bodyKeys: Object.keys(options.body || {}),
		});

		// Get credentials
		const credentials = getAtlassianCredentials();
		if (!credentials) {
			throw createAuthMissingError();
		}

		// Ensure path starts with /
		let path = options.path;
		if (!path.startsWith('/')) {
			path = '/' + path;
		}

		// Ensure path starts with /2.0 for Bitbucket API versioning
		if (!path.startsWith('/2.0')) {
			path = '/2.0' + path;
		}

		// Build query string if queryParams provided
		if (
			options.queryParams &&
			Object.keys(options.queryParams).length > 0
		) {
			const queryString = new URLSearchParams(
				options.queryParams,
			).toString();
			path = path + (path.includes('?') ? '&' : '?') + queryString;
		}

		methodLogger.debug(`POSTing to: ${path}`);
		const response = await fetchAtlassian<unknown>(credentials, path, {
			method: 'POST',
			body: options.body,
		});
		methodLogger.debug('Successfully received response');

		// Apply JQ filter if provided, otherwise return raw data
		const result = applyJqFilter(response, options.jq);

		return {
			content: toJsonString(result),
		};
	} catch (error) {
		throw handleControllerError(error, {
			entityType: 'API',
			operation: 'POST request',
			source: 'controllers/atlassian.api.controller.ts@handlePost',
			additionalInfo: { path: options.path },
		});
	}
}

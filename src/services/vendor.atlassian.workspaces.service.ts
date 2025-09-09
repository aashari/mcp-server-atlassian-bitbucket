import { z } from 'zod';
import {
	createAuthMissingError,
	createApiError,
	McpError,
} from '../utils/error.util.js';
import { Logger } from '../utils/logger.util.js';
import {
	fetchAtlassian,
	getAtlassianCredentials,
} from '../utils/transport.util.js';
import {
	WorkspaceDetailedSchema,
	WorkspacePermissionsResponseSchema,
	ListWorkspacesParamsSchema,
	type ListWorkspacesParams,
} from './vendor.atlassian.workspaces.types.js';

/**
 * Base API path for Bitbucket REST API v2
 * @see https://developer.atlassian.com/cloud/bitbucket/rest/api-group-workspaces/
 * @constant {string}
 */
const API_PATH = '/2.0';

/**
 * @namespace VendorAtlassianWorkspacesService
 * @description Service for interacting with Bitbucket Workspaces API.
 * Provides methods for listing workspaces and retrieving workspace details.
 * All methods require valid Atlassian credentials configured in the environment.
 */

// Create a contextualized logger for this file
const serviceLogger = Logger.forContext(
	'services/vendor.atlassian.workspaces.service.ts',
);

// Log service initialization
serviceLogger.debug('Bitbucket workspaces service initialized');

/**
 * List Bitbucket workspaces with optional filtering and pagination
 *
 * Retrieves a list of workspaces from Bitbucket with support for various filters
 * and pagination options.
 *
 * NOTE: The /2.0/user/permissions/workspaces endpoint does not support sorting,
 * despite the ListWorkspacesParams type including a sort parameter.
 *
 * @async
 * @memberof VendorAtlassianWorkspacesService
 * @param {ListWorkspacesParams} [params={}] - Optional parameters for customizing the request
 * @param {string} [params.q] - Filter by workspace name
 * @param {number} [params.page] - Page number
 * @param {number} [params.pagelen] - Number of items per page
 * @returns {Promise<z.infer<typeof WorkspacePermissionsResponseSchema>>} Promise containing the validated workspaces response
 * @throws {McpError} If validation fails, credentials are missing, or API request fails
 * @example
 * // List workspaces with pagination
 * const response = await list({
 *   pagelen: 10
 * });
 */
async function list(
	params: ListWorkspacesParams = {},
): Promise<z.infer<typeof WorkspacePermissionsResponseSchema>> {
	const methodLogger = Logger.forContext(
		'services/vendor.atlassian.workspaces.service.ts',
		'list',
	);
	methodLogger.debug('Listing Bitbucket workspaces with params:', params);

	// Validate params with Zod
	try {
		ListWorkspacesParamsSchema.parse(params);
	} catch (error) {
		if (error instanceof z.ZodError) {
			methodLogger.error(
				'Invalid parameters provided to list workspaces:',
				error.format(),
			);
			throw createApiError(
				`Invalid parameters for listing workspaces: ${error.issues.map((e) => e.message).join(', ')}`,
				400,
				error,
			);
		}
		throw error;
	}

	const credentials = getAtlassianCredentials();
	if (!credentials) {
		throw createAuthMissingError(
			'Atlassian credentials are required for this operation',
		);
	}

	// Build query parameters
	const queryParams = new URLSearchParams();

	// Add optional query parameters if provided
	// NOTE: Sort is intentionally not included as the /2.0/user/permissions/workspaces endpoint
	// does not support sorting on any field
	if (params.q) {
		queryParams.set('q', params.q);
	}
	if (params.pagelen) {
		queryParams.set('pagelen', params.pagelen.toString());
	}
	if (params.page) {
		queryParams.set('page', params.page.toString());
	}

	const queryString = queryParams.toString()
		? `?${queryParams.toString()}`
		: '';
	const path = `${API_PATH}/user/permissions/workspaces${queryString}`;

	methodLogger.debug(`Sending request to: ${path}`);
	try {
		const rawData = await fetchAtlassian(credentials, path);
		// Validate response with Zod schema
		try {
			const validatedData =
				WorkspacePermissionsResponseSchema.parse(rawData);
			return validatedData;
		} catch (error) {
			if (error instanceof z.ZodError) {
				methodLogger.error(
					'Invalid response from Bitbucket API:',
					error.format(),
				);
				throw createApiError(
					`Invalid response format from Bitbucket API for workspace list: ${error.message}`,
					500,
					error,
				);
			}
			throw error;
		}
	} catch (error) {
		if (error instanceof McpError) {
			throw error;
		}
		throw createApiError(
			`Failed to list workspaces: ${error instanceof Error ? error.message : String(error)}`,
			500,
			error,
		);
	}
}

/**
 * Get detailed information about a specific Bitbucket workspace
 *
 * Retrieves comprehensive details about a single workspace.
 *
 * @async
 * @memberof VendorAtlassianWorkspacesService
 * @param {string} workspace - The workspace slug
 * @returns {Promise<z.infer<typeof WorkspaceDetailedSchema>>} Promise containing the validated workspace information
 * @throws {McpError} If validation fails, credentials are missing, or API request fails
 * @example
 * // Get workspace details
 * const workspace = await get('my-workspace');
 */
async function get(
	workspace: string,
): Promise<z.infer<typeof WorkspaceDetailedSchema>> {
	const methodLogger = Logger.forContext(
		'services/vendor.atlassian.workspaces.service.ts',
		'get',
	);
	methodLogger.debug(`Getting Bitbucket workspace with slug: ${workspace}`);

	const credentials = getAtlassianCredentials();
	if (!credentials) {
		throw createAuthMissingError(
			'Atlassian credentials are required for this operation',
		);
	}

	// Currently no query parameters for workspace details API
	const path = `${API_PATH}/workspaces/${workspace}`;

	methodLogger.debug(`Sending request to: ${path}`);
	try {
		const rawData = await fetchAtlassian(credentials, path);
		// Validate response with Zod schema
		try {
			const validatedData = WorkspaceDetailedSchema.parse(rawData);
			return validatedData;
		} catch (error) {
			if (error instanceof z.ZodError) {
				methodLogger.error(
					'Invalid response from Bitbucket API:',
					error.format(),
				);
				throw createApiError(
					`Invalid response format from Bitbucket API for workspace details: ${error.message}`,
					500,
					error,
				);
			}
			throw error;
		}
	} catch (error) {
		if (error instanceof McpError) {
			throw error;
		}
		throw createApiError(
			`Failed to get workspace details: ${error instanceof Error ? error.message : String(error)}`,
			500,
			error,
		);
	}
}

export default { list, get };

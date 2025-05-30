import atlassianWorkspacesService from '../services/vendor.atlassian.workspaces.service.js';
import { Logger } from '../utils/logger.util.js';
import { handleControllerError } from '../utils/error-handler.util.js';
import {
	extractPaginationInfo,
	PaginationType,
} from '../utils/pagination.util.js';
import { ControllerResponse } from '../types/common.types.js';
import {
	ListWorkspacesToolArgsType,
	GetWorkspaceToolArgsType,
} from '../tools/atlassian.workspaces.types.js';
import {
	formatWorkspacesList,
	formatWorkspaceDetails,
} from './atlassian.workspaces.formatter.js';
import { ListWorkspacesParams } from '../services/vendor.atlassian.workspaces.types.js';
import { DEFAULT_PAGE_SIZE, applyDefaults } from '../utils/defaults.util.js';
import { formatPagination } from '../utils/formatter.util.js';

// Create a contextualized logger for this file
const controllerLogger = Logger.forContext(
	'controllers/atlassian.workspaces.controller.ts',
);

// Log controller initialization
controllerLogger.debug('Bitbucket workspaces controller initialized');

/**
 * Controller for managing Bitbucket workspaces.
 * Provides functionality for listing workspaces and retrieving workspace details.
 */

/**
 * List Bitbucket workspaces with optional filtering
 * @param options - Options for listing workspaces
 * @param options.limit - Maximum number of workspaces to return
 * @param options.cursor - Pagination cursor for retrieving the next set of results
 * @returns Promise with formatted workspace list content including pagination information
 */
async function list(
	options: ListWorkspacesToolArgsType,
): Promise<ControllerResponse> {
	const methodLogger = Logger.forContext(
		'controllers/atlassian.workspaces.controller.ts',
		'list',
	);
	methodLogger.debug('Listing Bitbucket workspaces...', options);

	try {
		// Create defaults object with proper typing
		const defaults: Partial<ListWorkspacesToolArgsType> = {
			limit: DEFAULT_PAGE_SIZE,
		};

		// Apply defaults
		const mergedOptions = applyDefaults<ListWorkspacesToolArgsType>(
			options,
			defaults,
		);

		// Map controller filters to service params
		const serviceParams: ListWorkspacesParams = {
			pagelen: mergedOptions.limit, // Default page length
			page: mergedOptions.cursor
				? parseInt(mergedOptions.cursor, 10)
				: undefined, // Use cursor value for page
			// NOTE: Sort parameter is not included as the Bitbucket API's /2.0/user/permissions/workspaces
			// endpoint does not support sorting on any field
		};

		methodLogger.debug('Using filters:', serviceParams);

		const workspacesData =
			await atlassianWorkspacesService.list(serviceParams);

		methodLogger.debug(
			`Retrieved ${workspacesData.values?.length || 0} workspaces`,
		);

		// Extract pagination information using the utility
		const pagination = extractPaginationInfo(
			workspacesData,
			PaginationType.PAGE,
		);

		// Format the workspaces data for display using the formatter
		const formattedWorkspaces = formatWorkspacesList(workspacesData);

		// Create the final content by combining the formatted workspaces with pagination information
		let finalContent = formattedWorkspaces;

		// Add pagination information if available
		if (
			pagination &&
			(pagination.hasMore || pagination.count !== undefined)
		) {
			const paginationString = formatPagination(pagination);
			finalContent += '\n\n' + paginationString;
		}

		return {
			content: finalContent,
		};
	} catch (error) {
		// Use the standardized error handler
		throw handleControllerError(error, {
			entityType: 'Workspaces',
			operation: 'listing',
			source: 'controllers/atlassian.workspaces.controller.ts@list',
			additionalInfo: { options },
		});
	}
}

/**
 * Get details of a specific Bitbucket workspace
 * @param identifier - Object containing the workspace slug
 * @param identifier.workspaceSlug - The slug of the workspace to retrieve
 * @returns Promise with formatted workspace details content
 * @throws Error if workspace retrieval fails
 */
async function get(
	identifier: GetWorkspaceToolArgsType,
): Promise<ControllerResponse> {
	const { workspaceSlug } = identifier;
	const methodLogger = Logger.forContext(
		'controllers/atlassian.workspaces.controller.ts',
		'get',
	);

	methodLogger.debug(
		`Getting Bitbucket workspace with slug: ${workspaceSlug}...`,
	);

	try {
		const workspaceData =
			await atlassianWorkspacesService.get(workspaceSlug);
		methodLogger.debug(`Retrieved workspace: ${workspaceData.slug}`);

		// Since membership info isn't directly available, we'll use the workspace data only
		methodLogger.debug(
			'Membership info not available, using workspace data only',
		);

		// Format the workspace data for display using the formatter
		const formattedWorkspace = formatWorkspaceDetails(
			workspaceData,
			undefined, // Pass undefined instead of membership data
		);

		return {
			content: formattedWorkspace,
		};
	} catch (error) {
		// Use the standardized error handler
		throw handleControllerError(error, {
			entityType: 'Workspace',
			operation: 'retrieving',
			source: 'controllers/atlassian.workspaces.controller.ts@get',
			additionalInfo: { identifier },
		});
	}
}

export default { list, get };

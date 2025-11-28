import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { Logger } from '../utils/logger.util.js';
import { formatErrorForMcpTool } from '../utils/error.util.js';
import {
	ListWorkspacesToolArgs,
	type ListWorkspacesToolArgsType,
	type GetWorkspaceToolArgsType,
	GetWorkspaceToolArgs,
} from './atlassian.workspaces.types.js';

import atlassianWorkspacesController from '../controllers/atlassian.workspaces.controller.js';

// Create a contextualized logger for this file
const toolLogger = Logger.forContext('tools/atlassian.workspaces.tool.ts');

// Log tool initialization
toolLogger.debug('Bitbucket workspaces tool initialized');

/**
 * MCP Tool: List Bitbucket Workspaces
 *
 * Lists Bitbucket workspaces available to the authenticated user with optional filtering.
 * Returns a formatted markdown response with workspace details.
 *
 * @param args - Tool arguments for filtering workspaces
 * @returns MCP response with formatted workspaces list
 * @throws Will return error message if workspace listing fails
 */
async function listWorkspaces(args: Record<string, unknown>) {
	const methodLogger = Logger.forContext(
		'tools/atlassian.workspaces.tool.ts',
		'listWorkspaces',
	);
	methodLogger.debug('Listing Bitbucket workspaces with filters:', args);

	try {
		// Pass args directly to controller without any logic
		const result = await atlassianWorkspacesController.list(
			args as ListWorkspacesToolArgsType,
		);

		methodLogger.debug('Successfully retrieved workspaces from controller');

		return {
			content: [
				{
					type: 'text' as const,
					text: result.content,
				},
			],
		};
	} catch (error) {
		methodLogger.error('Failed to list workspaces', error);
		return formatErrorForMcpTool(error);
	}
}

/**
 * MCP Tool: Get Bitbucket Workspace Details
 *
 * Retrieves detailed information about a specific Bitbucket workspace.
 * Returns a formatted markdown response with workspace metadata.
 *
 * @param args - Tool arguments containing the workspace slug
 * @returns MCP response with formatted workspace details
 * @throws Will return error message if workspace retrieval fails
 */
async function getWorkspace(args: Record<string, unknown>) {
	const methodLogger = Logger.forContext(
		'tools/atlassian.workspaces.tool.ts',
		'getWorkspace',
	);
	methodLogger.debug('Getting workspace details:', args);

	try {
		// Pass args directly to controller without any logic
		const result = await atlassianWorkspacesController.get(
			args as GetWorkspaceToolArgsType,
		);

		methodLogger.debug(
			'Successfully retrieved workspace details from controller',
		);

		return {
			content: [
				{
					type: 'text' as const,
					text: result.content,
				},
			],
		};
	} catch (error) {
		methodLogger.error('Failed to get workspace details', error);
		return formatErrorForMcpTool(error);
	}
}

/**
 * Register all Bitbucket workspace tools with the MCP server.
 */
function registerTools(server: McpServer) {
	const registerLogger = Logger.forContext(
		'tools/atlassian.workspaces.tool.ts',
		'registerTools',
	);
	registerLogger.debug('Registering Workspace tools...');

	// Register the list workspaces tool
	server.tool(
		'bb_ls_workspaces',
		`Lists workspaces within your Bitbucket account. Returns a formatted Markdown list showing workspace slugs, names, and membership role. Requires Bitbucket credentials to be configured.`,
		ListWorkspacesToolArgs.shape,
		listWorkspaces,
	);

	// Register the get workspace details tool
	server.tool(
		'bb_get_workspace',
		`Retrieves detailed information for a workspace identified by \`workspaceSlug\`. Returns raw JSON response from Bitbucket API. Use the optional \`jq\` parameter with a JMESPath expression to filter/transform the response (e.g., "name", "links.html.href", "{name: name, slug: slug}"). Requires Bitbucket credentials to be configured.`,
		GetWorkspaceToolArgs.shape,
		getWorkspace,
	);

	registerLogger.debug('Successfully registered Workspace tools');
}

export default { registerTools };

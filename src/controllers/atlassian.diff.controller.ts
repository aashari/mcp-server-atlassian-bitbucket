import { Logger } from '../utils/logger.util.js';
import { handleControllerError } from '../utils/error-handler.util.js';
import { DEFAULT_PAGE_SIZE, applyDefaults } from '../utils/defaults.util.js';
import { ControllerResponse } from '../types/common.types.js';
import {
	extractPaginationInfo,
	PaginationType,
} from '../utils/pagination.util.js';
import { formatPagination } from '../utils/formatter.util.js';
import * as diffService from '../services/vendor.atlassian.repositories.diff.service.js';
import { formatDiffstat, formatFullDiff } from './atlassian.diff.formatter.js';
import { getDefaultWorkspace } from '../utils/workspace.util.js';

const controllerLogger = Logger.forContext(
	'controllers/atlassian.diff.controller.ts',
);
controllerLogger.debug('Bitbucket diff controller initialized');

/**
 * Base interface that extends Record<string, unknown> for error handling compatibility
 */
interface BaseDiffOptions extends Record<string, unknown> {
	workspaceSlug?: string;
	repoSlug: string;
	includeFullDiff?: boolean;
	limit?: number;
	cursor?: number;
	topic?: boolean;
}

/**
 * Interface for branch diff options
 */
interface BranchDiffOptions extends BaseDiffOptions {
	sourceBranch: string;
	destinationBranch?: string;
}

/**
 * Interface for commit diff options
 */
interface CommitDiffOptions extends BaseDiffOptions {
	sinceCommit: string;
	untilCommit: string;
}

/**
 * Compare two branches and return the differences
 *
 * @param options - Options for branch comparison
 * @returns Promise with formatted diff content and pagination
 */
async function branchDiff(
	options: BranchDiffOptions,
): Promise<ControllerResponse> {
	const methodLogger = controllerLogger.forMethod('branchDiff');

	try {
		methodLogger.debug('Comparing branches', options);

		// Apply defaults
		const defaults = {
			limit: DEFAULT_PAGE_SIZE,
			includeFullDiff: true,
			destinationBranch: 'main', // Default to main if not provided
			topic: false, // Default to topic=false which shows all changes between branches
		};

		// Explicitly cast the result of applyDefaults to preserve the original types
		const params = applyDefaults(options, defaults) as typeof options &
			typeof defaults;

		// Handle optional workspaceSlug
		if (!params.workspaceSlug) {
			methodLogger.debug(
				'No workspace provided, fetching default workspace',
			);
			const defaultWorkspace = await getDefaultWorkspace();
			if (!defaultWorkspace) {
				throw new Error(
					'Could not determine a default workspace. Please provide a workspaceSlug.',
				);
			}
			params.workspaceSlug = defaultWorkspace;
			methodLogger.debug(
				`Using default workspace: ${params.workspaceSlug}`,
			);
		}

		// Construct the spec (e.g., "feature..main")
		// NOTE: Bitbucket API behavior is counterintuitive:
		// - API returns diff formatted as "first_param → second_param"
		// - To show what sourceBranch ADDS to destinationBranch (the PR direction),
		//   we must REVERSE the parameters: sourceBranch..destinationBranch
		// - This ensures additions appear as + and deletions as - from the PR author's perspective
		//
		// Example: PR is feature/SP-123 → develop
		// - User expectation: see what feature/SP-123 adds to develop
		// - Spec format: "feature/SP-123..develop" (REVERSED from intuition)
		// - API returns: "develop → feature/SP-123" (but content is correct)
		//
		// This swap fixes GitHub issue #84 where PRs were incorrectly classified
		const spec = `${params.sourceBranch}..${params.destinationBranch}`;

		methodLogger.debug(`Using diff spec: ${spec}`);

		try {
			// Fetch diffstat for the branches
			const diffstat = await diffService.getDiffstat({
				workspace: params.workspaceSlug,
				repo_slug: params.repoSlug,
				spec,
				pagelen: params.limit,
				cursor: params.cursor,
				topic: params.topic,
			});

			// Extract pagination info
			const pagination = extractPaginationInfo(
				diffstat,
				PaginationType.PAGE,
			);

			// Fetch full diff if requested
			let rawDiff: string | null = null;
			if (params.includeFullDiff) {
				rawDiff = await diffService.getRawDiff({
					workspace: params.workspaceSlug,
					repo_slug: params.repoSlug,
					spec,
				});
			}
			// Format the results
			let content =
				params.includeFullDiff && rawDiff
					? formatFullDiff(
							diffstat,
							rawDiff,
							params.sourceBranch,
							params.destinationBranch,
					  )
					: formatDiffstat(
							diffstat,
							params.sourceBranch,
							params.destinationBranch,
					  );
			// Add pagination information if available
			if (
				pagination &&
				(pagination.hasMore || pagination.count !== undefined)
			) {
				const paginationString = formatPagination(pagination);
				content += '\n\n' + paginationString;
			}

			return {
				content,
			};
		} catch (error) {
			// Enhance error handling for common diff-specific errors
			if (
				error instanceof Error &&
				error.message.includes(
					'source or destination could not be found',
				)
			) {
				// Create a more user-friendly error message
				throw new Error(
					`Unable to generate diff between '${params.sourceBranch}' and '${params.destinationBranch}'. ` +
						`One or both of these branches may not exist in the repository. ` +
						`Please verify both branch names and ensure you have access to view them.`,
				);
			}
			// Re-throw other errors to be handled by the outer catch block
			throw error;
		}
	} catch (error) {
		throw handleControllerError(error, {
			entityType: 'Branch Diff',
			operation: 'comparing branches',
			source: 'controllers/atlassian.diff.controller.ts@branchDiff',
			additionalInfo: options,
		});
	}
}

/**
 * Compare two commits and return the differences
 *
 * @param options - Options for commit comparison
 * @returns Promise with formatted diff content and pagination
 */
async function commitDiff(
	options: CommitDiffOptions,
): Promise<ControllerResponse> {
	const methodLogger = controllerLogger.forMethod('commitDiff');

	try {
		methodLogger.debug('Comparing commits', options);

		// Apply defaults
		const defaults = {
			limit: DEFAULT_PAGE_SIZE,
			includeFullDiff: true,
			topic: false, // Default to topic=false which shows all changes between commits
		};

		// Explicitly cast the result of applyDefaults to preserve the original types
		const params = applyDefaults(options, defaults) as typeof options &
			typeof defaults;

		// Handle optional workspaceSlug
		if (!params.workspaceSlug) {
			methodLogger.debug(
				'No workspace provided, fetching default workspace',
			);
			const defaultWorkspace = await getDefaultWorkspace();
			if (!defaultWorkspace) {
				throw new Error(
					'Could not determine a default workspace. Please provide a workspaceSlug.',
				);
			}
			params.workspaceSlug = defaultWorkspace;
			methodLogger.debug(
				`Using default workspace: ${params.workspaceSlug}`,
			);
		}

		// Construct the spec (e.g., "a1b2c3d..e4f5g6h")
		// NOTE: Bitbucket API expects the base/since commit first, then the target/until commit
		// Construct the spec (e.g., "e4f5g6h..a1b2c3d")
		// NOTE: Bitbucket API behavior is counterintuitive (same as branches):
		// - API returns diff formatted as "first_param → second_param"
		// - To show changes FROM untilCommit TO sinceCommit correctly,
		//   we must use: untilCommit..sinceCommit
		// - This ensures the diff shows what changed between the two commits correctly
		//
		// This swap fixes GitHub issue #84 to match branch diff behavior
		const spec = `${params.untilCommit}..${params.sinceCommit}`;

		try {
			// Fetch diffstat for the commits
			const diffstat = await diffService.getDiffstat({
				workspace: params.workspaceSlug,
				repo_slug: params.repoSlug,
				spec,
				pagelen: params.limit,
				cursor: params.cursor,
			});

			// Extract pagination info
			const pagination = extractPaginationInfo(
				diffstat,
				PaginationType.PAGE,
			);

			// Fetch full diff if requested
			let rawDiff: string | null = null;
			if (params.includeFullDiff) {
				rawDiff = await diffService.getRawDiff({
					workspace: params.workspaceSlug,
					repo_slug: params.repoSlug,
					spec,
				});
			}

			// Format the results
			let content =
				params.includeFullDiff && rawDiff
					? formatFullDiff(
							diffstat,
							rawDiff,
							params.untilCommit,
							params.sinceCommit,
					  )
					: formatDiffstat(
							diffstat,
							params.untilCommit,
							params.sinceCommit,
					  );

			// Add pagination information if available
			if (
				pagination &&
				(pagination.hasMore || pagination.count !== undefined)
			) {
				const paginationString = formatPagination(pagination);
				content += '\n\n' + paginationString;
			}

			return {
				content,
			};
		} catch (error) {
			// Enhance error handling for common diff-specific errors
			if (
				error instanceof Error &&
				error.message.includes(
					'source or destination could not be found',
				)
			) {
				// Create a more user-friendly error message
				throw new Error(
					`Unable to generate diff between commits '${params.sinceCommit}' and '${params.untilCommit}'. ` +
						`One or both of these commits may not exist in the repository or may be in the wrong order. ` +
						`Please verify both commit hashes and ensure you have access to view them.`,
				);
			}
			// Re-throw other errors to be handled by the outer catch block
			throw error;
		}
	} catch (error) {
		throw handleControllerError(error, {
			entityType: 'Commit Diff',
			operation: 'comparing commits',
			source: 'controllers/atlassian.diff.controller.ts@commitDiff',
			additionalInfo: options,
		});
	}
}

export default { branchDiff, commitDiff };

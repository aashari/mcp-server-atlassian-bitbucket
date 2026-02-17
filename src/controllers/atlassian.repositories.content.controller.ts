import atlassianRepositoriesService from '../services/vendor.atlassian.repositories.service.js';
import { Logger } from '../utils/logger.util.js';
import { handleControllerError } from '../utils/error-handler.util.js';
import { ControllerResponse } from '../types/common.types.js';
import { CloneRepositoryToolArgsType } from '../tools/atlassian.repositories.types.js';
import { getDefaultWorkspace } from '../utils/workspace.util.js';
import { executeShellCommand } from '../utils/shell.util.js';
import * as path from 'path';
import * as fs from 'fs/promises';
import { constants } from 'fs';

// Logger instance for this module
const logger = Logger.forContext(
	'controllers/atlassian.repositories.content.controller.ts',
);

/**
 * Clones a Bitbucket repository to the local filesystem
 * @param options Options including repository identifiers and target path
 * @returns Information about the cloned repository
 */
export async function handleCloneRepository(
	options: CloneRepositoryToolArgsType,
): Promise<ControllerResponse> {
	const methodLogger = logger.forMethod('handleCloneRepository');
	methodLogger.debug('Cloning repository with options:', options);

	try {
		// Handle optional workspaceSlug
		let { workspaceSlug } = options;
		if (!workspaceSlug) {
			methodLogger.debug(
				'No workspace provided, fetching default workspace',
			);
			const defaultWorkspace = await getDefaultWorkspace();
			if (!defaultWorkspace) {
				throw new Error(
					'No default workspace found. Please provide a workspace slug.',
				);
			}
			workspaceSlug = defaultWorkspace;
			methodLogger.debug(`Using default workspace: ${defaultWorkspace}`);
		}

		// Required parameters check
		const { repoSlug, targetPath } = options;
		if (!repoSlug) {
			throw new Error('Repository slug is required');
		}
		if (!targetPath) {
			throw new Error('Target path is required');
		}

		// Validate repoSlug to prevent path traversal (CWE-22)
		if (!/^[a-zA-Z0-9._-]+$/.test(repoSlug)) {
			throw new Error(
				'Invalid repository slug: must contain only alphanumeric characters, hyphens, underscores, and dots.',
			);
		}

		// Normalize and resolve the target path
		// If it's a relative path, convert it to absolute based on current working directory
		const processedTargetPath = path.isAbsolute(targetPath)
			? targetPath
			: path.resolve(process.cwd(), targetPath);

		methodLogger.debug(
			`Normalized target path: ${processedTargetPath} (original: ${targetPath})`,
		);

		// Validate directory access and permissions before proceeding
		let dirExists = false;
		try {
			await fs.access(processedTargetPath, constants.F_OK);
			dirExists = true;
		} catch (err: unknown) {
			const code = (err as NodeJS.ErrnoException).code;
			if (code !== 'ENOENT') {
				throw new Error(
					`Cannot access target directory ${processedTargetPath}: ${(err as Error).message}`,
				);
			}
		}

		if (dirExists) {
			try {
				await fs.access(processedTargetPath, constants.W_OK);
				methodLogger.debug(
					`Have write permission to: ${processedTargetPath}`,
				);
			} catch {
				throw new Error(
					`Permission denied: You don't have write access to the target directory: ${processedTargetPath}`,
				);
			}
		} else {
			methodLogger.debug(
				`Target directory doesn't exist, creating: ${processedTargetPath}`,
			);
			try {
				await fs.mkdir(processedTargetPath, { recursive: true });
				methodLogger.debug(
					`Successfully created directory: ${processedTargetPath}`,
				);
			} catch (mkdirError) {
				throw new Error(
					`Failed to create target directory ${processedTargetPath}: ${(mkdirError as Error).message}. Please ensure you have write permissions to the parent directory.`,
				);
			}
		}

		// Get repository details to determine clone URL
		methodLogger.debug(
			`Getting repository details for ${workspaceSlug}/${repoSlug}`,
		);
		const repoDetails = await atlassianRepositoriesService.get({
			workspace: workspaceSlug,
			repo_slug: repoSlug,
		});

		// Find SSH clone URL (preferred) or fall back to HTTPS
		let cloneUrl: string | undefined;
		let cloneProtocol: string = 'SSH'; // Default to SSH

		if (repoDetails.links?.clone) {
			// First try to find SSH clone URL
			const sshClone = repoDetails.links.clone.find(
				(link) => link.name === 'ssh',
			);

			if (sshClone) {
				cloneUrl = sshClone.href;
			} else {
				// Fall back to HTTPS if SSH is not available
				const httpsClone = repoDetails.links.clone.find(
					(link) => link.name === 'https',
				);

				if (httpsClone) {
					cloneUrl = httpsClone.href;
					cloneProtocol = 'HTTPS';
					methodLogger.warn(
						'SSH clone URL not found, falling back to HTTPS',
					);
				}
			}
		}

		if (!cloneUrl) {
			throw new Error(
				'Could not find a valid clone URL for the repository',
			);
		}

		// Determine full target directory path
		// Clone into a subdirectory named after the repo slug
		const targetDir = path.join(processedTargetPath, repoSlug);
		methodLogger.debug(`Will clone to: ${targetDir}`);

		// Check if directory already exists
		try {
			const stats = await fs.stat(targetDir);
			if (stats.isDirectory()) {
				methodLogger.warn(
					`Target directory already exists: ${targetDir}`,
				);
				return {
					content: `Target directory \`${targetDir}\` already exists. Please choose a different target path or remove the existing directory.`,
				};
			}
		} catch {
			// Error means directory doesn't exist, which is what we want
			methodLogger.debug(
				`Target directory doesn't exist, proceeding with clone`,
			);
		}

		// Execute git clone command (uses execFile to prevent command injection)
		methodLogger.debug(`Cloning from URL (${cloneProtocol}): ${cloneUrl}`);

		try {
			const result = await executeShellCommand(
				'git',
				['clone', cloneUrl, targetDir],
				'cloning repository',
			);

			// Return success message with more detailed information
			return {
				content:
					`Successfully cloned repository \`${workspaceSlug}/${repoSlug}\` to \`${targetDir}\` using ${cloneProtocol}.\n\n` +
					`**Details:**\n` +
					`- **Repository**: ${workspaceSlug}/${repoSlug}\n` +
					`- **Clone Protocol**: ${cloneProtocol}\n` +
					`- **Target Location**: ${targetDir}\n\n` +
					`**Output:**\n\`\`\`\n${result}\n\`\`\`\n\n` +
					`**Note**: If this is your first time cloning with SSH, ensure your SSH keys are set up correctly.`,
			};
		} catch (cloneError) {
			// Enhanced error message with troubleshooting steps
			const errorMsg = `Failed to clone repository: ${(cloneError as Error).message}`;
			let troubleshooting = '';

			if (cloneProtocol === 'SSH') {
				troubleshooting =
					`\n\n**Troubleshooting SSH Clone Issues:**\n` +
					`1. Ensure you have SSH keys set up with Bitbucket\n` +
					`2. Check if your SSH agent is running: \`eval "$(ssh-agent -s)"; ssh-add\`\n` +
					`3. Verify connectivity: \`ssh -T git@bitbucket.org\`\n` +
					`4. Try using HTTPS instead (modify your tool call with a different repository URL)`;
			} else {
				troubleshooting =
					`\n\n**Troubleshooting HTTPS Clone Issues:**\n` +
					`1. Check your Bitbucket credentials\n` +
					`2. Ensure the target directory is writable\n` +
					`3. Try running the command manually to see detailed errors`;
			}

			throw new Error(errorMsg + troubleshooting);
		}
	} catch (error) {
		throw handleControllerError(error, {
			entityType: 'Repository',
			operation: 'clone',
			source: 'controllers/atlassian.repositories.content.controller.ts@handleCloneRepository',
			additionalInfo: options,
		});
	}
}

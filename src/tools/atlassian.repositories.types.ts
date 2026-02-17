import { z } from 'zod';

/**
 * Schema for clone-repository tool arguments.
 */
export const CloneRepositoryToolArgs = z.object({
	workspaceSlug: z
		.string()
		.optional()
		.describe(
			'Bitbucket workspace slug containing the repository. If not provided, the tool will use your default workspace (either configured via BITBUCKET_DEFAULT_WORKSPACE or the first workspace in your account). Example: "myteam"',
		),
	repoSlug: z
		.string()
		.min(1, 'Repository slug is required')
		.describe(
			'Repository name/slug to clone. This is the short name of the repository. Example: "project-api"',
		),
	targetPath: z
		.string()
		.min(1, 'Target path is required')
		.describe(
			'Directory path where the repository will be cloned. IMPORTANT: Absolute paths are strongly recommended (e.g., "/home/user/projects" or "C:\\Users\\name\\projects"). Relative paths will be resolved relative to the server\'s working directory, which may not be what you expect. The repository will be cloned into a subdirectory at targetPath/repoSlug. Make sure you have write permissions to this location.',
		),
});

export type CloneRepositoryToolArgsType = z.infer<
	typeof CloneRepositoryToolArgs
>;

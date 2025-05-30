import {
	PullRequest,
	PullRequestsResponse,
	DiffstatResponse,
	PullRequestComment,
} from '../services/vendor.atlassian.pullrequests.types.js';
import {
	formatHeading,
	formatBulletList,
	formatUrl,
	formatSeparator,
	formatNumberedList,
	formatDiff,
	formatDate,
	optimizeBitbucketMarkdown,
} from '../utils/formatter.util.js';

// Define the extended type here as well for clarity
interface PullRequestCommentWithSnippet extends PullRequestComment {
	codeSnippet?: string;
}

/**
 * Format a list of pull requests for display
 * @param pullRequestsData - Raw pull requests data from the API
 * @returns Formatted string with pull requests information in markdown format
 */
export function formatPullRequestsList(
	pullRequestsData: PullRequestsResponse,
): string {
	const pullRequests = pullRequestsData.values || [];

	if (pullRequests.length === 0) {
		return 'No pull requests found matching your criteria.';
	}

	const lines: string[] = [formatHeading('Bitbucket Pull Requests', 1), ''];

	// Format each pull request with its details
	const formattedList = formatNumberedList(pullRequests, (pr, _index) => {
		const itemLines: string[] = [];
		itemLines.push(formatHeading(`#${pr.id}: ${pr.title}`, 2));

		// Prepare the description (truncated if too long)
		let description = 'No description provided';
		if (pr.summary?.raw && pr.summary.raw.trim() !== '') {
			description = pr.summary.raw;
		} else if (
			pr.summary?.markup &&
			pr.summary.markup.trim() !== '' &&
			pr.summary.markup !== 'markdown'
		) {
			description = pr.summary.markup;
		}

		if (description.length > 150) {
			description = description.substring(0, 150) + '...';
		}

		// Basic information
		const properties: Record<string, unknown> = {
			ID: pr.id,
			State: pr.state,
			Author: pr.author?.display_name || pr.author?.nickname || 'Unknown',
			Created: formatDate(pr.created_on),
			Updated: formatDate(pr.updated_on),
			'Source Branch': pr.source?.branch?.name || 'Unknown',
			'Destination Branch': pr.destination?.branch?.name || 'Unknown',
			Description: description,
			URL: pr.links?.html?.href
				? formatUrl(pr.links.html.href, `PR #${pr.id}`)
				: 'N/A',
		};

		// Format as a bullet list
		itemLines.push(formatBulletList(properties, (key) => key));

		return itemLines.join('\n');
	});

	lines.push(formattedList);

	// Add standard footer with timestamp
	lines.push('\n\n' + formatSeparator());
	lines.push(`*Information retrieved at: ${formatDate(new Date())}*`);

	return lines.join('\n');
}

/**
 * Format detailed pull request information for display
 * @param pullRequest - Raw pull request data from the API
 * @param diffstat - Optional diffstat data from the API
 * @param rawDiff - Optional raw diff content from the API
 * @param comments - Optional comments data from the API
 * @returns Formatted string with pull request details in markdown format
 */
export function formatPullRequestDetails(
	pullRequest: PullRequest,
	diffstat?: DiffstatResponse | null,
	rawDiff?: string | null,
	comments?: PullRequestCommentWithSnippet[] | null,
): string {
	const lines: string[] = [
		formatHeading(
			`Pull Request #${pullRequest.id}: ${pullRequest.title}`,
			1,
		),
		'',
		formatHeading('Basic Information', 2),
	];

	// Format basic information as a bullet list
	const basicProperties: Record<string, unknown> = {
		State: pullRequest.state,
		Repository: pullRequest.destination.repository.full_name,
		Source: pullRequest.source.branch.name,
		Destination: pullRequest.destination.branch.name,
		Author: pullRequest.author?.display_name,
		Created: formatDate(pullRequest.created_on),
		Updated: formatDate(pullRequest.updated_on),
		'Comment Count': pullRequest.comment_count ?? 0,
		'Task Count': pullRequest.task_count ?? 0,
	};

	lines.push(formatBulletList(basicProperties, (key) => key));

	// Reviewers
	if (pullRequest.reviewers && pullRequest.reviewers.length > 0) {
		lines.push('');
		lines.push(formatHeading('Reviewers', 2));
		const reviewerLines: string[] = [];
		pullRequest.reviewers.forEach((reviewer) => {
			reviewerLines.push(`- ${reviewer.display_name}`);
		});
		lines.push(reviewerLines.join('\n'));
	}

	// Summary or rendered content for description if available
	if (pullRequest.summary?.raw) {
		lines.push('');
		lines.push(formatHeading('Description', 2));
		// Optimize the markdown content for better rendering
		lines.push(optimizeBitbucketMarkdown(pullRequest.summary.raw));
	} else if (pullRequest.rendered?.description?.raw) {
		lines.push('');
		lines.push(formatHeading('Description', 2));
		// Optimize the markdown content for better rendering
		lines.push(
			optimizeBitbucketMarkdown(pullRequest.rendered.description.raw),
		);
	}

	// File Changes Summary from Diffstat
	if (diffstat && diffstat.values && diffstat.values.length > 0) {
		lines.push('');
		lines.push(formatHeading('File Changes', 2));

		// Calculate summary statistics
		const totalFiles = diffstat.values.length;
		let totalAdditions = 0;
		let totalDeletions = 0;

		diffstat.values.forEach((file) => {
			if (file.lines_added) totalAdditions += file.lines_added;
			if (file.lines_removed) totalDeletions += file.lines_removed;
		});

		// Add summary line
		lines.push(
			`${totalFiles} file${totalFiles !== 1 ? 's' : ''} changed with ${totalAdditions} insertion${totalAdditions !== 1 ? 's' : ''} and ${totalDeletions} deletion${totalDeletions !== 1 ? 's' : ''}`,
		);

		// Add file list (limited to 10 files for brevity)
		const maxFilesToShow = 10;
		if (totalFiles > 0) {
			lines.push('');
			diffstat.values.slice(0, maxFilesToShow).forEach((file) => {
				const changes = [];
				if (file.lines_added) changes.push(`+${file.lines_added}`);
				if (file.lines_removed) changes.push(`-${file.lines_removed}`);
				const changeStr =
					changes.length > 0 ? ` (${changes.join(', ')})` : '';
				lines.push(
					`- \`${file.old?.path || file.new?.path}\`${changeStr}`,
				);
			});

			if (totalFiles > maxFilesToShow) {
				lines.push(
					`- ... and ${totalFiles - maxFilesToShow} more files`,
				);
			}
		}
	}

	// Detailed Diff Content
	if (rawDiff) {
		lines.push('');
		lines.push(formatHeading('Code Changes (Full Diff)', 2));
		lines.push(formatDiff(rawDiff));
	}

	// Comments Section (when included)
	if (comments && comments.length > 0) {
		lines.push('');
		lines.push(formatHeading('Comments', 2));

		// Group comments by parent (to handle threads)
		const topLevelComments: PullRequestCommentWithSnippet[] = [];
		const childComments: {
			[parentId: number]: PullRequestCommentWithSnippet[];
		} = {};

		// First pass: organize comments by parent
		comments.forEach((comment) => {
			if (comment.parent) {
				const parentId = comment.parent.id;
				if (!childComments[parentId]) {
					childComments[parentId] = [];
				}
				childComments[parentId].push(comment);
			} else {
				topLevelComments.push(comment);
			}
		});

		// Format each top-level comment and its replies (limit to 5 comments for conciseness)
		const maxCommentsToShow = 5;
		const commentsToShow = topLevelComments.slice(0, maxCommentsToShow);

		commentsToShow.forEach((comment, index) => {
			formatComment(comment, lines);

			// Add replies if any exist (limit to 3 replies per comment for conciseness)
			const replies = childComments[comment.id] || [];
			if (replies.length > 0) {
				lines.push('');
				lines.push('**Replies:**');

				const maxRepliesToShow = 3;
				const repliesToShow = replies.slice(0, maxRepliesToShow);

				repliesToShow.forEach((reply) => {
					lines.push('');
					lines.push(
						`> **${reply.user.display_name || 'Unknown User'}** (${formatDate(reply.created_on)})`,
					);
					// Optimize the markdown content for replies as well
					const optimizedReplyContent = optimizeBitbucketMarkdown(
						reply.content.raw,
					);
					lines.push(
						`> ${optimizedReplyContent.replace(/\n/g, '\n> ')}`,
					);
				});

				// Show message if more replies were omitted
				if (replies.length > maxRepliesToShow) {
					lines.push('');
					lines.push(
						`> *...and ${replies.length - maxRepliesToShow} more replies*`,
					);
				}
			}

			if (index < commentsToShow.length - 1) {
				lines.push('');
				lines.push(formatSeparator());
			}
		});

		// Show message if more comments were omitted
		if (topLevelComments.length > maxCommentsToShow) {
			lines.push('');
			lines.push(
				`*...and ${topLevelComments.length - maxCommentsToShow} more comments*`,
			);
		}

		// Add link to view all comments if available
		if (pullRequest.links?.comments?.href) {
			lines.push('');
			lines.push(
				`[View all comments in browser](${pullRequest.links.comments.href})`,
			);
		}
	} else if (comments && comments.length === 0) {
		lines.push('');
		lines.push(formatHeading('Comments', 2));
		lines.push('*No comments found on this pull request.*');
	}

	// Links
	lines.push('');
	lines.push(formatHeading('Links', 2));

	const links: string[] = [];

	if (pullRequest.links.html?.href) {
		links.push(
			`- ${formatUrl(pullRequest.links.html.href, 'View in Browser')}`,
		);
	}
	if (pullRequest.links.commits?.href) {
		links.push(`- ${formatUrl(pullRequest.links.commits.href, 'Commits')}`);
	}
	if (pullRequest.links.comments?.href) {
		links.push(
			`- ${formatUrl(pullRequest.links.comments.href, 'Comments')}`,
		);
	}
	if (pullRequest.links.diff?.href) {
		links.push(`- ${formatUrl(pullRequest.links.diff.href, 'Diff')}`);
	}

	lines.push(links.join('\n'));

	// Add standard footer with timestamp
	lines.push('\n\n' + formatSeparator());
	lines.push(`*Information retrieved at: ${formatDate(new Date())}*`);

	return lines.join('\n');
}

/**
 * Format pull request comments for display, including code snippets for inline comments.
 * @param comments - Array of comment objects, potentially enhanced with code snippets.
 * @param prId - The ID of the pull request to include in the title.
 * @returns Formatted string with pull request comments in markdown format.
 */
export function formatPullRequestComments(
	comments: PullRequestCommentWithSnippet[], // Accept the array of enhanced comments directly
	prId: string,
): string {
	const lines: string[] = [];

	lines.push(formatHeading(`Comments on Pull Request #${prId}`, 1));
	lines.push('');

	if (!comments || comments.length === 0) {
		lines.push('*No comments found on this pull request.*');
		lines.push('\n\n' + formatSeparator());
		lines.push(`*Information retrieved at: ${formatDate(new Date())}*`);
		return lines.join('\n');
	}

	// Group comments by parent (to handle threads)
	const topLevelComments: PullRequestCommentWithSnippet[] = [];
	const childComments: {
		[parentId: number]: PullRequestCommentWithSnippet[]; // Use enhanced type here too
	} = {};

	// First pass: organize comments by parent
	comments.forEach((comment) => {
		if (comment.parent) {
			const parentId = comment.parent.id;
			if (!childComments[parentId]) {
				childComments[parentId] = [];
			}
			childComments[parentId].push(comment);
		} else {
			topLevelComments.push(comment);
		}
	});

	// Format each top-level comment and its replies
	topLevelComments.forEach((comment, index) => {
		formatComment(comment, lines); // Pass the enhanced comment object

		// Add replies if any exist
		const replies = childComments[comment.id] || [];
		if (replies.length > 0) {
			lines.push('');
			lines.push('**Replies:**');

			replies.forEach((reply) => {
				lines.push('');
				lines.push(
					`> **${reply.user.display_name || 'Unknown User'}** (${formatDate(reply.created_on)})`,
				);
				// Optimize the markdown content for replies as well
				const optimizedReplyContent = optimizeBitbucketMarkdown(
					reply.content.raw,
				);
				lines.push(`> ${optimizedReplyContent.replace(/\n/g, '\n> ')}`);
			});
		}

		if (index < topLevelComments.length - 1) {
			lines.push('');
			lines.push(formatSeparator());
		}
	});

	lines.push('\n\n' + formatSeparator());
	lines.push(`*Information retrieved at: ${formatDate(new Date())}*`);

	return lines.join('\n');
}

/**
 * Helper function to format a single comment, including code snippet if available.
 * @param comment - The comment object (potentially with codeSnippet).
 * @param lines - Array of string lines to append to.
 */
function formatComment(
	comment: PullRequestCommentWithSnippet, // Use the enhanced type
	lines: string[],
): void {
	const author = comment.user.display_name || 'Unknown User';
	const headerText = comment.deleted
		? `[DELETED] Comment by ${author}`
		: `Comment by ${author}`;

	lines.push(formatHeading(headerText, 3));
	lines.push(`*Posted on ${formatDate(comment.created_on)}*`);

	if (comment.updated_on && comment.updated_on !== comment.created_on) {
		lines.push(`*Updated on ${formatDate(comment.updated_on)}*`);
	}

	// If it's an inline comment, show file, line info, and snippet
	if (comment.inline) {
		const fileInfo = `File: \`${comment.inline.path}\``;
		let lineInfo = '';

		if (
			comment.inline.from !== undefined &&
			comment.inline.to !== undefined
		) {
			lineInfo = `(changed line ${comment.inline.from} -> ${comment.inline.to})`; // Slightly clearer wording
		} else if (comment.inline.to !== undefined) {
			lineInfo = `(line ${comment.inline.to})`;
		}

		lines.push(`**Inline Comment: ${fileInfo}** ${lineInfo}`);

		// Add the code snippet if it exists
		if (comment.codeSnippet) {
			lines.push('');
			lines.push('```diff'); // Use diff language for syntax highlighting
			lines.push(comment.codeSnippet);
			lines.push('```');
		} else if (comment.links?.code?.href) {
			// Fallback link if snippet fetch failed or wasn't applicable
			lines.push(
				`[View code context in browser](${comment.links.code.href})`,
			);
		}
	}

	lines.push('');
	// Show specific message for deleted comments, otherwise show optimized raw content
	lines.push(
		comment.deleted
			? '*This comment has been deleted.*'
			: optimizeBitbucketMarkdown(comment.content.raw) ||
					'*No content provided.*',
	);

	// Add link to view the comment itself in browser if available
	if (comment.links?.html?.href) {
		lines.push('');
		lines.push(
			`[View full comment thread in browser](${comment.links.html.href})`,
		); // Clarify link purpose
	}
}

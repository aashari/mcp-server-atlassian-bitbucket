import {
	Issue,
	IssueListResponse,
	IssueComment,
	CommentListResponse,
} from '../services/vendor.atlassian.issues.types.js';
import {
	formatHeading,
	formatBulletList,
	formatUrl,
	formatSeparator,
	formatDate,
	optimizeBitbucketMarkdown,
} from '../utils/formatter.util.js';

/**
 * Format a list of issues for display
 * @param issuesData - Raw issues data from the API
 * @returns Formatted string with issues information in markdown format
 */
export function formatIssuesList(issuesData: IssueListResponse): string {
	const issues = issuesData.values || [];

	if (issues.length === 0) {
		return 'No issues found matching your criteria.';
	}

	const lines: string[] = [formatHeading('Issues', 1), ''];

	// Format each issue
	for (const issue of issues) {
		lines.push(formatHeading(`#${issue.id}: ${issue.title}`, 2));

		// Prepare the description (truncated if too long)
		let description = 'No description';
		if (issue.content?.raw && issue.content.raw.trim() !== '') {
			description = issue.content.raw;
			if (description.length > 150) {
				description = description.substring(0, 150) + '...';
			}
		}

		// Basic information
		const properties: Record<string, unknown> = {
			ID: issue.id,
			State: issue.state || 'N/A',
			Kind: issue.kind || 'N/A',
			Priority: issue.priority || 'N/A',
			Reporter: issue.reporter?.display_name || 'Unknown',
			Assignee: issue.assignee?.display_name || 'Unassigned',
			Created: formatDate(issue.created_on),
			Updated: formatDate(issue.updated_on),
			Description: description,
		};

		// Add URL if available
		if (issue.links?.html?.href) {
			properties['URL'] = formatUrl(
				issue.links.html.href,
				`Issue #${issue.id}`,
			);
		}

		// Add vote/watch counts if available
		if (issue.votes !== undefined) {
			properties['Votes'] = issue.votes;
		}
		if (issue.watches !== undefined) {
			properties['Watchers'] = issue.watches;
		}

		// Format as a bullet list
		lines.push(formatBulletList(properties, (key) => key));
		lines.push('');
	}

	return lines.join('\n');
}

/**
 * Format detailed issue information
 * @param issue - Issue data from the API
 * @returns Formatted string with detailed issue information in markdown format
 */
export function formatIssueDetails(issue: Issue): string {
	const lines: string[] = [
		formatHeading(`Issue #${issue.id}: ${issue.title}`, 1),
		'',
	];

	// Details section
	lines.push(formatHeading('Details', 2));

	const properties: Record<string, unknown> = {
		ID: issue.id,
		State: issue.state || 'N/A',
		Kind: issue.kind || 'N/A',
		Priority: issue.priority || 'N/A',
		Reporter: issue.reporter?.display_name || 'Unknown',
		Assignee: issue.assignee?.display_name || 'Unassigned',
		Created: formatDate(issue.created_on),
		Updated: formatDate(issue.updated_on),
	};

	// Add vote/watch counts if available
	if (issue.votes !== undefined) {
		properties['Votes'] = issue.votes;
	}
	if (issue.watches !== undefined) {
		properties['Watchers'] = issue.watches;
	}

	lines.push(formatBulletList(properties, (key) => key));
	lines.push('');

	// Description section
	if (issue.content?.raw && issue.content.raw.trim() !== '') {
		lines.push(formatHeading('Description', 2));
		lines.push('');
		lines.push(optimizeBitbucketMarkdown(issue.content.raw));
		lines.push('');
	}

	// Links section
	if (issue.links?.html?.href) {
		lines.push(formatHeading('Links', 2));
		lines.push('');
		lines.push(
			`- ${formatUrl(issue.links.html.href, 'View in Bitbucket')}`,
		);
		lines.push('');
	}

	return lines.join('\n');
}

/**
 * Format a list of comments on an issue
 * @param commentsData - Raw comments data from the API
 * @returns Formatted string with comments in markdown format
 */
export function formatCommentsList(commentsData: CommentListResponse): string {
	const comments = commentsData.values || [];

	if (comments.length === 0) {
		return 'No comments found on this issue.';
	}

	const lines: string[] = [formatHeading('Comments', 1), ''];

	// Format each comment
	for (const comment of comments) {
		lines.push(formatHeading(`Comment #${comment.id}`, 2));

		// Author and timestamp
		const author = comment.user?.display_name || 'Unknown';
		const timestamp = formatDate(comment.created_on);
		lines.push(`**Author**: ${author}`);
		lines.push(`**Posted**: ${timestamp}`);

		// Check if updated
		if (comment.updated_on && comment.updated_on !== comment.created_on) {
			lines.push(`**Updated**: ${formatDate(comment.updated_on)}`);
		}

		lines.push('');

		// Comment content
		if (comment.content?.raw) {
			lines.push(optimizeBitbucketMarkdown(comment.content.raw));
		}

		lines.push('');
		lines.push(formatSeparator());
		lines.push('');
	}

	return lines.join('\n');
}

/**
 * Format a success message for issue operations
 * @param issue - The issue that was created or updated
 * @param action - The action performed (e.g., "created", "updated")
 * @returns Formatted success message
 */
export function formatIssueSuccess(issue: Issue, action: string): string {
	const lines: string[] = [
		`✓ Issue ${action}: #${issue.id} - ${issue.title}`,
		'',
	];

	// Add link if available
	if (issue.links?.html?.href) {
		lines.push(`View at: ${issue.links.html.href}`);
		lines.push('');
	}

	// Add brief details
	const properties: Record<string, unknown> = {
		State: issue.state || 'N/A',
		Kind: issue.kind || 'N/A',
		Priority: issue.priority || 'N/A',
	};

	lines.push(formatBulletList(properties, (key) => key));

	return lines.join('\n');
}

/**
 * Format a success message for comment operations
 * @param comment - The comment that was created
 * @returns Formatted success message
 */
export function formatCommentSuccess(comment: IssueComment): string {
	const lines: string[] = [`✓ Comment #${comment.id} added successfully`, ''];

	// Add author if available
	if (comment.user?.display_name) {
		lines.push(`**Author**: ${comment.user.display_name}`);
	}

	// Add timestamp
	lines.push(`**Posted**: ${formatDate(comment.created_on)}`);
	lines.push('');

	// Preview of comment content
	if (comment.content?.raw) {
		const preview =
			comment.content.raw.length > 100
				? comment.content.raw.substring(0, 100) + '...'
				: comment.content.raw;
		lines.push(`**Content**: ${preview}`);
	}

	return lines.join('\n');
}

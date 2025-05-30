import { ContentType } from '../utils/atlassian.util.js';
import { CodeSearchResult } from '../services/vendor.atlassian.search.service.js';
import {
	formatSeparator,
	formatDate,
	formatUrl,
} from '../utils/formatter.util.js';
import path from 'path';
import { getContentTypeDisplay } from '../utils/atlassian.util.js';

/**
 * Try to guess the language from the file path
 */
function getLanguageHint(filePath: string): string {
	const ext = path.extname(filePath).toLowerCase();
	const langMap: Record<string, string> = {
		'.js': 'javascript',
		'.jsx': 'jsx',
		'.ts': 'typescript',
		'.tsx': 'tsx',
		'.py': 'python',
		'.java': 'java',
		'.rb': 'ruby',
		'.php': 'php',
		'.cs': 'csharp',
		'.go': 'go',
		'.rs': 'rust',
		'.c': 'c',
		'.cpp': 'cpp',
		'.h': 'c',
		'.hpp': 'cpp',
		'.tf': 'terraform',
		'.hcl': 'hcl',
		'.sh': 'bash',
		'.zsh': 'zsh',
		'.json': 'json',
		'.yaml': 'yaml',
		'.yml': 'yaml',
		'.xml': 'xml',
		'.md': 'markdown',
		'.sql': 'sql',
		'.dockerfile': 'dockerfile',
		dockerfile: 'dockerfile',
		'.gitignore': 'gitignore',
	};
	return langMap[ext] || '';
}

/**
 * Format a single code search result into markdown
 *
 * @param result The code search result to format
 * @returns Formatted markdown string
 */
function formatCodeSearchResult(result: CodeSearchResult): string {
	// Format the file path - No highlighting needed here
	const filePath = result.file.path || 'Unknown File'; // <-- Use direct path

	// Fix the link text
	const fileLink = result.file.links?.self?.href
		? formatUrl(result.file.links.self.href, filePath) // Use filePath for link text
		: filePath;

	// Build markdown output
	let markdown = `### ${fileLink}\n\n`; // Use fixed fileLink

	// Add match summary
	markdown += `${result.content_match_count} ${
		result.content_match_count === 1 ? 'match' : 'matches'
	} found\n\n`;

	// Get language hint for code block
	const langHint = getLanguageHint(filePath);
	markdown += '```' + langHint + '\n'; // Add language hint

	// Process each content match
	result.content_matches.forEach((contentMatch) => {
		// Process each line in the content match
		contentMatch.lines.forEach((line) => {
			// Add line number
			markdown += `${line.line}: `;

			// Process segments (some may be highlighted matches)
			if (line.segments.length) {
				line.segments.forEach((segment) => {
					// Use standard bold markdown for highlighting
					markdown += segment.match
						? `\\\`${segment.text}\\\`` // <-- Changed highlighting to backticks
						: segment.text;
				});
			}

			markdown += '\n';
		});

		// Add space between match groups only if there are multiple lines shown
		if (contentMatch.lines.length > 1) {
			markdown += '\n';
		}
	});

	markdown += '```\n\n';

	return markdown;
}

/**
 * Format code search results into markdown
 *
 * @param response The code search response from the API
 * @returns Markdown formatted string of code search results
 */
export function formatCodeSearchResults(searchResponse: {
	values?: CodeSearchResult[];
	size: number;
}): string {
	const results = searchResponse.values || [];

	if (!results || results.length === 0) {
		// Add standard footer even for empty state
		return (
			'**No code matches found.**\n\n' +
			'\n\n' +
			formatSeparator() +
			'\n' +
			`*Information retrieved at: ${formatDate(new Date())}*`
		);
	}

	// Start with a summary
	let markdown = `## Code Search Results\n\nFound ${searchResponse.size} matches for the code search query.\n\n`;

	// Format each result
	results.forEach((result: CodeSearchResult) => {
		markdown += formatCodeSearchResult(result);
	});

	// Add standard footer with timestamp
	markdown += '\n\n' + formatSeparator();
	markdown += `\n*Information retrieved at: ${formatDate(new Date())}*`;

	return markdown;
}

/**
 * Format content search results into markdown
 *
 * @param response The content search response from the API
 * @param contentType Optional content type filter that was applied
 * @returns Markdown formatted string of content search results
 */
export function formatContentSearchResults(
	response: { values?: unknown[]; size: number },
	contentType?: ContentType,
): string {
	const results = response.values || [];

	if (!results || results.length === 0) {
		// Add standard footer even for empty state
		return (
			'**No content matches found.**\n\n' +
			'\n\n' +
			formatSeparator() +
			'\n' +
			`*Information retrieved at: ${formatDate(new Date())}*`
		);
	}

	// Start with a summary
	const typeStr = contentType
		? getContentTypeDisplay(contentType)
		: 'Content';
	let markdown = `## ${typeStr} Search Results\n\nFound ${response.size} matches for the content search query.\n\n`;

	// Format each result - this is generic as content results can vary widely
	results.forEach((result) => {
		// We need to handle result as a generic object since content types vary
		const typedResult = result as Record<string, unknown>;

		// Try to determine the type from the result
		const type = (typedResult.type as string) || 'Unknown';

		// Try to get a title/name
		let title = 'Untitled';
		if (typedResult.title) {
			title = String(typedResult.title);
		} else if (typedResult.name) {
			title = String(typedResult.name);
		} else if (typedResult.summary) {
			const summary = String(typedResult.summary);
			title = summary.slice(0, 80) + (summary.length > 80 ? '...' : '');
		}

		// Try to get a link
		let link = '';
		const links = typedResult.links as
			| Record<string, { href?: string }>
			| undefined;
		if (links?.html?.href) {
			link = links.html.href;
		} else if (links?.self?.href) {
			link = links.self.href;
		}

		markdown += '### ';
		if (link) {
			markdown += formatUrl(link, title);
		} else {
			markdown += title;
		}
		markdown += '\n\n';

		// Add type information
		markdown += `**Type**: ${type}\n`;

		// Add update/created date if available
		if (typedResult.updated_on) {
			markdown += `**Updated**: ${formatDate(typedResult.updated_on as string | Date)}\n`;
		} else if (typedResult.created_on) {
			markdown += `**Created**: ${formatDate(typedResult.created_on as string | Date)}\n`;
		}

		// Add description/content if available (limited to preserve readability)
		if (typedResult.description) {
			const description = String(typedResult.description);
			const limitedDesc =
				description.length > 500
					? description.slice(0, 500) + '...'
					: description;
			markdown += `\n${limitedDesc}\n\n`;
		} else if (typedResult.content) {
			const content = String(typedResult.content);
			const limitedContent =
				content.length > 500 ? content.slice(0, 500) + '...' : content;
			markdown += `\n${limitedContent}\n\n`;
		}

		markdown += '\n';
	});

	// Add standard footer with timestamp
	markdown += '\n' + formatSeparator();
	markdown += `\n*Information retrieved at: ${formatDate(new Date())}*`;

	return markdown;
}

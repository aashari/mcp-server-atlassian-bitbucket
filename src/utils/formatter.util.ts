/**
 * Standardized formatting utilities for consistent output across all CLI and Tool interfaces.
 * These functions should be used by all formatters to ensure consistent formatting.
 */

import { Logger } from './logger.util.js'; // Ensure logger is imported
import { ResponsePagination } from '../types/common.types.js';

// const formatterLogger = Logger.forContext('utils/formatter.util.ts'); // Define logger instance - Removed as unused

/**
 * Format a date in a standardized way: YYYY-MM-DD HH:MM:SS UTC
 * @param dateString - ISO date string or Date object
 * @returns Formatted date string
 */
export function formatDate(dateString?: string | Date): string {
	if (!dateString) {
		return 'Not available';
	}

	try {
		const date =
			typeof dateString === 'string' ? new Date(dateString) : dateString;

		// Format: YYYY-MM-DD HH:MM:SS UTC
		return date
			.toISOString()
			.replace('T', ' ')
			.replace(/\.\d+Z$/, ' UTC');
	} catch {
		return 'Invalid date';
	}
}

/**
 * Format a URL as a markdown link
 * @param url - URL to format
 * @param title - Link title
 * @returns Formatted markdown link
 */
export function formatUrl(url?: string, title?: string): string {
	if (!url) {
		return 'Not available';
	}

	const linkTitle = title || url;
	return `[${linkTitle}](${url})`;
}

/**
 * Format pagination information in a standardized way for CLI output.
 * Includes separator, item counts, availability message, next page instructions, and timestamp.
 * @param pagination - The ResponsePagination object containing pagination details.
 * @returns Formatted pagination footer string for CLI.
 */
export function formatPagination(pagination: ResponsePagination): string {
	const methodLogger = Logger.forContext(
		'utils/formatter.util.ts',
		'formatPagination',
	);
	const parts: string[] = [formatSeparator()]; // Start with separator

	const { count = 0, hasMore, nextCursor, total, page } = pagination;

	// Showing count and potentially total
	if (total !== undefined && total >= 0) {
		parts.push(`*Showing ${count} of ${total} total items.*`);
	} else if (count >= 0) {
		parts.push(`*Showing ${count} item${count !== 1 ? 's' : ''}.*`);
	}

	// More results availability
	if (hasMore) {
		parts.push('More results are available.');
	}

	// Include the actual cursor value for programmatic use
	if (hasMore && nextCursor) {
		parts.push(`*Next cursor: \`${nextCursor}\`*`);
		// Assuming nextCursor holds the next page number for Bitbucket
		parts.push(`*Use --page ${nextCursor} to view more.*`);
	} else if (hasMore && page !== undefined) {
		// Fallback if nextCursor wasn't parsed but page exists
		const nextPage = page + 1;
		parts.push(`*Next cursor: \`${nextPage}\`*`);
		parts.push(`*Use --page ${nextPage} to view more.*`);
	}

	// Add standard timestamp
	parts.push(`*Information retrieved at: ${formatDate(new Date())}*`);

	const result = parts.join('\n').trim(); // Join with newline
	methodLogger.debug(`Formatted pagination footer: ${result}`);
	return result;
}

/**
 * Format a heading with consistent style
 * @param text - Heading text
 * @param level - Heading level (1-6)
 * @returns Formatted heading
 */
export function formatHeading(text: string, level: number = 1): string {
	const validLevel = Math.min(Math.max(level, 1), 6);
	const prefix = '#'.repeat(validLevel);
	return `${prefix} ${text}`;
}

/**
 * Format a list of key-value pairs as a bullet list
 * @param items - Object with key-value pairs
 * @param keyFormatter - Optional function to format keys
 * @returns Formatted bullet list
 */
export function formatBulletList(
	items: Record<string, unknown>,
	keyFormatter?: (key: string) => string,
): string {
	const lines: string[] = [];

	for (const [key, value] of Object.entries(items)) {
		if (value === undefined || value === null) {
			continue;
		}

		const formattedKey = keyFormatter ? keyFormatter(key) : key;
		const formattedValue = formatValue(value);
		lines.push(`- **${formattedKey}**: ${formattedValue}`);
	}

	return lines.join('\n');
}

/**
 * Format a value based on its type
 * @param value - Value to format
 * @returns Formatted value
 */
function formatValue(value: unknown): string {
	if (value === undefined || value === null) {
		return 'Not available';
	}

	if (value instanceof Date) {
		return formatDate(value);
	}

	// Handle URL objects with url and title properties
	if (typeof value === 'object' && value !== null && 'url' in value) {
		const urlObj = value as { url: string; title?: string };
		if (typeof urlObj.url === 'string') {
			return formatUrl(urlObj.url, urlObj.title);
		}
	}

	if (typeof value === 'string') {
		// Check if it's a URL
		if (value.startsWith('http://') || value.startsWith('https://')) {
			return formatUrl(value);
		}

		// Check if it might be a date
		if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
			return formatDate(value);
		}

		return value;
	}

	if (typeof value === 'boolean') {
		return value ? 'Yes' : 'No';
	}

	return String(value);
}

/**
 * Format a separator line
 * @returns Separator line
 */
export function formatSeparator(): string {
	return '---';
}

/**
 * Format a numbered list of items
 * @param items - Array of items to format
 * @param formatter - Function to format each item
 * @returns Formatted numbered list
 */
export function formatNumberedList<T>(
	items: T[],
	formatter: (item: T, index: number) => string,
): string {
	if (items.length === 0) {
		return 'No items.';
	}

	return items.map((item, index) => formatter(item, index)).join('\n\n');
}

/**
 * Format a raw diff output for display
 *
 * Parses and formats a raw unified diff string into a Markdown
 * formatted display with proper code block syntax highlighting.
 *
 * @param {string} rawDiff - The raw diff content from the API
 * @param {number} maxFiles - Maximum number of files to display in detail (optional, default: 5)
 * @param {number} maxLinesPerFile - Maximum number of lines to display per file (optional, default: 100)
 * @returns {string} Markdown formatted diff content
 */
export function formatDiff(
	rawDiff: string,
	maxFiles: number = 5,
	maxLinesPerFile: number = 100,
): string {
	if (!rawDiff || rawDiff.trim() === '') {
		return '*No changes found in this pull request.*';
	}

	const lines = rawDiff.split('\n');
	const formattedLines: string[] = [];
	let currentFile = '';
	let fileCount = 0;
	let inFile = false;
	let truncated = false;
	let lineCount = 0;

	for (const line of lines) {
		// New file is marked by a line starting with "diff --git"
		if (line.startsWith('diff --git')) {
			if (inFile) {
				// Close previous file code block
				formattedLines.push('```');
				formattedLines.push('');
			}

			// Only process up to maxFiles
			fileCount++;
			if (fileCount > maxFiles) {
				truncated = true;
				break;
			}

			// Extract filename
			const filePath = line.match(/diff --git a\/(.*) b\/(.*)/);
			currentFile = filePath ? filePath[1] : 'unknown file';
			formattedLines.push(`### ${currentFile}`);
			formattedLines.push('');
			formattedLines.push('```diff');
			inFile = true;
			lineCount = 0;
		} else if (inFile) {
			lineCount++;

			// Truncate files that are too long
			if (lineCount > maxLinesPerFile) {
				formattedLines.push(
					'// ... more lines omitted for brevity ...',
				);
				formattedLines.push('```');
				formattedLines.push('');
				inFile = false;
				continue;
			}

			// Format diff lines with appropriate highlighting
			if (line.startsWith('+')) {
				formattedLines.push(line);
			} else if (line.startsWith('-')) {
				formattedLines.push(line);
			} else if (line.startsWith('@@')) {
				// Change section header
				formattedLines.push(line);
			} else {
				// Context line
				formattedLines.push(line);
			}
		}
	}

	// Close the last code block if necessary
	if (inFile) {
		formattedLines.push('```');
	}

	// Add truncation notice if we limited the output
	if (truncated) {
		formattedLines.push('');
		formattedLines.push(
			`*Output truncated. Only showing the first ${maxFiles} files.*`,
		);
	}

	return formattedLines.join('\n');
}

/**
 * Optimizes markdown content to address Bitbucket Cloud's rendering quirks
 *
 * IMPORTANT: This function does NOT convert between formats (unlike Jira's ADF conversion).
 * Bitbucket Cloud API natively accepts and returns markdown format. This function specifically
 * addresses documented rendering issues in Bitbucket's markdown renderer by applying targeted
 * formatting adjustments for better display in the Bitbucket UI.
 *
 * Known Bitbucket rendering issues this function fixes:
 * - List spacing and indentation (prevents items from concatenating on a single line)
 * - Code block formatting (addresses BCLOUD-20503 and similar bugs)
 * - Nested list indentation (ensures proper hierarchy display)
 * - Inline code formatting (adds proper spacing around backticks)
 * - Diff syntax preservation (maintains +/- at line starts)
 * - Excessive line break normalization
 * - Heading spacing consistency
 *
 * Use this function for both:
 * - Content received FROM the Bitbucket API (to properly display in CLI/tools)
 * - Content being sent TO the Bitbucket API (to ensure proper rendering in Bitbucket UI)
 *
 * @param {string} markdown - The original markdown content
 * @returns {string} Optimized markdown with workarounds for Bitbucket rendering issues
 */
export function optimizeBitbucketMarkdown(markdown: string): string {
	const methodLogger = Logger.forContext(
		'utils/formatter.util.ts',
		'optimizeBitbucketMarkdown',
	);

	if (!markdown || markdown.trim() === '') {
		return markdown;
	}

	methodLogger.debug('Optimizing markdown for Bitbucket rendering');

	// First, let's extract code blocks to protect them from other transformations
	const codeBlocks: string[] = [];
	let optimized = markdown.replace(
		/```(\w*)\n([\s\S]*?)```/g,
		(_match, language, code) => {
			// Store the code block and replace with a placeholder
			const placeholder = `__CODE_BLOCK_${codeBlocks.length}__`;
			codeBlocks.push(`\n\n\`\`\`${language}\n${code}\n\`\`\`\n\n`);
			return placeholder;
		},
	);

	// Fix numbered lists with proper spacing
	// Match numbered lists (1. Item) and ensure proper spacing between items
	optimized = optimized.replace(
		/^(\d+\.)\s+(.*?)$/gm,
		(_match, number, content) => {
			// Keep the list item and ensure it ends with double line breaks if it doesn't already
			return `${number} ${content.trim()}\n\n`;
		},
	);

	// Fix bullet lists with proper spacing
	optimized = optimized.replace(
		/^(\s*)[-*]\s+(.*?)$/gm,
		(_match, indent, content) => {
			// Ensure proper indentation and spacing for bullet lists
			return `${indent}- ${content.trim()}\n\n`;
		},
	);

	// Ensure nested lists have proper indentation
	// Matches lines that are part of nested lists and ensures proper indentation
	// REMOVED: This step added excessive leading spaces causing Bitbucket to treat lists as code blocks
	// optimized = optimized.replace(
	// 	/^(\s+)[-*]\s+(.*?)$/gm,
	// 	(_match, indent, content) => {
	// 		// For nested items, ensure proper indentation (4 spaces per level)
	// 		const indentLevel = Math.ceil(indent.length / 2);
	// 		const properIndent = '    '.repeat(indentLevel);
	// 		return `${properIndent}- ${content.trim()}\n\n`;
	// 	},
	// );

	// Fix inline code formatting - ensure it has spaces around it for rendering
	optimized = optimized.replace(/`([^`]+)`/g, (_match, code) => {
		// Ensure inline code is properly formatted with spaces before and after
		// but avoid adding spaces within diff lines (+ or - prefixed)
		const trimmedCode = code.trim();
		const firstChar = trimmedCode.charAt(0);

		// Don't add spaces if it's part of a diff line
		if (firstChar === '+' || firstChar === '-') {
			return `\`${trimmedCode}\``;
		}

		return ` \`${trimmedCode}\` `;
	});

	// Ensure diff lines are properly preserved
	// This helps with preserving + and - prefixes in diff code blocks
	optimized = optimized.replace(
		/^([+-])(.*?)$/gm,
		(_match, prefix, content) => {
			return `${prefix}${content}`;
		},
	);

	// Remove excessive line breaks (more than 2 consecutive)
	optimized = optimized.replace(/\n{3,}/g, '\n\n');

	// Restore code blocks
	codeBlocks.forEach((codeBlock, index) => {
		optimized = optimized.replace(`__CODE_BLOCK_${index}__`, codeBlock);
	});

	// Fix double formatting issues (heading + bold) which Bitbucket renders incorrectly
	// Remove bold formatting from headings as headings are already emphasized
	optimized = optimized.replace(
		/^(#{1,6})\s+\*\*(.*?)\*\*\s*$/gm,
		(_match, hashes, content) => {
			return `\n${hashes} ${content.trim()}\n\n`;
		},
	);

	// Fix bold text within headings (alternative pattern)
	optimized = optimized.replace(
		/^(#{1,6})\s+(.*?)\*\*(.*?)\*\*(.*?)$/gm,
		(_match, hashes, before, boldText, after) => {
			// Combine text without bold formatting since heading already provides emphasis
			const cleanContent = (before + boldText + after).trim();
			return `\n${hashes} ${cleanContent}\n\n`;
		},
	);

	// Ensure headings have proper spacing (for headings without bold issues)
	optimized = optimized.replace(
		/^(#{1,6})\s+(.*?)$/gm,
		(_match, hashes, content) => {
			// Skip if already processed by bold removal above
			if (content.includes('**')) {
				return _match; // Leave as-is, will be handled by bold removal patterns
			}
			return `\n${hashes} ${content.trim()}\n\n`;
		},
	);

	// Ensure the content ends with a single line break
	optimized = optimized.trim() + '\n';

	methodLogger.debug('Markdown optimization complete');
	return optimized;
}

/**
 * Maximum character limit for AI responses (~10k tokens)
 * 1 token ≈ 4 characters, so 10k tokens ≈ 40,000 characters
 */
const MAX_RESPONSE_CHARS = 40000;

/**
 * Truncate content for AI consumption and add guidance if truncated
 *
 * When responses exceed the token limit, this function truncates the content
 * and appends guidance for the AI to either access the full response from
 * the raw log file or refine the request with better filtering.
 *
 * @param content - The formatted response content
 * @param rawResponsePath - Optional path to the raw response file in /tmp/mcp/
 * @returns Truncated content with guidance if needed, or original content if within limits
 */
export function truncateForAI(
	content: string,
	rawResponsePath?: string | null,
): string {
	if (content.length <= MAX_RESPONSE_CHARS) {
		return content;
	}

	// Truncate at a reasonable boundary (try to find a newline near the limit)
	let truncateAt = MAX_RESPONSE_CHARS;
	const searchStart = Math.max(0, MAX_RESPONSE_CHARS - 500);
	const lastNewline = content.lastIndexOf('\n', MAX_RESPONSE_CHARS);
	if (lastNewline > searchStart) {
		truncateAt = lastNewline;
	}

	const truncatedContent = content.substring(0, truncateAt);
	const originalSize = content.length;
	const truncatedSize = truncatedContent.length;
	const percentShown = Math.round((truncatedSize / originalSize) * 100);

	// Build guidance section
	const guidance: string[] = [
		'',
		formatSeparator(),
		formatHeading('Response Truncated', 2),
		'',
		`This response was truncated to ~${Math.round(truncatedSize / 4000)}k tokens (${percentShown}% of original ${Math.round(originalSize / 1000)}k chars).`,
		'',
		'**To access the complete data:**',
	];

	if (rawResponsePath) {
		guidance.push(
			`- The full raw API response is saved at: \`${rawResponsePath}\``,
		);
	}

	guidance.push(
		'- Consider refining your request with more specific filters or selecting fewer fields',
		'- For paginated data, use smaller page sizes or specific identifiers',
		'- When searching, use more targeted queries to reduce result sets',
	);

	return truncatedContent + guidance.join('\n');
}

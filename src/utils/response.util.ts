import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { Logger } from './logger.util.js';
import { PACKAGE_NAME } from './constants.util.js';

// Create a contextualized logger for this file
const responseLogger = Logger.forContext('utils/response.util.ts');

/**
 * Get the project name from PACKAGE_NAME, stripping the scope prefix
 * e.g., "@aashari/mcp-server-atlassian-bitbucket" -> "mcp-server-atlassian-bitbucket"
 */
function getProjectName(): string {
	const name = PACKAGE_NAME.replace(/^@[^/]+\//, '');
	return name;
}

/**
 * Generate a unique filename with timestamp and random string
 * Format: <timestamp>-<random>.txt
 */
function generateFilename(): string {
	const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
	const randomStr = crypto.randomBytes(4).toString('hex');
	return `${timestamp}-${randomStr}.txt`;
}

/**
 * Ensure the directory exists, creating it if necessary
 */
function ensureDirectoryExists(dirPath: string): void {
	if (!fs.existsSync(dirPath)) {
		fs.mkdirSync(dirPath, { recursive: true });
		responseLogger.debug(`Created directory: ${dirPath}`);
	}
}

/**
 * Save raw API response to a file in /tmp/mcp/<project-name>/
 *
 * @param url The URL that was called
 * @param method The HTTP method used
 * @param requestBody The request body (if any)
 * @param responseData The raw response data
 * @param statusCode The HTTP status code
 * @param durationMs The request duration in milliseconds
 * @returns The path to the saved file, or null if saving failed
 */
export function saveRawResponse(
	url: string,
	method: string,
	requestBody: unknown,
	responseData: unknown,
	statusCode: number,
	durationMs: number,
): string | null {
	const methodLogger = Logger.forContext(
		'utils/response.util.ts',
		'saveRawResponse',
	);

	try {
		const projectName = getProjectName();
		const dirPath = path.join('/tmp', 'mcp', projectName);
		const filename = generateFilename();
		const filePath = path.join(dirPath, filename);

		ensureDirectoryExists(dirPath);

		// Build the content
		const content = buildResponseContent(
			url,
			method,
			requestBody,
			responseData,
			statusCode,
			durationMs,
		);

		// Write to file
		fs.writeFileSync(filePath, content, 'utf8');
		methodLogger.debug(`Saved raw response to: ${filePath}`);

		return filePath;
	} catch (error) {
		methodLogger.error('Failed to save raw response', error);
		return null;
	}
}

/**
 * Build the content string for the response file
 */
function buildResponseContent(
	url: string,
	method: string,
	requestBody: unknown,
	responseData: unknown,
	statusCode: number,
	durationMs: number,
): string {
	const timestamp = new Date().toISOString();
	const separator = '='.repeat(80);

	let content = `${separator}
RAW API RESPONSE LOG
${separator}

Timestamp: ${timestamp}
URL: ${url}
Method: ${method}
Status Code: ${statusCode}
Duration: ${durationMs.toFixed(2)}ms

${separator}
REQUEST BODY
${separator}
`;

	if (requestBody) {
		content +=
			typeof requestBody === 'string'
				? requestBody
				: JSON.stringify(requestBody, null, 2);
	} else {
		content += '(no request body)';
	}

	content += `

${separator}
RESPONSE DATA
${separator}
`;

	if (responseData !== undefined && responseData !== null) {
		content +=
			typeof responseData === 'string'
				? responseData
				: JSON.stringify(responseData, null, 2);
	} else {
		content += '(no response data)';
	}

	content += `
${separator}
`;

	return content;
}

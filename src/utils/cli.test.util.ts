import { spawn } from 'child_process';
import { join } from 'path';

/**
 * Utility for testing CLI commands with real execution
 */
export class CliTestUtil {
	/**
	 * Executes a CLI command and returns the result
	 *
	 * @param args - CLI arguments to pass to the command
	 * @param options - Test options
	 * @returns Promise with stdout, stderr, and exit code
	 */
	static async runCommand(
		args: string[],
		options: {
			timeoutMs?: number;
			env?: Record<string, string>;
		} = {},
	): Promise<{
		stdout: string;
		stderr: string;
		exitCode: number;
	}> {
		// Default timeout of 30 seconds
		const timeoutMs = options.timeoutMs || 30000;

		// CLI execution path - points to the built CLI script
		const cliPath = join(process.cwd(), 'dist', 'index.js');

		return new Promise((resolve, reject) => {
			// Set up timeout handler
			const timeoutId = setTimeout(() => {
				child.kill();
				reject(new Error(`CLI command timed out after ${timeoutMs}ms`));
			}, timeoutMs);

			// Capture stdout and stderr
			let stdout = '';
			let stderr = '';

			// Spawn the process with given arguments
			const child = spawn('node', [cliPath, ...args], {
				env: {
					...process.env,
					...options.env,
				},
			});

			// Collect stdout data
			child.stdout.on('data', (data) => {
				stdout += data.toString();
			});

			// Collect stderr data
			child.stderr.on('data', (data) => {
				stderr += data.toString();
			});

			// Handle process completion
			child.on('close', (exitCode) => {
				clearTimeout(timeoutId);
				resolve({
					stdout,
					stderr,
					exitCode: exitCode ?? 0,
				});
			});

			// Handle process errors
			child.on('error', (err) => {
				clearTimeout(timeoutId);
				reject(err);
			});
		});
	}

	/**
	 * Validates that stdout contains expected strings/patterns
	 */
	static validateOutputContains(
		output: string,
		expectedPatterns: (string | RegExp)[],
	): void {
		for (const pattern of expectedPatterns) {
			if (typeof pattern === 'string') {
				expect(output).toContain(pattern);
			} else {
				expect(output).toMatch(pattern);
			}
		}
	}

	/**
	 * Validates Markdown output format
	 */
	static validateMarkdownOutput(output: string): void {
		// Check for Markdown heading
		expect(output).toMatch(/^#\s.+/m);

		// Check for markdown formatting elements like bold text, lists, etc.
		const markdownElements = [
			/\*\*.+\*\*/, // Bold text
			/-\s.+/, // List items
			/\|.+\|.+\|/, // Table rows
			/\[.+\]\(.+\)/, // Links
		];

		expect(markdownElements.some((pattern) => pattern.test(output))).toBe(
			true,
		);
	}

	/**
	 * Extracts and parses JSON from CLI output
	 * Handles output that may contain log lines before the JSON
	 *
	 * @param output - The CLI output string
	 * @returns Parsed JSON object or null if no valid JSON found
	 */
	static extractJsonFromOutput(output: string): Record<string, unknown> | null {
		// Split by newlines and find lines that could be start of JSON
		const lines = output.split('\n');
		let jsonStartIndex = -1;

		// Find the first line that starts with '{' (the actual JSON output)
		for (let i = 0; i < lines.length; i++) {
			const trimmed = lines[i].trim();
			if (trimmed.startsWith('{') && !trimmed.includes('[')) {
				// This looks like start of JSON, not a log line with timestamp
				jsonStartIndex = i;
				break;
			}
		}

		if (jsonStartIndex === -1) {
			return null;
		}

		// Join from the JSON start to the end
		const jsonStr = lines.slice(jsonStartIndex).join('\n');

		try {
			return JSON.parse(jsonStr);
		} catch {
			// Try to find the matching closing brace
			let braceCount = 0;
			let endIndex = 0;
			for (let i = 0; i < jsonStr.length; i++) {
				if (jsonStr[i] === '{') braceCount++;
				if (jsonStr[i] === '}') braceCount--;
				if (braceCount === 0) {
					endIndex = i + 1;
					break;
				}
			}
			if (endIndex > 0) {
				try {
					return JSON.parse(jsonStr.substring(0, endIndex));
				} catch {
					return null;
				}
			}
			return null;
		}
	}
}

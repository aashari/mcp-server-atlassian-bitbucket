import { promisify } from 'util';
import { execFile as callbackExecFile } from 'child_process';
import { Logger } from './logger.util.js';

const execFile = promisify(callbackExecFile);
const utilLogger = Logger.forContext('utils/shell.util.ts');

/**
 * Executes a command directly without shell interpretation.
 * Uses execFile instead of exec to prevent command injection (CWE-78).
 *
 * @param file The executable to run.
 * @param args Arguments to pass to the executable.
 * @param operationDesc A brief description of the operation for logging purposes.
 * @returns A promise that resolves with the stdout of the command.
 * @throws An error if the command execution fails, including stderr.
 */
export async function executeShellCommand(
	file: string,
	args: string[],
	operationDesc: string,
): Promise<string> {
	const methodLogger = utilLogger.forMethod('executeShellCommand');
	methodLogger.debug(
		`Attempting to ${operationDesc}: ${file} ${args.join(' ')}`,
	);
	try {
		const { stdout, stderr } = await execFile(file, args, {
			timeout: 5 * 60 * 1000,
		});
		if (stderr) {
			methodLogger.warn(`Stderr from ${operationDesc}: ${stderr}`);
		}
		methodLogger.info(
			`Successfully executed ${operationDesc}. Stdout: ${stdout}`,
		);
		return stdout || `Successfully ${operationDesc}.`;
	} catch (error: unknown) {
		methodLogger.error(
			`Failed to ${operationDesc}: ${file} ${args.join(' ')}`,
			error,
		);

		let errorMessage = 'Unknown error during shell command execution.';
		if (error instanceof Error) {
			const execError = error as Error & {
				stdout?: string;
				stderr?: string;
			};
			errorMessage =
				execError.stderr || execError.stdout || execError.message;
		} else if (typeof error === 'string') {
			errorMessage = error;
		}
		if (!errorMessage && error) {
			errorMessage = String(error);
		}

		throw new Error(`Failed to ${operationDesc}: ${errorMessage}`);
	}
}

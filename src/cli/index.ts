import { Command } from 'commander';
import { Logger } from '../utils/logger.util.js';
import { VERSION, CLI_NAME } from '../utils/constants.util.js';

// Import CLI modules
import atlassianApiCli from './atlassian.api.cli.js';
import atlassianRepositoriesCli from './atlassian.repositories.cli.js';

// Package description
const DESCRIPTION =
	'A Model Context Protocol (MCP) server for Atlassian Bitbucket integration';

// Create a contextualized logger for this file
const cliLogger = Logger.forContext('cli/index.ts');

// Log CLI initialization
cliLogger.debug('Bitbucket CLI module initialized');

export async function runCli(args: string[]) {
	const methodLogger = Logger.forContext('cli/index.ts', 'runCli');

	const program = new Command();

	program.name(CLI_NAME).description(DESCRIPTION).version(VERSION);

	// Register CLI commands
	atlassianApiCli.register(program);
	cliLogger.debug('API commands registered (get, post)');

	atlassianRepositoriesCli.register(program);
	cliLogger.debug('Repository commands registered (clone)');

	// Handle unknown commands
	program.on('command:*', (operands) => {
		methodLogger.error(`Unknown command: ${operands[0]}`);
		console.log('');
		program.help();
		process.exit(1);
	});

	// Parse arguments; default to help if no command provided
	await program.parseAsync(args.length ? args : ['--help'], { from: 'user' });
}

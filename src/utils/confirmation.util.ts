/**
 * Utility for handling write operation confirmations
 *
 * This module provides utilities to ensure users explicitly confirm
 * write operations that modify data in Bitbucket repositories.
 */

export interface ConfirmationCheckResult {
	isConfirmed: boolean;
	warningMessage?: string;
}

/**
 * Check if a write operation has been confirmed by the user
 *
 * @param confirmed - The confirmation parameter from the tool args
 * @param operationName - Name of the operation being performed
 * @param operationDetails - Details about what will be modified
 * @returns Object indicating if confirmed and optional warning message
 */
export function checkWriteOperationConfirmation(
	confirmed: boolean | undefined,
	operationName: string,
	operationDetails: string,
): ConfirmationCheckResult {
	if (confirmed === true) {
		return { isConfirmed: true };
	}

	const warningMessage = `
# ⚠️ WRITE OPERATION CONFIRMATION REQUIRED ⚠️

## Operation: ${operationName}

${operationDetails}

---

## ⚠️ WARNING
This operation will **MODIFY DATA** in your Bitbucket repository.

**This action:**
- Will make permanent changes to your Bitbucket data
- May affect your team's workflow
- Cannot be easily undone in some cases

---

## To Proceed
If you want to proceed with this operation, call this tool again with the parameter:
\`\`\`
confirmed: true
\`\`\`

## To Cancel
Simply do not call this tool again, or call it without the \`confirmed\` parameter.

---

**Think carefully before confirming this write operation.**
`;

	return {
		isConfirmed: false,
		warningMessage: warningMessage.trim(),
	};
}

/**
 * Format a confirmation response for MCP
 *
 * @param warningMessage - The warning message to display
 * @returns MCP-formatted response
 */
export function formatConfirmationWarning(warningMessage: string) {
	return {
		content: [
			{
				type: 'text' as const,
				text: warningMessage,
			},
		],
	};
}

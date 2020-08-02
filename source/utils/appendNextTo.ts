import select from "select-dom";

/**
 * https://stackoverflow.com/a/4793630/9285308
 */
export const appendNextTo = (targetSelector: string, newNode: Node): void => {
	const targetNode = select(targetSelector);

	// eslint-disable-next-line no-unused-expressions
	targetNode?.parentNode?.insertBefore(newNode, targetNode?.nextSibling);
};

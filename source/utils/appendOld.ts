import select from "select-dom";

/**
 * https://stackoverflow.com/a/4793630/9285308
 */
export const appendBefore = (targetSelector: string, newNode: Node): void => {
	const targetNode = select(targetSelector);

	// eslint-disable-next-line no-unused-expressions
	targetNode?.insertBefore(newNode, targetNode);
};

/**
 * https://stackoverflow.com/a/4793630/9285308
 */
export const appendNextTo = (targetSelector: string, newNode: Node): void => {
	const targetNode = select(targetSelector);

	// eslint-disable-next-line no-unused-expressions
	targetNode?.parentNode?.insertBefore(newNode, targetNode?.nextSibling);
};

/**
 * oftentimes you want to append multiple elements, * but the order is reversed.
 *
 * You can work around it by using `array.reverse()`, but that might yield unexpected results,
 * such as the later items resolving first instead of the reverse,
 * and using this function will fix it without the `array.reverse()` hack.
 *
 */
export const appendNextToInReverseOrder = (targetSelector: string, newNode: Node): void => {
	console.log("renderingNode", newNode);
	const targetNode = select(targetSelector);

	/** inserts before */
	// // eslint-disable-next-line no-unused-expressions
	// targetNode?.nextSibling?.parentNode?.insertBefore(newNode, targetNode?.previousSibling);

	// eslint-disable-next-line no-unused-expressions
	targetNode?.nextElementSibling?.insertBefore(newNode, targetNode?.nextSibling);
};

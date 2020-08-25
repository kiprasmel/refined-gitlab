import select from "select-dom";
import isString from "is-string";

const parseTargetNode = (targetSelector: string | Element): Element | null =>
	isString(targetSelector) ? select(targetSelector as string) : (targetSelector as Element);

/**
 * https://stackoverflow.com/a/4793630/9285308
 */
export const append = (nodeInserter: (targetNode: Element | null, newNode: Node) => void) => (
	targetSelector: string | Element,
	newNode: Node
): void => {
	const targetNode = parseTargetNode(targetSelector);

	nodeInserter(targetNode, newNode);
};

export const appendBefore = append((targetNode, newNode) => {
	console.log("targetNode", targetNode);
	targetNode?.parentNode?.insertBefore(newNode, targetNode);
});

export const appendNextTo = append((targetNode, newNode) =>
	targetNode?.parentNode?.insertBefore(newNode, targetNode?.nextSibling)
);

/**
 * oftentimes you want to append multiple elements, * but the order is reversed.
 *
 * You can work around it by using `array.reverse()`, but that might yield unexpected results,
 * such as the later items resolving first instead of the reverse,
 * and using this function will fix it without the `array.reverse()` hack.
 *
 * ---
 *
 * Don't do this. Since we place items in-between the 1st (current) and the 2nd (next) nodes,
 * the 2nd node becomes the 3rd, the 4th etc. and you cannot track it without further work-arounds.
 *
 * At that point - select the 2nd (next) node **before** you start appending elements,
 * and always render before it, because it won't matter anymore if it's the 2nd, 3rd or nth --
 * it will be saved and will point to the same node.
 *
 * Use together with `appendBefore` and you solved the issue.
 *
 * See the `add-custom-label-pickers` feature for a practical example
 *
 */
// // export const appendNextToInReverseOrder = append((targetNode, newNode) => {
// // 	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
// // 	const actualTargetNode = targetNode?.nextElementSibling /** TODO FIXME */!;

// // 	appendBefore(actualTargetNode, newNode);

// // 	// targetNode?.nextElementSibling?.insertBefore(newNode, targetNode?.nextSibling);
// // });

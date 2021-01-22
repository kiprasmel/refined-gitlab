export const observe = (
	elementToObserve: Node, //
	handleMutation: (mutationRecords: MutationRecord[]) => void,
	mutationObserverOptionOverrides: MutationObserverInit = {}
): void => {
	const observer = new MutationObserver((mutationRecords) => {
		handleMutation(mutationRecords);
	});

	observer.observe(elementToObserve, {
		childList: true, //
		subtree: true,
		characterData: true,
		...mutationObserverOptionOverrides,
	});
};

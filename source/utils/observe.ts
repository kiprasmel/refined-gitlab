const observe = (elementToObserve: Node, handleMutation: (mutationRecords: MutationRecord[]) => void) => {
	const observer = new MutationObserver((mutationRecords) => {
		handleMutation(mutationRecords);
		// const parsedVal: T = parseValueOnElementChange(mutationRecords);

		// console.log("update! parsedVal", parsedVal);

		// // setObservedValue(parsedVal);
	});

	// console.log("observing", elementToObserve);

	observer.observe(elementToObserve, {
		childList: true, //
		subtree: true,
		characterData: true,
	});
};

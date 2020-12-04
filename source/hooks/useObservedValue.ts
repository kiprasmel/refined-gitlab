import { useState } from "react";
import select from "select-dom";

export const observedValueFactory = <T>(parseValueOnElementChange: (mutationRecords: MutationRecord[]) => T) =>
	function useObservedValue(elementToObserve: HTMLElement | null = select(`ul[data-board]`)): T | undefined {
		if (!elementToObserve) {
			throw new Error("Cannot render label pickers in issue board - the `elementToObserve` was falsy");
		}

		const [observedValue, setObservedValue] = useState<T | undefined>(undefined);

		const observer = new MutationObserver((mutationRecords) => {
			const parsedVal: T = parseValueOnElementChange(mutationRecords);

			// console.log("update! parsedVal", parsedVal);

			setObservedValue(parsedVal);
		});

		// console.log("observing", elementToObserve);

		observer.observe(elementToObserve, {
			childList: true, //
			subtree: true,
			characterData: true,
		});

		return observedValue;
	};

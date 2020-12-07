import { useState } from "react";

export const observedValueFactory = <T>(parseValueOnElementChange: (mutationRecords: MutationRecord[]) => T) =>
	function useObservedValue(elementToObserve: HTMLElement): T | undefined {
		if (!elementToObserve) {
			const err = new Error(
				"[refined-gitlab] Cannot render element in issue board - the `elementToObserve` was falsy"
			);
			console.error(err, elementToObserve);
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

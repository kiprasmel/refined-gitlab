import React, { FC, useEffect, useRef, useState } from "react";

// eslint-disable-next-line import/no-cycle
import { getConfig } from "../utils/config";

export const LoadingIndicator: FC<{}> = () => {
	const symbols: string[] = ["-", "\\", "|", "/", "-", "\\", "|", "/"];
	const cyclingSpeedMs: number = getConfig().loadingIndicatorCyclingSpeedMs ?? 100;

	const currIdxRef = useRef<number>(0);
	const [currIdx, setCurrIdx] = useState(currIdxRef.current);

	const intervalId = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		intervalId.current = setInterval(() => {
			//
			let newIndex: number = currIdxRef.current;

			newIndex = (newIndex + 1) % symbols.length;

			console.log("newIndex", newIndex);

			currIdxRef.current = newIndex;
			setCurrIdx(newIndex);

			/** TODO */

			// setCurrentSymbolIdx(newIndex);

			// setCurrentSymbol(symbols[currIdxRef.current]);
			// console.log("currentSymbol", currentSymbol);
		}, cyclingSpeedMs);

		return (): void => {
			console.log("clear interval!", intervalId?.current);
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			clearInterval(intervalId?.current!);
		};
	}, []);

	// useEffect(() => {
	// 	setCurrentSymbol(symbols[currIdxRef.current]);
	// 	console.log("currentSymbol", currentSymbol);
	// }, [symbols, currIdxRef.current]);

	return <>{symbols[currIdx]}</>;
};

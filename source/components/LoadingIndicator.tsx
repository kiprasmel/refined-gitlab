import React, { FC, useEffect, useRef, useState } from "react";

// eslint-disable-next-line import/no-cycle
import { getConfig } from "../config";

export const LoadingIndicator: FC<{}> = () => {
	const symbols: string[] = ["-", "\\", "|", "/", "-", "\\", "|", "/"];
	const cyclingSpeedMs: number = getConfig().loadingIndicatorCyclingSpeedMs ?? Math.ceil(1000 / 60 /** 60 FPS */);

	const currIdxRef = useRef<number>(0);
	const [currIdx, setCurrIdx] = useState(currIdxRef.current);

	const intervalId = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		intervalId.current = setInterval(() => {
			//
			let newIndex: number = currIdxRef.current;

			newIndex = (newIndex + 1) % symbols.length;

			currIdxRef.current = newIndex;
			setCurrIdx(newIndex);
		}, cyclingSpeedMs);

		return (): void => {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			clearInterval(intervalId?.current!);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return <>{symbols[currIdx]}</>;
};

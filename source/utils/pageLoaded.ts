// const hasLoaded = (): boolean => document.readyState === "complete";

export const pageLoaded = new Promise((resolve) => {
	// if (hasLoaded()) {
	// 	resolve();
	// } else {
	document.addEventListener(
		"readystatechange",
		(event) => {
			// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
			// @ts-ignore
			if (event?.target?.readyState === "complete") {
				resolve();
			}
		},
		{
			capture: true,
			once: true,
			passive: true,
		}
	);
	// }
});

// Object.defineProperty(pageLoaded, "hasLoaded", {
// 	get: () => hasLoaded(),
// });

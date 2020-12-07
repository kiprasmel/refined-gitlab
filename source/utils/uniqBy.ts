export const uniqBy = <T, K extends keyof T>(arr: T[], key: K): T[] => {
	const map: Map<T[K], T> = new Map();

	for (const item of arr) {
		if (map.has(item[key])) {
			continue;
		}

		map.set(item[key], item);
	}

	const uniqItems: T[] = [...map.values()];

	return uniqItems;
};

export const getCSRFData = () => {
	const key: string = document.querySelector(`meta[name="csrf-param"]`)?.content;
	const value: string = document.querySelector(`meta[name="csrf-token"]`)?.content;

	const ret = { key, value };
	console.log("\tCSRF", ret);
	return ret;
};

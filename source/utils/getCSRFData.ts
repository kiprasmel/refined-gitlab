export const getCSRFData = (): { key: string; value: string } => {
	const key: string | undefined = document.querySelector<HTMLMetaElement>(`meta[name="csrf-param"]`)?.content;
	const value: string | undefined = document.querySelector<HTMLMetaElement>(`meta[name="csrf-token"]`)?.content;

	if (key === undefined || value === undefined) {
		throw new Error("[Refined GitLab] Cannot get GitLab's CSRF data - the selectors might be outdated");
	}

	const ret = { key, value };

	console.log("CSRF", ret);

	return ret;
};

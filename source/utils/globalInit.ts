import { features } from "../Features";

export const globalInit = (): void => {
	if ((window as any).hasRun) {
		return;
	}
	(window as any).hasRun = true;

	features.loadAll();

	console.log("refined-gitlab loaded!", new Date().toISOString());
};

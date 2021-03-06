import domLoaded from "dom-loaded";

import { pageLoaded } from "./utils/pageLoaded";
// eslint-disable-next-line import/no-cycle
import { Config, getConfig } from "./config";
// eslint-disable-next-line import/no-cycle
import { needsToWaitForApi } from "./utils/needsToWaitForApi";
// eslint-disable-next-line import/no-cycle
import { apiLoaded } from "./utils/apiLoaded";

export type FeatureProps = Config & {};

export type Feature = (props: FeatureProps) => any;

export interface FeatureDescription {
	id: string;
	feature: Feature;
	waitForDomLoaded?: boolean;
	waitForPageLoaded?: boolean;
	needsApi?: boolean;
}

class Features {
	private __addedFeatures: FeatureDescription[] = [];

	add(ctx: FeatureDescription): void {
		this.__addedFeatures.push(ctx);
	}

	getAll(): FeatureDescription[] {
		return [...this.__addedFeatures];
	}

	async loadAll(): Promise<void> {
		const config = getConfig();

		const promises: Promise<any>[] = this.getAll().map(
			async ({ id, feature, waitForDomLoaded, waitForPageLoaded, needsApi }) => {
				if (config.features[id] === false) {
					console.log(`⏭ skipping feature because it's disabled in config, id: \`${id}\``);
					return;
				}

				try {
					const featureProps: FeatureProps = { ...config };

					const requirements: Promise<any>[] = [];

					if (waitForDomLoaded) {
						requirements.push(domLoaded);
					}

					if (waitForPageLoaded) {
						requirements.push(pageLoaded);
					}

					if (needsApi && needsToWaitForApi()) {
						requirements.push(apiLoaded);
					}

					if (requirements.length > 0) {
						await Promise.allSettled(requirements);
						await feature(featureProps);

						console.log(`✅ (⏱) feature loaded (after fulfilling requirements), id: \`${id}\``);
					} else {
						await feature(featureProps);

						console.log(`✅ feature loaded (instantly), id: \`${id}\``);
					}
				} catch (e) {
					console.error(`❌ failed to load feature "${id}", error:`, { e });
				}
			}
		);

		await Promise.allSettled(promises);
	}
}

const features = new Features();

export { features };

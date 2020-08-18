import domLoaded from "dom-loaded";
// eslint-disable-next-line import/no-cycle
import { Config, getConfig } from "./utils/config";

export type Feature = (config: Config) => any;

export interface FeatureDescription {
	id: string;
	feature: Feature;
	waitForDomLoaded?: boolean;
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

		for (const { id, feature, waitForDomLoaded } of this.getAll()) {
			if (config.features[id] === false) {
				console.log(`⏭ skipping feature because it's disabled in config, id: \`${id}\``);
				continue;
			}

			try {
				if (waitForDomLoaded) {
					// (async () => {
					await domLoaded;
					feature(config);
					console.log(`✅ (⏱) feature loaded (after dom loaded), id: \`${id}\``);
					// })();
				} else {
					feature(config);
					console.log(`✅ feature loaded (instantly), id: \`${id}\``);
				}
			} catch (e) {
				console.error(`❌ failed to load feature "${id}", error:`, { e });
			}
		}
	}
}

const features = new Features();

export { features };

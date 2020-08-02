import domLoaded from "dom-loaded";

interface FeatureDescription {
	id: string;
	feature: () => any;
	waitForDomLoaded?: boolean;
}

class Features {
	private __addedFeatures: FeatureDescription[] = [];

	add(ctx: FeatureDescription) {
		this.__addedFeatures.push(ctx);
	}

	getAll(): FeatureDescription[] {
		return this.__addedFeatures;
	}

	loadAll(): void {
		this.getAll().forEach(
			({
				id = "", //
				feature = () => {},
				waitForDomLoaded = false,
			}) => {
				try {
					if (waitForDomLoaded) {
						(async () => {
							await domLoaded;
							feature();
							console.log("feature loaded: ", id);
						})();
					} else {
						feature();
						console.log("feature loaded: ", id);
					}
				} catch (e) {
					console.error(`failed to load feature "${id}", error:`, { e });
				}
			}
		);
	}
}

const features = new Features();

export { features };

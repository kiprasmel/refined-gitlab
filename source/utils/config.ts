/**
 * TODO FUTURE
 *
 * 1. actually save the config
 * 1.1 figure out where you wanna save it (browser storage / local storage etc.)
 *     -> probably browser storage?
 *
 * Note the differences between web storage api & javascript storage api -
 * see https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/storage (incl. comparison)
 * and https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API
 *
 * 2. support multi-host configs
 *    -> note - this does not look easy and will need further planning,
 * because we need to figure out how to properly reload & use the correct config
 * on each browser tab, since the host may be different
 */

// eslint-disable-next-line import/no-cycle
import { FeatureDescription } from "../Features";
// eslint-disable-next-line import/no-cycle
import { SidebarFeatureFromLabels } from "../features/add-custom-label-pickers";

/** TODO LINT disable no-explicit-any */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FeatureConfigConfig<T = any> = Record<string, T>;

export interface FeatureConfig {
	disabled: boolean;
	config?: FeatureConfigConfig;
}

export interface Config {
	configVersion: string;
	hostUrl: string | RegExp;
	apiToken: string;

	/** feature configs leggo */
	sidebarFeaturesFromLabels: SidebarFeatureFromLabels[];

	/** feature toggles leggo */
	// // features: { [key: FeatureDescription["id"]]: FeatureConfig};
	// // features: { [key: string]:  boolean | FeatureConfig};
	features: Record<FeatureDescription["id"], boolean>;
}

/** Stored somewhere, probably as stringified JSON, or perhaps a js object instead? */
let config: Config = getDefaultConfig();

export const getConfig = (): Config => ({ ...config });

export const setConfig = (newConfig: Config): Config => {
	config = { ...newConfig };
	return config;
};

export const resetConfig = (): Config => {
	config = getDefaultConfig();
	return config;
};

function getDefaultConfig(): Config {
	return {
		configVersion: "0",
		hostUrl: "https://gitlab.com", // "<YOUR_GITLAB_HOST_URL>", /** TODO FIXME - why are there errors if the url is without `https?://` ? */
		apiToken: "yqA33kxeK7oB8ExnBfA-" /** TODO provide link to get the API token @ popup */,

		sidebarFeaturesFromLabels: [
			{
				isEnabled: true,
				title: "Column",
				labelLayoutType: "grid",
				isMultiSelect: false,
				labels: [
					"Backlog", //
					"Grooming",
					"Ready",
					"Next",
					"To Do",
					"In progress",
					"Confirmation",
					"Awaiting deployment",
					"QA",
					"Done",
				],
			},
			{
				isEnabled: true,
				title: "Story points",
				labelLayoutType: "select",
				isMultiSelect: false,
				labels: [
					"SP1/2", //
					"SP1",
					"SP2",
					"SP3",
					"SP5",
					"SP8",
				],
			},
			{
				isEnabled: true,
				title: "Priority",
				labelLayoutType: "grid",
				isMultiSelect: false,
				labels: [
					"P1", //
					"P2",
					"P3",
				],
			},
			{
				isEnabled: false,
				title: "QA status",
				labelLayoutType: "grid",
				isMultiSelect: false,
				labels: [
					"QA To Do", //
					"QA In Progress",
					"QA Passed",
					"QA Failed",
					"QA Blocked",
					"QA Passed /w Non-critical",
				],
			},
			{
				isEnabled: false,
				title: "Design status",
				labelLayoutType: "grid",
				isMultiSelect: false,
				labels: [
					"Design To Do", //
					"Design In Progress",
					"Design Review",
				],
			},
			{
				isEnabled: true,
				title: "Other commons",
				labelLayoutType: "grid",
				isMultiSelect: true,
				labels: [
					"Techical", //
					"Research",
					"Blocked",
					"Code Dep",
				],
			},
		],

		features: {
			"add-custom-label-pickers": true,
			"always-expand-sidebar": true,

			/**
			 * TODO AUTOMATE
			 *
			 * use webpack / native node modules (`fs` etc.)
			 * to get these filled in automatically at compile time
			 * (`filename` -> `true`)
			 *
			 */
		},

		/**
		 * TODO FUTURE
		 */
		// hostSpecificConfigs: [
		// 	{
		// 		hostUrl: /gitlab.com/,
		// 		apiToken: process.env.GITLAB_TOKEN,
		// 	},
		// ],
	};
}

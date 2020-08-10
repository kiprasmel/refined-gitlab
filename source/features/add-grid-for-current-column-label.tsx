/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/camelcase */
import React, { useState, useEffect } from "react";
/** TODO FIXME - investigate https://github.com/facebook/react/tree/master/packages/react-dom#on-the-server etc. */
import ReactDOM from "react-dom";
import cx from "classnames";

// eslint-disable-next-line import/no-cycle
import { Feature, features } from "../Features";
import { appendNextTo } from "../utils/appendNextTo";
// eslint-disable-next-line import/no-cycle
import { api } from "../utils/api";

import "./add-grid-for-current-column-label.scss";

export interface SidebarFeatureFromLabels {
	title: string;
	enabled: boolean;
	labelLayoutType: "grid" | "select";
	// isMultiChoice: boolean /** TODO FUTURE */;
	labels: string[];
}

/**
 * TODO - make generic for any labels
 * to allow any amount of customization
 *
 * (append | prepend, what labels)
 */
export const addGridForCurrentColumnLabel: Feature = async ({ sidebarFeaturesFromLabels }) => {
	// const { enabled, labelLayoutType, labels: columnLabels /** TODO */, title } = sidebarFeaturesFromLabels[0];

	if (!/\/issues\/\d+/.test(window.location.href)) {
		/** TODO handle @ `Features` */
		console.log("- skipping feature because wrong page");
		return;
	}

	console.log("window.location", window.location, document.location);

	/** TODO */
	const projectId: string = document.querySelectorAll(`[data-project-id]`)[0].attributes["data-project-id"].value!;

	console.log("projectId", projectId);

	/** TODO */
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const issueIid: string = window.location.href.match(/\/issues\/(\d+)/)?.[1]!;

	console.log("issueIid", issueIid);

	console.log("API", api);
	(window as any).api = api;

	const Component = ({ columnLabels, title }) => {
		/** TODO xstate? :kekw: */
		const [currentColumnLabel, setCurrentColumnLabel] = useState<string | null>();

		/** retrieve the current label (intially) */
		useEffect(() => {
			let hasUnmounted = false;

			api.Issues.show(projectId, issueIid)
				.then(({ labels: issueLabels = [] }) => {
					const foundLabel = issueLabels.find((issueLabel: string) => columnLabels.includes(issueLabel));

					if (!foundLabel) {
						/** TODO */
					}

					if (!hasUnmounted) {
						setCurrentColumnLabel(foundLabel);
					}

					console.log("currentColumnLabel", currentColumnLabel);
				})
				.catch(console.error);

			return (): void => {
				hasUnmounted = true;
			};

			/** disabled because should react only on the first load */
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, []);

		const [selectionStatus, setSelectionStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

		const handleLabelChange = async (
			newLabel: string,
			e: React.MouseEvent<HTMLButtonElement, MouseEvent>
		): Promise<void> => {
			console.log("set", { currentColumnLabel, newLabel });

			let goal: "update" | "remove" | "ignore";

			if (newLabel === currentColumnLabel) {
				if (e.shiftKey) {
					goal = "remove";

					// console.log("removing label since it's identical and the shift key was held");
					// setCurrentColumnLabel(null);
					// setSelectionStatus("loading");
				} else {
					goal = "ignore";

					// console.log("ignoring setting new label because current one already exists");
					// return;
				}
			} else {
				if (e.shiftKey) {
					goal = "ignore";
				} else {
					goal = "update";
				}

				// setCurrentColumnLabel(newLabel);
				// setSelectionStatus("loading");
			}

			console.log("goal", goal);

			if (goal === "ignore") {
				console.log("ignoring setting new label because current one already exists");
				return;
			} else if (goal === "update") {
				console.log("removing label since it's identical and the shift key was held");

				setCurrentColumnLabel(newLabel);
				setSelectionStatus("loading");

				await api.Issues.edit(projectId, issueIid, {
					remove_labels: currentColumnLabel /** TODO make sure this is the old one xd */,
					add_labels: newLabel,
				})
					.then((res) => {
						console.log("res", res);
						setSelectionStatus("success");

						setTimeout(() => {
							setSelectionStatus("idle");
						}, 1000 * 2);
					})
					.catch((e) => {
						console.error(e);
						setSelectionStatus("error");
					});
			} else if (goal === "remove") {
				// // setCurrentColumnLabel(null);
				setSelectionStatus("loading");

				await api.Issues.edit(projectId, issueIid, {
					remove_labels: currentColumnLabel /** TODO make sure this is the old one xd */,
				})
					.then((res) => {
						console.log("res", res);

						setCurrentColumnLabel(null);
						setSelectionStatus("success");

						// setTimeout(() => {
						// 	// // setSelectionStatus("idle");
						// }, 1000 * 2);
					})
					.catch((e) => {
						console.error(e);
						setSelectionStatus("error");
					});
			} else {
				throw new Error("Shall be impossible");
			}
		};

		return (
			<div
				className={cx({
					"cursor-loading": selectionStatus === "loading",
				})}
			>
				{/* <div className="block"> */}
				<div className="title hide-collapsed">
					{title}{" "}
					{selectionStatus === "loading" ? (
						<span title="Updating">🔁</span>
					) : selectionStatus === "success" || selectionStatus === "idle" ? (
						currentColumnLabel ? (
							<span title="Column successfully selected">✅</span>
						) : (
							<span title="No column selected">–</span>
						)
					) : (
						<span title="Something went wrong (perhaps the wifi is gone?) - check the console & report the issue">
							❌
						</span>
					)}
				</div>

				<div className="cluster">
					<ul className="story-point-label-grid">
						{columnLabels.map((label) => (
							<li key={label}>
								<button
									type="button"
									data-x-label={label}
									// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
									onClick={async (e) => await handleLabelChange(label, e)}
									// className="btn story-point-label-grid__list-item-button"

									className={cx("btn story-point-label-grid__list-item-button", {
										"cursor-loading": selectionStatus === "loading",
										//
										"select-initiated":
											selectionStatus === "loading" && label === currentColumnLabel,
										"select-confirmed":
											selectionStatus === "success" && label === currentColumnLabel,
										"select-idle": selectionStatus === "idle" && label === currentColumnLabel,
									})}
								>
									{label}
								</button>
							</li>
						))}
					</ul>
				</div>
				{/* </div> */}
			</div>
		);
	};

	sidebarFeaturesFromLabels.reverse().forEach(({ title = "", labels = [], enabled = true }) => {
		if (!enabled) {
			return;
		}

		const node = document.createElement("div");
		node.id = `ayyy-lmao-${title}`;
		node.classList.add("block"); /** TODO FIXME (should receive from the thing we tryna render) */
		appendNextTo(".labels", node);

		ReactDOM.render(<Component title={title} columnLabels={labels} />, document.getElementById(node.id));
	});
};

features.add({
	id: "add-grid-for-current-column-label",
	feature: addGridForCurrentColumnLabel,
	waitForDomLoaded: true,
});

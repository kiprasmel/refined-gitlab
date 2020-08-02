import React from "dom-chef";
import select from "select-dom";

import { features } from "../Features";
import { appendNextTo } from "../utils/appendNextTo";
import { api } from "../utils/api";

import "./add-grid-for-current-column-label.scss";

const columnLabels = [
	"Open",
	"Backlog",
	"Grooming",
	"Ready",
	"Next",
	"To Do",
	"In progress",
	"Confirmation",
	"Awaiting deployment",
	// "awaiting deployment ayyyy lmao fam XD :joy: ",
	"QA",
	"Done",
	"Closed",
];

/**
 * TODO - make generic for any labels
 * to allow any amount of customization
 *
 * (append | prepend, what labels)
 */
export const addGridForCurrentColumnLabel = async (): Promise<void> => {
	/** TODO */
	const projectId: string | number = 318;
	/** TODO */
	const issueIid: string | number = 8014;

	console.log("API", api);
	(window as any).api = api;

	let currentColumnLabel: string;

	try {
		// const issues = await api.Issues.all({ projectId, groupId: 905 });
		// console.log("issues", issues);

		const { labels = [] } = await api.Issues.show(projectId, issueIid);

		for (const label of labels) {
			if (columnLabels.includes(label)) {
				currentColumnLabel = label;
				break;
			}
		}

		if (!currentColumnLabel) {
			currentColumnLabel = "open";
		}

		/**
		 * WARNING - Will **not** find the element
		 * since it's not even rendered yet
		 *
		 * Take care of updating yourself kiddo!
		 */
		// // const found = select(`[data-x-label="${currentColumnLabel}"]`);

		// // // eslint-disable-next-line no-unused-expressions
		// // found?.classList.add("selected");

		console.log("currentColumnLabel", currentColumnLabel);
	} catch (e) {
		console.error(e);
	}

	// let [currentColumnLabel, setCurrentColumnLabel] = useState<string>(() => "grooming");

	const setCurrentColumnLabel = async (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>, //
		newLabel: string
	): Promise<string> => {
		console.log("set", { e, currentColumnLabel, newLabel });

		// eslint-disable-next-line no-unused-expressions
		const oldL = select(`[data-x-label="${currentColumnLabel}"]`);

		// eslint-disable-next-line no-unused-expressions
		oldL?.classList.remove("selected");

		// eslint-disable-next-line no-unused-expressions
		const newL = select(`[data-x-label="${newLabel}"]`);

		// eslint-disable-next-line no-unused-expressions
		newL?.classList.add("selected");

		console.log({ oldL, newL });

		// e.currentTarget.classList.add("selected");

		/** --- */

		/**
		 * TODO - call gitlab's API to remove the current label and set a new one
		 * or "drag" the issue into a different column, if such a feature exists (doubt)
		 */
		// await fetch("").then(async (res) => await res.json());

		await api.Issues.edit(projectId, issueIid, {
			// eslint-disable-next-line @typescript-eslint/camelcase
			remove_labels: currentColumnLabel,
			// eslint-disable-next-line @typescript-eslint/camelcase
			add_labels: newLabel,
		}).catch((e) => console.error(e));

		// if (newLabel === currentColumnLabel) {
		// 	return currentColumnLabel;
		// }

		currentColumnLabel = newLabel;

		return newLabel;
	};

	const isLabelSelected = (label: string): boolean => currentColumnLabel === label;

	// eslint-disable-next-line no-unused-expressions

	appendNextTo(
		".labels",
		((
			<>
				<div className="block">
					<div className="title hide-collapsed">Column</div>

					<div className="cluster">
						<ul className="story-point-label-grid">
							{columnLabels.map((label) => (
								<li
									key={label}
									className={
										isLabelSelected(label)
											? "story-point-label-grid__list-item--selected"
											: "story-point-label-grid__list-item"
									}
								>
									<button
										type="button"
										data-x-label={label}
										// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
										onClick={(e) => setCurrentColumnLabel(e, label)}
										// className="btn story-point-label-grid__list-item-button"

										className={[
											"btn story-point-label-grid__list-item-button",
											/** WARNING - Will **NOT** auto-update like you'd expect in react - manage it yourself kiddo */
											currentColumnLabel === label ? "selected" : "",
										].join(" ")}

										// className={
										// 	isLabelSelected(label)
										// 		? "btn story-point-label-grid__list-item-button--selected"
										// 		: "btn story-point-label-grid__list-item-button"
										// }
									>
										{label}
									</button>
								</li>
							))}
						</ul>
					</div>
				</div>
			</>
		) as unknown) as Node
	);
};

features.add({
	id: "add-grid-for-current-column-label",
	feature: addGridForCurrentColumnLabel,
	waitForDomLoaded: true,
});

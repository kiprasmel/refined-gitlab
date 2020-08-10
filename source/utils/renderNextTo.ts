/** TODO FIXME - investigate https://github.com/facebook/react/tree/master/packages/react-dom#on-the-server etc. */
import ReactDOM from "react-dom";
import { appendNextTo } from "./appendNextTo";

export const renderNextTo = (
	selector: string, //
	holderNodeId: string,
	extraClassesForNode: string[] = [],
	jsxElement: Parameters<typeof ReactDOM.render>[0][0]
): void => {
	const node = document.createElement("div");
	node.id = holderNodeId;

	node.classList.add(...extraClassesForNode);
	appendNextTo(selector, node);

	ReactDOM.render(jsxElement, document.getElementById(node.id));
};

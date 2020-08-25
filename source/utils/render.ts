/** TODO FIXME - investigate https://github.com/facebook/react/tree/master/packages/react-dom#on-the-server etc. */
import ReactDOM from "react-dom";
import { appendBefore, appendNextTo, appendNextToInReverseOrder } from "./append";

const render = (nodeAppender: (selector: string, newNode: Node) => void) => (
	selector: string, //
	jsxElement: Parameters<typeof ReactDOM.render>[0][0],
	options: {
		extraClassesForRootNode: string[]; //
		rootNodeId?: string;
	} = {
		extraClassesForRootNode: [], //
		rootNodeId: "",
	}
): void => {
	const node = document.createElement("div");

	if (options.rootNodeId) {
		node.id = options.rootNodeId;
	}

	if (options.extraClassesForRootNode.length > 0) {
		node.classList.add(...options.extraClassesForRootNode);
	}

	nodeAppender(selector, node);

	ReactDOM.render(jsxElement, node);
};

export const renderBefore = render(appendBefore);
export const renderNextTo = render(appendNextTo);
export const renderNextToInReverseOrder = render(appendNextToInReverseOrder);

/** TODO FIXME - investigate https://github.com/facebook/react/tree/master/packages/react-dom#on-the-server etc. */
import ReactDOM from "react-dom";
import { appendBefore, appendNextTo } from "./append";

const render = <S extends string | Element = string | Element>(nodeAppender: (selector: S, newNode: Node) => void) => (
	selector: S, //
	jsxElement: Parameters<typeof ReactDOM.render>[0][0],
	options: {
		rootNodeId?: string;
		rootNodeClassName?: string; //
	} = {
		rootNodeId: "",
		rootNodeClassName: "", //
	}
): void => {
	const rootNode = document.createElement("div");

	if (options.rootNodeId) {
		rootNode.id = options.rootNodeId;
	}

	if (options.rootNodeClassName) {
		rootNode.classList.add(...options.rootNodeClassName.split(" "));
	}

	nodeAppender(selector, rootNode);

	ReactDOM.render(jsxElement, rootNode);
};

export const renderBefore = render(appendBefore);
export const renderNextTo = render(appendNextTo);

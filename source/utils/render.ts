/** TODO FIXME - investigate https://github.com/facebook/react/tree/master/packages/react-dom#on-the-server etc. */
import ReactDOM from "react-dom";
import { appendBefore, appendNextTo } from "./append";

const render = <S extends string | Element = string | Element>(nodeAppender: (selector: S, newNode: Node) => void) => (
	selector: S, //
	jsxElement: Parameters<typeof ReactDOM.render>[0][0],
	options: {
		rootNodeId?: string;
		rootNodeClassName?: string; //
		rootNode?: HTMLElement;
	} = {
		rootNodeId: "",
		rootNodeClassName: "", //
	}
): void => {
	if (!options.rootNode) {
		options.rootNode = document.createElement("div");
	}

	if (options.rootNodeId) {
		options.rootNode.id = options.rootNodeId;
	}

	if (options.rootNodeClassName) {
		options.rootNode.classList.add(...options.rootNodeClassName.split(" "));
	}

	nodeAppender(selector, options.rootNode);

	ReactDOM.render(jsxElement, options.rootNode);
};

export const renderBefore = render(appendBefore);
export const renderNextTo = render(appendNextTo);

import select from "select-dom";

import { globalInit } from "./utils/globalInit";

import "./styles/default.scss";
import "./styles/cluster.scss";

/** leggo */
import "./features/add-custom-label-pickers";
import "./features/always-expand-sidebar";

globalInit();

/**
 * debugging
 *
 * though might not work - see:
 *
 * https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Content_scripts
 * & https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Content_scripts
 *
 */
(window as any).select = select;

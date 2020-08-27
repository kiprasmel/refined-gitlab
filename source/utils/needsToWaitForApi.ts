import { getConfig } from "../config";

export const needsToWaitForApi = (): boolean => getConfig().authKind === "native";

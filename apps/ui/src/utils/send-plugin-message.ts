import type { PluginMessage } from "@ftc/types";

export const sendPluginMessage = (pluginMessage: PluginMessage) => {
  parent.postMessage({ pluginMessage }, "*");
};

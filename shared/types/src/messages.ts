export type PluginMessageCreateShapes = {
  kind: "create-shapes";
  count: number;
};

export type PluginMessageCancel = {
  kind: "cancel";
};

export type PluginMessage = PluginMessageCreateShapes | PluginMessageCancel;

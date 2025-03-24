export type PluginMessageCreateShapes = {
  kind: "create-shapes";
  count: number;
};

export type PluginMessageCancel = {
  kind: "cancel";
};

export type PluginMessage = PluginMessageCreateShapes | PluginMessageCancel;

export type PluginMessageKind = PluginMessage["kind"];

export type UiMessageSetSelection = {
  kind: "set-selection";
  nodes: unknown[];
};

export type UiMessage = UiMessageSetSelection;

export type UiMessageKind = UiMessageSetSelection["kind"];

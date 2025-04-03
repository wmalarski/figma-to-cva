import type { PluginVariable, PluginVariableCollection } from "./variables";

export type PluginMessageCreateShapes = {
  kind: "create-shapes";
  count: number;
};

export type PluginMessageCancel = {
  kind: "cancel";
};

export type PluginMessage = PluginMessageCreateShapes | PluginMessageCancel;

export type PluginMessageKind = PluginMessage["kind"];

export type UiMessageSetVariables = {
  kind: "set-variables";
  collections: PluginVariableCollection[];
  variables: PluginVariable[];
};

export type UiMessageSetComponentSets = {
  kind: "set-component-sets";
  componentSets: unknown[];
};

export type UiMessageSetComponents = {
  kind: "set-components";
  components: unknown[];
  total: number;
  page: number;
};

export type UiMessage =
  | UiMessageSetVariables
  | UiMessageSetComponentSets
  | UiMessageSetComponents;

export type UiMessageKind = UiMessage["kind"];

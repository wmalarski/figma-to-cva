export type PluginVariableResolvedDataType =
  | "BOOLEAN"
  | "COLOR"
  | "FLOAT"
  | "STRING";

export type PluginVariableScope =
  | "ALL_SCOPES"
  | "TEXT_CONTENT"
  | "CORNER_RADIUS"
  | "WIDTH_HEIGHT"
  | "GAP"
  | "ALL_FILLS"
  | "FRAME_FILL"
  | "SHAPE_FILL"
  | "TEXT_FILL"
  | "STROKE_COLOR"
  | "STROKE_FLOAT"
  | "EFFECT_FLOAT"
  | "EFFECT_COLOR"
  | "OPACITY"
  | "FONT_FAMILY"
  | "FONT_STYLE"
  | "FONT_WEIGHT"
  | "FONT_SIZE"
  | "LINE_HEIGHT"
  | "LETTER_SPACING"
  | "PARAGRAPH_SPACING"
  | "PARAGRAPH_INDENT";

export type PluginCodeSyntax = {
  WEB?: string | undefined;
  ANDROID?: string | undefined;
  iOS?: string | undefined;
};

export type RGB = {
  readonly r: number;
  readonly g: number;
  readonly b: number;
};

export type RGBA = {
  readonly r: number;
  readonly g: number;
  readonly b: number;
  readonly a: number;
};

export type PluginVariableAlias = {
  type: "VARIABLE_ALIAS";
  id: string;
};

export type PluginVariableValue =
  | boolean
  | string
  | number
  | RGB
  | RGBA
  | PluginVariableAlias;

export type PluginValuesByMode = Record<string, PluginVariableValue>;

export type PluginVariable = {
  id: string;
  key: string;
  name: string;
  description: string;
  resolvedType: PluginVariableResolvedDataType;
  scopes: PluginVariableScope[];
  valuesByMode: PluginValuesByMode;
  variableCollectionId: string;
  codeSyntax: PluginCodeSyntax;
};

export type PluginVariableMode = {
  modeId: string;
  name: string;
};

export type PluginVariableCollection = {
  id: string;
  key: string;
  defaultModeId: string;
  modes: PluginVariableMode[];
  name: string;
};

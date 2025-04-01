import type {
  PluginMessage,
  PluginMessageCreateShapes,
  PluginVariable,
  PluginVariableCollection,
  UiMessageSetSelection,
} from "@ftc/types";

figma.on("run", async () => {
  const nodes = figma.currentPage.selection;

  if (nodes.length === 0) {
    figma.notify("Error: At least 1 node has to be selected");
    figma.closePlugin();
    return;
  }

  figma.showUI(__html__, { width: 500, height: 600 });

  await sendSelection(nodes);
});

figma.on("selectionchange", async () => {
  await sendSelection(figma.currentPage.selection);
});

figma.ui.onmessage = (message: PluginMessage) => {
  switch (message.kind) {
    case "create-shapes": {
      createRectangles(message);
      break;
    }
    case "cancel": {
      figma.closePlugin();
      break;
    }
    default: {
      figma.closePlugin();
    }
  }
};

const sendSelection = async (nodes: readonly SceneNode[]) => {
  const withCss = await Promise.all(nodes.map((node) => node.getCSSAsync()));

  const variables = await figma.variables.getLocalVariablesAsync();
  const serizalizedVariables = variables.map(serizalizeVariable);

  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  const serizalizedCollections = collections.map(serizalizeVariableCollection);

  const nodesMessage = nodes.map((node, index) => ({
    boundVariables: node.boundVariables,
    mainComponent: node.componentPropertyReferences?.mainComponent,
    explicitVariableModes: node.explicitVariableModes,
    inferredVariables: node.inferredVariables,
    resolvedVariableModes: node.resolvedVariableModes,
    css: withCss[index],
  }));

  // console.log("nodes", nodes);
  // console.log("nodesMessage", nodesMessage);
  // console.log("localVariables", localVariables);
  // console.log("variableCollections", variables);
  // console.log("figma.constants", figma.constants);
  // console.log("figma.variables", figma.variables);

  postUiMessage({
    kind: "set-selection",
    nodes: nodesMessage,
    collections: serizalizedCollections,
    variables: serizalizedVariables,
  });
};

const createRectangles = (message: PluginMessageCreateShapes) => {
  const numberOfRectangles = message.count;
  const nodes: SceneNode[] = [];
  for (let i = 0; i < numberOfRectangles; i++) {
    const rect = figma.createRectangle();
    rect.x = i * 150;
    rect.fills = [{ type: "SOLID", color: { r: 1, g: 0.5, b: 0 } }];
    figma.currentPage.appendChild(rect);
    nodes.push(rect);
  }
  figma.currentPage.selection = nodes;
  figma.viewport.scrollAndZoomIntoView(nodes);

  figma.closePlugin();
};

const postUiMessage = (pluginMessage: UiMessageSetSelection) => {
  figma.ui.postMessage(pluginMessage, { origin: "*" });
};

const serizalizeVariable = (variable: Variable): PluginVariable => {
  return {
    id: variable.id,
    key: variable.key,
    description: variable.description,
    resolvedType: variable.resolvedType,
    scopes: variable.scopes,
    valuesByMode: variable.valuesByMode,
    variableCollectionId: variable.variableCollectionId,
    codeSyntax: variable.codeSyntax,
  };
};

const serizalizeVariableCollection = (
  collection: VariableCollection,
): PluginVariableCollection => {
  return {
    id: collection.id,
    key: collection.key,
    defaultModeId: collection.defaultModeId,
    modes: collection.modes,
    name: collection.name,
    variableIds: collection.variableIds,
  };
};

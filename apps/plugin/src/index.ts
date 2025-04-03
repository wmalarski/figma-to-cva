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
  // const withCss = await Promise.all(nodes.map((node) => node.getCSSAsync()));

  const variables = await figma.variables.getLocalVariablesAsync();
  const serizalizedVariables = variables.map(serizalizeVariable);

  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  const serizalizedCollections = collections.map(serizalizeVariableCollection);

  // const children = nodes.map(node => figma.currentPage.findAllWithCriteria({types: ["COMPONENT_SET"]}))

  // const nodesMessage = nodes.map((node, index) => ({
  //   name: node.name,
  //   boundVariables: node.boundVariables,
  //   mainComponent: node.componentPropertyReferences?.mainComponent,
  //   explicitVariableModes: node.explicitVariableModes,
  //   pageExplicitVariableModes: figma.currentPage.explicitVariableModes,
  //   inferredVariables: node.inferredVariables,
  //   resolvedVariableModes: node.resolvedVariableModes,
  //   // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  //   variantGroupProperties: (node as any).variantGroupProperties,
  //       // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  //   componentPropertyDefinitions: (node as any).componentPropertyDefinitions,
  //   css: withCss[index],
  // }));

  // nodes.map(node => node.)

  const componentSetList = figma.currentPage.findAllWithCriteria({
    types: ["COMPONENT_SET"],
  });
  const componentList = figma.currentPage.findAllWithCriteria({
    types: ["COMPONENT"],
  });
  const groupList = figma.currentPage.findAllWithCriteria({ types: ["GROUP"] });
  const instanceList = figma.currentPage.findAllWithCriteria({
    types: ["INSTANCE"],
  });
  const frames = figma.currentPage.findAllWithCriteria({ types: ["FRAME"] });

  console.log("nodes", nodes);
  console.log("componentSetList", componentSetList);
  console.log("componentList", componentList);
  console.log("instanceList", instanceList);
  console.log("groupList", groupList);
  console.log("frames", frames);
  console.log("variables", variables);
  console.log("collections", collections);
  console.log("collections", collections);

  postUiMessage({
    kind: "set-selection",
    nodes: [],
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
    name: variable.name,
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
  };
};

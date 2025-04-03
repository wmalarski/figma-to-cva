import type {
  PluginMessage,
  PluginMessageCreateShapes,
  PluginVariable,
  PluginVariableCollection,
  UiMessage,
} from "@ftc/types";

figma.on("run", async () => {
  const selectedComponentSets = getComponentSets();

  if (selectedComponentSets.length === 0) {
    figma.notify("Error: At least 1 component set node has to be selected");
    figma.closePlugin();
    return;
  }

  figma.showUI(__html__, { width: 500, height: 600 });

  await sendVariables();

  sendComponentSets(selectedComponentSets);

  await sendComponents(selectedComponentSets);
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

const getComponentSets = () => {
  const selectedNodes = figma.currentPage.selection;
  const selectedComponentSets = selectedNodes.flatMap((node) =>
    node.type === "COMPONENT_SET" ? [node] : [],
  );

  if (selectedComponentSets.length > 0) {
    return selectedComponentSets;
  }

  return figma.currentPage.findAllWithCriteria({
    types: ["COMPONENT_SET"],
  });
};

const sendVariables = async () => {
  const variables = await figma.variables.getLocalVariablesAsync();
  const serizalizedVariables = variables.map(serizalizeVariable);

  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  const serizalizedCollections = collections.map(serizalizeVariableCollection);

  postUiMessage({
    kind: "set-variables",
    collections: serizalizedCollections,
    variables: serizalizedVariables,
  });
};

const sendComponentSets = (componentSetNodes: readonly ComponentSetNode[]) => {
  const componentSets = componentSetNodes.map((node) => ({
    id: node.id,
    name: node.name,
    node: node.variantGroupProperties,
  }));

  postUiMessage({
    kind: "set-component-sets",
    componentSets,
  });
};

const sendComponents = async (
  componentSetNodes: readonly ComponentSetNode[],
) => {
  const componentSetIds = new Set(componentSetNodes.map((node) => node.id));

  const componentList = figma.currentPage.findAllWithCriteria({
    types: ["COMPONENT"],
  });

  const batchSize = 50;
  const batches: ComponentNode[][] = [[]];

  componentList.forEach((node) => {
    const lastBatch = batches[batches.length - 1];

    if (lastBatch.length < batchSize) {
      lastBatch.push(node);
    } else {
      batches.push([node]);
    }
  });

  const css = await Promise.all(
    componentList.map((node) => node.getCSSAsync()),
  );

  const components = componentList.map((node, index) => ({
    name: node.name,
    parentId: node.parent?.id,
    css: css[index],
  }));

  // console.log("nodes", nodes);
  // console.log("variables", variables);
  // console.log("collections", collections);

  console.log("componentList", componentList);

  postUiMessage({
    kind: "set-components",
    components,
    page: 0,
    total: 5,
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

const postUiMessage = (pluginMessage: UiMessage) => {
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

import type {
  PluginMessage,
  PluginMessageCreateShapes,
  UiMessageSetSelection,
} from "@ftc/types";

figma.on("run", async () => {
  const nodes = figma.currentPage.selection;

  if (nodes.length === 0) {
    figma.notify("Error: At least 1 node has to be selected");
    figma.closePlugin();
    return;
  }

  console.log("nodes", nodes);

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

  postUiMessage({
    kind: "set-selection",
    nodes: nodes.map((node, index) => ({
      boundVariables: node.boundVariables,
      mainComponent: node.componentPropertyReferences?.mainComponent,
      explicitVariableModes: node.explicitVariableModes,
      inferredVariables: node.inferredVariables,
      resolvedVariableModes: node.resolvedVariableModes,
      css: withCss[index],
      constants: figma.constants,
      variables: figma.variables,
      getLocalVariables: figma.variables.getLocalVariables(),
    })),
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

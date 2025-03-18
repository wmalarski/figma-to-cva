import type {
  PluginMessage,
  PluginMessageCreateShapes,
  UiMessageSetSelection,
} from "@ftc/types";

figma.on("run", () => {
  const nodes = figma.currentPage.selection;

  if (nodes.length === 0) {
    figma.notify("Error: At least 1 node has to be selected");
    figma.closePlugin();
    return;
  }

  console.log("nodes", nodes);

  figma.showUI(__html__);

  postUiMessage({
    kind: "set-selection",
    nodes: nodes.map((node) => node.toString()),
  });
});

figma.on("selectionchange", () => {
  const nodes = figma.currentPage.selection;

  postUiMessage({
    kind: "set-selection",
    nodes: nodes.map((node) => node.toString()),
  });
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

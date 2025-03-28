import type { Component } from "solid-js";
import { Button } from "~/ui/button";
import { createUiMessageSignal } from "~/utils/create-ui-message-signal";
import { sendPluginMessage } from "~/utils/send-plugin-message";

export const Main: Component = () => {
  const onCreate = () => {
    const count = 4;
    sendPluginMessage({ kind: "create-shapes", count });
  };

  const onCancel = () => {
    sendPluginMessage({ kind: "cancel" });
  };

  const selectionMessage = createUiMessageSignal("set-selection");

  return (
    <div>
      <Button onClick={onCreate}>Create</Button>
      <Button onClick={onCancel} variant="solid">
        Cancel
      </Button>
      <pre>{JSON.stringify(selectionMessage(), null, 2)}</pre>
    </div>
  );
};

import type { UiMessage, UiMessageKind } from "@ftc/types";
import { createEventSignal } from "@solid-primitives/event-listener";
import { createMemo } from "solid-js";

export const createUiMessageSignal = (kind: UiMessageKind) => {
  const lastEvent = createEventSignal(window, "message", { passive: true });

  return createMemo<UiMessage | undefined>((previous) => {
    const event = lastEvent();
    const data: UiMessage | undefined = event?.data.pluginMessage;
    return data?.kind === kind ? data : previous;
  });
};

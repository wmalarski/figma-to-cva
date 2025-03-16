import type { Component } from "solid-js";
import { css } from "styled-system/css";
import { Button } from "~/ui/button";

export const Main: Component = () => {
  return (
    <div>
      <Button>Hello</Button>
      <Button variant="solid">Hello</Button>
      <Button variant="outline">Hello</Button>
      <span class={css({ backgroundColor: "gray.dark.a4", p: 8 })}>Buu</span>
    </div>
  );
};

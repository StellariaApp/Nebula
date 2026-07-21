import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { Conditional } from "../Conditional.js";

afterEach(cleanup);

describe("Conditional", () => {
  it("renderiza children cuando when es true", () => {
    render(
      <Conditional when fallback={<span>no</span>}>
        <span>sí</span>
      </Conditional>,
    );
    expect(screen.getByText("sí")).toBeDefined();
    expect(screen.queryByText("no")).toBeNull();
  });

  it("renderiza fallback cuando when es false", () => {
    render(
      <Conditional when={false} fallback={<span>no</span>}>
        <span>sí</span>
      </Conditional>,
    );
    expect(screen.getByText("no")).toBeDefined();
    expect(screen.queryByText("sí")).toBeNull();
  });

  it("sin fallback no renderiza nada cuando when es false", () => {
    render(
      <Conditional when={false}>
        <span>sí</span>
      </Conditional>,
    );
    expect(screen.queryByText("sí")).toBeNull();
  });
});

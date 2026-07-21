import { cleanup, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it } from "vitest";

import { NebulaProvider } from "../../../provider/nebula-provider.js";
import { Collapse } from "../Collapse.js";

afterEach(cleanup);

function Wrap(ui: ReactNode) {
  return render(
    <NebulaProvider defaultTheme="nebula-dark" storage={null}>
      {ui}
    </NebulaProvider>,
  );
}

describe("Collapse", () => {
  it("renderiza children abierto sin aria-hidden", () => {
    Wrap(
      <Collapse in>
        <span data-testid="c">contenido</span>
      </Collapse>,
    );
    const wrapper = screen.getByTestId("c").parentElement;
    expect(wrapper?.getAttribute("aria-hidden")).toBeNull();
  });

  it("marca aria-hidden cuando está cerrado", () => {
    Wrap(
      <Collapse in={false}>
        <span data-testid="c">contenido</span>
      </Collapse>,
    );
    const wrapper = screen.getByTestId("c").parentElement;
    expect(wrapper?.getAttribute("aria-hidden")).toBe("true");
  });
});

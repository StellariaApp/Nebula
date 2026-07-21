import { cleanup, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it } from "vitest";

import { NebulaProvider } from "../../../provider/nebula-provider.js";
import { Transition } from "../Transition.js";

afterEach(cleanup);

function Wrap(ui: ReactNode) {
  return render(
    <NebulaProvider defaultTheme="nebula-dark" storage={null}>
      {ui}
    </NebulaProvider>,
  );
}

describe("Transition", () => {
  it("renderiza children cuando mounted", () => {
    Wrap(
      <Transition mounted transition="fade">
        <span data-testid="c">visible</span>
      </Transition>,
    );
    expect(screen.getByTestId("c")).toBeDefined();
  });

  it("no renderiza children cuando no mounted", () => {
    Wrap(
      <Transition mounted={false} transition="scale">
        <span data-testid="c">oculto</span>
      </Transition>,
    );
    expect(screen.queryByTestId("c")).toBeNull();
  });
});

import { cleanup, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it } from "vitest";

import { NebulaProvider } from "../../../provider/nebula-provider.js";
import { ButtonClose } from "../ButtonClose.js";

afterEach(cleanup);

function Wrap(ui: ReactNode) {
  return render(
    <NebulaProvider defaultTheme="nebula-dark" storage={null}>
      {ui}
    </NebulaProvider>,
  );
}

describe("ButtonClose", () => {
  it("tiene nombre accesible por defecto (Cerrar)", () => {
    Wrap(<ButtonClose />);
    expect(screen.getByRole("button", { name: "Cerrar" })).toBeDefined();
  });

  it("respeta un aria-label del consumidor", () => {
    Wrap(<ButtonClose aria-label="Descartar" />);
    expect(screen.getByRole("button", { name: "Descartar" })).toBeDefined();
  });
});

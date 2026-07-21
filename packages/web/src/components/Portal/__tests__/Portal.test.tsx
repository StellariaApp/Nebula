import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { Portal } from "../Portal.js";

afterEach(cleanup);

describe("Portal", () => {
  it("monta los children en document.body tras el efecto de montaje", () => {
    render(
      <div data-testid="host">
        <Portal>
          <span data-testid="ported">contenido</span>
        </Portal>
      </div>,
    );
    const ported = screen.getByTestId("ported");
    const host = screen.getByTestId("host");
    expect(ported).toBeDefined();
    expect(host.contains(ported)).toBe(false);
  });

  it("con disabled renderiza en el sitio original", () => {
    render(
      <div data-testid="host">
        <Portal disabled>
          <span data-testid="inline">contenido</span>
        </Portal>
      </div>,
    );
    expect(screen.getByTestId("host").contains(screen.getByTestId("inline"))).toBe(true);
  });
});

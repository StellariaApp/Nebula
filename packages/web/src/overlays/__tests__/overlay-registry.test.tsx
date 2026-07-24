import { act } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { cleanup, render, screen } from "../../__tests__/render.js";
import { nebulaOverlays, useOverlayState } from "../overlay-registry.js";

afterEach(() => {
  cleanup();
  nebulaOverlays.closeAll();
});

function Panel(): React.ReactElement {
  const overlay = useOverlayState("filtros");
  return (
    <>
      <button type="button" onClick={overlay.toggle}>
        alternar
      </button>
      <span data-testid="estado">{overlay.isOpen ? "abierto" : "cerrado"}</span>
    </>
  );
}

describe("registro de overlays", () => {
  it("arranca cerrado", () => {
    render(<Panel />);
    expect(screen.getByTestId("estado").textContent).toBe("cerrado");
  });

  it("se abre desde el API imperativo, sin prop-drilling", () => {
    render(<Panel />);
    act(() => {
      nebulaOverlays.open("filtros");
    });
    expect(screen.getByTestId("estado").textContent).toBe("abierto");
    expect(nebulaOverlays.isOpen("filtros")).toBe(true);
  });

  it("toggle e isOpen se mantienen sincronizados", () => {
    render(<Panel />);
    act(() => {
      nebulaOverlays.toggle("filtros");
    });
    expect(nebulaOverlays.isOpen("filtros")).toBe(true);
    act(() => {
      nebulaOverlays.toggle("filtros");
    });
    expect(screen.getByTestId("estado").textContent).toBe("cerrado");
  });

  it("no confunde ids distintos", () => {
    render(<Panel />);
    act(() => {
      nebulaOverlays.open("otro");
    });
    expect(screen.getByTestId("estado").textContent).toBe("cerrado");
    expect(nebulaOverlays.isOpen("otro")).toBe(true);
  });

  it("closeAll cierra todo", () => {
    render(<Panel />);
    act(() => {
      nebulaOverlays.open("filtros");
      nebulaOverlays.open("otro");
    });
    act(() => {
      nebulaOverlays.closeAll();
    });
    expect(nebulaOverlays.isOpen("filtros")).toBe(false);
    expect(nebulaOverlays.isOpen("otro")).toBe(false);
  });
});

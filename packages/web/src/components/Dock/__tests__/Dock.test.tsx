import { afterEach, describe, expect, it, vi } from "vitest";

import { cleanup, render, screen } from "../../../__tests__/render.js";
import { Dock } from "../Dock.js";

afterEach(cleanup);

describe("Dock (ADR-193)", () => {
  it("monta dos superficies con el mismo nombre y el contrato data-floating", () => {
    render(
      <Dock aria-label="Preferencias" withinPortal={false}>
        <span>controles</span>
      </Dock>,
    );
    const asides = screen.getAllByRole("complementary", { name: "Preferencias" });
    expect(asides).toHaveLength(2);
    for (const aside of asides) expect(aside.getAttribute("data-floating")).toBe("dock");
  });

  it("pinta los controles en fila y, plegados, tras el botón que abre el popover", () => {
    const Render = vi.fn((stacked: boolean) => <span>{stacked ? "apilados" : "en fila"}</span>);
    render(
      <Dock aria-label="Preferencias" withinPortal={false}>
        {Render}
      </Dock>,
    );
    expect(screen.getByText("en fila")).toBeDefined();
    expect(Render).toHaveBeenCalledWith(false);
    expect(screen.getByRole("button", { name: "Preferencias" })).toBeDefined();
    expect(screen.queryByText("apilados")).toBeNull();
  });

  it("con compactBelow=false no hay pliegue: una superficie y ningún botón", () => {
    render(
      <Dock aria-label="Preferencias" compactBelow={false} withinPortal={false}>
        <span>controles</span>
      </Dock>,
    );
    expect(screen.getAllByRole("complementary", { name: "Preferencias" })).toHaveLength(1);
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("triggerLabel nombra el botón plegado", () => {
    render(
      <Dock aria-label="Preferencias" triggerLabel="Abrir preferencias" withinPortal={false}>
        <span>controles</span>
      </Dock>,
    );
    expect(screen.getByRole("button", { name: "Abrir preferencias" })).toBeDefined();
  });
});

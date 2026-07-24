import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { cleanup, render, screen } from "../../../__tests__/render.js";
import { Drawer } from "../Drawer.js";

afterEach(cleanup);

describe("Drawer", () => {
  it("expone un diálogo con su título", () => {
    render(
      <Drawer opened onClose={() => undefined} title="Filtros">
        <span>contenido</span>
      </Drawer>,
    );
    expect(screen.getByRole("dialog", { name: "Filtros" })).toBeDefined();
  });

  it("marca data-drawer para el layout lateral", () => {
    render(
      <Drawer opened onClose={() => undefined} title="Filtros">
        <span>contenido</span>
      </Drawer>,
    );
    expect(screen.getByRole("dialog").getAttribute("data-drawer")).toBe("true");
  });

  it("cierra desde el botón de cierre", async () => {
    const OnClose = vi.fn();
    const user = userEvent.setup();
    render(
      <Drawer opened onClose={OnClose} title="Filtros">
        <span>contenido</span>
      </Drawer>,
    );
    await user.click(screen.getByRole("button", { name: "Cerrar" }));
    expect(OnClose).toHaveBeenCalledTimes(1);
  });
});

import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { NebulaProvider } from "../../../provider/nebula-provider.js";
import { ActionIcon } from "../ActionIcon.js";

afterEach(cleanup);

function Wrap(ui: ReactNode) {
  return render(
    <NebulaProvider defaultTheme="dark" storage={null}>
      {ui}
    </NebulaProvider>,
  );
}

const DOT = <span data-testid="icon">•</span>;

describe("ActionIcon", () => {
  it("expone su nombre accesible por aria-label (solo-icono)", () => {
    Wrap(<ActionIcon aria-label="Editar">{DOT}</ActionIcon>);
    expect(screen.getByRole("button", { name: "Editar" })).toBeDefined();
    expect(screen.getByTestId("icon").parentElement?.getAttribute("aria-hidden")).toBe("true");
  });

  it("pressed anuncia aria-pressed, conserva el nombre y cambia la receta al relleno", () => {
    const { rerender } = Wrap(
      <ActionIcon aria-label="Guardar" variant="glass" pressed={false}>
        {DOT}
      </ActionIcon>,
    );
    const off = screen.getByRole("button", { name: "Guardar", pressed: false });
    expect(off.getAttribute("data-variant")).toBe("glass");
    expect(off.getAttribute("data-toggled")).toBeNull();

    rerender(
      <NebulaProvider defaultTheme="dark" storage={null}>
        <ActionIcon aria-label="Guardar" variant="glass" pressed>
          {DOT}
        </ActionIcon>
      </NebulaProvider>,
    );
    const on = screen.getByRole("button", { name: "Guardar", pressed: true });
    expect(on.getAttribute("data-variant")).toBe("filled");
    expect(on.getAttribute("data-toggled")).toBe("true");
  });

  it("sin pressed no hay aria-pressed: un botón que sólo dispara no es un conmutador", () => {
    Wrap(<ActionIcon aria-label="Editar">{DOT}</ActionIcon>);
    expect(screen.getByRole("button", { name: "Editar" }).hasAttribute("aria-pressed")).toBe(false);
  });

  it("se activa con teclado", async () => {
    const on_press = vi.fn();
    Wrap(
      <ActionIcon aria-label="Acción" onPress={on_press}>
        {DOT}
      </ActionIcon>,
    );
    await userEvent.tab();
    await userEvent.keyboard("{Enter}");
    expect(on_press).toHaveBeenCalledTimes(1);
  });

  it("resuelve el color de la variante en vars locales (sin hex)", () => {
    Wrap(
      <ActionIcon aria-label="x" variant="filled">
        {DOT}
      </ActionIcon>,
    );
    const style = screen.getByRole("button").getAttribute("style") ?? "";
    expect(style).toContain("var(--");
    expect(style).not.toMatch(/#[0-9a-f]{6}/i);
  });

  it("loading anuncia aria-busy y bloquea la interacción", async () => {
    const on_press = vi.fn();
    Wrap(
      <ActionIcon aria-label="Save" loading onPress={on_press}>
        {DOT}
      </ActionIcon>,
    );
    const button = screen.getByRole("button", { name: "Save" });
    expect(button.getAttribute("aria-busy")).toBe("true");
    await userEvent.click(button);
    expect(on_press).not.toHaveBeenCalled();
  });
});

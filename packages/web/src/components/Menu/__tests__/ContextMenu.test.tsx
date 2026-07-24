import { fireEvent } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { cleanup, render, screen, waitFor } from "../../../__tests__/render.js";
import { ContextMenu } from "../ContextMenu.js";
import type { MenuItemData } from "../Menu.types.js";

afterEach(cleanup);

const ITEMS: MenuItemData[] = [
  { key: "copy", label: "Copiar" },
  { key: "paste", label: "Pegar" },
];

describe("ContextMenu", () => {
  it("abre con click derecho", async () => {
    render(
      <ContextMenu items={ITEMS} aria-label="Acciones">
        <div data-testid="zona">Contenido</div>
      </ContextMenu>,
    );
    expect(screen.queryByRole("menu")).toBeNull();
    fireEvent.contextMenu(screen.getByTestId("zona"));
    expect(await screen.findByRole("menu")).toBeDefined();
    expect(screen.getAllByRole("menuitem")).toHaveLength(2);
  });

  it("abre con Shift+F10 desde el teclado", async () => {
    render(
      <ContextMenu items={ITEMS} aria-label="Acciones">
        <button type="button">Fila</button>
      </ContextMenu>,
    );
    fireEvent.keyDown(screen.getByRole("button", { name: "Fila" }), {
      key: "F10",
      shiftKey: true,
    });
    expect(await screen.findByRole("menu")).toBeDefined();
  });

  it("dispara onAction y cierra", async () => {
    const OnAction = vi.fn();
    const user = userEvent.setup();
    render(
      <ContextMenu items={ITEMS} onAction={OnAction} aria-label="Acciones">
        <div data-testid="zona">Contenido</div>
      </ContextMenu>,
    );
    fireEvent.contextMenu(screen.getByTestId("zona"));
    await screen.findByRole("menu");
    await user.click(screen.getByRole("menuitem", { name: "Copiar" }));
    await waitFor(() => {
      expect(OnAction).toHaveBeenCalledWith("copy");
    });
    await waitFor(() => {
      expect(screen.queryByRole("menu")).toBeNull();
    });
  });

  it("no abre si está deshabilitado", () => {
    render(
      <ContextMenu items={ITEMS} disabled aria-label="Acciones">
        <div data-testid="zona">Contenido</div>
      </ContextMenu>,
    );
    fireEvent.contextMenu(screen.getByTestId("zona"));
    expect(screen.queryByRole("menu")).toBeNull();
  });
});

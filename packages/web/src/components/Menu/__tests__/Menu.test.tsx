import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { cleanup, render, screen, waitFor } from "../../../__tests__/render.js";
import { Button } from "../../Button/Button.js";
import { Menu } from "../Menu.js";
import type { MenuItemData } from "../Menu.types.js";

afterEach(cleanup);

const ITEMS: MenuItemData[] = [
  { key: "edit", label: "Editar" },
  { key: "duplicate", label: "Duplicar", shortcut: "⌘D" },
  { key: "archive", label: "Archivar", disabled: true },
  { key: "delete", label: "Eliminar", danger: true },
];

function Sample(props: { onAction?: (key: string) => void }): React.ReactElement {
  return (
    <Menu
      trigger={<Button>Acciones</Button>}
      items={ITEMS}
      aria-label="Acciones"
      {...(props.onAction === undefined ? {} : { onAction: props.onAction })}
    />
  );
}

describe("Menu", () => {
  it("no monta el menú mientras está cerrado", () => {
    render(<Sample />);
    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("abre con click y expone role=menu con sus items", async () => {
    const user = userEvent.setup();
    render(<Sample />);
    await user.click(screen.getByRole("button", { name: "Acciones" }));
    expect(await screen.findByRole("menu")).toBeDefined();
    expect(screen.getAllByRole("menuitem")).toHaveLength(4);
  });

  it("marca el item deshabilitado con aria-disabled", async () => {
    const user = userEvent.setup();
    render(<Sample />);
    await user.click(screen.getByRole("button", { name: "Acciones" }));
    await screen.findByRole("menu");
    const archive = screen.getByRole("menuitem", { name: /Archivar/ });
    expect(archive.getAttribute("aria-disabled")).toBe("true");
  });

  it("navega con flechas y activa con Enter", async () => {
    const OnAction = vi.fn();
    const user = userEvent.setup();
    render(<Sample onAction={OnAction} />);

    await user.tab();
    await user.keyboard("{Enter}");
    await screen.findByRole("menu");

    await user.keyboard("{ArrowDown}");
    await user.keyboard("{Enter}");

    await waitFor(() => {
      expect(OnAction).toHaveBeenCalledTimes(1);
    });
    expect(OnAction.mock.calls[0]?.[0]).toBe("duplicate");
  });

  it("salta los deshabilitados al navegar", async () => {
    const OnAction = vi.fn();
    const user = userEvent.setup();
    render(<Sample onAction={OnAction} />);

    await user.click(screen.getByRole("button", { name: "Acciones" }));
    await screen.findByRole("menu");

    await user.keyboard("{End}");
    await user.keyboard("{Enter}");

    await waitFor(() => {
      expect(OnAction).toHaveBeenCalledWith("delete");
    });
  });

  it("cierra con Escape", async () => {
    const user = userEvent.setup();
    render(<Sample />);
    await user.click(screen.getByRole("button", { name: "Acciones" }));
    await screen.findByRole("menu");
    await user.keyboard("{Escape}");
    await waitFor(() => {
      expect(screen.queryByRole("menu")).toBeNull();
    });
  });
});

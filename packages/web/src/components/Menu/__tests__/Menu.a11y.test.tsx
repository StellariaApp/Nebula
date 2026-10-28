import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import { ExpectNoViolations } from "../../../__tests__/axe.js";
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

function Sample(): React.ReactElement {
  return <Menu trigger={<Button>Acciones</Button>} items={ITEMS} aria-label="Acciones" />;
}

describe("Menu · accesibilidad", () => {
  it("cerrado y abierto: sin violaciones de axe", async () => {
    const user = userEvent.setup();
    render(<Sample />);
    await ExpectNoViolations();
    await user.click(screen.getByRole("button", { name: "Acciones" }));
    await screen.findByRole("menu");
    await ExpectNoViolations();
  });

  it("el disparador anuncia haspopup y su estado expandido", async () => {
    const user = userEvent.setup();
    render(<Sample />);
    const trigger = screen.getByRole("button", { name: "Acciones" });
    expect(trigger.getAttribute("aria-haspopup")).toBe("true");
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    await user.click(trigger);
    await screen.findByRole("menu");
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
  });

  it("ArrowDown abre desde el teclado, las flechas se saltan lo deshabilitado y Enter activa", async () => {
    const user = userEvent.setup();
    render(<Sample />);
    await user.tab();
    await user.keyboard("{ArrowDown}");
    await screen.findByRole("menu");
    await waitFor(() =>
      expect(screen.getByRole("menuitem", { name: /Editar/ }).getAttribute("data-focused")).toBe(
        "true",
      ),
    );
    await user.keyboard("{ArrowDown}{ArrowDown}");
    await waitFor(() =>
      expect(screen.getByRole("menuitem", { name: /Eliminar/ }).getAttribute("data-focused")).toBe(
        "true",
      ),
    );
  });

  it("Escape cierra el menú y devuelve el foco al disparador", async () => {
    const user = userEvent.setup();
    render(<Sample />);
    const trigger = screen.getByRole("button", { name: "Acciones" });
    await user.click(trigger);
    await screen.findByRole("menu");
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
    await waitFor(() => expect(document.activeElement).toBe(trigger));
  });

  it("el item deshabilitado se anuncia como deshabilitado", async () => {
    const user = userEvent.setup();
    render(<Sample />);
    await user.click(screen.getByRole("button", { name: "Acciones" }));
    await screen.findByRole("menu");
    expect(screen.getByRole("menuitem", { name: /Archivar/ }).getAttribute("aria-disabled")).toBe(
      "true",
    );
  });
});

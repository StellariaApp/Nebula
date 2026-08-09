import { PermissionProvider } from "@stellaria/nebula-hooks";
import { userEvent } from "@testing-library/user-event";
import type { ReactElement, ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { cleanup, render, screen } from "../../../__tests__/render.js";
import { ActionIcon } from "../../ActionIcon/ActionIcon.js";
import { Button } from "../../Button/Button.js";
import { Menu } from "../../Menu/Menu.js";
import { NavLink } from "../../NavLink/NavLink.js";
import { QuickAction } from "../../QuickAction/QuickAction.js";
import { Tabs } from "../../Tabs/Tabs.js";

afterEach(cleanup);

function Granting(granted: readonly string[]) {
  return function Wrapper(props: { children: ReactNode }): ReactElement {
    return (
      <PermissionProvider resolver={(key) => granted.includes(key)}>
        {props.children}
      </PermissionProvider>
    );
  };
}

describe("permission en controles", () => {
  it("Button sin permiso se retira del DOM por defecto", () => {
    const Wrapper = Granting([]);
    render(
      <Wrapper>
        <Button permission="cobros.anular">Anular</Button>
      </Wrapper>,
    );
    expect(screen.queryByRole("button", { name: "Anular" })).toBeNull();
  });

  it("Button con permiso se pinta con normalidad", () => {
    const Wrapper = Granting(["cobros.anular"]);
    render(
      <Wrapper>
        <Button permission="cobros.anular">Anular</Button>
      </Wrapper>,
    );
    expect(screen.getByRole("button", { name: "Anular" })).toBeDefined();
  });

  it("Button en permissionMode disable queda visible y no dispara", async () => {
    const on_press = vi.fn();
    const Wrapper = Granting([]);
    render(
      <Wrapper>
        <Button permission="cobros.anular" permissionMode="disable" onPress={on_press}>
          Anular
        </Button>
      </Wrapper>,
    );
    const action = screen.getByRole("button", { name: "Anular" });
    expect(action.getAttribute("data-disabled")).toBe("true");
    await userEvent.click(action);
    expect(on_press).not.toHaveBeenCalled();
  });

  it("sin provider la ausencia de permiso deniega, no concede", () => {
    render(<Button permission="cobros.anular">Anular</Button>);
    expect(screen.queryByRole("button", { name: "Anular" })).toBeNull();
  });

  it("un Button sin prop permission no pasa por el gate", () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole("button", { name: "Save" })).toBeDefined();
  });

  it("ActionIcon aplica el mismo contrato", () => {
    const Wrapper = Granting(["a"]);
    const { unmount } = render(
      <Wrapper>
        <ActionIcon aria-label="Permitida" permission="a">
          <span>x</span>
        </ActionIcon>
        <ActionIcon aria-label="Denegada" permission="b">
          <span>x</span>
        </ActionIcon>
      </Wrapper>,
    );
    expect(screen.getByRole("button", { name: "Permitida" })).toBeDefined();
    expect(screen.queryByRole("button", { name: "Denegada" })).toBeNull();
    unmount();
  });

  it("QuickAction aplica el mismo contrato", () => {
    const Wrapper = Granting([]);
    render(
      <Wrapper>
        <QuickAction label="Anular en lote" permission="cobros.anular" />
      </Wrapper>,
    );
    expect(screen.queryByRole("button", { name: "Anular en lote" })).toBeNull();
  });

  it("NavLink sin permiso desaparece de la navegación", () => {
    const Wrapper = Granting(["nav.inicio"]);
    render(
      <Wrapper>
        <NavLink label="Inicio" href="/" permission="nav.inicio" />
        <NavLink label="Ajustes" href="/ajustes" permission="nav.ajustes" />
      </Wrapper>,
    );
    expect(screen.getByRole("link", { name: "Inicio" })).toBeDefined();
    expect(screen.queryByRole("link", { name: "Ajustes" })).toBeNull();
  });

  it("NavLink en disable pierde el href", () => {
    const Wrapper = Granting([]);
    render(
      <Wrapper>
        <NavLink
          label="Ajustes"
          href="/ajustes"
          permission="nav.ajustes"
          permissionMode="disable"
        />
      </Wrapper>,
    );
    const link = screen.getByText("Ajustes").closest("a");
    expect(link?.getAttribute("href")).toBeNull();
    expect(link?.getAttribute("aria-disabled")).toBe("true");
  });
});

describe("permission en colecciones", () => {
  it("Menu retira del árbol los items sin permiso", async () => {
    const Wrapper = Granting(["cobros.ver"]);
    render(
      <Wrapper>
        <Menu
          trigger={<Button>Acciones</Button>}
          aria-label="Acciones"
          items={[
            { key: "ver", label: "Ver detalle", permission: "cobros.ver" },
            { key: "anular", label: "Anular", permission: "cobros.anular" },
            { key: "copiar", label: "Copiar folio" },
          ]}
        />
      </Wrapper>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Acciones" }));
    expect(await screen.findByRole("menu")).toBeDefined();
    expect(screen.getByRole("menuitem", { name: "Ver detalle" })).toBeDefined();
    expect(screen.getByRole("menuitem", { name: "Copiar folio" })).toBeDefined();
    expect(screen.queryByRole("menuitem", { name: "Anular" })).toBeNull();
  });

  it("un item de Menu en disable se queda como deshabilitado", async () => {
    const Wrapper = Granting([]);
    render(
      <Wrapper>
        <Menu
          trigger={<Button>Acciones</Button>}
          aria-label="Acciones"
          items={[
            {
              key: "anular",
              label: "Anular",
              permission: "cobros.anular",
              permissionMode: "disable",
            },
          ]}
        />
      </Wrapper>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Acciones" }));
    expect(await screen.findByRole("menu")).toBeDefined();
    const item = screen.getByRole("menuitem", { name: "Anular" });
    expect(item.getAttribute("aria-disabled")).toBe("true");
  });

  it("Tabs retira la pestaña sin permiso y su contenido", () => {
    const Wrapper = Granting(["tab.general"]);
    render(
      <Wrapper>
        <Tabs
          aria-label="Secciones"
          data={[
            {
              value: "general",
              label: "General",
              content: "contenido general",
              permission: "tab.general",
            },
            {
              value: "auditoria",
              label: "Auditoría",
              content: "contenido auditoría",
              permission: "tab.auditoria",
            },
          ]}
        />
      </Wrapper>,
    );
    expect(screen.getByRole("tab", { name: "General" })).toBeDefined();
    expect(screen.queryByRole("tab", { name: "Auditoría" })).toBeNull();
    expect(screen.queryByText("contenido auditoría")).toBeNull();
  });

  it("la primera pestaña por defecto es la primera permitida", () => {
    const Wrapper = Granting(["tab.auditoria"]);
    render(
      <Wrapper>
        <Tabs
          aria-label="Secciones"
          data={[
            {
              value: "general",
              label: "General",
              content: "contenido general",
              permission: "tab.general",
            },
            {
              value: "auditoria",
              label: "Auditoría",
              content: "contenido auditoría",
              permission: "tab.auditoria",
            },
          ]}
        />
      </Wrapper>,
    );
    expect(screen.getByRole("tab", { name: "Auditoría" }).getAttribute("aria-selected")).toBe(
      "true",
    );
  });
});

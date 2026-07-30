import { PermissionProvider } from "@stellaria/nebula-hooks";
import type { ReactElement, ReactNode } from "react";
import { afterEach, describe, expect, it } from "vitest";

import { cleanup, render, screen } from "../../../__tests__/render.js";
import { PermissionGate } from "../PermissionGate.js";

afterEach(cleanup);

type AppPermission = "orders.read" | "orders.void";

function Granting(granted: readonly AppPermission[]) {
  return function Wrapper(props: { children: ReactNode }): ReactElement {
    return (
      <PermissionProvider<AppPermission> resolver={(key) => granted.includes(key)}>
        {props.children}
      </PermissionProvider>
    );
  };
}

describe("PermissionGate", () => {
  it("sin provider oculta en vez de mostrar", () => {
    render(
      <PermissionGate permission="orders.void">
        <button type="button">Anular</button>
      </PermissionGate>,
    );
    expect(screen.queryByRole("button", { name: "Anular" })).toBeNull();
  });

  it("con permiso concedido pinta los hijos sin envoltorio", () => {
    const Wrapper = Granting(["orders.read"]);
    render(
      <Wrapper>
        <PermissionGate<AppPermission> permission="orders.read">
          <button type="button">Ver</button>
        </PermissionGate>
      </Wrapper>,
    );
    const action = screen.getByRole("button", { name: "Ver" });
    expect(action.parentElement?.getAttribute("data-permission-denied")).toBeNull();
  });

  it("denegado en mode hide pinta el fallback", () => {
    const Wrapper = Granting(["orders.read"]);
    render(
      <Wrapper>
        <PermissionGate<AppPermission> permission="orders.void" fallback={<p>Sin acceso</p>}>
          <button type="button">Anular</button>
        </PermissionGate>
      </Wrapper>,
    );
    expect(screen.getByText("Sin acceso")).toBeDefined();
    expect(screen.queryByRole("button", { name: "Anular" })).toBeNull();
  });

  it("denegado en mode disable deja el control visible dentro de un contenedor inerte", () => {
    const Wrapper = Granting([]);
    render(
      <Wrapper>
        <PermissionGate<AppPermission> permission="orders.void" mode="disable">
          <button type="button">Anular</button>
        </PermissionGate>
      </Wrapper>,
    );
    const container = document.querySelector("[data-permission-denied='true']");
    expect(container).not.toBeNull();
    expect(container?.hasAttribute("inert")).toBe(true);
    expect(container?.textContent).toContain("Anular");
  });

  it("deniedLabel se anuncia fuera del contenedor inerte", () => {
    const Wrapper = Granting([]);
    render(
      <Wrapper>
        <PermissionGate<AppPermission>
          permission="orders.void"
          mode="disable"
          deniedLabel="Anular: sin permiso"
        >
          <button type="button">Anular</button>
        </PermissionGate>
      </Wrapper>,
    );
    const label = screen.getByText("Anular: sin permiso");
    expect(label.closest("[data-permission-denied='true']")).toBeNull();
  });

  it("el resolver decide por key, no por presencia de provider", () => {
    const Wrapper = Granting(["orders.read"]);
    render(
      <Wrapper>
        <PermissionGate<AppPermission> permission="orders.read">
          <span>visible</span>
        </PermissionGate>
        <PermissionGate<AppPermission> permission="orders.void">
          <span>oculto</span>
        </PermissionGate>
      </Wrapper>,
    );
    expect(screen.getByText("visible")).toBeDefined();
    expect(screen.queryByText("oculto")).toBeNull();
  });
});

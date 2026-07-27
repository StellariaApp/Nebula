import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { cleanup, render, screen } from "../../../__tests__/render.js";
import { NavLink } from "../NavLink.js";

afterEach(cleanup);

describe("NavLink", () => {
  it("renderiza como enlace cuando recibe href", () => {
    render(<NavLink label="Inicio" href="/inicio" />);
    const link = screen.getByRole("link", { name: "Inicio" });
    expect(link.getAttribute("href")).toBe("/inicio");
  });

  it("marca aria-current='page' cuando está activo", () => {
    render(<NavLink label="Inicio" href="/inicio" active />);
    expect(screen.getByRole("link", { name: "Inicio" }).getAttribute("aria-current")).toBe(
      "page",
    );
  });

  it("renderiza como botón y ejecuta onPress al hacer click", async () => {
    const OnPress = vi.fn();
    const user = userEvent.setup();
    render(<NavLink label="Cerrar sesión" onPress={OnPress} />);

    await user.click(screen.getByRole("button", { name: "Cerrar sesión" }));
    expect(OnPress).toHaveBeenCalledTimes(1);
  });

  it("deshabilitado no dispara onPress", async () => {
    const OnPress = vi.fn();
    const user = userEvent.setup();
    render(<NavLink label="Cerrar sesión" onPress={OnPress} disabled />);

    await user.click(screen.getByRole("button", { name: "Cerrar sesión" }));
    expect(OnPress).not.toHaveBeenCalled();
  });

  it("con hijos expone el patrón de disclosure y despliega el panel", async () => {
    const user = userEvent.setup();
    render(
      <NavLink label="Configuración">
        <NavLink label="Perfil" href="/perfil" />
      </NavLink>,
    );

    const trigger = screen.getByRole("button", { name: "Configuración" });
    expect(trigger.getAttribute("aria-expanded")).toBe("false");

    await user.click(trigger);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByRole("link", { name: "Perfil" })).not.toBeNull();
  });

  it("respeta el modo controlado de opened", () => {
    render(
      <NavLink label="Configuración" opened onOpenChange={() => undefined}>
        <NavLink label="Perfil" href="/perfil" />
      </NavLink>,
    );
    expect(screen.getByRole("button", { name: "Configuración" }).getAttribute("aria-expanded")).toBe(
      "true",
    );
  });
});

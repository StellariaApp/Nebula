import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { cleanup, render, screen } from "../../../__tests__/render.js";
import { NavLink } from "../../NavLink/NavLink.js";
import { Pagination } from "../Pagination.js";
import { PaginationRange } from "../pagination-range.js";

afterEach(cleanup);

describe("PaginationRange", () => {
  it("sin recortar muestra todas las páginas", () => {
    expect(PaginationRange(5, 1, 1, 1)).toEqual([1, 2, 3, 4, 5]);
  });

  it("recorta por el final cuando la página está al principio", () => {
    expect(PaginationRange(20, 2, 1, 1)).toEqual([1, 2, 3, 4, 5, "dots-end", 20]);
  });

  it("recorta por el principio cuando la página está al final", () => {
    expect(PaginationRange(20, 19, 1, 1)).toEqual([1, "dots-start", 16, 17, 18, 19, 20]);
  });

  it("recorta por ambos lados en el centro", () => {
    expect(PaginationRange(20, 10, 1, 1)).toEqual([1, "dots-start", 9, 10, 11, "dots-end", 20]);
  });

  it("total 0 no produce items", () => {
    expect(PaginationRange(0, 1, 1, 1)).toEqual([]);
  });
});

describe("Pagination", () => {
  it("es un nav con nombre accesible", () => {
    render(<Pagination total={5} />);
    expect(screen.getByRole("navigation", { name: "Pagination" })).toBeDefined();
  });

  it("marca la página activa con aria-current", () => {
    render(<Pagination total={5} defaultPage={3} />);
    expect(screen.getByRole("button", { name: "Page 3" }).getAttribute("aria-current")).toBe(
      "page",
    );
  });

  it("cambia de página al pulsar", async () => {
    const OnChange = vi.fn();
    const user = userEvent.setup();
    render(<Pagination total={5} onChange={OnChange} />);
    await user.click(screen.getByRole("button", { name: "Page 4" }));
    expect(OnChange).toHaveBeenCalledWith(4);
  });

  it("los controles avanzan y retroceden", async () => {
    const OnChange = vi.fn();
    const user = userEvent.setup();
    render(<Pagination total={5} defaultPage={2} onChange={OnChange} />);

    await user.click(screen.getByRole("button", { name: "Next page" }));
    expect(OnChange).toHaveBeenLastCalledWith(3);
  });

  it("deshabilita el anterior en la primera página", () => {
    render(<Pagination total={5} defaultPage={1} />);
    expect(
      screen.getByRole<HTMLButtonElement>("button", { name: "Previous page" }).disabled,
    ).toBe(true);
  });

  it("withEdges añade primera y última", () => {
    render(<Pagination total={20} defaultPage={10} withEdges />);
    expect(screen.getByRole("button", { name: "First page" })).toBeDefined();
    expect(screen.getByRole("button", { name: "Last page" })).toBeDefined();
  });

  it("disabled bloquea todos los botones", () => {
    render(<Pagination total={5} disabled />);
    const buttons = screen.getAllByRole<HTMLButtonElement>("button");
    expect(buttons.every((button) => button.disabled)).toBe(true);
  });

  it("respeta el modo controlado", () => {
    render(<Pagination total={5} page={2} onChange={() => undefined} />);
    expect(screen.getByRole("button", { name: "Page 2" }).getAttribute("aria-current")).toBe(
      "page",
    );
  });
});

describe("NavLink", () => {
  it("con href es un enlace", () => {
    render(<NavLink label="Inicio" href="/" />);
    expect(screen.getByRole("link", { name: "Inicio" }).getAttribute("href")).toBe("/");
  });

  it("activo marca aria-current", () => {
    render(<NavLink label="Inicio" href="/" active />);
    expect(screen.getByRole("link", { name: "Inicio" }).getAttribute("aria-current")).toBe("page");
  });

  it("sin href es un botón que dispara onPress", async () => {
    const OnPress = vi.fn();
    const user = userEvent.setup();
    render(<NavLink label="Ajustes" onPress={OnPress} />);
    await user.click(screen.getByRole("button", { name: "Ajustes" }));
    expect(OnPress).toHaveBeenCalledTimes(1);
  });

  it("con hijos se comporta como disclosure", async () => {
    const user = userEvent.setup();
    render(
      <NavLink label="Reportes">
        <NavLink label="Ventas" href="/ventas" />
      </NavLink>,
    );
    const trigger = screen.getByRole("button", { name: "Reportes" });
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(trigger.getAttribute("aria-controls")).not.toBeNull();

    await user.click(trigger);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
  });

  it("deshabilitado no dispara onPress", async () => {
    const OnPress = vi.fn();
    const user = userEvent.setup();
    render(<NavLink label="Ajustes" onPress={OnPress} disabled />);
    await user.click(screen.getByRole("button", { name: "Ajustes" }));
    expect(OnPress).not.toHaveBeenCalled();
  });
});

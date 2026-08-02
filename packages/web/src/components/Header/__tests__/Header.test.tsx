import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { cleanup, render, screen } from "../../../__tests__/render.js";
import { Header } from "../Header.js";
import { HEADER_LABELS } from "../labels.js";

afterEach(cleanup);

describe("Header", () => {
  it("rinde el título como h1 por defecto", () => {
    render(<Header title="Expediente 40-118" />);
    const heading = screen.getByRole("heading", { name: "Expediente 40-118" });
    expect(heading.tagName).toBe("H1");
  });

  it("respeta el order que se le pase", () => {
    render(<Header title="Cartera" order={3} />);
    expect(screen.getByRole("heading", { name: "Cartera", level: 3 })).toBeDefined();
  });

  it("no emite un landmark banner por defecto", () => {
    const { container } = render(<Header title="Cartera" />);
    expect(container.querySelector("header")).toBeNull();
    expect(screen.queryByRole("banner")).toBeNull();
  });

  it("se eleva a landmark con component y queda etiquetado por su título", () => {
    render(<Header component="header" title="Cartera" />);
    const banner = screen.getByRole("banner");
    expect(banner.tagName).toBe("HEADER");
    expect(banner.getAttribute("aria-labelledby")).toBe(
      screen.getByRole("heading", { name: "Cartera" }).id,
    );
  });

  it("usa aria-label cuando se eleva sin título", () => {
    render(<Header component="header" aria-label="Cabecera de la cartera" />);
    expect(screen.getByRole("banner", { name: "Cabecera de la cartera" })).toBeDefined();
  });

  it("no ensucia el DOM con aria-labelledby cuando no es landmark", () => {
    const { container } = render(<Header title="Cartera" />);
    expect(container.firstElementChild?.getAttribute("aria-labelledby")).toBeNull();
  });

  it("withBack rinde un botón con nombre accesible y dispara onBack", async () => {
    const user = userEvent.setup();
    const on_back = vi.fn();
    render(<Header title="Cartera" withBack onBack={on_back} />);

    await user.click(screen.getByRole("button", { name: HEADER_LABELS.back }));
    expect(on_back).toHaveBeenCalledTimes(1);
  });

  it("el botón de vuelta se activa por teclado", async () => {
    const user = userEvent.setup();
    const on_back = vi.fn();
    render(<Header title="Cartera" withBack onBack={on_back} />);

    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole("button", { name: HEADER_LABELS.back }));
    await user.keyboard("{Enter}");
    expect(on_back).toHaveBeenCalledTimes(1);
  });

  it("labels sustituye el nombre accesible del botón de vuelta", () => {
    render(<Header title="Cartera" withBack labels={{ back: "Regresar" }} />);
    expect(screen.getByRole("button", { name: "Regresar" })).toBeDefined();
    expect(screen.queryByRole("button", { name: HEADER_LABELS.back })).toBeNull();
  });

  it("no rinde botón de vuelta sin withBack", () => {
    render(<Header title="Cartera" />);
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("rinde subtítulo, secciones laterales y children", () => {
    render(
      <Header
        title="Cartera"
        subtitle="118 expedientes activos"
        leftSection={<span>izquierda</span>}
        rightSection={<button type="button">Nuevo</button>}
      >
        <span>pie</span>
      </Header>,
    );

    expect(screen.getByText("118 expedientes activos")).toBeDefined();
    expect(screen.getByText("izquierda")).toBeDefined();
    expect(screen.getByRole("button", { name: "Nuevo" })).toBeDefined();
    expect(screen.getByText("pie")).toBeDefined();
  });

  it("aplica style props y className del consumidor a la misma raíz", () => {
    const { container } = render(<Header title="Cartera" mt="lg" className="propia" />);
    const root = container.querySelector(".propia");

    expect(root).not.toBeNull();
    expect(root?.contains(screen.getByRole("heading", { name: "Cartera" }))).toBe(true);
    expect(root?.className.split(" ").length).toBeGreaterThan(2);
  });

  it("no hornea tokens en estilo inline", () => {
    const { container } = render(<Header title="Cartera" subtitle="sub" withBack />);
    expect(container.innerHTML).not.toContain("#");
  });

  it("no tiene posición propia: la pastilla flotante es de Nav", () => {
    const { container } = render(<Header title="Cartera" />);
    expect(container.querySelector("[data-floating]")).toBeNull();
    expect(container.querySelector("[data-scrolled]")).toBeNull();
  });
});

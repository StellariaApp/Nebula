import { afterEach, describe, expect, it } from "vitest";

import { cleanup, render, screen } from "../../../__tests__/render.js";
import type { BadgeVariant } from "../Badge.types.js";
import { Badge } from "../Badge.js";

afterEach(cleanup);

const variants: BadgeVariant[] = ["light", "filled", "outline", "ghost", "gradient"];

describe("Badge", () => {
  it("renderiza su contenido", () => {
    render(<Badge>Activo</Badge>);
    expect(screen.getByText("Activo")).toBeDefined();
  });

  it("publica la variante como data-attribute en las cuatro", () => {
    for (const variant of variants) {
      const { container, unmount } = render(<Badge variant={variant}>Estado</Badge>);
      expect(container.querySelector("[data-variant]")?.getAttribute("data-variant")).toBe(variant);
      unmount();
    }
  });

  it("el punto decorativo no añade texto y es ortogonal a la variante", () => {
    render(<Badge dot>Pendiente</Badge>);
    expect(screen.getByText("Pendiente").textContent).toBe("Pendiente");
    const dot = screen.getByText("Pendiente").querySelector("[aria-hidden='true']");
    expect(dot).not.toBeNull();
  });

  it("leftSection es decorativa y rightSection sí se anuncia", () => {
    render(
      <Badge leftSection={<span>icono</span>} rightSection={<span>3</span>}>
        Mensajes
      </Badge>,
    );
    const badge = screen.getByText(/Mensajes/);
    const left = badge.querySelector("[aria-hidden='true']");
    expect(left?.textContent).toBe("icono");
    expect(screen.getByText("3").getAttribute("aria-hidden")).toBeNull();
  });

  it("resuelve el color por var del tema, nunca por hex horneado", () => {
    const { container } = render(<Badge color="success">Pagado</Badge>);
    const style = container.querySelector("[data-variant]")?.getAttribute("style") ?? "";
    expect(style).toContain("var(");
    expect(style).not.toMatch(/#[0-9a-f]{6}/i);
  });

  it("acepta los cinco tamaños sin perder el contenido", () => {
    for (const size of ["xs", "sm", "md", "lg", "xl"] as const) {
      const { unmount } = render(<Badge size={size}>Nivel</Badge>);
      expect(screen.getByText("Nivel")).toBeDefined();
      unmount();
    }
  });
});

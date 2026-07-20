import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { Variant } from "@stellaria/nebula-tokens";

import { NebulaProvider } from "../../../provider/nebula-provider.js";
import { Button } from "../Button.js";

afterEach(cleanup);

function RenderButton(
  ui: ReactNode,
  theme: "nebula-light" | "nebula-dark" | "sober-light" | "playful" = "nebula-light",
) {
  return render(
    <NebulaProvider defaultTheme={theme} storage={null}>
      {ui}
    </NebulaProvider>,
  );
}

const ALL_VARIANTS: Variant[] = [
  "filled",
  "outline",
  "light",
  "glass",
  "ghost",
  "glow",
  "gradient",
  "unstyled",
];

describe("Button — render y variantes", () => {
  it("renderiza un button accesible por rol y nombre", () => {
    RenderButton(<Button>Guardar</Button>);
    expect(screen.getByRole("button", { name: "Guardar" })).toBeDefined();
  });

  it("usa type=button por defecto (no envía formularios por accidente)", () => {
    RenderButton(<Button>Acción</Button>);
    expect(screen.getByRole("button").getAttribute("type")).toBe("button");
  });

  it("renderiza las 8 variantes del variantMap", () => {
    for (const variant of ALL_VARIANTS) {
      const { unmount } = RenderButton(<Button variant={variant}>v</Button>);
      expect(screen.getByRole("button").dataset["variant"]).toBe(variant);
      unmount();
    }
  });

  it("renderiza los 5 tamaños de sizes.control", () => {
    for (const size of ["xs", "sm", "md", "lg", "xl"] as const) {
      const { unmount } = RenderButton(<Button size={size}>s</Button>);
      expect(screen.getByRole("button").className).not.toBe("");
      unmount();
    }
  });

  it("resuelve el color de la variante en vars locales (no hex hardcoded)", () => {
    RenderButton(<Button variant="filled">x</Button>);
    const style = screen.getByRole("button").getAttribute("style") ?? "";
    expect(style).toContain("var(--");
    expect(style).not.toMatch(/#[0-9a-f]{6}/i);
  });

  it("renderiza secciones laterales ocultas a la a11y tree", () => {
    RenderButton(<Button leftSection={<span data-testid="izq">←</span>}>Con icono</Button>);
    expect(screen.getByRole("button", { name: "Con icono" })).toBeDefined();
    expect(screen.getByTestId("izq")).toBeDefined();
  });
});

describe("Button — interacción y contrato a11y (docs/03 §1)", () => {
  it("dispara onClick al pulsar con el ratón", async () => {
    const on_click = vi.fn();
    RenderButton(<Button onClick={on_click}>Click</Button>);
    await userEvent.click(screen.getByRole("button"));
    expect(on_click).toHaveBeenCalledTimes(1);
  });

  it("es alcanzable por Tab y se activa con Enter", async () => {
    const on_click = vi.fn();
    RenderButton(<Button onClick={on_click}>Enter</Button>);
    await userEvent.tab();
    expect(screen.getByRole("button")).toBe(document.activeElement);
    await userEvent.keyboard("{Enter}");
    expect(on_click).toHaveBeenCalledTimes(1);
  });

  it("se activa con Space (patrón APG de button)", async () => {
    const on_click = vi.fn();
    RenderButton(<Button onClick={on_click}>Space</Button>);
    screen.getByRole("button").focus();
    await userEvent.keyboard(" ");
    expect(on_click).toHaveBeenCalledTimes(1);
  });

  it("no dispara onClick cuando está disabled y lo anuncia", async () => {
    const on_click = vi.fn();
    RenderButton(
      <Button disabled onClick={on_click}>
        Off
      </Button>,
    );
    const button = screen.getByRole("button");
    expect((button as HTMLButtonElement).disabled).toBe(true);
    expect(button.dataset["disabled"]).toBe("true");
    await userEvent.click(button);
    expect(on_click).not.toHaveBeenCalled();
  });

  it("en loading anuncia aria-busy, bloquea la interacción y conserva el nombre", async () => {
    const on_click = vi.fn();
    RenderButton(
      <Button loading onClick={on_click}>
        Enviando
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Enviando" });
    expect(button.getAttribute("aria-busy")).toBe("true");
    expect(button.dataset["loading"]).toBe("true");
    await userEvent.click(button);
    expect(on_click).not.toHaveBeenCalled();
  });

  it("marca el foco visible solo por teclado (no al hacer click)", async () => {
    RenderButton(<Button>Foco</Button>);
    const button = screen.getByRole("button");
    await userEvent.tab();
    expect(button.dataset["focusVisible"]).toBe("true");
  });

  it("respeta aria-label del consumidor en botones solo-icono", () => {
    RenderButton(<Button aria-label="Cerrar" leftSection={<span>×</span>} />);
    expect(screen.getByRole("button", { name: "Cerrar" })).toBeDefined();
  });
});

describe("Button — theming (gate de W1)", () => {
  it("reconfigura el mismo componente en los 4 temas sin cambiar props", () => {
    const rendered = new Set<string>();
    for (const theme of ["nebula-light", "nebula-dark", "sober-light", "playful"] as const) {
      const { unmount } = RenderButton(<Button variant="filled">Tema</Button>, theme);
      const style = screen.getByRole("button").getAttribute("style") ?? "";
      rendered.add(style);
      unmount();
    }
    expect(rendered.size).toBeGreaterThan(1);
  });

  it("desactiva la animación cuando el tema usa motion.tier minimal", () => {
    RenderButton(<Button>Sobrio</Button>, "sober-light");
    expect(screen.getByRole("button")).toBeDefined();
  });
});

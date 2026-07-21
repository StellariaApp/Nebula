import { cleanup, render, screen } from "@testing-library/react";
import type { ReactElement } from "react";
import { afterEach, describe, expect, it } from "vitest";

import { Icon } from "./Icon.js";
import { ClearIcons, RegisterIcons } from "./registry.js";
import type { IconComponentProps } from "./types.js";

function Square(props: IconComponentProps): ReactElement {
  return (
    <svg data-testid="svg" {...props}>
      <rect />
    </svg>
  );
}

afterEach(() => {
  cleanup();
  ClearIcons();
});

describe("Icon", () => {
  it("renderiza un icono registrado", () => {
    RegisterIcons({ square: Square });
    render(<Icon name="square" />);
    expect(screen.getByTestId("svg")).toBeDefined();
  });

  it("no renderiza nada si el nombre no está registrado", () => {
    const { container } = render(<Icon name="missing" />);
    expect(container.firstChild).toBeNull();
  });

  it("es decorativo por defecto (aria-hidden + focusable false)", () => {
    RegisterIcons({ square: Square });
    render(<Icon name="square" />);
    const svg = screen.getByTestId("svg");
    expect(svg.getAttribute("aria-hidden")).toBe("true");
    expect(svg.getAttribute("focusable")).toBe("false");
  });

  it("con label pasa a role img + aria-label", () => {
    RegisterIcons({ square: Square });
    render(<Icon name="square" label="cuadro" />);
    expect(screen.getByRole("img", { name: "cuadro" })).toBeDefined();
  });

  it("aplica size a width y height", () => {
    RegisterIcons({ square: Square });
    render(<Icon name="square" size={32} />);
    const svg = screen.getByTestId("svg");
    expect(svg.getAttribute("width")).toBe("32");
    expect(svg.getAttribute("height")).toBe("32");
  });
});

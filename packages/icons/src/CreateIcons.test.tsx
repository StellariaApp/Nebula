import { cleanup, render, screen } from "@testing-library/react";
import type { ReactElement } from "react";
import { afterEach, describe, expect, it } from "vitest";

import { CreateIcons } from "./CreateIcons.js";
import { AllIconsPack, CommonPack } from "./packs/index.js";
import type { IconComponentProps } from "./types.js";

function Square(props: IconComponentProps): ReactElement {
  return (
    <svg data-testid="svg" {...props}>
      <rect />
    </svg>
  );
}

function Circle(props: IconComponentProps): ReactElement {
  return (
    <svg data-testid="circle" {...props}>
      <circle />
    </svg>
  );
}

afterEach(cleanup);

describe("CreateIcons", () => {
  it("renderiza un icono del set por nombre", () => {
    const { Icon } = CreateIcons({ square: Square });
    render(<Icon name="square" />);
    expect(screen.getByTestId("svg")).toBeDefined();
  });

  it("expone names y has", () => {
    const set = CreateIcons({ square: Square, circle: Circle });
    expect([...set.names].sort()).toEqual(["circle", "square"]);
    expect(set.has("square")).toBe(true);
    expect(set.has("nope")).toBe(false);
  });

  it("aplica a11y (decorativo por defecto, role img con label)", () => {
    const { Icon } = CreateIcons({ square: Square });
    const { rerender } = render(<Icon name="square" />);
    expect(screen.getByTestId("svg").getAttribute("aria-hidden")).toBe("true");
    rerender(<Icon name="square" label="cuadro" />);
    expect(screen.getByRole("img", { name: "cuadro" })).toBeDefined();
  });

  it("compone packs por spread", () => {
    const { Icon, has } = CreateIcons({ ...CommonPack, square: Square });
    expect(has("home")).toBe(true);
    expect(has("square")).toBe(true);
    render(<Icon name="square" />);
    expect(screen.getByTestId("svg")).toBeDefined();
  });
});

describe("packs", () => {
  it("CommonPack expone iconos con claves kebab/lower", () => {
    expect(CommonPack.home).toBeDefined();
    expect(CommonPack["chevron-down"]).toBeDefined();
  });

  it("AllIconsPack reúne los nombres de todos los packs", () => {
    expect(AllIconsPack.dashboard).toBeDefined();
    expect(AllIconsPack.mail).toBeDefined();
    expect(AllIconsPack.image).toBeDefined();
    expect(Object.keys(AllIconsPack).length).toBeGreaterThan(50);
  });
});

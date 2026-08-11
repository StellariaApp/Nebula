import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { Divider } from "../Divider.js";

afterEach(cleanup);

describe("Divider", () => {
  it("expone role separator y aria-orientation", () => {
    render(<Divider />);
    const el = screen.getByRole("separator");
    expect(el.getAttribute("aria-orientation")).toBe("horizontal");
  });

  it("orientación vertical se anuncia", () => {
    render(<Divider orientation="vertical" />);
    expect(screen.getByRole("separator").getAttribute("aria-orientation")).toBe("vertical");
  });

  it("renderiza el label con las líneas ocultas a la a11y tree", () => {
    render(<Divider label="Sección" />);
    const el = screen.getByRole("separator");
    expect(el.textContent).toContain("Sección");
    expect(el.querySelectorAll('[aria-hidden="true"]')).toHaveLength(2);
  });

  it("resuelve color, grosor y estilo en vars locales (sin hex)", () => {
    render(<Divider color="border.strong" size="md" lineStyle="dashed" />);
    const style = screen.getByRole("separator").getAttribute("style") ?? "";
    expect(style).toContain("var(--");
    expect(style).toContain("dashed");
    expect(style).not.toMatch(/#[0-9a-f]{6}/i);
  });

  it("acepta el mismo vocabulario que la style prop c (ADR-021)", () => {
    const { rerender } = render(<Divider color="primary.600" />);
    const Style = (): string => screen.getByRole("separator").getAttribute("style") ?? "";
    expect(Style()).toContain("var(--");

    rerender(<Divider color="primary.600.40" />);
    expect(Style()).toContain("color-mix");

    rerender(<Divider color="currentColor" />);
    expect(Style()).toContain("currentColor");

    rerender(<Divider color="#ff0000" />);
    expect(Style()).toContain("#ff0000");
  });
});

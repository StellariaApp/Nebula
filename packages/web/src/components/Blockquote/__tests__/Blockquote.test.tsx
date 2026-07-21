import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { Blockquote } from "../Blockquote.js";

afterEach(cleanup);

describe("Blockquote", () => {
  it("renderiza un blockquote con su contenido", () => {
    render(<Blockquote data-testid="bq">cita</Blockquote>);
    const el = screen.getByTestId("bq");
    expect(el.tagName).toBe("BLOCKQUOTE");
    expect(el.textContent).toContain("cita");
  });

  it("resuelve el color del acento en una var local (sin hex)", () => {
    render(
      <Blockquote data-testid="bq" color="success">
        x
      </Blockquote>,
    );
    const style = screen.getByTestId("bq").getAttribute("style") ?? "";
    expect(style).toContain("--");
    expect(style).not.toMatch(/#[0-9a-f]{6}/i);
  });

  it("renderiza cite e icon", () => {
    render(
      <Blockquote cite="— Autor" icon={<span data-testid="ic">”</span>}>
        texto
      </Blockquote>,
    );
    expect(screen.getByText("— Autor").tagName).toBe("CITE");
    expect(screen.getByTestId("ic")).toBeDefined();
  });
});

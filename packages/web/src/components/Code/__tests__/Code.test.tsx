import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { Code } from "../Code.js";

afterEach(cleanup);

describe("Code", () => {
  it("renderiza code inline por defecto", () => {
    render(<Code data-testid="c">const x = 1</Code>);
    expect(screen.getByTestId("c").tagName).toBe("CODE");
  });

  it("con block renderiza un pre", () => {
    render(
      <Code data-testid="c" block>
        línea
      </Code>,
    );
    expect(screen.getByTestId("c").tagName).toBe("PRE");
  });

  it("aplica clases de estructura", () => {
    render(<Code data-testid="c">x</Code>);
    expect(screen.getByTestId("c").className.length).toBeGreaterThan(0);
  });
});

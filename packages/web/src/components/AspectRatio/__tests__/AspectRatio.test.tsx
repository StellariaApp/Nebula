import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { AspectRatio } from "../AspectRatio.js";

afterEach(cleanup);

describe("AspectRatio", () => {
  it("publica el ratio como var local", () => {
    render(
      <AspectRatio data-testid="ar" ratio={16 / 9}>
        <img alt="" src="x.png" />
      </AspectRatio>,
    );
    const style = screen.getByTestId("ar").getAttribute("style") ?? "";
    expect(style).toContain("--");
    expect(style).toContain("1.77");
  });

  it("usa 1 por defecto", () => {
    render(<AspectRatio data-testid="ar" />);
    const style = screen.getByTestId("ar").getAttribute("style") ?? "";
    expect(style).toMatch(/--\S*ratio\S*:\s*1/);
  });
});

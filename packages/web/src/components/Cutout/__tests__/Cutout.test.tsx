import { afterEach, describe, expect, it } from "vitest";

import { cleanup, render, screen } from "../../../__tests__/render.js";
import { Cutout } from "../Cutout.js";

afterEach(cleanup);

describe("Cutout (ADR-197)", () => {
  it("pinta el fondo que le pasan, la figura y los hijos, en ese orden", () => {
    render(
      <Cutout
        background={<img alt="" src="bg.png" data-testid="bg" />}
        figure="figure.png"
        figureAlt="Rose"
        figureSize={0.9}
        figurePosition={{ right: -24, translate: { y: "4%" }, rotate: { z: "-6deg" } }}
      >
        <span>pie</span>
      </Cutout>,
    );
    const bg = screen.getByTestId("bg");
    const figure = screen.getByRole("img", { name: "Rose" });
    const foot = screen.getByText("pie");
    expect(bg.compareDocumentPosition(figure) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(figure.compareDocumentPosition(foot) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    const inline = figure.getAttribute("style") ?? "";
    expect(inline).toContain("90%");
    expect(inline).toContain("-24px");
    expect(inline).toContain("4%");
    expect(inline).toContain("-6deg");
  });

  it("sin figura ni fondo sigue siendo una caja con los hijos", () => {
    render(<Cutout>solo</Cutout>);
    expect(screen.getByText("solo")).toBeDefined();
    expect(screen.queryByRole("img")).toBeNull();
  });
});

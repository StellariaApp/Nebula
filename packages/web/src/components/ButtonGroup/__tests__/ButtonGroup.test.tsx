import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { ButtonGroup } from "../ButtonGroup.js";

afterEach(cleanup);

describe("ButtonGroup", () => {
  it("agrupa con role=group", () => {
    render(
      <ButtonGroup data-testid="g">
        <button type="button">a</button>
        <button type="button">b</button>
      </ButtonGroup>,
    );
    const group = screen.getByTestId("g");
    expect(group.getAttribute("role")).toBe("group");
    expect(group.querySelectorAll("button")).toHaveLength(2);
  });

  it("aplica clase distinta según orientación", () => {
    const { rerender } = render(<ButtonGroup data-testid="g">x</ButtonGroup>);
    const horizontal = screen.getByTestId("g").className;
    rerender(
      <ButtonGroup data-testid="g" orientation="vertical">
        x
      </ButtonGroup>,
    );
    expect(screen.getByTestId("g").className).not.toBe(horizontal);
  });
});

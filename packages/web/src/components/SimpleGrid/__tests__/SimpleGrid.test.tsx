import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { SimpleGrid } from "../SimpleGrid.js";

afterEach(cleanup);

describe("SimpleGrid", () => {
  it("publica cols base y spacing como vars locales", () => {
    render(
      <SimpleGrid data-testid="sg" cols={3} spacing="lg">
        <span>a</span>
      </SimpleGrid>,
    );
    const style = screen.getByTestId("sg").getAttribute("style") ?? "";
    expect(style).toContain("var(--");
    expect(style).toContain("3");
  });

  it("cols responsive publica una var por breakpoint presente", () => {
    render(
      <SimpleGrid data-testid="sg" cols={{ base: 1, tablet: 2, laptop: 4 }}>
        <span>a</span>
      </SimpleGrid>,
    );
    const style = screen.getByTestId("sg").getAttribute("style") ?? "";
    expect(style).toContain("1");
    expect(style).toContain("2");
    expect(style).toContain("4");
  });

  it("verticalSpacing distinto del horizontal", () => {
    render(<SimpleGrid data-testid="sg" spacing="sm" verticalSpacing="xl" />);
    const style = screen.getByTestId("sg").getAttribute("style") ?? "";
    expect(style).toContain("var(--");
  });
});

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { SimpleGrid } from "../index.js";

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

describe("SimpleGrid.Cell (ADR-201)", () => {
  it("es parte del compuesto y publica span y rowSpan como vars locales", () => {
    render(
      <SimpleGrid cols={3}>
        <SimpleGrid.Cell data-testid="cell" span={2} rowSpan={2}>
          a
        </SimpleGrid.Cell>
      </SimpleGrid>,
    );
    const style = screen.getByTestId("cell").getAttribute("style") ?? "";
    expect(style).toMatch(/--spanBase\S*: 2;/);
    expect(style).toMatch(/--rowSpanBase\S*: 2;/);
  });

  it("sin declarar nada ocupa una celda", () => {
    render(
      <SimpleGrid cols={3}>
        <SimpleGrid.Cell data-testid="cell">a</SimpleGrid.Cell>
      </SimpleGrid>,
    );
    const style = screen.getByTestId("cell").getAttribute("style") ?? "";
    expect(style).toMatch(/--spanBase\S*: 1;/);
    expect(style).toMatch(/--rowSpanBase\S*: 1;/);
    expect(style).not.toContain("Tablet");
  });

  it("span responsive publica una var por breakpoint presente", () => {
    render(
      <SimpleGrid cols={{ base: 1, tablet: 3 }}>
        <SimpleGrid.Cell data-testid="cell" span={{ base: 1, tablet: 2 }} rowSpan={{ tablet: 2 }}>
          a
        </SimpleGrid.Cell>
      </SimpleGrid>,
    );
    const style = screen.getByTestId("cell").getAttribute("style") ?? "";
    expect(style).toMatch(/--spanBase\S*: 1;/);
    expect(style).toMatch(/--spanTablet\S*: 2;/);
    expect(style).toMatch(/--rowSpanBase\S*: 1;/);
    expect(style).toMatch(/--rowSpanTablet\S*: 2;/);
    expect(style).not.toContain("Laptop");
  });

  it("acepta component para ser un li dentro de una lista", () => {
    render(
      <SimpleGrid component="ul" cols={2}>
        <SimpleGrid.Cell component="li" span={2}>
          a
        </SimpleGrid.Cell>
      </SimpleGrid>,
    );
    expect(screen.getByRole("listitem")).toBeDefined();
  });
});

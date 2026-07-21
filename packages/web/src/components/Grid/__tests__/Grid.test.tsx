import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { Grid } from "../Grid.js";

afterEach(cleanup);

describe("Grid / Grid.Col", () => {
  it("publica columns y gutter como vars locales heredables", () => {
    render(
      <Grid data-testid="grid" columns={12} gutter="md">
        <Grid.Col span={6}>a</Grid.Col>
      </Grid>,
    );
    const style = screen.getByTestId("grid").getAttribute("style") ?? "";
    expect(style).toContain("var(--");
    expect(style).toContain("12");
  });

  it("Grid.Col numérico publica su span", () => {
    render(
      <Grid>
        <Grid.Col data-testid="col" span={4} offset={2}>
          a
        </Grid.Col>
      </Grid>,
    );
    const style = screen.getByTestId("col").getAttribute("style") ?? "";
    expect(style).toContain("4");
    expect(style).toContain("2");
  });

  it("Grid.Col auto y content aplican clases sin var de span numérico obligatoria", () => {
    render(
      <Grid>
        <Grid.Col data-testid="auto" span="auto">
          a
        </Grid.Col>
        <Grid.Col data-testid="content" span="content">
          b
        </Grid.Col>
      </Grid>,
    );
    expect(screen.getByTestId("auto").className.length).toBeGreaterThan(0);
    expect(screen.getByTestId("content").className.length).toBeGreaterThan(0);
  });

  it("grow del Grid activa el reparto en las columnas", () => {
    render(
      <Grid data-testid="grid" grow>
        <Grid.Col span={6}>a</Grid.Col>
      </Grid>,
    );
    const style = screen.getByTestId("grid").getAttribute("style") ?? "";
    expect(style).toContain("var(--");
  });

  it("es polimórfico", () => {
    render(<Grid data-testid="grid" component="section" />);
    expect(screen.getByTestId("grid").tagName).toBe("SECTION");
  });
});

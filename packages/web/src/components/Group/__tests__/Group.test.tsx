import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { Group } from "../Group.js";

afterEach(cleanup);

describe("Group", () => {
  it("renderiza sus hijos en un contenedor flex", () => {
    render(
      <Group data-testid="g">
        <button type="button">a</button>
        <button type="button">b</button>
      </Group>,
    );
    const el = screen.getByTestId("g");
    expect(el.className.length).toBeGreaterThan(0);
    expect(el.querySelectorAll("button")).toHaveLength(2);
  });

  it("publica el gap y el conteo de hijos como vars locales", () => {
    render(
      <Group data-testid="g" gap="lg">
        <span>a</span>
        <span>b</span>
        <span>c</span>
      </Group>,
    );
    const style = screen.getByTestId("g").getAttribute("style") ?? "";
    expect(style).toContain("var(--");
    expect(style).toContain("3");
  });

  it("marca data-grow y data-prevent-overflow según props", () => {
    render(
      <Group data-testid="g" grow preventGrowOverflow={false}>
        <span>a</span>
      </Group>,
    );
    const el = screen.getByTestId("g");
    expect(el.dataset["grow"]).toBe("true");
    expect(el.dataset["preventOverflow"]).toBeUndefined();
  });

  it("no marca data-grow cuando grow es false", () => {
    render(
      <Group data-testid="g">
        <span>a</span>
      </Group>,
    );
    expect(screen.getByTestId("g").dataset["grow"]).toBeUndefined();
  });
});

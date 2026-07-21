import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { List } from "../List.js";

afterEach(cleanup);

describe("List / List.Item", () => {
  it("renderiza una ul con items por defecto", () => {
    render(
      <List data-testid="l">
        <List.Item>a</List.Item>
        <List.Item>b</List.Item>
      </List>,
    );
    const el = screen.getByTestId("l");
    expect(el.tagName).toBe("UL");
    expect(el.querySelectorAll("li")).toHaveLength(2);
  });

  it("type ordered renderiza una ol", () => {
    render(
      <List data-testid="l" type="ordered">
        <List.Item>a</List.Item>
      </List>,
    );
    expect(screen.getByTestId("l").tagName).toBe("OL");
  });

  it("publica el spacing como var local", () => {
    render(
      <List data-testid="l" spacing="lg">
        <List.Item>a</List.Item>
      </List>,
    );
    expect(screen.getByTestId("l").getAttribute("style") ?? "").toContain("--");
  });

  it("inyecta el icon de la lista en los items sin icono propio", () => {
    render(
      <List icon={<span data-testid="bullet">•</span>}>
        <List.Item>a</List.Item>
        <List.Item>b</List.Item>
      </List>,
    );
    expect(screen.getAllByTestId("bullet")).toHaveLength(2);
  });

  it("respeta el icono propio de un item", () => {
    render(
      <List icon={<span data-testid="def">•</span>}>
        <List.Item icon={<span data-testid="own">›</span>}>a</List.Item>
      </List>,
    );
    expect(screen.getByTestId("own")).toBeDefined();
    expect(screen.queryByTestId("def")).toBeNull();
  });
});

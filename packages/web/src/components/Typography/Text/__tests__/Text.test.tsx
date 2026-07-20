import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { Text } from "../Text.js";

afterEach(cleanup);

describe("Text", () => {
  it("renderiza un <p> por defecto", () => {
    render(<Text data-testid="t">hola</Text>);
    expect(screen.getByTestId("t").tagName).toBe("P");
  });

  it("es polimórfico (span, heading…)", () => {
    render(
      <Text component="span" data-testid="t">
        hola
      </Text>,
    );
    expect(screen.getByTestId("t").tagName).toBe("SPAN");
  });

  it("aplica truncado de una línea", () => {
    render(
      <Text data-testid="t" truncate>
        texto largo
      </Text>,
    );
    expect(screen.getByTestId("t").className).not.toBe("");
  });

  it("aplica line-clamp con `lines` y expone el número como estilo", () => {
    render(
      <Text data-testid="t" lines={3}>
        texto largo
      </Text>,
    );
    const el = screen.getByTestId("t");
    expect(el.style.getPropertyValue("-webkit-line-clamp")).toBe("3");
  });

  it("acepta las props tipográficas del contrato compartido sin caer en estilo inline", () => {
    render(
      <Text data-testid="t" fz="h3" fw="bold" c="text.muted" ta="center">
        hola
      </Text>,
    );
    expect(screen.getByTestId("t").getAttribute("style")).toBeNull();
  });

  it("mantiene el contenido accesible como texto", () => {
    render(<Text>contenido accesible</Text>);
    expect(screen.getByText("contenido accesible").tagName).toBe("P");
  });
});

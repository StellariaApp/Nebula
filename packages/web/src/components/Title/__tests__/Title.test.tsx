import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { Title } from "../Title.js";

afterEach(cleanup);

describe("Title", () => {
  it("renderiza un h1 por defecto", () => {
    render(<Title>Hola</Title>);
    expect(screen.getByRole("heading", { level: 1, name: "Hola" })).toBeDefined();
  });

  it("mapea order al nivel de heading", () => {
    for (const order of [1, 2, 3, 4, 5, 6] as const) {
      const { unmount } = render(<Title order={order}>T</Title>);
      expect(screen.getByRole("heading", { level: order })).toBeDefined();
      unmount();
    }
  });

  it("permite override del elemento con component sin cambiar el estilo de order", () => {
    render(
      <Title order={2} component="p" data-testid="t">
        subtítulo
      </Title>,
    );
    expect(screen.getByTestId("t").tagName).toBe("P");
  });
});

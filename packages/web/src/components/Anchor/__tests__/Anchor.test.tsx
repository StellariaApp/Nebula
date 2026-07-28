import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import { Anchor } from "../Anchor.js";

afterEach(cleanup);

describe("Anchor", () => {
  it("renderiza un enlace con href", () => {
    render(<Anchor href="/ruta">ir</Anchor>);
    const link = screen.getByRole("link", { name: "ir" });
    expect(link.getAttribute("href")).toBe("/ruta");
  });

  it("external añade target y rel seguros", () => {
    render(
      <Anchor href="https://x.com" external>
        externo
      </Anchor>,
    );
    const link = screen.getByRole("link", { name: "externo" });
    expect(link.getAttribute("target")).toBe("_blank");
    expect(link.getAttribute("rel")).toBe("noopener noreferrer");
  });

  it("es polimórfico (adapter de router por component)", () => {
    render(
      <Anchor component="button" type="button">
        botón-enlace
      </Anchor>,
    );
    expect(screen.getByRole("button", { name: "botón-enlace" })).toBeDefined();
  });

  it("es alcanzable por teclado", async () => {
    render(<Anchor href="/x">foco</Anchor>);
    await userEvent.tab();
    expect(screen.getByRole("link")).toBe(document.activeElement);
  });

  it("acepta style props además de sus propias clases base", () => {
    render(
      <Anchor href="/x" data-testid="sin">
        ir
      </Anchor>,
    );
    const sin = screen.getByTestId("sin").className.trim().split(/\s+/).length;
    cleanup();

    render(
      <Anchor href="/x" data-testid="con" p="xl" mt="lg">
        ir
      </Anchor>,
    );
    const con = screen.getByTestId("con").className.trim().split(/\s+/).length;

    expect(con).toBe(sin + 2);
  });

  it("una style prop responsive emite una clase por condición", () => {
    render(
      <Anchor href="/x" data-testid="plano" p="sm">
        ir
      </Anchor>,
    );
    const plano = screen.getByTestId("plano").className.trim().split(/\s+/).length;
    cleanup();

    render(
      <Anchor href="/x" data-testid="resp" p={{ base: "sm", tablet: "xl" }}>
        ir
      </Anchor>,
    );
    const resp = screen.getByTestId("resp").className.trim().split(/\s+/).length;

    expect(resp).toBe(plano + 1);
  });

  it("las props de dimensión llegan al estilo inline", () => {
    render(
      <Anchor href="/x" data-testid="ancho" maw={320}>
        ir
      </Anchor>,
    );
    expect(screen.getByTestId("ancho").style.maxWidth).toBe("320px");
  });
});

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
});

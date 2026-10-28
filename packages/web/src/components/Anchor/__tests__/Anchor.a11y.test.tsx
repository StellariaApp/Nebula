import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ExpectNoViolations } from "../../../__tests__/axe.js";
import { cleanup, render, screen } from "../../../__tests__/render.js";

import { Anchor } from "../Anchor.js";

afterEach(cleanup);

describe("Anchor · accesibilidad", () => {
  it("enlace interno, externo y como botón: sin violaciones de axe", async () => {
    const { container } = render(
      <>
        <Anchor href="/precios">Precios</Anchor>
        <Anchor href="https://ejemplo.com" external>
          Documentación
        </Anchor>
        <Anchor component="button" type="button">
          Ver más
        </Anchor>
      </>,
    );
    await ExpectNoViolations(container);
  });

  it("el enlace externo abre en pestaña nueva sin filtrar el opener", () => {
    render(
      <Anchor href="https://ejemplo.com" external>
        Documentación
      </Anchor>,
    );
    const link = screen.getByRole("link", { name: /Documentación/ });
    expect(link.getAttribute("target")).toBe("_blank");
    expect(link.getAttribute("rel") ?? "").toContain("noopener");
  });

  it("se activa con Enter", async () => {
    const user = userEvent.setup();
    const on_click = vi.fn((event: React.MouseEvent) => event.preventDefault());
    render(
      <Anchor href="/precios" onClick={on_click}>
        Precios
      </Anchor>,
    );
    await user.tab();
    await user.keyboard("{Enter}");
    expect(on_click).toHaveBeenCalledTimes(1);
  });
});

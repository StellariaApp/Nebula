import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import { ExpectNoViolations } from "../../../__tests__/axe.js";
import { cleanup, render, screen } from "../../../__tests__/render.js";

import { Loader } from "../Loader.js";

afterEach(cleanup);

describe("Loader · accesibilidad", () => {
  it("los tres tipos con etiqueta propia: sin violaciones de axe", async () => {
    const { container } = render(
      <>
        <Loader label="Cargando facturas" />
        <Loader type="dots" label="Enviando" />
        <Loader type="bars" label="Sincronizando" />
      </>,
    );
    await ExpectNoViolations(container);
  });

  it("es un status con nombre y sus piezas son decorativas", () => {
    render(<Loader label="Cargando facturas" />);
    const status = screen.getByRole("status", { name: "Cargando facturas" });
    for (const piece of Array.from(status.children)) {
      expect(piece.getAttribute("aria-hidden")).toBe("true");
    }
  });

  it("no es focusable", async () => {
    const user = userEvent.setup();
    render(<Loader />);
    await user.tab();
    expect(document.activeElement).toBe(document.body);
  });
});

import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ExpectNoViolations } from "../../../__tests__/axe.js";
import { cleanup, render, screen } from "../../../__tests__/render.js";

import { Textarea } from "../Textarea.js";

afterEach(cleanup);

describe("Textarea · accesibilidad", () => {
  it("con etiqueta, error, requerido y deshabilitado: sin violaciones de axe", async () => {
    const { container } = render(
      <>
        <Textarea label="Comentario" description="Máximo 200 caracteres" />
        <Textarea label="Motivo" required error="Escribe un motivo" />
        <Textarea label="Notas" disabled />
      </>,
    );
    await ExpectNoViolations(container);
  });

  it("el error se asocia por aria-describedby y marca aria-invalid", () => {
    render(<Textarea label="Motivo" error="Escribe un motivo" errorDisplay="text" />);
    const area = screen.getByLabelText("Motivo");
    expect(area.getAttribute("aria-invalid")).toBe("true");
    const described = (area.getAttribute("aria-describedby") ?? "").split(" ");
    expect(described.map((id) => document.getElementById(id)?.textContent)).toContain(
      "Escribe un motivo",
    );
  });

  it("acepta saltos de línea con Enter y entrega el valor completo", async () => {
    const user = userEvent.setup();
    const on_change = vi.fn();
    render(<Textarea label="Comentario" onChange={on_change} />);
    await user.click(screen.getByLabelText("Comentario"));
    await user.keyboard("uno{Enter}dos");
    expect(on_change).toHaveBeenLastCalledWith("uno\ndos");
  });

  it("controlado: refleja el valor que recibe", () => {
    render(<Textarea label="Comentario" value="Hola" onChange={() => {}} />);
    expect(screen.getByLabelText("Comentario")).toHaveProperty("value", "Hola");
  });
});

import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import { ExpectNoViolations } from "../../../__tests__/axe.js";
import { cleanup, render, screen } from "../../../__tests__/render.js";

import { Badge } from "../Badge.js";

afterEach(cleanup);

describe("Badge · accesibilidad", () => {
  it("las cuatro variantes con punto, iconos y todos los colores de estado: sin violaciones de axe", async () => {
    const { container } = render(
      <>
        {(["filled", "light", "outline", "ghost"] as const).map((variant) => (
          <Badge key={variant} variant={variant}>
            {variant}
          </Badge>
        ))}
        {(["success", "warning", "error", "info"] as const).map((color) => (
          <Badge key={color} color={color} dot>
            {color}
          </Badge>
        ))}
      </>,
    );
    await ExpectNoViolations(container);
  });

  it("el punto es decorativo: el texto es lo que se anuncia", () => {
    render(<Badge dot>Pendiente</Badge>);
    const badge = screen.getByText("Pendiente");
    expect(badge.querySelector("[aria-hidden='true']")).not.toBeNull();
    expect(badge.textContent).toBe("Pendiente");
  });

  it("no es focusable ni interactivo: es información, no control", async () => {
    const user = userEvent.setup();
    render(<Badge>Activo</Badge>);
    await user.tab();
    expect(document.activeElement).toBe(document.body);
    expect(screen.queryByRole("button")).toBeNull();
  });
});

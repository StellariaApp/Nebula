import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import { ExpectNoViolations } from "../../../__tests__/axe.js";
import { cleanup, render, screen } from "../../../__tests__/render.js";

import { Skeleton } from "../Skeleton.js";

afterEach(cleanup);

describe("Skeleton · accesibilidad", () => {
  it("bloque, varias líneas y sin animación: sin violaciones de axe", async () => {
    const { container } = render(
      <>
        <Skeleton height={40} />
        <Skeleton lines={3} />
        <Skeleton animation="none" height={12} />
      </>,
    );
    await ExpectNoViolations(container);
  });

  it("se anuncia una sola vez como estado de carga, no una por línea", () => {
    render(<Skeleton lines={4} />);
    expect(screen.getAllByRole("status")).toHaveLength(1);
  });

  it("al terminar de cargar desaparece el estado y aparece el contenido", () => {
    const { rerender } = render(
      <Skeleton loading>
        <p>Saldo: 1,240.00</p>
      </Skeleton>,
    );
    expect(screen.queryByText("Saldo: 1,240.00")).toBeNull();
    rerender(
      <Skeleton loading={false}>
        <p>Saldo: 1,240.00</p>
      </Skeleton>,
    );
    expect(screen.getByText("Saldo: 1,240.00")).toBeDefined();
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("no es focusable", async () => {
    const user = userEvent.setup();
    render(<Skeleton lines={2} />);
    await user.tab();
    expect(document.activeElement).toBe(document.body);
  });
});

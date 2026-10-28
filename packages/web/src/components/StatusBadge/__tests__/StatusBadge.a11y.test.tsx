import { afterEach, describe, expect, it } from "vitest";

import { ExpectNoViolations } from "../../../__tests__/axe.js";
import { cleanup, render, screen } from "../../../__tests__/render.js";

import { StatusBadge } from "../StatusBadge.js";

afterEach(cleanup);

const MAP = {
  paid: { label: "Pagado", color: "success", dot: true },
  late: { label: "Vencido", color: "error", dot: true },
  draft: { label: "Borrador", color: "gray" },
} as const;

describe("StatusBadge · accesibilidad", () => {
  it("cada estado: sin violaciones de axe", async () => {
    const { container } = render(
      <>
        <StatusBadge status="paid" map={MAP} />
        <StatusBadge status="late" map={MAP} />
        <StatusBadge status="draft" map={MAP} />
      </>,
    );
    await ExpectNoViolations(container);
  });

  it("el estado se comunica con texto, no solo con color", () => {
    render(<StatusBadge status="late" map={MAP} />);
    expect(screen.getByText("Vencido")).toBeDefined();
  });
});

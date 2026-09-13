import { afterEach, describe, expect, it } from "vitest";

import { cleanup, render, screen } from "../../../__tests__/render.js";
import { EmptyModule } from "../EmptyModule.js";

afterEach(cleanup);

describe("EmptyModule (ADR-192)", () => {
  it("por defecto apila y no rellena", () => {
    render(<EmptyModule title="Nada" data-testid="m" />);
    const root = screen.getByText("Nada").closest("section");
    expect(root?.getAttribute("data-layout")).toBeNull();
    expect(root?.getAttribute("data-fill")).toBeNull();
    expect(root?.getAttribute("data-surface")).toBe("dashed");
  });

  it("layout='side', surface='glass' y fill marcan la raíz y conservan el título", () => {
    render(
      <EmptyModule
        layout="side"
        surface="glass"
        fill
        illustration={<span>art</span>}
        title="No se pudo cargar esto"
        description="El servidor no contestó."
      />,
    );
    const root = screen.getByText("No se pudo cargar esto").closest("section");
    expect(root?.getAttribute("data-layout")).toBe("side");
    expect(root?.getAttribute("data-fill")).toBe("true");
    expect(root?.getAttribute("data-surface")).toBe("glass");
    expect(screen.getByText("art").parentElement?.getAttribute("aria-hidden")).toBe("true");
  });
});

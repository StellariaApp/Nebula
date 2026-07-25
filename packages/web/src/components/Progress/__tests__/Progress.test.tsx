import { afterEach, describe, expect, it } from "vitest";

import { cleanup, render, screen } from "../../../__tests__/render.js";
import { Progress } from "../Progress.js";

afterEach(cleanup);

describe("Progress", () => {
  it("expone progressbar con su valor", () => {
    render(<Progress value={40} label="Carga" />);
    const bar = screen.getByRole("progressbar", { name: "Carga" });
    expect(bar.getAttribute("aria-valuenow")).toBe("40");
    expect(bar.getAttribute("aria-valuemin")).toBe("0");
    expect(bar.getAttribute("aria-valuemax")).toBe("100");
  });

  it("suma los segmentos multi-color en el valor anunciado", () => {
    render(
      <Progress
        label="Cartera"
        segments={[
          { value: 30, color: "success" },
          { value: 20, color: "warning" },
          { value: 10, color: "error" },
        ]}
      />,
    );
    expect(screen.getByRole("progressbar").getAttribute("aria-valuenow")).toBe("60");
  });

  it("respeta max al calcular el porcentaje", () => {
    render(<Progress value={25} max={50} label="Mitad" />);
    expect(screen.getByRole("progressbar").getAttribute("aria-valuenow")).toBe("50");
  });

  it("acota el valor al rango", () => {
    render(<Progress value={180} label="Tope" />);
    expect(screen.getByRole("progressbar").getAttribute("aria-valuenow")).toBe("100");
  });

  it("indeterminate no publica valor", () => {
    render(<Progress indeterminate label="Procesando" />);
    expect(screen.getByRole("progressbar").getAttribute("aria-valuenow")).toBeNull();
  });

  it("el anillo también es un progressbar", () => {
    render(<Progress type="ring" value={75} label="Anillo" />);
    expect(screen.getByRole("progressbar", { name: "Anillo" }).getAttribute("aria-valuenow")).toBe(
      "75",
    );
  });

  it("el anillo admite contenido central", () => {
    render(
      <Progress type="ring" value={75} label="Anillo">
        75%
      </Progress>,
    );
    expect(screen.getByText("75%")).toBeDefined();
  });
});

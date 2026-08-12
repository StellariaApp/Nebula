import { fireEvent } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { cleanup, render, screen } from "../../../__tests__/render.js";
import { BackgroundImage } from "../BackgroundImage.js";
import { Image } from "../Image.js";

afterEach(cleanup);

describe("Image", () => {
  it("el alt es obligatorio y llega a la imagen", () => {
    render(<Image src="/recibo.png" alt="Recibo de agosto" />);
    expect(screen.getByRole("img", { name: "Recibo de agosto" })).toBeDefined();
  });

  it("sin src muestra el fallback en lugar de una imagen rota", () => {
    render(<Image alt="Recibo de agosto" />);
    expect(screen.queryByRole("img")).toBeNull();
    expect(screen.getByText("Recibo de agosto")).toBeDefined();
  });

  it("un fallback explícito sustituye al alt", () => {
    render(<Image alt="Recibo" fallback={<span>Sin comprobante</span>} />);
    expect(screen.getByText("Sin comprobante")).toBeDefined();
  });

  it("si la carga falla degrada al fallback", () => {
    const { container } = render(<Image src="/rota.png" alt="Recibo" />);
    fireEvent.error(screen.getByRole("img", { name: "Recibo" }));
    expect(screen.queryByRole("img")).toBeNull();
    expect(container.querySelector("[data-status]")?.getAttribute("data-status")).toBe("failed");
  });

  it("publica el estado de carga como data-attribute", () => {
    const { container } = render(<Image src="/recibo.png" alt="Recibo" />);
    expect(container.querySelector("[data-status]")?.getAttribute("data-status")).toBe("idle");
    fireEvent.load(screen.getByRole("img", { name: "Recibo" }));
    expect(container.querySelector("[data-status]")?.getAttribute("data-status")).toBe("loaded");
  });

  it("lazy es el default y eager es opt-in", () => {
    const { unmount } = render(<Image src="/a.png" alt="A" />);
    expect(screen.getByRole("img", { name: "A" }).getAttribute("loading")).toBe("lazy");
    unmount();
    render(<Image src="/b.png" alt="B" loading="eager" />);
    expect(screen.getByRole("img", { name: "B" }).getAttribute("loading")).toBe("eager");
  });
});

describe("BackgroundImage", () => {
  it("es decorativa: el contenido es lo que se anuncia", () => {
    render(
      <BackgroundImage src="/portada.png">
        <span>Reporte mensual</span>
      </BackgroundImage>,
    );
    expect(screen.getByText("Reporte mensual")).toBeDefined();
    expect(screen.queryByRole("img")).toBeNull();
  });
});

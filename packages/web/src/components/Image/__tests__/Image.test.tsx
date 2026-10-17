import { fireEvent } from "@testing-library/react";
import { act } from "react";
import { hydrateRoot, type Root } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it } from "vitest";

import { cleanup, render, screen, waitFor } from "../../../__tests__/render.js";
import { BackgroundImage } from "../BackgroundImage.js";
import { Image } from "../Image.js";

const hydrated: (() => void)[] = [];

afterEach(() => {
  hydrated.splice(0).forEach((Unmount) => {
    Unmount();
  });
  cleanup();
});

function HydrateLoaded(
  image: Partial<Pick<HTMLImageElement, "complete" | "naturalWidth" | "decode">>,
): HTMLElement {
  const ui = <Image src="/recibo.png" alt="Recibo" />;
  const container = document.createElement("div");
  container.innerHTML = renderToString(ui);
  document.body.appendChild(container);
  const node = container.querySelector("img");
  if (node === null) throw new Error("sin <img> en el HTML del servidor");
  for (const [key, value] of Object.entries(image)) {
    Object.defineProperty(node, key, { value, configurable: true });
  }
  let root: Root | undefined;
  act(() => {
    root = hydrateRoot(container, ui);
  });
  hydrated.push(() => {
    act(() => {
      root?.unmount();
    });
    container.remove();
  });
  return container;
}

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

  it("si la imagen cargó antes de hidratar, aparece sin esperar el onLoad", () => {
    const container = HydrateLoaded({ complete: true, naturalWidth: 640 });
    expect(container.querySelector("[data-status]")?.getAttribute("data-status")).toBe("loaded");
    expect(container.querySelector("img")?.getAttribute("data-loaded")).toBe("true");
  });

  it("si la imagen falló antes de hidratar, degrada al fallback", async () => {
    const container = HydrateLoaded({
      complete: true,
      naturalWidth: 0,
      decode: () => Promise.reject(new Error("rota")),
    });
    await waitFor(() => {
      expect(container.querySelector("[data-status]")?.getAttribute("data-status")).toBe("failed");
    });
    expect(container.querySelector("img")).toBeNull();
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

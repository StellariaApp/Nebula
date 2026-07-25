import { afterEach, describe, expect, it } from "vitest";

import { cleanup, render, screen } from "../../../__tests__/render.js";
import { Loader } from "../../Loader/Loader.js";
import { Skeleton } from "../Skeleton.js";

afterEach(cleanup);

describe("Skeleton", () => {
  it("anuncia la carga con role=status", () => {
    render(<Skeleton />);
    expect(screen.getByRole("status", { name: "Cargando contenido" })).toBeDefined();
  });

  it("con loading=false renderiza a sus hijos", () => {
    render(
      <Skeleton loading={false}>
        <p>Contenido real</p>
      </Skeleton>,
    );
    expect(screen.getByText("Contenido real")).toBeDefined();
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("lines>1 agrupa las líneas en un solo status", () => {
    render(<Skeleton lines={3} />);
    expect(screen.getAllByRole("status")).toHaveLength(1);
  });
});

describe("Loader", () => {
  it("anuncia su estado con una etiqueta accesible", () => {
    render(<Loader />);
    expect(screen.getByRole("status", { name: "Cargando" })).toBeDefined();
  });

  it("acepta una etiqueta propia", () => {
    render(<Loader label="Buscando resultados" />);
    expect(screen.getByRole("status", { name: "Buscando resultados" })).toBeDefined();
  });

  it("expone la variante como data-variant", () => {
    render(<Loader variant="dots" />);
    expect(screen.getByRole("status").getAttribute("data-variant")).toBe("dots");
  });
});

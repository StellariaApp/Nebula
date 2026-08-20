import { render as rtl_render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Collapse } from "../components/Collapse/Collapse.js";

interface GlobMeta {
  glob: (
    pattern: string,
    options: { query: string; import: string; eager: true },
  ) => Record<string, string>;
}

const sources = (import.meta as unknown as GlobMeta).glob("../**/*.tsx", {
  query: "?raw",
  import: "default",
  eager: true,
});

function FilesContaining(token: string): string[] {
  return Object.entries(sources)
    .filter(([path, source]) => !path.includes("__tests__") && source.includes(token))
    .map(([path]) => path.replace("../", ""))
    .sort();
}

describe("el escaneo de fuentes ve código real", () => {
  it("recibe el fuente de los componentes, no un módulo compilado", () => {
    const entries = Object.entries(sources).filter(([path]) => !path.includes("__tests__"));
    expect(entries.length).toBeGreaterThan(60);
    expect(FilesContaining("displayName")).toContain("components/Button/Button.tsx");
  });
});

describe("LazyMotion único (ADR-034 regla 5)", () => {
  it("solo el provider lo monta", () => {
    expect(FilesContaining("<LazyMotion")).toEqual(["provider/nebula-provider.tsx"]);
  });

  it("las features están unificadas en domAnimation, y `domMax` no vuelve por descuido", () => {
    expect(FilesContaining("domAnimation")).toEqual(["provider/nebula-provider.tsx"]);

    /*
     * El juego maximo es este mas arrastre y layout, y son 12 kB brotli EN TODA PAGINA porque
     * `LazyMotion` no carga a la carta. Ninguno de los dos lo usa nadie: el arrastre de `Segment`
     * es suyo con `useMotionValue`, el de `Dropzone` es DnD nativo, y la animacion de layout que tenia
     * `Pagination` se sustituyo por una medida y un `transform`.
     *
     * Si algun dia hace falta, no se sube este juego: se envuelve ese subarbol en su propio
     * `LazyMotion` para que lo pague quien lo usa. Por eso aqui la lista es vacia y no una excepcion.
     */
    expect(FilesContaining("domMax")).toEqual([]);
  });

  it("nadie vuelve a `layoutId`, que es lo que obligaba a `domMax`", () => {
    expect(FilesContaining("layoutId")).toEqual([]);
  });
});

describe("helper único de spring (ADR-034 regla 6)", () => {
  it("ningún componente copia la física a mano", () => {
    expect(FilesContaining('type: "spring"')).toEqual([]);
    expect(FilesContaining("stiffness:")).toEqual([]);
  });
});

describe("NebulaProvider es obligatorio", () => {
  it("un componente animado fuera del provider falla en voz alta", () => {
    expect(() =>
      rtl_render(
        <Collapse in>
          <p>contenido</p>
        </Collapse>,
      ),
    ).toThrowError(/NebulaProvider/);
  });
});

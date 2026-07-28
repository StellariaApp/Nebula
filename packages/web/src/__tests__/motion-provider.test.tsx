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

describe("LazyMotion único (ADR-034 regla 5)", () => {
  it("solo el provider lo monta", () => {
    expect(FilesContaining("<LazyMotion")).toEqual(["provider/nebula-provider.tsx"]);
  });

  it("las features están unificadas en domMax", () => {
    expect(FilesContaining("domAnimation")).toEqual([]);
    expect(FilesContaining("domMax")).toEqual(["provider/nebula-provider.tsx"]);
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

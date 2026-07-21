import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { Highlight } from "../Highlight.js";

afterEach(cleanup);

describe("Highlight", () => {
  it("envuelve la coincidencia en un mark", () => {
    render(<Highlight highlight="mundo">Hola mundo</Highlight>);
    const mark = screen.getByText("mundo");
    expect(mark.tagName).toBe("MARK");
  });

  it("es insensible a mayúsculas", () => {
    render(<Highlight highlight="hola">Hola mundo</Highlight>);
    const mark = screen.getByText("Hola");
    expect(mark.tagName).toBe("MARK");
  });

  it("acepta varios términos", () => {
    render(<Highlight highlight={["uno", "tres"]}>uno dos tres</Highlight>);
    expect(screen.getByText("uno").tagName).toBe("MARK");
    expect(screen.getByText("tres").tagName).toBe("MARK");
  });

  it("sin coincidencia deja el texto intacto", () => {
    render(<Highlight highlight="zzz">Hola mundo</Highlight>);
    expect(screen.queryByText("Hola", { selector: "mark" })).toBeNull();
    expect(screen.getByText("Hola mundo")).toBeDefined();
  });
});

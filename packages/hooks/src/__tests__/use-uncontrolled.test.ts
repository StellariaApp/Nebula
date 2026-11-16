import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useUncontrolled } from "../use-uncontrolled.js";

afterEach(cleanup);

describe("useUncontrolled", () => {
  it("modo no-controlado: usa defaultValue y gestiona estado local", () => {
    const { result } = renderHook(() => useUncontrolled<string>(undefined, "def"));
    expect(result.current[0]).toBe("def");

    act(() => {
      result.current[1]("x");
    });
    expect(result.current[0]).toBe("x");
  });

  it("modo controlado: el padre manda y on_change se dispara sin mutar el local", () => {
    const on_change = vi.fn<(value: string) => void>();
    const { result, rerender } = renderHook(
      ({ v }) => useUncontrolled<string>(v, "def", on_change),
      { initialProps: { v: "a" } },
    );
    expect(result.current[0]).toBe("a");

    act(() => {
      result.current[1]("b");
    });
    expect(on_change).toHaveBeenCalledWith("b");
    expect(result.current[0]).toBe("a"); // controlado: el valor solo cambia si el padre lo pasa

    rerender({ v: "b" });
    expect(result.current[0]).toBe("b");
  });

  it("modo controlado: el valor nuevo llega en el mismo render, sin pasar por el anterior", () => {
    const seen: string[] = [];
    const { rerender } = renderHook(
      ({ v }) => {
        const state = useUncontrolled<string>(v, "def");
        seen.push(state[0]);
        return state;
      },
      { initialProps: { v: "Finiuito" } },
    );
    seen.length = 0;

    rerender({ v: "Finiquito" });
    expect(seen[0]).toBe("Finiquito");
    expect(seen).not.toContain("Finiuito");
  });

  it("un valor controlado con identidad nueva en cada render no dispara renders en cadena", () => {
    let renders = 0;
    const { rerender } = renderHook(() => {
      renders += 1;
      return useUncontrolled<string[]>(["a"], []);
    });

    rerender();
    rerender();

    expect(renders).toBe(3);
  });
});

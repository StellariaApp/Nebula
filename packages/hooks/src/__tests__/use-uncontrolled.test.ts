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

  it("modo controlado: el padre manda y onChange se dispara sin mutar el local", () => {
    const onChange = vi.fn<(value: string) => void>();
    const { result, rerender } = renderHook(
      ({ v }) => useUncontrolled<string>(v, "def", onChange),
      { initialProps: { v: "a" } },
    );
    expect(result.current[0]).toBe("a");

    act(() => {
      result.current[1]("b");
    });
    expect(onChange).toHaveBeenCalledWith("b");
    expect(result.current[0]).toBe("a"); // controlado: el valor solo cambia si el padre lo pasa

    rerender({ v: "b" });
    expect(result.current[0]).toBe("b");
  });
});

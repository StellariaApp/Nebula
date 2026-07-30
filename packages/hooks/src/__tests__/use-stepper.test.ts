import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useStepper } from "../use-stepper.js";

describe("useStepper", () => {
  it("empieza en el paso inicial y conoce sus extremos", () => {
    const { result } = renderHook(() => useStepper({ count: 3 }));
    expect(result.current.step).toBe(0);
    expect(result.current.isFirst).toBe(true);
    expect(result.current.isLast).toBe(false);
  });

  it("avanza y retrocede sin salirse del rango", () => {
    const { result } = renderHook(() => useStepper({ count: 2 }));
    act(() => {
      result.current.next();
    });
    expect(result.current.step).toBe(1);
    expect(result.current.isLast).toBe(true);
    act(() => {
      result.current.next();
    });
    expect(result.current.step).toBe(1);
    act(() => {
      result.current.previous();
      result.current.previous();
    });
    expect(result.current.step).toBe(0);
  });

  it("con loop da la vuelta por los dos extremos", () => {
    const { result } = renderHook(() => useStepper({ count: 3, loop: true }));
    act(() => {
      result.current.previous();
    });
    expect(result.current.step).toBe(2);
    act(() => {
      result.current.next();
    });
    expect(result.current.step).toBe(0);
  });

  it("goTo recorta y reset vuelve al inicial", () => {
    const { result } = renderHook(() => useStepper({ count: 4, initialStep: 1 }));
    act(() => {
      result.current.goTo(99);
    });
    expect(result.current.step).toBe(3);
    act(() => {
      result.current.reset();
    });
    expect(result.current.step).toBe(1);
  });

  it("solo notifica cuando el paso cambia de verdad", () => {
    const on_change = vi.fn();
    const { result } = renderHook(() => useStepper({ count: 2, onChange: on_change }));
    act(() => {
      result.current.previous();
    });
    expect(on_change).not.toHaveBeenCalled();
    act(() => {
      result.current.next();
    });
    expect(on_change).toHaveBeenCalledWith(1);
  });

  it("no rompe con count 0", () => {
    const { result } = renderHook(() => useStepper({ count: 0 }));
    act(() => {
      result.current.next();
    });
    expect(result.current.step).toBe(0);
  });
});

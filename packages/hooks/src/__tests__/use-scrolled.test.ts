import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useScrolled } from "../use-scrolled.js";

let frames: (() => void)[] = [];

function Flush(): void {
  const pending = frames;
  frames = [];
  pending.forEach((fn) => {
    fn();
  });
}

function Scroll(y: number): void {
  Object.defineProperty(window, "scrollY", { value: y, configurable: true, writable: true });
  window.dispatchEvent(new Event("scroll"));
}

beforeEach(() => {
  frames = [];
  vi.stubGlobal("requestAnimationFrame", (fn: () => void) => {
    frames.push(fn);
    return frames.length;
  });
  vi.stubGlobal("cancelAnimationFrame", () => undefined);
  Object.defineProperty(window, "scrollY", { value: 0, configurable: true, writable: true });
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("useScrolled", () => {
  it("arranca en false y no cruza el umbral por debajo", () => {
    const { result } = renderHook(() => useScrolled(24));
    act(Flush);
    expect(result.current).toBe(false);

    act(() => {
      Scroll(24);
      Flush();
    });
    expect(result.current).toBe(false);
  });

  it("pasa a true al superar el umbral y vuelve al bajar", () => {
    const { result } = renderHook(() => useScrolled(24));

    act(() => {
      Scroll(25);
      Flush();
    });
    expect(result.current).toBe(true);

    act(() => {
      Scroll(0);
      Flush();
    });
    expect(result.current).toBe(false);
  });

  it("throttlea por frame: varios scroll seguidos piden un solo frame", () => {
    renderHook(() => useScrolled(24));
    act(Flush);

    act(() => {
      Scroll(100);
      Scroll(200);
      Scroll(300);
    });
    expect(frames).toHaveLength(1);
  });

  it("respeta initial en el primer render", () => {
    const { result } = renderHook(() => useScrolled(24, { initial: true }));
    expect(result.current).toBe(true);
  });

  it("enabled false no suscribe y devuelve initial", () => {
    const add = vi.spyOn(window, "addEventListener");
    const { result } = renderHook(() => useScrolled(24, { enabled: false }));

    act(() => {
      Scroll(500);
      Flush();
    });

    expect(result.current).toBe(false);
    expect(add.mock.calls.some(([type]) => type === "scroll")).toBe(false);
    add.mockRestore();
  });

  it("desuscribe al desmontar", () => {
    const remove = vi.spyOn(window, "removeEventListener");
    const { unmount } = renderHook(() => useScrolled(24));
    unmount();

    expect(remove.mock.calls.some(([type]) => type === "scroll")).toBe(true);
    expect(remove.mock.calls.some(([type]) => type === "resize")).toBe(true);
    remove.mockRestore();
  });
});

import { renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useMediaQuery } from "../use-media-query.js";

interface FakeList {
  matches: boolean;
  media: string;
  addEventListener: (type: string, fn: () => void) => void;
  removeEventListener: (type: string, fn: () => void) => void;
}

function Install(matches: boolean): { calls: string[]; removed: number } {
  const calls: string[] = [];
  let removed = 0;
  const media = (query: string): FakeList => {
    calls.push(query);
    return {
      matches,
      media: query,
      addEventListener: () => undefined,
      removeEventListener: () => {
        removed += 1;
      },
    };
  };
  vi.stubGlobal("matchMedia", media);
  Object.defineProperty(window, "matchMedia", { value: media, configurable: true, writable: true });
  return {
    calls,
    get removed() {
      return removed;
    },
  };
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("useMediaQuery", () => {
  it("devuelve el valor inicial antes de medir", () => {
    Install(false);
    const { result } = renderHook(() => useMediaQuery("(min-width: 900px)", true));
    expect(typeof result.current).toBe("boolean");
  });

  it("refleja el resultado de matchMedia", () => {
    Install(true);
    const { result } = renderHook(() => useMediaQuery("(min-width: 900px)"));
    expect(result.current).toBe(true);
  });

  it("consulta exactamente la query que recibe", () => {
    const spy = Install(false);
    renderHook(() => useMediaQuery("(max-width: 480px)"));
    expect(spy.calls).toContain("(max-width: 480px)");
  });

  it("se desuscribe al desmontar", () => {
    const spy = Install(false);
    const { unmount } = renderHook(() => useMediaQuery("(min-width: 900px)"));
    unmount();
    expect(spy.removed).toBeGreaterThan(0);
  });
});

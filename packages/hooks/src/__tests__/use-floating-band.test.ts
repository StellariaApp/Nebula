import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { CenterOn, FloatingBand, useFloatingBand } from "../use-floating-band.js";

function Bar(kind: string, top: number, bottom: number): HTMLElement {
  const node = document.createElement("div");
  node.setAttribute("data-floating", kind);
  node.getBoundingClientRect = () =>
    ({ top, bottom, height: bottom - top, left: 0, right: 0, width: 0, x: 0, y: top }) as DOMRect;
  document.body.append(node);
  return node;
}

let frames: (() => void)[] = [];

beforeEach(() => {
  frames = [];
  vi.stubGlobal("requestAnimationFrame", (fn: () => void) => {
    frames.push(fn);
    return frames.length;
  });
  vi.stubGlobal("cancelAnimationFrame", () => undefined);
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  document.body.innerHTML = "";
});

describe("FloatingBand", () => {
  it("los header bajan el techo y el resto sube el suelo; lo que mide cero no cuenta", () => {
    Bar("header", 0, 64);
    Bar("header", 64, 120);
    Bar("footer", 700, 760);
    Bar("dock", 800, 800);
    expect(FloatingBand(900)).toEqual({ ceiling: 120, floor: 700 });
  });

  it("sin barras, el techo es cero y el suelo es el alto", () => {
    expect(FloatingBand(900)).toEqual({ ceiling: 0, floor: 900 });
  });
});

describe("CenterOn", () => {
  it("centra entre techo y suelo en el documento", () => {
    Bar("header", 0, 100);
    Bar("footer", 700, 800);
    Object.defineProperty(window, "innerHeight", { value: 800, configurable: true });
    const scrolling = (document.scrollingElement ?? document.documentElement) as HTMLElement;
    const ScrollTo = vi.fn();
    scrolling.scrollTo = ScrollTo;
    Object.defineProperty(scrolling, "scrollTop", { value: 50, configurable: true });

    const node = document.createElement("div");
    node.getBoundingClientRect = () =>
      ({
        top: 500,
        bottom: 600,
        height: 100,
        left: 0,
        right: 0,
        width: 0,
        x: 0,
        y: 500,
      }) as DOMRect;
    document.body.append(node);

    CenterOn(node);
    expect(ScrollTo).toHaveBeenCalledWith({ behavior: "smooth", top: 50 + 500 + 50 - 400 });
  });
});

describe("useFloatingBand", () => {
  it("mide al montar y vuelve a medir al desplazar", () => {
    Bar("header", 0, 64);
    Object.defineProperty(window, "innerHeight", { value: 900, configurable: true });
    const { result } = renderHook(() => useFloatingBand());
    act(() => {
      frames.splice(0).forEach((fn) => {
        fn();
      });
    });
    expect(result.current).toEqual({ ceiling: 64, floor: 900 });

    Bar("dock", 820, 880);
    act(() => {
      window.dispatchEvent(new Event("scroll"));
      frames.splice(0).forEach((fn) => {
        fn();
      });
    });
    expect(result.current).toEqual({ ceiling: 64, floor: 820 });
  });
});

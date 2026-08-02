import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useScrollSpy } from "../use-scroll-spy.js";

let frames: (() => void)[] = [];

function Flush(): void {
  const pending = frames;
  frames = [];
  pending.forEach((fn) => {
    fn();
  });
}

function Section(id: string, top: number): void {
  const node = document.createElement("section");
  node.id = id;
  node.getBoundingClientRect = () => ({ top: top - window.scrollY, height: 400 }) as DOMRect;
  document.body.append(node);
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
  Object.defineProperty(window, "innerHeight", { value: 1000, configurable: true, writable: true });
  document.body.innerHTML = "";
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("useScrollSpy", () => {
  it("arranca en la primera sección", () => {
    Section("uno", 0);
    Section("dos", 2000);
    const { result } = renderHook(() => useScrollSpy(["uno", "dos"]));
    act(Flush);

    expect(result.current).toBe("uno");
  });

  it("pasa a la sección cuyo borde cruza el marcador", () => {
    Section("uno", 0);
    Section("dos", 2000);
    const { result } = renderHook(() => useScrollSpy(["uno", "dos"]));

    act(() => {
      Scroll(1659);
      Flush();
    });
    expect(result.current).toBe("uno");

    act(() => {
      Scroll(1660);
      Flush();
    });
    expect(result.current).toBe("dos");
  });

  it("se queda en la última cuando varias quedan por encima del marcador", () => {
    Section("uno", 0);
    Section("dos", 500);
    Section("tres", 900);
    const { result } = renderHook(() => useScrollSpy(["uno", "dos", "tres"]));

    act(() => {
      Scroll(1000);
      Flush();
    });
    expect(result.current).toBe("tres");
  });

  it("ignora los ids que no existen en el documento", () => {
    Section("uno", 0);
    const { result } = renderHook(() => useScrollSpy(["uno", "fantasma"]));

    act(() => {
      Scroll(5000);
      Flush();
    });
    expect(result.current).toBe("uno");
  });

  it("offset mueve el marcador", () => {
    Section("uno", 0);
    Section("dos", 2000);
    const { result } = renderHook(() => useScrollSpy(["uno", "dos"], { offset: 1 }));

    act(() => {
      Scroll(1001);
      Flush();
    });
    expect(result.current).toBe("dos");
  });

  it("throttlea por frame: varios scroll seguidos piden un solo frame", () => {
    Section("uno", 0);
    renderHook(() => useScrollSpy(["uno"]));
    act(Flush);

    act(() => {
      Scroll(100);
      Scroll(200);
      Scroll(300);
    });
    expect(frames).toHaveLength(1);
  });

  it("enabled false no suscribe y devuelve la primera", () => {
    Section("uno", 0);
    Section("dos", 100);
    const add = vi.spyOn(window, "addEventListener");
    const { result } = renderHook(() => useScrollSpy(["uno", "dos"], { enabled: false }));

    act(() => {
      Scroll(5000);
      Flush();
    });

    expect(result.current).toBe("uno");
    expect(add.mock.calls.some(([type]) => type === "scroll")).toBe(false);
    add.mockRestore();
  });

  it("no resuscribe cuando el array cambia de identidad pero no de contenido", () => {
    Section("uno", 0);
    const add = vi.spyOn(window, "addEventListener");
    const { rerender } = renderHook(() => useScrollSpy(["uno", "dos"]));
    const before = add.mock.calls.filter(([type]) => type === "scroll").length;

    rerender();
    expect(add.mock.calls.filter(([type]) => type === "scroll")).toHaveLength(before);
    add.mockRestore();
  });

  it("desuscribe al desmontar", () => {
    Section("uno", 0);
    const remove = vi.spyOn(window, "removeEventListener");
    const { unmount } = renderHook(() => useScrollSpy(["uno"]));
    unmount();

    expect(remove.mock.calls.some(([type]) => type === "scroll")).toBe(true);
    expect(remove.mock.calls.some(([type]) => type === "resize")).toBe(true);
    remove.mockRestore();
  });

  it("una lista vacía no rompe ni deja activo", () => {
    const { result } = renderHook(() => useScrollSpy([]));
    act(Flush);

    expect(result.current).toBeUndefined();
  });
});

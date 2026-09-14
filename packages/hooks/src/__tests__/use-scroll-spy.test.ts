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

function Section(id: string, top: number, height = 400): void {
  const node = document.createElement("section");
  node.id = id;
  node.getBoundingClientRect = () => ({ top: top - window.scrollY, height }) as DOMRect;
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

  it("enabled false no suscribe y no activa nada", () => {
    Section("uno", 0);
    Section("dos", 100);
    const add = vi.spyOn(window, "addEventListener");
    const { result } = renderHook(() => useScrollSpy(["uno", "dos"], { enabled: false }));

    act(() => {
      Scroll(5000);
      Flush();
    });

    expect(result.current).toBeUndefined();
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

  it("el recorte frena al marcador dentro de una sección corta", () => {
    // Para esto existe el recorte: si la que va en cabeza acaba antes que el marcador, el activo
    // NO debe adelantarse a la siguiente. Sin recorte el marcador cae en 340 y gana "dos".
    Section("uno", 0, 200);
    Section("dos", 300);
    const { result } = renderHook(() => useScrollSpy(["uno", "dos"]));
    act(Flush);

    expect(result.current).toBe("uno");
  });

  it("una astilla de subpíxel bajo el borde no se lleva el marcador", () => {
    // El aterrizaje de un ancla con barra fija: `Main` fija `scroll-padding-top` al alto de la
    // barra y ese mismo alto llega como `chrome`, así que el borde cae CLAVADO en la frontera
    // entre dos secciones pegadas. El redondeo del layout deja la anterior asomando 0,188 px y
    // esa astilla se llevaba el marcador. Cifras medidas en Iris.
    Object.defineProperty(window, "innerHeight", {
      value: 900,
      configurable: true,
      writable: true,
    });
    Section("entrega", 820, 399.188);
    Section("como", 1219.188, 463.531);
    Section("planes", 1994.281, 558.282);
    const { result } = renderHook(() =>
      useScrollSpy(["entrega", "como", "planes"], { chrome: 70 }),
    );

    act(() => {
      Scroll(1149);
      Flush();
    });
    expect(result.current).toBe("como");
  });
});

describe("useScrollSpy con scroller (ADR-204)", () => {
  interface Scroller {
    node: HTMLDivElement;
    Scroll: (top: number) => void;
  }

  function Container(height: number, content: number, top = 100): Scroller {
    const node = document.createElement("div");
    let scroll_top = 0;
    Object.defineProperty(node, "clientHeight", { value: height, configurable: true });
    Object.defineProperty(node, "scrollHeight", { value: content, configurable: true });
    Object.defineProperty(node, "scrollTop", { get: () => scroll_top, configurable: true });
    node.getBoundingClientRect = () => ({ top, height }) as DOMRect;
    document.body.append(node);
    return {
      node,
      Scroll: (value) => {
        scroll_top = value;
        node.dispatchEvent(new Event("scroll"));
      },
    };
  }

  function Inner(box: Scroller, id: string, top: number, height = 400): void {
    const node = document.createElement("section");
    node.id = id;
    node.getBoundingClientRect = () =>
      ({
        top: box.node.getBoundingClientRect().top + top - box.node.scrollTop,
        height,
      }) as DOMRect;
    box.node.append(node);
  }

  it("mide el scroll de la caja y no el de la ventana", () => {
    const box = Container(600, 3000);
    Inner(box, "uno", 0);
    Inner(box, "dos", 1200);
    const { result } = renderHook(() => useScrollSpy(["uno", "dos"], { scroller: box.node }));
    act(Flush);
    expect(result.current).toBe("uno");

    act(() => {
      Scroll(5000);
      Flush();
    });
    expect(result.current).toBe("uno");

    act(() => {
      box.Scroll(995);
      Flush();
    });
    expect(result.current).toBe("uno");

    act(() => {
      box.Scroll(996);
      Flush();
    });
    expect(result.current).toBe("dos");
  });

  it("las secciones se miden respecto al borde superior de la caja, no de la ventana", () => {
    const box = Container(600, 3000, 250);
    Inner(box, "uno", 0);
    Inner(box, "dos", 1200);
    const { result } = renderHook(() => useScrollSpy(["uno", "dos"], { scroller: box.node }));

    act(() => {
      box.Scroll(995);
      Flush();
    });
    expect(result.current).toBe("uno");

    act(() => {
      box.Scroll(996);
      Flush();
    });
    expect(result.current).toBe("dos");
  });

  it("chrome descuenta la barra pegada dentro de la caja", () => {
    const box = Container(600, 3000);
    Inner(box, "uno", 0);
    Inner(box, "dos", 1200);
    const { result } = renderHook(() =>
      useScrollSpy(["uno", "dos"], { scroller: box.node, chrome: 100 }),
    );

    act(() => {
      box.Scroll(929);
      Flush();
    });
    expect(result.current).toBe("uno");

    act(() => {
      box.Scroll(930);
      Flush();
    });
    expect(result.current).toBe("dos");
  });

  it("al fondo de la caja gana la última sección", () => {
    const box = Container(600, 3000);
    Inner(box, "uno", 0);
    Inner(box, "dos", 1200);
    Inner(box, "tres", 2800, 200);
    const { result } = renderHook(() =>
      useScrollSpy(["uno", "dos", "tres"], { scroller: box.node }),
    );

    act(() => {
      box.Scroll(2399);
      Flush();
    });
    expect(result.current).toBe("tres");
  });

  it("acepta la ref y con una ref vacía devuelve initial sin suscribir", () => {
    const box = Container(600, 3000);
    Inner(box, "uno", 0);
    Inner(box, "dos", 1200);
    const ref = { current: box.node };
    const { result } = renderHook(() => useScrollSpy(["uno", "dos"], { scroller: ref }));

    act(() => {
      box.Scroll(996);
      Flush();
    });
    expect(result.current).toBe("dos");

    const add = vi.spyOn(window, "addEventListener");
    const empty = renderHook(() =>
      useScrollSpy(["uno", "dos"], { scroller: { current: null }, initial: "uno" }),
    );
    act(Flush);
    expect(empty.result.current).toBe("uno");
    expect(add.mock.calls.some(([type]) => type === "scroll")).toBe(false);
    add.mockRestore();
  });
});

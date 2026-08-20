import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useMomentumPage, useMomentumScroll } from "../use-momentum-scroll.js";

const FRAME = 16;
const HOLD_BELOW = 90;

let frames: ((time: number) => void)[] = [];
let clock = 0;

function Run(count = 240): void {
  for (let i = 0; i < count; i += 1) {
    const pending = frames;
    frames = [];
    if (pending.length === 0) return;
    clock += FRAME;
    pending.forEach((fn) => {
      fn(clock);
    });
  }
}

function Scroller(): { node: HTMLDivElement; Position: () => number } {
  const node = document.createElement("div");
  let top = 0;

  Object.defineProperty(node, "scrollHeight", { value: 1000, configurable: true });
  Object.defineProperty(node, "clientHeight", { value: 200, configurable: true });
  Object.defineProperty(node, "scrollTop", {
    configurable: true,
    get: () => top,
    set: (value: number) => {
      top = value;
    },
  });
  node.scrollTo = (options?: ScrollToOptions | number, y?: number): void => {
    if (typeof options === "number") top = y ?? top;
    else if (options?.top !== undefined) top = options.top;
  };

  document.body.appendChild(node);
  return { node, Position: () => top };
}

function Wheel(node: HTMLElement, init: WheelEventInit = {}): WheelEvent {
  const event = new WheelEvent("wheel", { bubbles: true, cancelable: true, ...init });
  node.dispatchEvent(event);
  return event;
}

function Release(): void {
  vi.advanceTimersByTime(200);
  Run();
}

beforeEach(() => {
  frames = [];
  clock = 0;
  vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
  vi.stubGlobal("requestAnimationFrame", (fn: (time: number) => void) => {
    frames.push(fn);
    return frames.length;
  });
  vi.stubGlobal("cancelAnimationFrame", () => {
    frames = [];
  });
});

afterEach(() => {
  cleanup();
  document.body.innerHTML = "";
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe("useMomentumScroll", () => {
  it("cancela la rueda y lleva el scroll al destino con el muelle", () => {
    const { node, Position } = Scroller();
    renderHook(() => {
      useMomentumScroll({ current: node });
    });

    let event: WheelEvent | undefined;
    act(() => {
      event = Wheel(node, { deltaY: 300 });
    });

    expect(event?.defaultPrevented).toBe(true);
    expect(Position()).toBe(0);

    act(Run);
    expect(Position()).toBe(300);
  });

  it("llega despacio: el primer frame no salta al destino", () => {
    const { node, Position } = Scroller();
    renderHook(() => {
      useMomentumScroll({ current: node });
    });

    act(() => {
      Wheel(node, { deltaY: 300 });
      Run(1);
    });

    expect(Position()).toBeGreaterThan(0);
    expect(Position()).toBeLessThan(300);
  });

  it("no cancela el evento en el tope, para no romper el encadenamiento al padre", () => {
    const { node } = Scroller();
    renderHook(() => {
      useMomentumScroll({ current: node });
    });

    let event: WheelEvent | undefined;
    act(() => {
      event = Wheel(node, { deltaY: -120 });
    });

    expect(event?.defaultPrevented).toBe(false);
  });

  it("no toca ctrl+rueda", () => {
    const { node, Position } = Scroller();
    renderHook(() => {
      useMomentumScroll({ current: node });
    });

    let event: WheelEvent | undefined;
    act(() => {
      event = Wheel(node, { deltaY: 200, ctrlKey: true });
      Run();
    });

    expect(event?.defaultPrevented).toBe(false);
    expect(Position()).toBe(0);
  });

  it("convierte deltaMode de líneas a píxeles", () => {
    const { node, Position } = Scroller();
    renderHook(() => {
      useMomentumScroll({ current: node });
    });

    act(() => {
      Wheel(node, { deltaY: 3, deltaMode: 1 });
      Run();
    });

    expect(Position()).toBe(48);
  });

  it("un scroll ajeno resincroniza y mata el muelle", () => {
    const { node, Position } = Scroller();
    renderHook(() => {
      useMomentumScroll({ current: node });
    });

    act(() => {
      Wheel(node, { deltaY: 400 });
      Run(2);
    });

    act(() => {
      node.scrollTop = 800;
      node.dispatchEvent(new Event("scroll"));
      Run();
    });

    expect(Position()).toBe(800);
  });

  it("enabled false no suscribe nada", () => {
    const { node } = Scroller();
    const add = vi.spyOn(node, "addEventListener");
    renderHook(() => {
      useMomentumScroll({ current: node }, { enabled: false });
    });

    expect(add.mock.calls.some(([type]) => type === "wheel")).toBe(false);
    add.mockRestore();
  });

  it("desuscribe al desmontar", () => {
    const { node } = Scroller();
    const remove = vi.spyOn(node, "removeEventListener");
    const { unmount } = renderHook(() => {
      useMomentumScroll({ current: node });
    });
    unmount();

    expect(remove.mock.calls.some(([type]) => type === "wheel")).toBe(true);
    expect(remove.mock.calls.some(([type]) => type === "scroll")).toBe(true);
    remove.mockRestore();
  });
});

describe("useMomentumScroll · rebote en el límite", () => {
  it("sin bounce, la rueda en el tope no produce nada", () => {
    const { node } = Scroller();
    const on_bounce = vi.fn();
    renderHook(() => {
      useMomentumScroll({ current: node }, { onBounce: on_bounce });
    });

    act(() => {
      Wheel(node, { deltaY: -300 });
      Run();
    });

    expect(on_bounce).not.toHaveBeenCalled();
  });

  it("con bounce, el exceso estira y vuelve a cero", () => {
    const { node, Position } = Scroller();
    const seen: number[] = [];
    renderHook(() => {
      useMomentumScroll(
        { current: node },
        {
          bounce: 80,
          onBounce: (offset) => {
            seen.push(offset);
          },
        },
      );
    });

    act(() => {
      Wheel(node, { deltaY: -300 });
      Run();
    });

    expect(Math.min(...seen)).toBeLessThan(0);
    expect(seen.at(-1)).not.toBe(0);

    act(Release);

    expect(seen.at(-1)).toBe(0);
    expect(Position()).toBe(0);
  });

  it("el borde cede UNA VEZ por gesto: insistir ya no lo estira mas", () => {
    const { node } = Scroller();
    const seen: number[] = [];
    renderHook(() => {
      useMomentumScroll(
        { current: node },
        {
          bounce: 80,
          onBounce: (offset) => {
            seen.push(offset);
          },
        },
      );
    });

    act(() => {
      Wheel(node, { deltaY: -200 });
      Run();
    });
    const first = seen.at(-1) ?? 0;

    act(() => {
      vi.advanceTimersByTime(60);
      Wheel(node, { deltaY: -200 });
      Run();
    });
    const second = seen.at(-1) ?? 0;

    /*
     * Antes cada muesca estiraba un poco mas mientras el usuario insistiera. Ahora el cerrojo se
     * echa en cuanto el borde cede y solo lo suelta el silencio de la rueda: seguir girando contra
     * el tope deja la pagina quieta en vez de haciendo temblar la goma.
     */
    expect(second).toBeCloseTo(first, 5);
    expect(seen.every((value) => value <= 0)).toBe(true);

    act(Release);
    expect(seen.at(-1)).toBe(0);
  });

  it("la resistencia acota el estiramiento por debajo del tope", () => {
    const { node } = Scroller();
    const seen: number[] = [];
    renderHook(() => {
      useMomentumScroll(
        { current: node },
        {
          bounce: 80,
          onBounce: (offset) => {
            seen.push(offset);
          },
        },
      );
    });

    act(() => {
      Wheel(node, { deltaY: -5000 });
      Run();
    });

    expect(Math.abs(Math.min(...seen))).toBeLessThan(80);
  });

  it("con bounce sí cancela el evento en el tope: el gesto es suyo", () => {
    const { node } = Scroller();
    renderHook(() => {
      useMomentumScroll({ current: node }, { bounce: 80 });
    });

    let event: WheelEvent | undefined;
    act(() => {
      event = Wheel(node, { deltaY: -300 });
    });

    expect(event?.defaultPrevented).toBe(true);
  });

  it("un scroll ajeno devuelve el rebote a cero", () => {
    const { node } = Scroller();
    const seen: number[] = [];
    renderHook(() => {
      useMomentumScroll(
        { current: node },
        {
          bounce: 80,
          onBounce: (offset) => {
            seen.push(offset);
          },
        },
      );
    });

    act(() => {
      Wheel(node, { deltaY: -300 });
      Run(3);
    });

    expect(seen.at(-1)).not.toBe(0);

    act(() => {
      node.scrollTop = 500;
      node.dispatchEvent(new Event("scroll"));
    });

    expect(seen.at(-1)).toBe(0);
  });

  it("el muelle no tira mientras el gesto sigue vivo", () => {
    const { node } = Scroller();
    const seen: number[] = [];
    renderHook(() => {
      useMomentumScroll(
        { current: node },
        {
          bounce: 80,
          onBounce: (offset) => {
            seen.push(offset);
          },
        },
      );
    });

    act(() => {
      Wheel(node, { deltaY: -300 });
      Run();
    });
    const held = seen.at(-1) ?? 0;

    act(() => {
      vi.advanceTimersByTime(HOLD_BELOW);
      Run();
    });

    expect(seen.at(-1)).toBe(held);
  });
});

function PageScroller(): () => number {
  const root = document.documentElement;
  let top = 0;

  Object.defineProperty(root, "scrollHeight", { value: 4000, configurable: true });
  Object.defineProperty(root, "clientHeight", { value: 800, configurable: true });
  Object.defineProperty(root, "scrollTop", {
    configurable: true,
    get: () => top,
    set: (value: number) => {
      top = value;
    },
  });
  root.scrollTo = (options?: ScrollToOptions | number, y?: number): void => {
    if (typeof options === "number") top = y ?? top;
    else if (options?.top !== undefined) top = options.top;
  };

  return () => top;
}

describe("useMomentumPage", () => {
  it("lleva el scroll del documento al destino con el muelle", () => {
    const Position = PageScroller();
    renderHook(() => {
      useMomentumPage();
    });

    let event: WheelEvent | undefined;
    act(() => {
      event = new WheelEvent("wheel", { bubbles: true, cancelable: true, deltaY: 300 });
      window.dispatchEvent(event);
    });

    expect(event?.defaultPrevented).toBe(true);
    expect(Position()).toBe(0);

    act(Run);
    expect(Position()).toBe(300);
  });

  it("el scroll de la página resincroniza aunque se despache en document", () => {
    const Position = PageScroller();
    renderHook(() => {
      useMomentumPage();
    });

    act(() => {
      window.dispatchEvent(new WheelEvent("wheel", { cancelable: true, deltaY: 300 }));
      frames = [];
      document.documentElement.scrollTop = 1500;
      document.dispatchEvent(new Event("scroll"));
      Run();
    });

    expect(Position()).toBe(1500);
  });

  it("escucha el wheel en window y el scroll en document, no en el elemento", () => {
    PageScroller();
    const on_window = vi.spyOn(window, "addEventListener");
    const on_document = vi.spyOn(document, "addEventListener");
    const on_root = vi.spyOn(document.documentElement, "addEventListener");

    renderHook(() => {
      useMomentumPage();
    });

    expect(on_window.mock.calls.some(([type]) => type === "wheel")).toBe(true);
    expect(on_document.mock.calls.some(([type]) => type === "scroll")).toBe(true);
    expect(on_root.mock.calls.length).toBe(0);

    on_window.mockRestore();
    on_document.mockRestore();
    on_root.mockRestore();
  });

  it("enabled false no suscribe nada", () => {
    PageScroller();
    const on_window = vi.spyOn(window, "addEventListener");
    renderHook(() => {
      useMomentumPage({ enabled: false });
    });

    expect(on_window.mock.calls.some(([type]) => type === "wheel")).toBe(false);
    on_window.mockRestore();
  });
});

describe("la inercia depende del gesto, no de un numero fijo", () => {
  /*
   * El ritmo se mide sobre `timeStamp`, asi que hay que ponerlo a mano: dos eventos creados en el
   * mismo bloque sincrono comparten instante y el gesto pareceria infinitamente rapido.
   */
  function WheelAt(node: HTMLElement, at: number, init: WheelEventInit = {}): void {
    const event = new WheelEvent("wheel", { bubbles: true, cancelable: true, ...init });
    Object.defineProperty(event, "timeStamp", { value: at, configurable: true });
    node.dispatchEvent(event);
  }

  it("un giro suelto no gana ni un pixel", () => {
    const { node, Position } = Scroller();
    renderHook(() => {
      useMomentumScroll({ current: node }, { multiplier: 1 });
    });

    WheelAt(node, 1000, { deltaY: 100 });
    Run();

    /*
     * Esto es lo que protege el caso lento. Si el impulso se aplicara siempre, una muesca suelta se
     * pasaria de largo y la pagina dejaria de ir donde el usuario la manda — que es peor que no
     * tener inercia.
     */
    expect(Position()).toBeCloseTo(100, 0);
  });

  it("y varios giros espaciados tampoco: son pasos, no un gesto", () => {
    const { node, Position } = Scroller();
    renderHook(() => {
      useMomentumScroll({ current: node }, { multiplier: 1 });
    });

    for (let i = 0; i < 4; i += 1) {
      WheelAt(node, 1000 + i * 500, { deltaY: 100 });
      Run();
    }

    expect(Position()).toBeCloseTo(400, 0);
  });

  it("una rafaga seguida si termina mas alla de lo que suman sus ticks", () => {
    const { node, Position } = Scroller();
    renderHook(() => {
      useMomentumScroll({ current: node }, { multiplier: 1 });
    });

    for (let i = 0; i < 6; i += 1) {
      WheelAt(node, 1000 + i * 30, { deltaY: 100 });
      Run(2);
    }
    Run();

    expect(Position()).toBeGreaterThan(600);
  });
});

describe("el borde cede una vez, y con la fuerza con que se llega", () => {
  function WheelAt(node: HTMLElement, at: number, init: WheelEventInit = {}): void {
    const event = new WheelEvent("wheel", { bubbles: true, cancelable: true, ...init });
    Object.defineProperty(event, "timeStamp", { value: at, configurable: true });
    node.dispatchEvent(event);
  }

  /** El mayor estiron que se llego a reportar. */
  function Stretch(build: (node: HTMLElement, at: number) => void): number {
    const { node } = Scroller();
    const seen: number[] = [];
    renderHook(() => {
      useMomentumScroll(
        { current: node },
        { multiplier: 1, bounce: 280, onBounce: (o) => seen.push(Math.abs(o)) },
      );
    });
    build(node, 1000);
    Run();
    const peak = Math.max(...seen, 0);
    cleanup();
    return peak;
  }

  it("el estiron es mayor que el exceso: la inercia se transfiere a la goma", () => {
    /*
     * Rafaga de seis muescas de 250 sobre un recorrido de 800: al cruzar, lo que sobra son
     * exactamente 200 px. Si el estiron se quedara en eso, `RubberOffset(200, 280)` daria 116.7.
     *
     * Que salga por encima significa que lo que quedaba por recorrer al chocar TAMBIEN se
     * transfirio. Antes se descartaba en el `Clamp` y el borde no se enteraba de con cuanta fuerza
     * se habia llegado: frenar en seco y apoyarse estiraban lo mismo.
     */
    const solo_exceso = (280 * 200) / (280 + 200);

    const peak = Stretch((node, at) => {
      for (let i = 0; i < 6; i += 1) {
        WheelAt(node, at + i * 25, { deltaY: 250 });
        Run(2);
      }
    });

    expect(peak).toBeGreaterThan(solo_exceso);
  });

  it("insistir contra el tope no lo estira mas, y soltar lo devuelve", () => {
    const { node } = Scroller();
    const seen: number[] = [];
    renderHook(() => {
      useMomentumScroll(
        { current: node },
        { multiplier: 1, bounce: 280, onBounce: (o) => seen.push(Math.abs(o)) },
      );
    });

    WheelAt(node, 1000, { deltaY: 900 });
    Run();
    const primero = Math.max(...seen, 0);

    // Veinte muescas mas sin soltar: el cerrojo esta echado y el borde ya no cede.
    for (let i = 1; i <= 20; i += 1) {
      WheelAt(node, 1000 + i * 25, { deltaY: 900 });
      Run(2);
    }
    expect(Math.max(...seen, 0)).toBeCloseTo(primero, 5);

    // Y al parar del todo, la goma vuelve.
    act(() => {
      vi.advanceTimersByTime(400);
    });
    Run();
    expect(Math.abs(seen.at(-1) ?? 0)).toBeLessThan(1);
  });
});

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { cleanup, render, screen } from "../../../__tests__/render.js";
import { Scroll } from "../Scroll.js";

let frames: ((time: number) => void)[] = [];

function Flush(count = 200): void {
  let clock = 0;
  for (let i = 0; i < count; i += 1) {
    const pending = frames;
    frames = [];
    if (pending.length === 0) return;
    clock += 16;
    pending.forEach((fn) => {
      fn(clock);
    });
  }
}

function Sized(node: HTMLElement): { Position: () => number } {
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
  return { Position: () => top };
}

function Wheel(node: HTMLElement, deltaY: number): WheelEvent {
  const event = new WheelEvent("wheel", { deltaY, bubbles: true, cancelable: true });
  node.dispatchEvent(event);
  return event;
}

beforeEach(() => {
  frames = [];
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
  vi.unstubAllGlobals();
});

describe("Scroll momentum", () => {
  it("conserva las demás props del contenedor", () => {
    render(
      <Scroll data-testid="s" momentum shadows axis="y">
        contenido
      </Scroll>,
    );
    const node = screen.getByTestId("s");
    expect(node.className.length).toBeGreaterThan(0);
    expect(node.textContent).toBe("contenido");
    expect(node.getAttribute("data-momentum")).toBe("true");
  });

  it("la rueda mueve el scroll con el muelle del tema y la ganancia por defecto", () => {
    render(<Scroll data-testid="s" momentum />);
    const node = screen.getByTestId("s");
    const { Position } = Sized(node);

    const event = Wheel(node, 240);

    expect(event.defaultPrevented).toBe(true);
    Flush();
    expect(Position()).toBe(360);
  });

  it("multiplier gobierna cuánto avanza cada muesca", () => {
    render(<Scroll data-testid="s" momentum multiplier={1} />);
    const node = screen.getByTestId("s");
    const { Position } = Sized(node);

    Wheel(node, 240);
    Flush();
    expect(Position()).toBe(240);
  });

  it("sin la prop el scroll es el nativo y no hay atributo", () => {
    render(<Scroll data-testid="s" />);
    const node = screen.getByTestId("s");
    const { Position } = Sized(node);

    const event = Wheel(node, 240);

    expect(event.defaultPrevented).toBe(false);
    expect(node.getAttribute("data-momentum")).toBeNull();
    Flush();
    expect(Position()).toBe(0);
  });

  it("expone el nodo por ref también con momentum", () => {
    let captured: Element | null = null;
    render(
      <Scroll
        data-testid="s"
        momentum
        ref={(node: Element | null) => {
          captured = node;
        }}
      />,
    );
    expect(captured).toBe(screen.getByTestId("s"));
  });
});

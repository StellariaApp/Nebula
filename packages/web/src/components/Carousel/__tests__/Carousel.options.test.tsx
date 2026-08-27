import { afterEach, describe, expect, it, vi } from "vitest";

import { cleanup, render } from "../../../__tests__/render.js";

const seen: Record<string, unknown>[] = [];

vi.mock("embla-carousel-react", () => ({
  default: (options: Record<string, unknown>) => {
    seen.push(options);
    return [() => undefined, undefined];
  },
}));

const { Carousel } = await import("../Carousel.js");

afterEach(() => {
  cleanup();
  seen.length = 0;
});

const SLIDES = ["uno", "dos", "tres"];

function Basic(props: Partial<Parameters<typeof Carousel<string>>[0]> = {}) {
  return (
    <Carousel
      items={SLIDES}
      getKey={(item) => item}
      renderItem={(item) => <span>{item}</span>}
      {...props}
    />
  );
}

describe("Carousel · opciones de Embla", () => {
  it("el índice controlado no vuelve a entrar en startIndex", () => {
    const { rerender } = render(<Basic index={0} />);
    rerender(<Basic index={2} />);

    expect(seen.length).toBeGreaterThan(1);
    expect(seen.every((options) => options["startIndex"] === 0)).toBe(true);
  });

  it("arranca donde diga el índice inicial", () => {
    render(<Basic index={2} />);
    expect(seen[0]?.["startIndex"]).toBe(2);
  });

  it("sin índice, arranca donde diga defaultIndex", () => {
    render(<Basic defaultIndex={1} />);
    expect(seen[0]?.["startIndex"]).toBe(1);
  });

  it("deja pasar la duración, y 25 es lo de siempre", () => {
    render(<Basic />);
    expect(seen[0]?.["duration"]).toBe(25);

    cleanup();
    seen.length = 0;

    render(<Basic duration={60} />);
    expect(seen[0]?.["duration"]).toBe(60);
  });

  it("deja pasar containScroll, con el defecto de Embla", () => {
    render(<Basic />);
    expect(seen[0]?.["containScroll"]).toBe("trimSnaps");

    cleanup();
    seen.length = 0;

    render(<Basic containScroll={false} />);
    expect(seen[0]?.["containScroll"]).toBe(false);
  });
});

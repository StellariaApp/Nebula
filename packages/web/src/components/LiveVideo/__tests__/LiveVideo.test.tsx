import { act, fireEvent } from "@testing-library/react";
import { createRef } from "react";
import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from "vitest";

import { cleanup, render, screen } from "../../../__tests__/render.js";
import { LiveVideo } from "../LiveVideo.js";

afterEach(cleanup);

function Feed(): MediaStream {
  return {} as MediaStream;
}

function Surface(container: HTMLElement): HTMLVideoElement {
  const video = container.querySelector("video");
  if (video === null) throw new Error("sin video");
  return video;
}

describe("LiveVideo (ADR-205)", () => {
  let play: MockInstance<HTMLMediaElement["play"]>;

  beforeEach(() => {
    play = vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue(undefined);
  });

  afterEach(() => {
    play.mockRestore();
  });

  it("monta el video sin flujo, mudo, en línea y sin controles nativos", () => {
    const { container } = render(<LiveVideo label="Equipo" stream={null} />);
    const video = Surface(container);
    expect(video.getAttribute("aria-label")).toBe("Equipo");
    expect(video.muted).toBe(true);
    expect(video.autoplay).toBe(true);
    expect(video.hasAttribute("playsinline")).toBe(true);
    expect(video.hasAttribute("controls")).toBe(false);
    expect(video.dataset["fit"]).toBe("contain");
    expect(play).not.toHaveBeenCalled();
  });

  it("asigna el flujo a srcObject sólo cuando cambia, y null lo suelta", () => {
    const first = Feed();
    const { container, rerender } = render(<LiveVideo stream={first} />);
    const video = Surface(container);
    expect(video.srcObject).toBe(first);
    expect(play).toHaveBeenCalledTimes(1);

    rerender(<LiveVideo fit="cover" stream={first} />);
    expect(play).toHaveBeenCalledTimes(1);
    expect(video.dataset["fit"]).toBe("cover");

    const second = Feed();
    rerender(<LiveVideo stream={second} />);
    expect(video.srcObject).toBe(second);
    expect(play).toHaveBeenCalledTimes(2);

    rerender(<LiveVideo stream={null} />);
    expect(video.srcObject).toBeNull();
  });

  it("pinta el placeholder hasta el primer fotograma y avisa con onReady", () => {
    const on_ready = vi.fn();
    const { container, rerender } = render(
      <LiveVideo onReady={on_ready} placeholder={<span>Conectando</span>} stream={undefined} />,
    );
    const video = Surface(container);
    expect(screen.getByText("Conectando")).toBeDefined();
    expect(video.dataset["ready"]).toBe("false");

    rerender(
      <LiveVideo onReady={on_ready} placeholder={<span>Conectando</span>} stream={Feed()} />,
    );
    expect(screen.getByText("Conectando")).toBeDefined();

    act(() => {
      video.dispatchEvent(new Event("loadeddata"));
    });
    expect(screen.queryByText("Conectando")).toBeNull();
    expect(video.dataset["ready"]).toBe("true");
    expect(on_ready).toHaveBeenLastCalledWith(true);

    rerender(<LiveVideo onReady={on_ready} placeholder={<span>Conectando</span>} stream={null} />);
    expect(screen.getByText("Conectando")).toBeDefined();
    expect(on_ready).toHaveBeenLastCalledWith(false);
    expect(on_ready).toHaveBeenCalledTimes(2);
  });

  it("un onLoadedData en la ranura no le quita al componente el primer fotograma", () => {
    const on_loaded = vi.fn();
    const { container } = render(
      <LiveVideo
        placeholder={<span>Conectando</span>}
        stream={Feed()}
        surfaceProps={{ onLoadedData: on_loaded }}
      />,
    );
    act(() => {
      Surface(container).dispatchEvent(new Event("loadeddata", { bubbles: true }));
    });
    expect(on_loaded).toHaveBeenCalledTimes(1);
    expect(screen.queryByText("Conectando")).toBeNull();
  });

  it("surfaceRef alcanza el video desde el primer render, de objeto o callback", () => {
    const object_ref = createRef<HTMLVideoElement>();
    const { container, unmount } = render(<LiveVideo stream={null} surfaceRef={object_ref} />);
    expect(object_ref.current).toBe(Surface(container));
    unmount();

    const callback_ref = vi.fn();
    const second = render(
      <LiveVideo
        stream={null}
        surfaceProps={{ className: "remoto", style: { cursor: "crosshair" } }}
        surfaceRef={callback_ref}
      />,
    );
    const video = Surface(second.container);
    expect(callback_ref).toHaveBeenCalledWith(video);
    expect(video.classList.contains("remoto")).toBe(true);
    expect(video.style.cursor).toBe("crosshair");
  });

  it("ampliar y la insignia de directo sólo se pintan si se piden", () => {
    const { container, rerender } = render(<LiveVideo stream={Feed()} />);
    expect(screen.queryByRole("button")).toBeNull();

    rerender(
      <LiveVideo
        labels={{ fullscreen: "Pantalla completa", live: "En vivo" }}
        stream={Feed()}
        withFullscreen
        withLiveBadge
      />,
    );
    expect(screen.getByRole("button", { name: "Pantalla completa", pressed: false })).toBeDefined();
    expect(screen.queryByText("En vivo")).toBeNull();

    act(() => {
      Surface(container).dispatchEvent(new Event("loadeddata"));
    });
    expect(screen.getByText("En vivo")).toBeDefined();
  });

  it("pinta los mandos por esquina y pone ampliar el primero de topEnd (ADR-206)", () => {
    const { container } = render(
      <LiveVideo
        labels={{ fullscreen: "Pantalla completa" }}
        overlay={{
          topEnd: <button type="button">Más</button>,
          bottomStart: <span>Recepción</span>,
          bottomEnd: <button type="button">Tomar control</button>,
        }}
        stream={Feed()}
        withFullscreen
      />,
    );
    const top_end = container.querySelector('[data-corner="topEnd"]');
    const names = [...(top_end?.querySelectorAll("button") ?? [])].map((b) => b.getAttribute("aria-label") ?? b.textContent);
    expect(names).toEqual(["Pantalla completa", "Más"]);
    expect(container.querySelector('[data-corner="bottomStart"]')?.textContent).toBe("Recepción");
    expect(container.querySelector('[data-corner="bottomEnd"]')).not.toBeNull();
    expect(container.querySelector('[data-corner="topStart"]')).toBeNull();
  });

  it("en auto despierta al mover el puntero y se duerme tras idleDelay o al salir", () => {
    vi.useFakeTimers();
    try {
      const { container } = render(
        <LiveVideo idleDelay={1000} overlay={{ bottomEnd: <button type="button">Tomar control</button> }} stream={null} />,
      );
      const shell = Surface(container).parentElement as HTMLElement;
      expect(shell.dataset["mode"]).toBe("auto");
      expect(shell.dataset["awake"]).toBe("false");

      fireEvent.pointerMove(shell);
      expect(shell.dataset["awake"]).toBe("true");
      act(() => {
        vi.advanceTimersByTime(999);
      });
      expect(shell.dataset["awake"]).toBe("true");
      act(() => {
        vi.advanceTimersByTime(1);
      });
      expect(shell.dataset["awake"]).toBe("false");

      fireEvent.pointerMove(shell);
      fireEvent.pointerLeave(shell);
      expect(shell.dataset["awake"]).toBe("false");
    } finally {
      vi.useRealTimers();
    }
  });

  it("always no se duerme, never no despierta y pinned marca su esquina", () => {
    const corners = { topEnd: <button type="button">Más</button>, bottomEnd: <button type="button">Soltar</button> };
    const { container, rerender } = render(<LiveVideo overlay={corners} overlayMode="always" stream={null} />);
    const shell = Surface(container).parentElement as HTMLElement;
    expect(shell.dataset["awake"]).toBe("true");

    rerender(<LiveVideo overlay={corners} overlayMode="never" pinned={["bottomEnd"]} stream={null} />);
    fireEvent.pointerMove(shell);
    expect(shell.dataset["awake"]).toBe("false");
    expect(shell.dataset["mode"]).toBe("never");
    const pinned = (at: string) =>
      container.querySelector(`[data-corner="${at}"] [data-pinned]`)?.getAttribute("data-pinned");
    expect(pinned("bottomEnd")).toBe("true");
    expect(pinned("topEnd")).toBe("false");
  });

  it("la insignia de directo comparte topStart con lo que se pase allí", () => {
    const { container } = render(
      <LiveVideo
        labels={{ live: "En vivo" }}
        overlay={{ topStart: <span>Recepción</span> }}
        stream={Feed()}
        withLiveBadge
      />,
    );
    act(() => {
      Surface(container).dispatchEvent(new Event("loadeddata"));
    });
    const top_start = container.querySelector('[data-corner="topStart"]');
    expect(top_start?.textContent).toBe("En vivoRecepción");
    expect(top_start?.querySelector("[data-pinned]")?.textContent).toBe("Recepción");
  });

  it("las style props van al marco", () => {
    const { container } = render(<LiveVideo h={240} stream={null} />);
    const shell = container.querySelector("video")?.parentElement;
    expect(shell?.style.height).toBe("240px");
  });
});

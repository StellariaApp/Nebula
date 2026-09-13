import { act } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { cleanup, render, screen } from "../../../__tests__/render.js";
import { VideoPlayer } from "../VideoPlayer.js";

afterEach(cleanup);

describe("VideoPlayer (ADR-195)", () => {
  it("con defer y carátula no monta el video: pinta la carátula y el play", () => {
    const { container } = render(
      <VideoPlayer defer duration={5} label="Clip" poster="poster.jpg" src="clip.mp4" />,
    );
    expect(container.querySelector("video")).toBeNull();
    expect(screen.getByRole("img", { name: "Clip" }).getAttribute("src")).toBe("poster.jpg");
    expect(screen.getByRole("button", { name: "Play" })).toBeDefined();
    expect(screen.getByText("0:00/0:05")).toBeDefined();
  });

  it("al pulsar play con defer monta el video y le pide play()", async () => {
    const user = userEvent.setup();
    const play = vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue(undefined);
    const { container } = render(<VideoPlayer defer poster="poster.jpg" src="clip.mp4" />);
    await user.click(screen.getByRole("button", { name: "Play" }));
    expect(container.querySelector("video")).not.toBeNull();
    expect(play).toHaveBeenCalledTimes(1);
    play.mockRestore();
  });

  it("sin defer monta el video, y onPlaying sigue a play y pause", () => {
    const on_playing = vi.fn();
    const { container } = render(<VideoPlayer onPlaying={on_playing} src="clip.mp4" />);
    const video = container.querySelector("video");
    expect(video).not.toBeNull();
    act(() => {
      video?.dispatchEvent(new Event("play"));
    });
    expect(on_playing).toHaveBeenLastCalledWith(true);
    expect(screen.queryByRole("button", { name: "Play" })).toBeNull();
    act(() => {
      video?.dispatchEvent(new Event("pause"));
    });
    expect(on_playing).toHaveBeenLastCalledWith(false);
    expect(screen.getByRole("button", { name: "Play" })).toBeDefined();
  });

  it("expone la pista, el volumen y ampliar con sus nombres, y los rótulos se traducen", () => {
    render(
      <VideoPlayer labels={{ fullscreen: "Pantalla completa", seek: "Punto" }} src="clip.mp4" />,
    );
    expect(screen.getByRole("slider", { name: "Punto" })).toBeDefined();
    expect(screen.getByRole("button", { name: "Volume" })).toBeDefined();
    expect(screen.getByRole("button", { name: "Pantalla completa", pressed: false })).toBeDefined();
  });
});

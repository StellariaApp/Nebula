import { act } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { cleanup, render, screen } from "../../../__tests__/render.js";
import { AudioPlayer } from "../AudioPlayer.js";
import { Stamp } from "../labels.js";

afterEach(cleanup);

describe("Stamp", () => {
  it("escribe m:ss y no inventa decimales sin metadato", () => {
    expect(Stamp(0)).toBe("0:00");
    expect(Stamp(65.4)).toBe("1:05");
    expect(Stamp(Number.NaN)).toBe("0:00");
  });
});

describe("AudioPlayer (ADR-195)", () => {
  it("expone play, la pista y el volumen con sus nombres", () => {
    render(<AudioPlayer src="voice.mp3" label="Nota de voz" />);
    expect(screen.getByRole("button", { name: "Play" })).toBeDefined();
    expect(screen.getByRole("slider", { name: "Seek" })).toBeDefined();
    expect(screen.getByRole("button", { name: "Volume" })).toBeDefined();
    expect(screen.getByText("0:00/0:00")).toBeDefined();
  });

  it("sigue al elemento: al sonar el botón pasa a Pause, y los rótulos se traducen", () => {
    const { container } = render(
      <AudioPlayer src="voice.mp3" labels={{ play: "Reproducir", pause: "Pausar" }} />,
    );
    const audio = container.querySelector("audio");
    expect(audio).not.toBeNull();
    act(() => {
      audio?.dispatchEvent(new Event("play"));
    });
    expect(screen.getByRole("button", { name: "Pausar" })).toBeDefined();
    act(() => {
      audio?.dispatchEvent(new Event("pause"));
    });
    expect(screen.getByRole("button", { name: "Reproducir" })).toBeDefined();
  });

  it("el play pide play() al elemento", async () => {
    const user = userEvent.setup();
    const play = vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue(undefined);
    render(<AudioPlayer src="voice.mp3" />);
    await user.click(screen.getByRole("button", { name: "Play" }));
    expect(play).toHaveBeenCalledTimes(1);
    play.mockRestore();
  });
});

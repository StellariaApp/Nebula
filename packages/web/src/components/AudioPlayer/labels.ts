export interface PlayerControlsLabels {
  play: string;
  pause: string;
  seek: string;
  volume: string;
  mute: string;
  unmute: string;
  fullscreen: string;
  exitFullscreen: string;
}

export const PLAYER_CONTROLS_LABELS: PlayerControlsLabels = {
  play: "Play",
  pause: "Pause",
  seek: "Seek",
  volume: "Volume",
  mute: "Mute",
  unmute: "Unmute",
  fullscreen: "Full screen",
  exitFullscreen: "Exit full screen",
};

/** `m:ss`, and no odd decimals while the metadata has not arrived. */
export function Stamp(value: number): string {
  const whole = Number.isFinite(value) ? Math.max(0, Math.round(value)) : 0;
  return `${String(Math.floor(whole / 60))}:${String(whole % 60).padStart(2, "0")}`;
}

"use client";

import { useRef, useState, type CSSProperties, type ReactElement } from "react";

import { Pause, Play } from "../../glyphs/index.js";
import { FILLED, track } from "../../styles/player-controls.css.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { ActionIcon } from "../ActionIcon/ActionIcon.js";
import { Text } from "../Text/Text.js";

import * as styles from "./AudioPlayer.css.js";
import type { AudioPlayerProps } from "./AudioPlayer.types.js";
import { PlayerVolume } from "./components/Volume.js";
import { PLAYER_CONTROLS_LABELS, Stamp } from "./labels.js";

const PERCENT = 100;
const STEP = 0.1;

export function AudioPlayer(props: AudioPlayerProps): ReactElement {
  const { src, label, labels, className, surfaceProps, trackProps, volumeProps, ...style_rest } =
    props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);
  const text = { ...PLAYER_CONTROLS_LABELS, ...labels };

  const audio = useRef<HTMLAudioElement>(null);
  const [playing, set_playing] = useState(false);
  const [time, set_time] = useState(0);
  const [length, set_length] = useState(0);
  const [volume, set_volume] = useState(1);
  const [muted, set_muted] = useState(false);

  const Toggle = (): void => {
    const node = audio.current;
    if (node === null) return;
    if (node.paused) void node.play();
    else node.pause();
  };

  const filled = length > 0 ? Math.min(PERCENT, (time / length) * PERCENT) : 0;

  return (
    <div className={cx(styles.player, sprinkle_class, className)} style={sprinkle_style}>
      <audio
        aria-label={label}
        onDurationChange={(event) => {
          const total = event.currentTarget.duration;
          if (Number.isFinite(total)) set_length(total);
        }}
        onEnded={() => {
          set_playing(false);
          set_time(0);
        }}
        onPause={() => {
          set_playing(false);
        }}
        onPlay={() => {
          set_playing(true);
        }}
        onTimeUpdate={(event) => {
          set_time(event.currentTarget.currentTime);
        }}
        preload="metadata"
        {...surfaceProps}
        ref={audio}
        src={src}
      />

      <ActionIcon
        aria-label={playing ? text.pause : text.play}
        onPress={Toggle}
        size="sm"
        variant="light"
      >
        {playing ? <Pause /> : <Play />}
      </ActionIcon>

      <input
        aria-label={text.seek}
        max={length > 0 ? length : 1}
        min={0}
        onChange={(event) => {
          const node = audio.current;
          const wanted = Number(event.currentTarget.value);
          if (node !== null && Number.isFinite(wanted)) {
            node.currentTime = wanted;
            set_time(wanted);
          }
        }}
        step={STEP}
        type="range"
        value={Math.min(time, length > 0 ? length : 1)}
        {...trackProps}
        className={cx(track, trackProps?.className)}
        style={{ [FILLED]: `${String(filled)}%`, ...trackProps?.style } as CSSProperties}
      />

      <Text c="text.muted" ff="mono" fz="caption">
        {`${Stamp(time)}/${Stamp(length)}`}
      </Text>

      <PlayerVolume
        labels={text}
        muted={muted}
        onMute={() => {
          const next = !muted;
          set_muted(next);
          if (audio.current !== null) audio.current.muted = next;
        }}
        onVolume={(wanted) => {
          set_volume(wanted);
          set_muted(false);
          const node = audio.current;
          if (node !== null) {
            node.volume = wanted;
            node.muted = false;
          }
        }}
        sliderProps={volumeProps}
        volume={volume}
      />
    </div>
  );
}

AudioPlayer.displayName = "AudioPlayer";

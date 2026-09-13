"use client";

import type { ComponentPropsWithoutRef, CSSProperties, ReactElement } from "react";

import { Volume as VolumeGlyph, VolumeOff } from "../../../glyphs/index.js";
import { FILLED, mixer, mixer_slider } from "../../../styles/player-controls.css.js";
import { cx } from "../../../utils/style-props.js";
import { ActionIcon } from "../../ActionIcon/ActionIcon.js";
import { Popover } from "../../Popover/Popover.js";

import type { PlayerControlsLabels } from "../labels.js";

export interface PlayerVolumeProps {
  volume: number;
  muted: boolean;
  onVolume: (volume: number) => void;
  onMute: () => void;
  labels: PlayerControlsLabels;
  size?: "xs" | "sm" | undefined;
  sliderProps?: ComponentPropsWithoutRef<"input"> | undefined;
}

const STEP = 0.05;
const PERCENT = 100;

export function PlayerVolume(props: PlayerVolumeProps): ReactElement {
  const { volume, muted, onVolume, onMute, labels, size = "sm", sliderProps } = props;
  const silent = muted || volume === 0;
  const filled = { [FILLED]: `${String((muted ? 0 : volume) * PERCENT)}%` } as CSSProperties;

  return (
    <Popover
      aria-label={labels.volume}
      padding="sm"
      placement="top"
      withArrow
      trigger={
        <ActionIcon aria-label={labels.volume} size={size} variant="ghost">
          {silent ? <VolumeOff /> : <VolumeGlyph />}
        </ActionIcon>
      }
    >
      <div className={mixer}>
        <input
          aria-label={labels.volume}
          max={1}
          min={0}
          onChange={(event) => {
            onVolume(Number(event.currentTarget.value));
          }}
          step={STEP}
          type="range"
          value={muted ? 0 : volume}
          {...sliderProps}
          className={cx(mixer_slider, sliderProps?.className)}
          style={{ ...filled, ...sliderProps?.style }}
        />
        <ActionIcon
          aria-label={muted ? labels.unmute : labels.mute}
          onPress={onMute}
          pressed={muted}
          pressedVariant="light"
          size="xs"
          variant="ghost"
        >
          {muted ? <VolumeOff /> : <VolumeGlyph />}
        </ActionIcon>
      </div>
    </Popover>
  );
}

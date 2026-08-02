"use client";

import { useMemo, type ReactElement } from "react";

import { assignInlineVars } from "@vanilla-extract/dynamic";
import ReactPlayer from "react-player";

import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { Modal } from "../Modal/Modal.js";

import * as styles from "./Player.css.js";
import type { PlayerProps } from "./Player.types.js";

const DEFAULT_RATIO = 16 / 9;

const PLAYER_LABELS = {
  region: "Reproductor de vídeo",
  close: "Cerrar el reproductor",
} as const;

export function Player(props: PlayerProps): ReactElement {
  const {
    src,
    opened,
    onClose,
    title,
    ratio = DEFAULT_RATIO,
    controls = true,
    playing = false,
    loop = false,
    muted = false,
    volume,
    light = false,
    onReady,
    onEnded,
    onError,
    labels,
    className,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style, rest } = ExtractStyleProps(style_rest);

  const text = useMemo(
    () => (labels === undefined ? PLAYER_LABELS : { ...PLAYER_LABELS, ...labels }),
    [labels],
  );

  const css_vars = assignInlineVars({ [styles.frameRatio]: String(ratio) });

  const frame = (
    <div
      className={cx(styles.frame, sprinkle_class, className)}
      style={{ ...css_vars, ...sprinkle_style }}
      {...rest}
    >
      <ReactPlayer
        className={styles.surface}
        src={src}
        controls={controls}
        playing={playing}
        loop={loop}
        muted={muted}
        light={light}
        width="100%"
        height="100%"
        {...(volume === undefined ? {} : { volume })}
        {...(onReady === undefined ? {} : { onReady })}
        {...(onEnded === undefined ? {} : { onEnded })}
        {...(onError === undefined ? {} : { onError })}
      />
    </div>
  );

  if (opened === undefined) return frame;

  return (
    <Modal
      opened={opened}
      onClose={onClose ?? (() => undefined)}
      size="xl"
      centered
      blurred
      padding="sm"
      closeLabel={text.close}
      {...(title === undefined ? { "aria-label": text.region } : { title })}
    >
      {frame}
    </Modal>
  );
}

Player.displayName = "Player";

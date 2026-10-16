"use client";

import { useCallback, useEffect, useRef, useState, type ReactElement, type Ref } from "react";

import { Maximize, Minimize } from "../../glyphs/index.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { ActionIcon } from "../ActionIcon/ActionIcon.js";
import { Badge } from "../Badge/Badge.js";

import { LIVE_VIDEO_LABELS } from "./labels.js";
import * as styles from "./LiveVideo.css.js";
import type { LiveVideoProps } from "./LiveVideo.types.js";

const CURRENT_DATA = 2;

function Assign(target: Ref<HTMLVideoElement> | undefined, node: HTMLVideoElement | null): void {
  if (typeof target === "function") target(node);
  else if (target !== null && target !== undefined) target.current = node;
}

export function LiveVideo(props: LiveVideoProps): ReactElement {
  const {
    stream,
    fit = "contain",
    label,
    placeholder,
    withFullscreen = false,
    withLiveBadge = false,
    onReady,
    labels,
    className,
    surfaceRef,
    surfaceProps,
    fullscreenProps,
    liveBadgeProps,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);
  const text = { ...LIVE_VIDEO_LABELS, ...labels };

  const shell = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement | null>(null);
  const report = useRef(onReady);
  const announced = useRef(false);
  const [ready, set_ready] = useState(false);
  const [full, set_full] = useState(false);

  const Attach = useCallback(
    (node: HTMLVideoElement | null) => {
      video.current = node;
      Assign(surfaceRef, node);
    },
    [surfaceRef],
  );

  useEffect(() => {
    report.current = onReady;
  });

  useEffect(() => {
    if (announced.current === ready) return;
    announced.current = ready;
    report.current?.(ready);
  }, [ready]);

  useEffect(() => {
    const node = video.current;
    if (node === null) return;
    const next = stream ?? null;
    if (node.srcObject !== next) {
      node.srcObject = next;
      if (next !== null) void node.play().catch(() => undefined);
    }
    set_ready(next !== null && node.readyState >= CURRENT_DATA);
    if (next === null) return;
    const Show = (): void => {
      set_ready(true);
    };
    const Hide = (): void => {
      set_ready(false);
    };
    node.addEventListener("loadeddata", Show);
    node.addEventListener("emptied", Hide);
    return () => {
      node.removeEventListener("loadeddata", Show);
      node.removeEventListener("emptied", Hide);
    };
  }, [stream]);

  useEffect(() => {
    if (!withFullscreen) return;
    const Sync = (): void => {
      set_full(document.fullscreenElement === shell.current);
    };
    document.addEventListener("fullscreenchange", Sync);
    return () => {
      document.removeEventListener("fullscreenchange", Sync);
    };
  }, [withFullscreen]);

  const Full = (): void => {
    const node = shell.current;
    if (node === null) return;
    if (document.fullscreenElement === node) void document.exitFullscreen();
    else void node.requestFullscreen().catch(() => undefined);
  };

  const has_placeholder = placeholder !== null && placeholder !== undefined;

  return (
    <div className={cx(styles.shell, sprinkle_class, className)} ref={shell} style={sprinkle_style}>
      <video
        aria-label={label}
        autoPlay
        muted
        playsInline
        {...surfaceProps}
        className={cx(styles.video, surfaceProps?.className)}
        data-fit={fit}
        data-ready={ready}
        ref={Attach}
      />

      {ready || !has_placeholder ? null : <div className={styles.placeholder}>{placeholder}</div>}

      {withLiveBadge && ready ? (
        <div className={styles.badge}>
          <Badge color="error" size="sm" variant="filled" {...liveBadgeProps}>
            {text.live}
          </Badge>
        </div>
      ) : null}

      {withFullscreen ? (
        <div className={styles.grow}>
          <ActionIcon
            aria-label={full ? text.exitFullscreen : text.fullscreen}
            glass="strong"
            onPress={Full}
            pressed={full}
            pressedVariant="light"
            size="sm"
            variant="glass"
            {...fullscreenProps}
          >
            {full ? <Minimize /> : <Maximize />}
          </ActionIcon>
        </div>
      ) : null}
    </div>
  );
}

LiveVideo.displayName = "LiveVideo";

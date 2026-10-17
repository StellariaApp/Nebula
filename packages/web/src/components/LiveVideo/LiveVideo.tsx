"use client";

import { useCallback, useEffect, useRef, useState, type ReactElement, type ReactNode, type Ref } from "react";

import { Maximize, Minimize } from "../../glyphs/index.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { ActionIcon } from "../ActionIcon/ActionIcon.js";
import { Badge } from "../Badge/Badge.js";
import { Box } from "../Box/Box.js";

import { LIVE_VIDEO_LABELS } from "./labels.js";
import * as styles from "./LiveVideo.css.js";
import type { LiveVideoCorner, LiveVideoProps } from "./LiveVideo.types.js";

const CURRENT_DATA = 2;
const IDLE_DELAY = 2500;

const CORNERS: readonly LiveVideoCorner[] = ["topStart", "topEnd", "bottomStart", "bottomEnd"];

const CORNER_CLASS: Record<LiveVideoCorner, string> = {
  topStart: styles.top_start,
  topEnd: styles.top_end,
  bottomStart: styles.bottom_start,
  bottomEnd: styles.bottom_end,
};

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
    overlay,
    overlayMode = "auto",
    idleDelay = IDLE_DELAY,
    pinned,
    overlayProps,
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
  const [awake, set_awake] = useState(false);
  const sleep = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  useEffect(
    () => () => {
      if (sleep.current !== null) clearTimeout(sleep.current);
    },
    [],
  );

  const Wake = (): void => {
    if (overlayMode !== "auto") return;
    set_awake(true);
    if (sleep.current !== null) clearTimeout(sleep.current);
    sleep.current = setTimeout(() => {
      set_awake(false);
    }, idleDelay);
  };

  const Rest = (): void => {
    if (sleep.current !== null) clearTimeout(sleep.current);
    set_awake(false);
  };

  const fullscreen = withFullscreen ? (
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
  ) : null;

  const content: Partial<Record<LiveVideoCorner, ReactNode>> = {
    ...overlay,
    topEnd:
      fullscreen === null ? overlay?.topEnd : (
        <>
          {fullscreen}
          {overlay?.topEnd}
        </>
      ),
  };
  const badge =
    withLiveBadge && ready ? (
      <Badge color="error" size="sm" variant="filled" {...liveBadgeProps}>
        {text.live}
      </Badge>
    ) : null;
  const used = CORNERS.filter((at) => content[at] !== null && content[at] !== undefined);
  const has_top = used.some((at) => at.startsWith("top"));
  const has_bottom = used.some((at) => at.startsWith("bottom"));

  return (
    <div
      className={cx(styles.shell, sprinkle_class, className)}
      data-awake={overlayMode === "always" || awake}
      data-mode={overlayMode}
      onPointerLeave={Rest}
      onPointerMove={Wake}
      ref={shell}
      style={sprinkle_style}
    >
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

      {used.length === 0 && badge === null ? null : (
        <Box {...overlayProps} className={cx(styles.layer, overlayProps?.className)}>
          {has_top ? <div className={styles.scrim_top} /> : null}
          {has_bottom ? <div className={styles.scrim_bottom} /> : null}
          {CORNERS.map((at) => {
            const lead = at === "topStart" ? badge : null;
            const own = content[at];
            if (lead === null && (own === null || own === undefined)) return null;
            return (
              <div className={cx(styles.slot, CORNER_CLASS[at])} data-corner={at} key={at}>
                {lead}
                {own === null || own === undefined ? null : (
                  <div className={styles.corner} data-pinned={pinned?.includes(at) === true}>
                    {own}
                  </div>
                )}
              </div>
            );
          })}
        </Box>
      )}
    </div>
  );
}

LiveVideo.displayName = "LiveVideo";

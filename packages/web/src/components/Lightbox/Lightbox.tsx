"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type KeyboardEvent,
  type PointerEvent,
  type ReactElement,
  type WheelEvent,
} from "react";

import { useUncontrolled } from "@stellaria/nebula-hooks";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { cx } from "../../utils/style-props.js";
import { ActionIcon } from "../ActionIcon/ActionIcon.js";
import { Modal } from "../Modal/Modal.js";
import { VisuallyHidden } from "../VisuallyHidden/VisuallyHidden.js";

import * as styles from "./Lightbox.css.js";
import * as lightbox_vars from "./Lightbox.vars.css.js";
import { LIGHTBOX_LABELS } from "./labels.js";
import type { LightboxProps } from "./Lightbox.types.js";
import { ZOOM_CONSTANTS, useZoomPan } from "./useZoomPan.js";

const DEFAULT_INTERVAL = 4000;
const DEFAULT_MAX_ZOOM = 4;
const PERCENT = 100;

const Icon = (path: string): ReactElement => (
  <svg
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path d={path} />
  </svg>
);

const PREV = Icon("M15 18l-6-6 6-6");
const NEXT = Icon("M9 18l6-6-6-6");
const ZOOM_IN = Icon("M11 3a8 8 0 108 8 8 8 0 00-8-8zm0 5v6m-3-3h6m6 10l-4.35-4.35");
const ZOOM_OUT = Icon("M11 3a8 8 0 108 8 8 8 0 00-8-8zm-3 8h6m6 10l-4.35-4.35");
const PLAY = Icon("M6 4l14 8-14 8V4z");
const PAUSE = Icon("M7 4v16M17 4v16");

export function Lightbox(props: LightboxProps): ReactElement {
  const {
    images,
    opened,
    onClose,
    index,
    defaultIndex = 0,
    onIndexChange,
    withZoom = true,
    withSlideshow = false,
    withThumbnails = false,
    slideshowInterval = DEFAULT_INTERVAL,
    maxZoom = DEFAULT_MAX_ZOOM,
    labels,
    className,
  } = props;

  const text = useMemo(
    () => (labels === undefined ? LIGHTBOX_LABELS : { ...LIGHTBOX_LABELS, ...labels }),
    [labels],
  );

  const [current, set_current] = useUncontrolled(index, defaultIndex, onIndexChange);
  const [playing, set_playing] = useState(false);
  const zoom = useZoomPan(maxZoom);

  const total = images.length;
  const safe = total === 0 ? 0 : Math.min(Math.max(current, 0), total - 1);
  const image = images[safe];

  const Go = useCallback(
    (next: number): void => {
      if (total === 0) return;
      zoom.Reset();
      set_current((next + total) % total);
    },
    [total, zoom, set_current],
  );

  const ResetZoom = zoom.Reset;

  useEffect(() => {
    if (opened) return;
    set_playing(false);
    ResetZoom();
  }, [opened, ResetZoom]);

  useEffect(() => {
    if (!playing || !opened || total < 2) return;
    const timer = window.setInterval(() => {
      Go(safe + 1);
    }, slideshowInterval);
    return () => {
      window.clearInterval(timer);
    };
  }, [playing, opened, total, safe, slideshowInterval, Go]);

  const OnKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    const { key } = event;
    if (key === "ArrowLeft" && !zoom.zoomed) {
      event.preventDefault();
      Go(safe - 1);
      return;
    }
    if (key === "ArrowRight" && !zoom.zoomed) {
      event.preventDefault();
      Go(safe + 1);
      return;
    }
    if (!withZoom) return;
    if (key === "+" || key === "=") {
      event.preventDefault();
      zoom.ZoomBy(ZOOM_CONSTANTS.ZOOM_STEP);
      return;
    }
    if (key === "-") {
      event.preventDefault();
      zoom.ZoomBy(-ZOOM_CONSTANTS.ZOOM_STEP);
      return;
    }
    if (key === "0") {
      event.preventDefault();
      zoom.Reset();
      return;
    }
    if (!zoom.zoomed) return;
    const step = ZOOM_CONSTANTS.PAN_STEP;
    if (key === "ArrowLeft") zoom.PanBy(step, 0);
    if (key === "ArrowRight") zoom.PanBy(-step, 0);
    if (key === "ArrowUp") zoom.PanBy(0, step);
    if (key === "ArrowDown") zoom.PanBy(0, -step);
  };

  const OnWheel = (event: WheelEvent<HTMLDivElement>): void => {
    if (!withZoom) return;
    zoom.ZoomBy(event.deltaY < 0 ? ZOOM_CONSTANTS.ZOOM_STEP : -ZOOM_CONSTANTS.ZOOM_STEP);
  };

  const OnPointerDown = (event: PointerEvent<HTMLDivElement>): void => {
    if (!withZoom || !zoom.zoomed) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    zoom.StartPan(event.clientX, event.clientY);
  };

  const OnPointerMove = (event: PointerEvent<HTMLDivElement>): void => {
    if (!zoom.panning) return;
    zoom.MovePan(event.clientX, event.clientY);
  };

  const css_vars = assignInlineVars({
    [lightbox_vars.imageTransform]: `translate3d(${String(zoom.state.x)}px, ${String(zoom.state.y)}px, 0) scale(${String(zoom.state.scale)})`,
  });

  const percent = Math.round(zoom.state.scale * PERCENT);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size="xl"
      centered
      blurred
      closeLabel={text.close}
      aria-label={text.region}
      {...(className === undefined ? {} : { className })}
    >
      {image === undefined ? (
        <p className={styles.empty}>{text.counter(0, 0)}</p>
      ) : (
        <>
          <div
            className={styles.stage}
            style={css_vars}
            tabIndex={0}
            role="group"
            aria-label={text.region}
            data-zoomed={zoom.zoomed ? "true" : "false"}
            data-panning={zoom.panning ? "true" : "false"}
            onKeyDown={OnKeyDown}
            onWheel={OnWheel}
            onPointerDown={OnPointerDown}
            onPointerMove={OnPointerMove}
            onPointerUp={zoom.EndPan}
            onPointerCancel={zoom.EndPan}
            onDoubleClick={withZoom ? zoom.Toggle : undefined}
          >
            <img
              className={styles.image}
              src={image.src}
              alt={image.alt ?? ""}
              data-panning={zoom.panning ? "true" : "false"}
              draggable={false}
            />
          </div>

          {image.caption === undefined ? null : <p className={styles.caption}>{image.caption}</p>}

          <div className={styles.bar}>
            <div className={styles.group}>
              <ActionIcon
                variant="ghost"
                size="sm"
                aria-label={text.previous}
                disabled={total < 2}
                onPress={() => {
                  Go(safe - 1);
                }}
              >
                {PREV}
              </ActionIcon>
              <span className={styles.counter}>{text.counter(safe + 1, total)}</span>
              <ActionIcon
                variant="ghost"
                size="sm"
                aria-label={text.next}
                disabled={total < 2}
                onPress={() => {
                  Go(safe + 1);
                }}
              >
                {NEXT}
              </ActionIcon>
            </div>

            <div className={styles.group}>
              {withSlideshow ? (
                <ActionIcon
                  variant="ghost"
                  size="sm"
                  aria-label={playing ? text.pause : text.play}
                  disabled={total < 2}
                  onPress={() => {
                    set_playing((value) => !value);
                  }}
                >
                  {playing ? PAUSE : PLAY}
                </ActionIcon>
              ) : null}
              {withZoom ? (
                <>
                  <ActionIcon
                    variant="ghost"
                    size="sm"
                    aria-label={text.zoomOut}
                    disabled={!zoom.zoomed}
                    onPress={() => {
                      zoom.ZoomBy(-ZOOM_CONSTANTS.ZOOM_STEP);
                    }}
                  >
                    {ZOOM_OUT}
                  </ActionIcon>
                  <ActionIcon
                    variant="ghost"
                    size="sm"
                    aria-label={text.zoomIn}
                    disabled={zoom.state.scale >= maxZoom}
                    onPress={() => {
                      zoom.ZoomBy(ZOOM_CONSTANTS.ZOOM_STEP);
                    }}
                  >
                    {ZOOM_IN}
                  </ActionIcon>
                  <VisuallyHidden aria-live="polite">{text.zoomLevel(percent)}</VisuallyHidden>
                </>
              ) : null}
            </div>
          </div>

          {withThumbnails && total > 1 ? (
            <ul className={styles.filmstrip}>
              {images.map((item, position) => (
                <li key={item.src}>
                  <button
                    type="button"
                    className={cx(styles.thumb)}
                    aria-label={text.counter(position + 1, total)}
                    aria-current={position === safe ? "true" : undefined}
                    onClick={() => {
                      Go(position);
                    }}
                  >
                    <img
                      className={styles.thumb_image}
                      src={item.thumbnail ?? item.src}
                      alt=""
                      draggable={false}
                    />
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </>
      )}
    </Modal>
  );
}

Lightbox.displayName = "Lightbox";

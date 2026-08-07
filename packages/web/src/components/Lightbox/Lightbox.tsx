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
import { ChevronLeft, ChevronRight, Glyph } from "../../glyphs/index.js";
import { Box } from "../Box/Box.js";
import { Text } from "../Text/Text.js";

const DEFAULT_INTERVAL = 4000;
const DEFAULT_MAX_ZOOM = 4;
const PERCENT = 100;

const Icon = (path: string): ReactElement => (
  <Glyph>
    <path d={path} />
  </Glyph>
);

const PREV = <ChevronLeft />;
const NEXT = <ChevronRight />;
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
    emptyProps,
    stageProps,
    imageProps,
    captionProps,
    barProps,
    groupProps,
    counterProps,
    filmstripProps,
    thumbProps,
    thumbImageProps,
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
        <Text {...emptyProps} className={cx(styles.empty, emptyProps?.className)}>
          {text.counter(0, 0)}
        </Text>
      ) : (
        <>
          <div
            {...stageProps}
            className={cx(styles.stage, stageProps?.className)}
            style={{ ...css_vars, ...stageProps?.style }}
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
              {...imageProps}
              className={cx(styles.image, imageProps?.className)}
              src={image.src}
              alt={image.alt ?? ""}
              data-panning={zoom.panning ? "true" : "false"}
              draggable={false}
            />
          </div>

          {image.caption === undefined ? null : (
            <Text {...captionProps} className={cx(styles.caption, captionProps?.className)}>
              {image.caption}
            </Text>
          )}

          <Box {...barProps} className={cx(styles.bar, barProps?.className)}>
            <Box {...groupProps} className={cx(styles.group, groupProps?.className)}>
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
              <Text
                component="span"
                {...counterProps}
                className={cx(styles.counter, counterProps?.className)}
              >
                {text.counter(safe + 1, total)}
              </Text>
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
            </Box>

            <Box {...groupProps} className={cx(styles.group, groupProps?.className)}>
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
            </Box>
          </Box>

          {withThumbnails && total > 1 ? (
            <Box
              component="ul"
              {...filmstripProps}
              className={cx(styles.filmstrip, filmstripProps?.className)}
            >
              {images.map((item, position) => (
                <li key={item.src}>
                  <button
                    type="button"
                    {...thumbProps}
                    className={cx(styles.thumb, thumbProps?.className)}
                    aria-label={text.counter(position + 1, total)}
                    aria-current={position === safe ? "true" : undefined}
                    onClick={() => {
                      Go(position);
                    }}
                  >
                    <img
                      {...thumbImageProps}
                      className={cx(styles.thumb_image, thumbImageProps?.className)}
                      src={item.thumbnail ?? item.src}
                      alt=""
                      draggable={false}
                    />
                  </button>
                </li>
              ))}
            </Box>
          ) : null}
        </>
      )}
    </Modal>
  );
}

Lightbox.displayName = "Lightbox";

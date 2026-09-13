"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactElement,
  type TouchEvent as ReactTouchEvent,
  type TouchList as ReactTouchList,
  type WheelEvent as ReactWheelEvent,
} from "react";

import { ChevronLeft, ChevronRight, Close, UploadCloud } from "../../glyphs/index.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { ActionIcon } from "../ActionIcon/ActionIcon.js";
import { Box } from "../Box/Box.js";
import { FocusTrap } from "../FocusTrap/FocusTrap.js";
import { Portal } from "../Portal/Portal.js";
import { Text } from "../Text/Text.js";

import { VIEWER_LABELS } from "./labels.js";
import * as styles from "./Viewer.css.js";
import type { ViewerProps } from "./Viewer.types.js";

const MAX_SCALE = 4;
const TAP_SCALE = 2.5;
const WHEEL_STEP = 0.3;
const DRAG_SLOP = 6;
const PERCENT = 100;
const INTERACTIVE = "button, a";
const MEDIA = "img, video";

const Clamp = (value: number, top: number): number =>
  Math.min(Math.max(value, 0), Math.max(top, 0));

const Spread = (touches: ReactTouchList): number => {
  const first = touches[0];
  const second = touches[1];
  if (first === undefined || second === undefined) return 1;
  return Math.hypot(first.clientX - second.clientX, first.clientY - second.clientY);
};

export function Viewer(props: ViewerProps): ReactElement | null {
  const {
    images,
    index,
    onIndexChange,
    opened,
    onClose,
    caption,
    actions,
    withDownload = false,
    labels,
    className,
    stageProps,
    imageProps,
    barProps,
    counterProps,
    stripProps,
    thumbProps,
    thumbImageProps,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);
  const text = { ...VIEWER_LABELS, ...labels };

  const [offset, set_offset] = useState(index);
  const [dragging, set_dragging] = useState(false);
  const [scale, set_scale] = useState(1);
  const [pan, set_pan] = useState({ x: 0, y: 0 });

  const stage = useRef<HTMLDivElement>(null);
  const strip = useRef<HTMLDivElement>(null);
  const live = useRef(index);
  const origin = useRef({ offset: 0, x: 0 });
  const grab = useRef<{ ox: number; oy: number; x: number; y: number } | null>(null);
  const pinch = useRef<{ scale: number; spread: number } | null>(null);
  const held = useRef(false);
  const moved = useRef(false);
  const backdrop = useRef(false);

  const last = images.length - 1;
  const zoomed = scale > 1;

  const Reset = useCallback((): void => {
    set_scale(1);
    set_pan({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    Reset();
  }, [Reset, index, opened]);

  useEffect(() => {
    if (held.current) return;
    live.current = index;
    set_offset(index);
  }, [index]);

  useEffect(() => {
    if (!opened) return;
    const OnKey = (event: KeyboardEvent): void => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft" && index > 0) onIndexChange(index - 1);
      if (event.key === "ArrowRight" && index < last) onIndexChange(index + 1);
    };
    window.addEventListener("keydown", OnKey);
    return () => {
      window.removeEventListener("keydown", OnKey);
    };
  }, [index, last, onClose, onIndexChange, opened]);

  useEffect(() => {
    const node = strip.current;
    if (node === null) return;
    const active = node.querySelector<HTMLElement>("[aria-current='true']");
    if (active === null) return;
    node.scrollTo({ left: active.offsetLeft - node.clientWidth / 2 + active.offsetWidth / 2 });
  }, [index, opened]);

  if (!opened || images.length === 0) return null;

  const position = Clamp(index, last);
  const current = images[position];
  if (current === undefined) return null;

  const Zoom = (next: number): void => {
    const value = Math.min(Math.max(next, 1), MAX_SCALE);
    set_scale(value);
    if (value === 1) set_pan({ x: 0, y: 0 });
  };

  const Settle = (): void => {
    if (!held.current) return;
    held.current = false;
    set_dragging(false);
    const landed = Clamp(Math.round(live.current), last);
    live.current = landed;
    set_offset(landed);
    if (landed !== index) onIndexChange(landed);
  };

  const Slide = (x: number): void => {
    const width = stage.current?.clientWidth ?? 1;
    if (Math.abs(x - origin.current.x) > DRAG_SLOP) moved.current = true;
    const next = Clamp(origin.current.offset - (x - origin.current.x) / width, last);
    live.current = next;
    set_offset(next);
    const rounded = Clamp(Math.round(next), last);
    if (rounded !== index) onIndexChange(rounded);
  };

  const OnPointerDown = (event: ReactPointerEvent): void => {
    const target = event.target as HTMLElement;
    const interactive = target.closest(INTERACTIVE) !== null;
    backdrop.current = !interactive && target.closest(MEDIA) === null;
    if (interactive) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    moved.current = false;
    if (zoomed) {
      grab.current = { ox: pan.x, oy: pan.y, x: event.clientX, y: event.clientY };
      return;
    }
    held.current = true;
    origin.current = { offset: live.current, x: event.clientX };
    set_dragging(true);
  };

  const OnPointerMove = (event: ReactPointerEvent): void => {
    if (pinch.current !== null) return;
    if (grab.current !== null) {
      moved.current = true;
      set_pan({
        x: grab.current.ox + (event.clientX - grab.current.x),
        y: grab.current.oy + (event.clientY - grab.current.y),
      });
      return;
    }
    if (held.current) Slide(event.clientX);
  };

  const Release = (): void => {
    grab.current = null;
    pinch.current = null;
    Settle();
  };

  const OnTouchStart = (event: ReactTouchEvent): void => {
    if (event.touches.length !== 2) return;
    Settle();
    grab.current = null;
    pinch.current = { scale, spread: Spread(event.touches) };
  };

  const OnTouchMove = (event: ReactTouchEvent): void => {
    if (pinch.current === null || event.touches.length !== 2) return;
    Zoom(pinch.current.scale * (Spread(event.touches) / pinch.current.spread));
  };

  const OnStageClick = (event: ReactMouseEvent): void => {
    if (zoomed || moved.current || !backdrop.current) return;
    if ((event.target as HTMLElement).closest(INTERACTIVE) !== null) return;
    onClose();
  };

  const Step = (delta: number): void => {
    const next = Clamp(position + delta, last);
    if (next !== position) onIndexChange(next);
  };

  const several = images.length > 1;

  return (
    <Portal>
      <FocusTrap autoFocus restoreFocus>
        <div
          aria-label={text.region}
          aria-modal
          className={cx(styles.overlay, sprinkle_class, className)}
          role="dialog"
          style={sprinkle_style}
        >
          <Box {...barProps} className={cx(styles.bar, barProps?.className)}>
            {!several && caption === undefined ? (
              <span />
            ) : (
              <div className={styles.heading}>
                {several ? (
                  <Text c="text.secondary" ff="mono" fz="caption" {...counterProps}>
                    {text.counter(position + 1, images.length)}
                  </Text>
                ) : null}
                {caption === undefined ? null : (
                  <Text c="text.secondary" fz="caption" truncate>
                    {caption}
                  </Text>
                )}
              </div>
            )}

            <div className={styles.actions}>
              {actions}
              {withDownload ? (
                <a
                  aria-label={text.download}
                  className={styles.download}
                  download
                  href={current.src}
                  rel="noreferrer"
                  target="_blank"
                >
                  <UploadCloud style={{ transform: "scaleY(-1)" }} />
                </a>
              ) : null}
              <ActionIcon aria-label={text.close} onPress={onClose} variant="glass">
                <Close />
              </ActionIcon>
            </div>
          </Box>

          <Box
            data-zoomed={zoomed}
            onClick={OnStageClick}
            onDoubleClick={() => {
              Zoom(zoomed ? 1 : TAP_SCALE);
            }}
            onPointerCancel={Release}
            onPointerDown={OnPointerDown}
            onPointerMove={OnPointerMove}
            onPointerUp={Release}
            onTouchEnd={Release}
            onTouchMove={OnTouchMove}
            onTouchStart={OnTouchStart}
            onWheel={(event: ReactWheelEvent) => {
              Zoom(scale + (event.deltaY < 0 ? WHEEL_STEP : -WHEEL_STEP));
            }}
            {...stageProps}
            className={cx(styles.stage, stageProps?.className)}
            ref={stage}
          >
            <div
              className={styles.track}
              data-dragging={dragging}
              style={{ transform: `translate3d(${String(offset * -PERCENT)}%, 0, 0)` }}
            >
              {images.map((image) => (
                <div className={styles.slide} key={image.src}>
                  <img
                    alt={image.alt}
                    draggable={false}
                    src={image.src}
                    {...imageProps}
                    className={cx(styles.piece, imageProps?.className)}
                  />
                </div>
              ))}
            </div>

            {zoomed ? (
              <div className={styles.zoom}>
                <img
                  alt=""
                  className={styles.piece}
                  draggable={false}
                  src={current.src}
                  style={{
                    transform: `translate3d(${String(pan.x)}px, ${String(pan.y)}px, 0) scale(${String(scale)})`,
                  }}
                />
              </div>
            ) : null}

            {several && !zoomed ? (
              <>
                {position === 0 ? null : (
                  <button
                    aria-label={text.previous}
                    className={styles.arrow_start}
                    onClick={() => {
                      Step(-1);
                    }}
                    type="button"
                  >
                    <ChevronLeft />
                  </button>
                )}
                {position === last ? null : (
                  <button
                    aria-label={text.next}
                    className={styles.arrow_end}
                    onClick={() => {
                      Step(1);
                    }}
                    type="button"
                  >
                    <ChevronRight />
                  </button>
                )}
              </>
            ) : null}
          </Box>

          {several ? (
            <Box
              aria-label={text.region}
              role="group"
              {...stripProps}
              className={cx(styles.strip, stripProps?.className)}
              ref={strip}
            >
              {images.map((image, slide) => (
                <button
                  aria-current={slide === position ? "true" : undefined}
                  aria-label={image.alt}
                  key={`thumb-${image.src}`}
                  onClick={() => {
                    onIndexChange(slide);
                  }}
                  type="button"
                  {...thumbProps}
                  className={cx(styles.thumb, thumbProps?.className)}
                >
                  <img
                    alt=""
                    src={image.thumbnail ?? image.src}
                    {...thumbImageProps}
                    className={cx(styles.thumb_image, thumbImageProps?.className)}
                  />
                </button>
              ))}
            </Box>
          ) : null}
        </div>
      </FocusTrap>
    </Portal>
  );
}

Viewer.displayName = "Viewer";

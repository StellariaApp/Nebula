"use client";

import { useCallback, useEffect, useMemo, useState, type ReactElement } from "react";

import { assignInlineVars } from "@vanilla-extract/dynamic";
import useEmblaCarousel from "embla-carousel-react";
import { useReducedMotion } from "motion/react";

import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { LengthToCss } from "../../utils/token-css.js";
import { ActionIcon } from "../ActionIcon/ActionIcon.js";

import * as styles from "./Carousel.css.js";
import { CAROUSEL_LABELS } from "./labels.js";
import type { CarouselProps } from "./Carousel.types.js";

const CHEVRON_LEFT = (
  <svg
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

const CHEVRON_RIGHT = (
  <svg
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path d="M9 18l6-6-6-6" />
  </svg>
);

export function Carousel<T>(props: CarouselProps<T>): ReactElement {
  const {
    items,
    getKey,
    renderItem,
    slideSize = "100%",
    gap = "sm",
    align = "start",
    loop = false,
    dragFree = false,
    axis = "x",
    withControls = true,
    withIndicators = false,
    slidesToScroll = 1,
    index,
    defaultIndex = 0,
    onIndexChange,
    empty,
    label,
    labels,
    className,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style, rest } = ExtractStyleProps(style_rest);

  const text = useMemo(
    () => (labels === undefined ? CAROUSEL_LABELS : { ...CAROUSEL_LABELS, ...labels }),
    [labels],
  );
  const reduced = useReducedMotion() === true;

  const [viewport_ref, embla] = useEmblaCarousel({
    axis,
    align,
    loop,
    dragFree,
    slidesToScroll,
    startIndex: index ?? defaultIndex,
    duration: reduced ? 0 : 25,
  });

  const [selected, set_selected] = useState(index ?? defaultIndex);
  const [can_prev, set_can_prev] = useState(false);
  const [can_next, set_can_next] = useState(false);

  const Sync = useCallback(() => {
    if (!embla) return;
    set_selected(embla.selectedScrollSnap());
    set_can_prev(embla.canScrollPrev());
    set_can_next(embla.canScrollNext());
  }, [embla]);

  useEffect(() => {
    if (!embla) return;
    Sync();
    embla.on("select", Sync);
    embla.on("reInit", Sync);
    return () => {
      embla.off("select", Sync);
      embla.off("reInit", Sync);
    };
  }, [embla, Sync]);

  useEffect(() => {
    if (!embla) return;
    const Notify = (): void => {
      onIndexChange?.(embla.selectedScrollSnap());
    };
    embla.on("select", Notify);
    return () => {
      embla.off("select", Notify);
    };
  }, [embla, onIndexChange]);

  useEffect(() => {
    if (!embla || index === undefined) return;
    if (index === embla.selectedScrollSnap()) return;
    embla.scrollTo(index, reduced);
  }, [embla, index, reduced]);

  const css_vars = assignInlineVars({ [styles.slideSize]: LengthToCss(slideSize) });
  const total = items.length;

  return (
    <section
      className={cx(styles.carousel, styles.gap[gap], sprinkle_class, className)}
      style={{ ...css_vars, ...sprinkle_style }}
      aria-roledescription="carousel"
      aria-label={label ?? text.region}
      {...rest}
    >
      <div className={styles.viewport} ref={viewport_ref}>
        <div className={styles.container} data-axis={axis}>
          {total === 0 && empty !== undefined ? <p className={styles.emptySlot}>{empty}</p> : null}
          {items.map((item, position) => (
            <div
              key={getKey(item, position)}
              className={styles.slide}
              role="group"
              aria-roledescription="slide"
              aria-label={text.slide(position + 1, total)}
            >
              {renderItem(item, position)}
            </div>
          ))}
        </div>
      </div>

      {withControls || withIndicators ? (
        <div className={styles.controls}>
          {withControls ? (
            <ActionIcon
              variant="ghost"
              size="sm"
              aria-label={text.previous}
              disabled={!can_prev}
              onPress={() => embla?.scrollPrev()}
            >
              {CHEVRON_LEFT}
            </ActionIcon>
          ) : null}

          {withIndicators ? (
            <ul className={styles.indicators}>
              {items.map((item, position) => (
                <li key={getKey(item, position)}>
                  <button
                    type="button"
                    className={styles.indicator}
                    aria-label={text.goTo(position + 1)}
                    aria-current={position === selected ? "true" : undefined}
                    onClick={() => embla?.scrollTo(position, reduced)}
                  />
                </li>
              ))}
            </ul>
          ) : null}

          {withControls ? (
            <ActionIcon
              variant="ghost"
              size="sm"
              aria-label={text.next}
              disabled={!can_next}
              onPress={() => embla?.scrollNext()}
            >
              {CHEVRON_RIGHT}
            </ActionIcon>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

Carousel.displayName = "Carousel";

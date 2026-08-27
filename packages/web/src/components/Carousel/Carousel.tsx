"use client";

import { useCallback, useEffect, useMemo, useState, type ReactElement } from "react";

import { assignInlineVars } from "@vanilla-extract/dynamic";
import useEmblaCarousel from "embla-carousel-react";

import { useMediaQuery } from "@stellaria/nebula-hooks";

import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { LengthToCss } from "../../utils/token-css.js";
import { ActionIcon } from "../ActionIcon/ActionIcon.js";
import { Box } from "../Box/Box.js";
import { Text } from "../Text/Text.js";

import * as styles from "./Carousel.css.js";
import * as carousel_vars from "./Carousel.vars.css.js";
import { CAROUSEL_LABELS } from "./labels.js";
import type { CarouselProps } from "./Carousel.types.js";
import { ChevronLeft, ChevronRight } from "../../glyphs/index.js";

const CHEVRON_LEFT = <ChevronLeft />;

const CHEVRON_RIGHT = <ChevronRight />;

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
    duration = 25,
    containScroll = "trimSnaps",
    index,
    defaultIndex = 0,
    onIndexChange,
    empty,
    label,
    labels,
    className,
    slideProps,
    emptyProps,
    controlsProps,
    indicatorsProps,
    indicatorProps,
    previousProps,
    nextProps,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style, rest } = ExtractStyleProps(style_rest);

  const text = useMemo(
    () => (labels === undefined ? CAROUSEL_LABELS : { ...CAROUSEL_LABELS, ...labels }),
    [labels],
  );
  // La consulta, sin motion: es lo unico que se usaba de la libreria en este fichero.
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");

  const [start_index] = useState(index ?? defaultIndex);

  const [viewport_ref, embla] = useEmblaCarousel({
    axis,
    align,
    loop,
    dragFree,
    slidesToScroll,
    containScroll,
    startIndex: start_index,
    duration: reduced ? 0 : duration,
  });

  const [selected, set_selected] = useState(start_index);
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

  const css_vars = assignInlineVars({ [carousel_vars.slideSize]: LengthToCss(slideSize) });
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
          {total === 0 && empty !== undefined ? (
            <Text {...emptyProps} className={cx(styles.empty_slot, emptyProps?.className)}>
              {empty}
            </Text>
          ) : null}
          {items.map((item, position) => (
            <Box
              key={getKey(item, position)}

              aria-roledescription="slide"
              aria-label={text.slide(position + 1, total)}
              {...slideProps}
              role="group"
              className={cx(styles.slide, slideProps?.className)}
            >
              {renderItem(item, position)}
            </Box>
          ))}
        </div>
      </div>

      {withControls || withIndicators ? (
        <Box {...controlsProps} className={cx(styles.controls, controlsProps?.className)}>
          {withControls ? (
            <ActionIcon
              variant="ghost"
              size="sm"
              aria-label={text.previous}
              disabled={!can_prev}
              onPress={() => embla?.scrollPrev()}
              {...previousProps}
            >
              {CHEVRON_LEFT}
            </ActionIcon>
          ) : null}

          {withIndicators ? (
            <ul {...indicatorsProps} className={cx(styles.indicators, indicatorsProps?.className)}>
              {items.map((item, position) => (
                <li key={getKey(item, position)}>
                  <button
                    type="button"
                    aria-label={text.goTo(position + 1)}
                    aria-current={position === selected ? "true" : undefined}
                    onClick={() => embla?.scrollTo(position, reduced)}
                    {...indicatorProps}
                    className={cx(styles.indicator, indicatorProps?.className)}
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
              {...nextProps}
            >
              {CHEVRON_RIGHT}
            </ActionIcon>
          ) : null}
        </Box>
      ) : null}
    </section>
  );
}

Carousel.displayName = "Carousel";

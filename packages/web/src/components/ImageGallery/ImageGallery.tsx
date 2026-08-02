"use client";

import { useMemo, useState, type ReactElement } from "react";

import { assignInlineVars } from "@vanilla-extract/dynamic";

import { vars } from "../../theme/contract.css.js";

import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { LIGHTBOX_LABELS } from "../Lightbox/labels.js";
import { Lightbox } from "../Lightbox/Lightbox.js";

import * as styles from "./ImageGallery.css.js";
import type { ImageGalleryProps } from "./ImageGallery.types.js";

const DEFAULT_MIN_COL = 160;
const DEFAULT_RATIO = 4 / 3;

export function ImageGallery(props: ImageGalleryProps): ReactElement {
  const {
    images,
    cols,
    minColWidth = DEFAULT_MIN_COL,
    gap = "sm",
    ratio = DEFAULT_RATIO,
    radius = "md",
    withLightbox = true,
    withThumbnails = true,
    withSlideshow = false,
    onSelect,
    label,
    empty,
    labels,
    className,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style, rest } = ExtractStyleProps(style_rest);

  const [opened, set_opened] = useState(false);
  const [index, set_index] = useState(0);

  const text = useMemo(
    () => (labels === undefined ? LIGHTBOX_LABELS : { ...LIGHTBOX_LABELS, ...labels }),
    [labels],
  );

  const css_vars = assignInlineVars({
    [styles.columns]:
      cols === undefined
        ? `repeat(auto-fill, minmax(${String(minColWidth)}px, 1fr))`
        : `repeat(${String(cols)}, minmax(0, 1fr))`,
    [styles.ratio]: String(ratio),
    [styles.tileRadius]: vars.radius[radius],
  });

  const Open = (position: number): void => {
    set_index(position);
    onSelect?.(position);
    if (withLightbox) set_opened(true);
  };

  if (images.length === 0 && empty !== undefined) {
    return <div className={cx(styles.empty, sprinkle_class, className)}>{empty}</div>;
  }

  return (
    <>
      <ul
        className={cx(styles.gallery, styles.gap[gap], sprinkle_class, className)}
        style={{ ...css_vars, ...sprinkle_style }}
        {...(label === undefined ? {} : { "aria-label": label })}
        {...rest}
      >
        {images.map((image, position) => (
          <li key={image.src}>
            {withLightbox || onSelect !== undefined ? (
              <button
                type="button"
                className={styles.tile}
                aria-label={image.alt ?? text.counter(position + 1, images.length)}
                onClick={() => {
                  Open(position);
                }}
              >
                <img
                  className={styles.tileImage}
                  src={image.thumbnail ?? image.src}
                  alt=""
                  loading="lazy"
                  draggable={false}
                />
              </button>
            ) : (
              <div className={cx(styles.tile, styles.tileStatic)}>
                <img
                  className={styles.tileImage}
                  src={image.thumbnail ?? image.src}
                  alt={image.alt ?? ""}
                  loading="lazy"
                  draggable={false}
                />
              </div>
            )}
          </li>
        ))}
      </ul>

      {withLightbox ? (
        <Lightbox
          images={images}
          opened={opened}
          index={index}
          onIndexChange={set_index}
          withThumbnails={withThumbnails}
          withSlideshow={withSlideshow}
          {...(labels === undefined ? {} : { labels })}
          onClose={() => {
            set_opened(false);
          }}
        />
      ) : null}
    </>
  );
}

ImageGallery.displayName = "ImageGallery";

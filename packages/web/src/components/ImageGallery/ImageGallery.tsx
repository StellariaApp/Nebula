"use client";

import { useMemo, useState, type ReactElement } from "react";

import { assignInlineVars } from "@vanilla-extract/dynamic";

import { vars } from "../../theme/contract.css.js";

import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { Box } from "../Box/Box.js";
import { LIGHTBOX_LABELS } from "../Lightbox/labels.js";
import { Lightbox } from "../Lightbox/Lightbox.js";

import * as styles from "./ImageGallery.css.js";
import * as image_gallery_vars from "./ImageGallery.vars.css.js";
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
    tileProps,
    tileImageProps,
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
    [image_gallery_vars.columns]:
      cols === undefined
        ? `repeat(auto-fill, minmax(${String(minColWidth)}px, 1fr))`
        : `repeat(${String(cols)}, minmax(0, 1fr))`,
    [image_gallery_vars.ratio]: String(ratio),
    [image_gallery_vars.tileRadius]: vars.radius[radius],
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
              <Box
                component="button"
                type="button"
                aria-label={image.alt ?? text.counter(position + 1, images.length)}
                onClick={() => {
                  Open(position);
                }}
                {...tileProps}
                className={cx(styles.tile, tileProps?.className)}
              >
                <img
                  src={image.thumbnail ?? image.src}
                  alt=""
                  loading="lazy"
                  draggable={false}
                  {...tileImageProps}
                  className={cx(styles.tile_image, tileImageProps?.className)}
                />
              </Box>
            ) : (
              <Box
                {...tileProps}
                className={cx(styles.tile, styles.tile_static, tileProps?.className)}
              >
                <img
                  src={image.thumbnail ?? image.src}
                  alt={image.alt ?? ""}
                  loading="lazy"
                  draggable={false}
                  {...tileImageProps}
                  className={cx(styles.tile_image, tileImageProps?.className)}
                />
              </Box>
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

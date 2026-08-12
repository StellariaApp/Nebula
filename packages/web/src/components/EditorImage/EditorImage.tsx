"use client";

import { useMemo, useState, type ReactElement } from "react";

import { assignInlineVars } from "@vanilla-extract/dynamic";

import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { Box } from "../Box/Box.js";
import { Text } from "../Text/Text.js";
import { Modal } from "../Modal/Modal.js";

import * as styles from "./EditorImage.css.js";
import * as editor_image_vars from "./EditorImage.vars.css.js";
import type { EditorImageLabels, EditorImageProps } from "./EditorImage.types.js";

const DEFAULT_RATIO = 4 / 3;

const EDITOR_IMAGE_LABELS: EditorImageLabels = {
  open: "Edit the image",
  close: "Close the editor",
  region: "Image editor",
  missingPeer:
    "EditorImage needs you to pass the Pintura editor in the `editor` prop. Pintura is an optional peer dependency under a commercial licence: install it in your project and pass `PinturaEditor` from @pqina/react-pintura.",
};

export function EditorImage(props: EditorImageProps): ReactElement {
  const {
    src,
    editor: PinturaEditor,
    editorProps,
    opened,
    onOpenChange,
    onProcess,
    alt = "",
    ratio = DEFAULT_RATIO,
    disabled = false,
    fallback,
    labels,
    className,
    triggerProps,
    imageProps,
    hintProps,
    missingProps,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style, rest } = ExtractStyleProps(style_rest);

  const text = useMemo(
    () => (labels === undefined ? EDITOR_IMAGE_LABELS : { ...EDITOR_IMAGE_LABELS, ...labels }),
    [labels],
  );

  const [uncontrolled, set_uncontrolled] = useState(false);
  const is_open = opened ?? uncontrolled;

  const SetOpen = (next: boolean): void => {
    if (opened === undefined) set_uncontrolled(next);
    onOpenChange?.(next);
  };

  const css_vars = assignInlineVars({ [editor_image_vars.frameRatio]: String(ratio) });
  const has_editor = PinturaEditor !== undefined;

  return (
    <div className={cx(sprinkle_class, className)} style={sprinkle_style} {...rest}>
      <Box
        component="button"
        type="button"
        disabled={disabled || !has_editor}
        aria-label={text.open}
        onClick={() => {
          SetOpen(true);
        }}
        {...triggerProps}
        className={cx(styles.trigger, triggerProps?.className)}
        style={{ ...triggerProps?.style, ...css_vars }}
      >
        <img
          {...imageProps}
          className={cx(styles.image, imageProps?.className)}
          src={src}
          alt={alt}
        />
        {has_editor ? (
          <Box component="span" {...hintProps} className={cx(styles.hint, hintProps?.className)}>
            {text.open}
          </Box>
        ) : null}
      </Box>

      {has_editor
        ? null
        : (fallback ?? (
            <Text {...missingProps} className={cx(styles.missing, missingProps?.className)}>
              {text.missingPeer}
            </Text>
          ))}

      {has_editor && is_open ? (
        <Modal
          opened
          onClose={() => {
            SetOpen(false);
          }}
          size="xl"
          centered
          fullScreen
          padding="none"
          closeLabel={text.close}
          aria-label={text.region}
        >
          <PinturaEditor
            {...editorProps}
            src={src}
            onProcess={(result) => {
              onProcess?.(result);
              SetOpen(false);
            }}
            onClose={() => {
              SetOpen(false);
            }}
          />
        </Modal>
      ) : null}
    </div>
  );
}

EditorImage.displayName = "EditorImage";

"use client";

import { useMemo, useState, type ReactElement } from "react";

import { assignInlineVars } from "@vanilla-extract/dynamic";

import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { Modal } from "../Modal/Modal.js";

import * as styles from "./EditorImage.css.js";
import type { EditorImageLabels, EditorImageProps } from "./EditorImage.types.js";

const DEFAULT_RATIO = 4 / 3;

const EDITOR_IMAGE_LABELS: EditorImageLabels = {
  open: "Editar la imagen",
  close: "Cerrar el editor",
  region: "Editor de imagen",
  missingPeer:
    "EditorImage necesita que le pases el editor de Pintura en la prop `editor`. Pintura es una peer-dependency opcional con licencia comercial: instálala en tu proyecto y pasa `PinturaEditor` de @pqina/react-pintura.",
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
    radius = "md",
    disabled = false,
    fallback,
    labels,
    className,
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

  const css_vars = assignInlineVars({ [styles.frameRatio]: String(ratio) });
  const has_editor = PinturaEditor !== undefined;

  return (
    <div className={cx(sprinkle_class, className)} style={sprinkle_style} {...rest}>
      <button
        type="button"
        className={cx(styles.trigger, styles.radius[radius])}
        style={css_vars}
        disabled={disabled || !has_editor}
        aria-label={text.open}
        onClick={() => {
          SetOpen(true);
        }}
      >
        <img className={styles.image} src={src} alt={alt} />
        {has_editor ? <span className={styles.hint}>{text.open}</span> : null}
      </button>

      {has_editor ? null : (fallback ?? <p className={styles.missing}>{text.missingPeer}</p>)}

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

"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent,
  type ReactElement,
} from "react";

import { useFieldProps } from "@stellaria/nebula-hooks";

import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { Box } from "../Box/Box.js";
import { Button } from "../Button/Button.js";
import { FormField } from "../FormField/FormField.js";

import * as styles from "./Signature.css.js";
import type { SignatureLabels, SignatureProps } from "./Signature.types.js";

type Stroke = { x: number; y: number }[];

const DEFAULT_LABELS: SignatureLabels = {
  hint: "Dibuja tu firma con el ratón, el dedo o un lápiz digital",
  signed: "Firma capturada",
  empty: "Sin firma",
  undo: "Deshacer trazo",
  clear: "Borrar firma",
};

const MIME = { png: "image/png", jpeg: "image/jpeg" } as const;

export function Signature(props: SignatureProps): ReactElement {
  const {
    label,
    description,
    error,
    errorDisplay = "tooltip",
    required = false,
    disabled = false,
    size = "md",
    field: nebula_field,
    value,
    defaultValue = null,
    onChange,
    height = 180,
    strokeWidth = 2,
    penColor,
    format = "png",
    quality = 0.92,
    fileName = "signature",
    labels,
    name,
    className,
    rootClassName,
    canvasProps,
    actionsProps,
    labelProps,
    descriptionProps,
    requiredProps,
    headerProps,
    bodyProps,
    errorProps,
    ...style_rest
  } = props;
  const field_slots = {
    labelProps,
    descriptionProps,
    requiredProps,
    headerProps,
    bodyProps,
    errorProps,
  };
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  const text = { ...DEFAULT_LABELS, ...labels };

  const fp = useFieldProps<File | null>({
    field: nebula_field,
    value,
    defaultValue,
    onChange,
    error,
    disabled,
    required,
  });

  const canvas_ref = useRef<HTMLCanvasElement>(null);
  const strokes_ref = useRef<Stroke[]>([]);
  const drawing_ref = useRef(false);
  const [count, set_count] = useState(0);

  const Repaint = useCallback((): void => {
    const canvas = canvas_ref.current;
    if (canvas === null) return;
    const ctx = canvas.getContext("2d");
    if (ctx === null) return;

    const ratio = window.devicePixelRatio || 1;
    const width = canvas.clientWidth;
    if (canvas.width !== width * ratio || canvas.height !== height * ratio) {
      canvas.width = width * ratio;
      canvas.height = height * ratio;
    }
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.clearRect(0, 0, width, height);

    const computed = getComputedStyle(canvas);
    ctx.strokeStyle = penColor ?? computed.color;
    ctx.lineWidth = strokeWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    for (const stroke of strokes_ref.current) {
      if (stroke.length === 0) continue;
      ctx.beginPath();
      ctx.moveTo(stroke[0]?.x ?? 0, stroke[0]?.y ?? 0);
      for (const point of stroke.slice(1)) ctx.lineTo(point.x, point.y);
      ctx.stroke();
    }
  }, [height, penColor, strokeWidth]);

  useEffect(() => {
    Repaint();
  }, [Repaint, count]);

  useEffect(() => {
    if (fp.value === null) {
      strokes_ref.current = [];
      set_count(0);
    }
  }, [fp.value]);

  const Emit = useCallback((): void => {
    const canvas = canvas_ref.current;
    if (canvas === null) return;
    if (strokes_ref.current.length === 0) {
      fp.onChange(null);
      return;
    }
    canvas.toBlob(
      (blob) => {
        if (blob === null) return;
        fp.onChange(new File([blob], `${fileName}.${format}`, { type: MIME[format] }));
      },
      MIME[format],
      quality,
    );
  }, [fileName, format, fp, quality]);

  const Point = (event: PointerEvent<HTMLCanvasElement>): { x: number; y: number } => {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  const Down = (event: PointerEvent<HTMLCanvasElement>): void => {
    if (fp.isDisabled) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    drawing_ref.current = true;
    strokes_ref.current = [...strokes_ref.current, [Point(event)]];
    set_count((n) => n + 1);
  };

  const Move = (event: PointerEvent<HTMLCanvasElement>): void => {
    if (!drawing_ref.current) return;
    const last = strokes_ref.current.at(-1);
    if (last === undefined) return;
    last.push(Point(event));
    Repaint();
  };

  const Up = (): void => {
    if (!drawing_ref.current) return;
    drawing_ref.current = false;
    Emit();
  };

  const Undo = (): void => {
    strokes_ref.current = strokes_ref.current.slice(0, -1);
    set_count((n) => n + 1);
    Emit();
  };

  const Clear = (): void => {
    strokes_ref.current = [];
    set_count((n) => n + 1);
    fp.onChange(null);
  };

  const signed = strokes_ref.current.length > 0;
  const form_error = fp.errorMessage ?? (fp.isInvalid ? true : undefined);

  return (
    <FormField
      {...field_slots}
      label={label}
      description={description ?? text.hint}
      error={form_error}
      errorDisplay={errorDisplay}
      status={fp.status}
      required={required}
      className={cx(sprinkle_class, rootClassName)}
      style={sprinkle_style}
    >
      {(control) => (
        <div className={styles.root}>
          <canvas
            {...control}
            ref={canvas_ref}
            role="img"
            aria-label={signed ? text.signed : text.empty}
            data-disabled={fp.isDisabled ? "true" : undefined}
            data-invalid={fp.isInvalid ? "true" : undefined}
            onPointerDown={Down}
            onPointerMove={Move}
            onPointerUp={Up}
            onPointerCancel={Up}
            {...canvasProps}
            className={cx(styles.canvas, styles.size[size], className, canvasProps?.className)}
            style={{ ...canvasProps?.style, height }}
          />
          <Box {...actionsProps} className={cx(styles.actions, actionsProps?.className)}>
            <Button variant="ghost" size="sm" disabled={fp.isDisabled || !signed} onPress={Undo}>
              {text.undo}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              color="error"
              disabled={fp.isDisabled || !signed}
              onPress={Clear}
            >
              {text.clear}
            </Button>
          </Box>
          {name === undefined ? null : (
            <input type="hidden" name={name} value={signed ? `${fileName}.${format}` : ""} />
          )}
        </div>
      )}
    </FormField>
  );
}

Signature.displayName = "Signature";

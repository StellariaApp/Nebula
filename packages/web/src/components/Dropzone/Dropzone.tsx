"use client";

import { useEffect, useRef, useState, type DragEvent, type ReactElement } from "react";

import { useFieldProps } from "@stellaria/nebula-hooks";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { ResolveAccent } from "../../utils/scale.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { ButtonClose } from "../ButtonClose/ButtonClose.js";
import { FormField } from "../FormField/FormField.js";

import * as variables from "./Dropzone.vars.css.js";
import * as styles from "./Dropzone.css.js";
import type { DropzoneKind, DropzoneLabels, DropzoneProps } from "./Dropzone.types.js";
import { UploadCloud } from "../../glyphs/index.js";
import { Box } from "../Box/Box.js";
import { Text } from "../Text/Text.js";

const ACCEPT: Record<DropzoneKind, string> = {
  image: "image/*",
  video: "video/*",
  pdf: "application/pdf",
  file: "",
};

const DEFAULT_LABELS: DropzoneLabels = {
  idle: "Drag files here or click to choose them",
  hint: "You can also drop them here",
  accept: "Drop to add",
  reject: "That file type is not accepted",
  remove: "Remove file",
};

const CLOUD = <UploadCloud strokeWidth={1.5} />;

function Matches(file: File, accept: string): boolean {
  if (accept === "") return true;
  return accept.split(",").some((entry) => {
    const rule = entry.trim();
    if (rule === "") return true;
    if (rule.endsWith("/*")) return file.type.startsWith(rule.slice(0, -1));
    if (rule.startsWith(".")) return file.name.toLowerCase().endsWith(rule.toLowerCase());
    return file.type === rule;
  });
}

export function Dropzone(props: DropzoneProps): ReactElement {
  const {
    label,
    description,
    error,
    errorDisplay = "tooltip",
    required = false,
    disabled = false,
    size = "md",
    color = "primary",
    field: nebula_field,
    value,
    defaultValue,
    onChange,
    kind = "file",
    accept,
    multiple = true,
    replace = false,
    maxFiles,
    maxSize,
    withPreview = true,
    height,
    icon,
    labels,
    name,
    className,
    zoneProps,
    iconProps,
    titleProps,
    hintProps,
    listProps,
    rootClassName,
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
  const rule = accept ?? ACCEPT[kind];

  const fp = useFieldProps<File[]>({
    field: nebula_field,
    value: value === undefined ? undefined : [...value],
    defaultValue: defaultValue === undefined ? [] : [...defaultValue],
    onChange,
    error,
    disabled,
    required,
  });

  const input_ref = useRef<HTMLInputElement>(null);
  const depth_ref = useRef(0);
  const [drag, set_drag] = useState<"idle" | "accept" | "reject">("idle");

  const Accepts = (files: File[]): boolean =>
    files.every((file) => Matches(file, rule) && (maxSize === undefined || file.size <= maxSize));

  const Commit = (incoming: File[]): void => {
    const valid = incoming.filter(
      (file) => Matches(file, rule) && (maxSize === undefined || file.size <= maxSize),
    );
    if (valid.length === 0) return;
    const base = replace || !multiple ? [] : fp.value;
    const merged = multiple ? [...base, ...valid] : [valid[0] as File];
    fp.onChange(maxFiles === undefined ? merged : merged.slice(0, maxFiles));
  };

  const Enter = (event: DragEvent<HTMLElement>): void => {
    if (fp.isDisabled) return;
    event.preventDefault();
    depth_ref.current += 1;
    const items = Array.from(event.dataTransfer.items)
      .filter((item) => item.kind === "file")
      .map((item) => item.getAsFile())
      .filter((file): file is File => file !== null);
    set_drag(items.length === 0 || Accepts(items) ? "accept" : "reject");
  };

  const Leave = (): void => {
    depth_ref.current -= 1;
    if (depth_ref.current <= 0) {
      depth_ref.current = 0;
      set_drag("idle");
    }
  };

  const Over = (event: DragEvent<HTMLElement>): void => {
    if (fp.isDisabled) return;
    event.preventDefault();
  };

  const Drop = (event: DragEvent<HTMLElement>): void => {
    event.preventDefault();
    depth_ref.current = 0;
    set_drag("idle");
    if (fp.isDisabled) return;
    Commit(Array.from(event.dataTransfer.files));
  };

  const Remove = (index: number): void => {
    fp.onChange(fp.value.filter((_, entry) => entry !== index));
  };

  const form_error = fp.errorMessage ?? (fp.isInvalid ? true : undefined);
  const previews = withPreview && kind === "image";

  return (
    <FormField
      {...field_slots}
      label={label}
      description={description}
      error={form_error}
      errorDisplay={errorDisplay}
      status={fp.status}
      required={required}
      className={cx(sprinkle_class, rootClassName)}
      style={sprinkle_style}
    >
      {(control) => (
        <div
          className={styles.root}
          style={assignInlineVars({ [variables.dropColor]: ResolveAccent(color, "600") })}
        >
          <button
            {...control}
            type="button"
            {...zoneProps}
            className={cx(styles.zone, styles.size[size], className, zoneProps?.className)}
            style={{ ...zoneProps?.style, ...(height === undefined ? {} : { minHeight: height }) }}
            disabled={fp.isDisabled}
            data-drag={drag === "idle" ? undefined : drag}
            data-invalid={fp.isInvalid ? "true" : undefined}
            onClick={() => input_ref.current?.click()}
            onDragEnter={Enter}
            onDragLeave={Leave}
            onDragOver={Over}
            onDrop={Drop}
          >
            <Box
              component="span"
              aria-hidden="true"
              {...iconProps}
              className={cx(styles.icon, iconProps?.className)}
            >
              {icon ?? CLOUD}
            </Box>
            <Text
              inherit
              component="span"
              {...titleProps}
              className={cx(styles.title, titleProps?.className)}
            >
              {drag === "accept" ? text.accept : drag === "reject" ? text.reject : text.idle}
            </Text>
            <Text component="span" {...hintProps} className={cx(styles.hint, hintProps?.className)}>
              {text.hint}
            </Text>
          </button>
          <input
            ref={input_ref}
            type="file"
            className={styles.native_input}
            tabIndex={-1}
            aria-hidden="true"
            multiple={multiple}
            disabled={fp.isDisabled}
            {...(rule === "" ? {} : { accept: rule })}
            {...(name === undefined ? {} : { name })}
            onChange={(event) => {
              Commit(Array.from(event.target.files ?? []));
              event.target.value = "";
            }}
          />
          {fp.value.length === 0 ? null : (
            <Box component="ul" {...listProps} className={cx(styles.list, listProps?.className)}>
              {fp.value.map((file, index) => (
                <li key={`${file.name}-${String(index)}`} className={styles.item}>
                  {previews ? <Preview file={file} /> : null}
                  <span className={styles.file_name}>{file.name}</span>
                  <ButtonClose
                    size="sm"
                    aria-label={`${text.remove}: ${file.name}`}
                    disabled={fp.isDisabled}
                    onPress={() => {
                      Remove(index);
                    }}
                  />
                </li>
              ))}
            </Box>
          )}
        </div>
      )}
    </FormField>
  );
}

function Preview(props: { file: File }): ReactElement | null {
  const { file } = props;
  const [url, set_url] = useState<string | null>(null);

  useEffect(() => {
    const created = URL.createObjectURL(file);
    set_url(created);
    return () => {
      URL.revokeObjectURL(created);
    };
  }, [file]);

  if (url === null) return null;
  return <img src={url} alt="" className={styles.preview} />;
}

Dropzone.displayName = "Dropzone";

"use client";

import { useEffect, useId, useMemo, type ReactElement } from "react";

import { useFieldProps } from "@stellaria/nebula-hooks";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { LengthToCss } from "../../utils/token-css.js";
import { FormField } from "../FormField/FormField.js";

import * as styles from "./RichTextEditor.css.js";
import { DEFAULT_TOOLBAR, RICH_TEXT_LABELS } from "./labels.js";
import { Toolbar } from "./Toolbar.js";
import type { RichTextEditorProps } from "./RichTextEditor.types.js";

const ROW_HEIGHT = 24;
const DEFAULT_ROWS = 6;

export function RichTextEditor(props: RichTextEditorProps): ReactElement {
  const {
    value,
    defaultValue = "",
    onChange,
    field,
    toolbar = DEFAULT_TOOLBAR,
    placeholder,
    minRows = DEFAULT_ROWS,
    maxHeight,
    readOnly = false,
    disabled = false,
    label,
    description,
    error,
    required = false,
    withToolbar = true,
    labels,
    className,
    ...style_rest
  } = props;
  const {
    className: sprinkle_class,
    style: sprinkle_style,
    rest,
  } = ExtractStyleProps(style_rest);

  const text = useMemo(
    () => (labels === undefined ? RICH_TEXT_LABELS : { ...RICH_TEXT_LABELS, ...labels }),
    [labels],
  );

  const resolved = useFieldProps<string>({
    ...(field === undefined ? {} : { field }),
    ...(value === undefined ? {} : { value }),
    defaultValue,
    ...(onChange === undefined ? {} : { onChange }),
    ...(typeof error === "string" ? { error } : {}),
    disabled,
    required,
  });

  const editable = !readOnly && !resolved.isDisabled;

  const auto_id = useId();
  const field_id = `${auto_id}-editor`;

  const described_by =
    [
      description === undefined ? null : `${field_id}-description`,
      typeof error === "string" ? `${field_id}-error` : null,
    ]
      .filter((value): value is string => value !== null)
      .join(" ") || undefined;

  const editor = useEditor({
    extensions: [StarterKit],
    content: resolved.value,
    editable,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        id: field_id,
        role: "textbox",
        "aria-multiline": "true",
        ...(label === undefined
          ? { "aria-label": text.editor }
          : { "aria-labelledby": `${field_id}-label` }),
        ...(described_by === undefined ? {} : { "aria-describedby": described_by }),
        ...(readOnly ? { "aria-readonly": "true" } : {}),
        ...(resolved.isInvalid ? { "aria-invalid": "true" } : {}),
        ...(required ? { "aria-required": "true" } : {}),
      },
    },
    onUpdate: ({ editor: instance }) => {
      resolved.onChange(instance.getHTML());
    },
  });

  useEffect(() => {
    if (editor === null) return;
    editor.setEditable(editable);
  }, [editor, editable]);

  useEffect(() => {
    if (editor === null) return;
    if (resolved.value === editor.getHTML()) return;
    editor.commands.setContent(resolved.value, { emitUpdate: false });
  }, [editor, resolved.value]);

  const css_vars = assignInlineVars({
    [styles.minHeight]: LengthToCss(minRows * ROW_HEIGHT),
    [styles.maxHeight]: maxHeight === undefined ? "none" : LengthToCss(maxHeight),
  });

  const empty = editor === null || editor.isEmpty;

  return (
    <FormField
      id={field_id}
      {...(label === undefined ? {} : { label })}
      {...(description === undefined ? {} : { description })}
      {...(error === undefined ? {} : { error })}
      errorDisplay="text"
      status={resolved.status}
      required={required}
      className={sprinkle_class}
      style={sprinkle_style}
      {...rest}
    >
      {() => (
        <div
          className={cx(styles.shell, className)}
          style={css_vars}
          data-invalid={resolved.isInvalid ? "true" : "false"}
          data-disabled={resolved.isDisabled ? "true" : "false"}
        >
          {withToolbar && editor !== null ? (
            <Toolbar editor={editor} groups={toolbar} labels={text} disabled={!editable} />
          ) : null}
          <div className={styles.content} data-empty={empty ? "true" : "false"}>
            <EditorContent editor={editor} />
            {empty && placeholder !== undefined ? (
              <span className={styles.placeholder} aria-hidden="true">
                {placeholder}
              </span>
            ) : null}
          </div>
        </div>
      )}
    </FormField>
  );
}

RichTextEditor.displayName = "RichTextEditor";

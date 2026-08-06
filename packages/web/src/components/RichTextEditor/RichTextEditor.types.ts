import type { ReactNode } from "react";

import type { NebulaField } from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";

import type { FormFieldSlotProps } from "../FormField/FormField.types.js";

export type RichTextAction =
  | "bold"
  | "italic"
  | "underline"
  | "strike"
  | "code"
  | "h1"
  | "h2"
  | "h3"
  | "bulletList"
  | "orderedList"
  | "blockquote"
  | "codeBlock"
  | "horizontalRule"
  | "link"
  | "unlink"
  | "clear"
  | "undo"
  | "redo";

export type RichTextGroup = readonly RichTextAction[];

export interface RichTextLabels extends Record<RichTextAction, string> {
  toolbar: string;
  editor: string;
  linkPrompt: string;
}

export interface RichTextEditorProps extends StyleProps, FormFieldSlotProps {
  value?: string | undefined;
  defaultValue?: string | undefined;
  onChange?: ((html: string) => void) | undefined;
  field?: NebulaField<string> | undefined;
  toolbar?: readonly RichTextGroup[] | undefined;
  placeholder?: string | undefined;
  minRows?: number | undefined;
  maxHeight?: number | undefined;
  readOnly?: boolean | undefined;
  disabled?: boolean | undefined;
  label?: ReactNode | undefined;
  description?: ReactNode | undefined;
  error?: string | boolean | undefined;
  required?: boolean | undefined;
  withToolbar?: boolean | undefined;
  labels?: Partial<RichTextLabels> | undefined;
  className?: string | undefined;
}

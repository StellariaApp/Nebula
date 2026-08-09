import type { ReactNode } from "react";

import type { NebulaField } from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";

import type { FormFieldSlotProps } from "../FormField/FormField.types.js";
import type { BoxSlotProps } from "../Box/Box.types.js";
import type { TextSlotProps } from "../Text/Text.types.js";

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
  /** The editable area. It carries `data-empty`, which is what makes the placeholder show. */
  contentProps?: BoxSlotProps | undefined;
  /** The placeholder. Only rendered with an empty editor and a `placeholder`. */
  placeholderProps?: TextSlotProps | undefined;
  /** The action bar. Only with `withToolbar`. */
  toolbarProps?: BoxSlotProps | undefined;
  /** Every group in the bar. It spreads over ALL of them; the groups come from `toolbar`. */
  toolbarGroupProps?: BoxSlotProps | undefined;
  value?: string | undefined;
  defaultValue?: string | undefined;
  onChange?: ((html: string) => void) | undefined;
  field?: NebulaField<string> | undefined;
  /** @default the five rows of the full group, exported as `DEFAULT_TOOLBAR` */
  toolbar?: readonly RichTextGroup[] | undefined;
  placeholder?: string | undefined;
  /** @default 6 */
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

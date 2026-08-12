import type { ComponentPropsWithoutRef, ComponentType, ReactNode } from "react";

import type { StyleProps } from "../../utils/style-props.js";
import type { BoxOwnProps, BoxSlotProps } from "../Box/Box.types.js";
import type { TextSlotProps } from "../Text/Text.types.js";

/**
 * The minimal shape of `@pqina/react-pintura`. It is declared **structurally** and not imported from
 * Pintura: it is an optional peer dependency under a commercial licence (C1-Q6, ADR-014 rule 4), so
 * Nebula can neither depend on its types nor install it to compile.
 */
export interface PinturaEditorResult {
  dest: Blob | File;
  imageState?: unknown;
}

export interface PinturaEditorProps {
  src: string | File | Blob;
  onProcess?: ((result: PinturaEditorResult) => void) | undefined;
  onClose?: (() => void) | undefined;
  [key: string]: unknown;
}

export type PinturaEditorComponent = ComponentType<PinturaEditorProps>;

export interface EditorImageLabels {
  open: string;
  close: string;
  region: string;
  missingPeer: string;
}

/** Props of the trigger: the button attributes plus the system style props, so `r` reaches it. */
export type EditorImageTriggerProps = BoxOwnProps &
  Omit<ComponentPropsWithoutRef<"button">, keyof BoxOwnProps>;

export interface EditorImageProps extends StyleProps {
  /**
   * The button that opens the editor. Its aspect-ratio variable is written after the slot. It is
   * also the route to the shape of the frame —`triggerProps={{ r: "lg" }}`—, which used to be the
   * `radius` prop: the style props of the component itself land on the wrapper, not on the button.
   */
  triggerProps?: EditorImageTriggerProps | undefined;
  /** The button image. Its `src` and `alt` come from the component props. */
  imageProps?: ComponentPropsWithoutRef<"img"> | undefined;
  /** The floating label over the image. Only rendered when there is an editor. */
  hintProps?: BoxSlotProps | undefined;
  /** The missing-peer notice. Only rendered without `editor` and without `fallback`. */
  missingProps?: TextSlotProps | undefined;
  src: string;
  editor?: PinturaEditorComponent | undefined;
  editorProps?: Record<string, unknown> | undefined;
  opened?: boolean | undefined;
  onOpenChange?: ((opened: boolean) => void) | undefined;
  onProcess?: ((result: PinturaEditorResult) => void) | undefined;
  alt?: string | undefined;
  /** @default 4 / 3 */
  ratio?: number | undefined;
  disabled?: boolean | undefined;
  fallback?: ReactNode | undefined;
  labels?: Partial<EditorImageLabels> | undefined;
  className?: string | undefined;
}

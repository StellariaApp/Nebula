import type { ComponentType, ReactNode } from "react";

import type { StyleProps } from "../../utils/style-props.js";

/**
 * Forma mínima de `@pqina/react-pintura`. Se declara **estructuralmente** y no se importa de Pintura:
 * es una peer-dependency opcional de licencia comercial (C1-Q6, ADR-014 regla 4), así que Nebula no
 * puede depender de sus tipos ni instalarla para compilar.
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

export interface EditorImageProps extends StyleProps {
  src: string;
  editor?: PinturaEditorComponent | undefined;
  editorProps?: Record<string, unknown> | undefined;
  opened?: boolean | undefined;
  onOpenChange?: ((opened: boolean) => void) | undefined;
  onProcess?: ((result: PinturaEditorResult) => void) | undefined;
  alt?: string | undefined;
  ratio?: number | undefined;
  radius?: "none" | "sm" | "md" | "lg" | undefined;
  disabled?: boolean | undefined;
  fallback?: ReactNode | undefined;
  labels?: Partial<EditorImageLabels> | undefined;
  className?: string | undefined;
}

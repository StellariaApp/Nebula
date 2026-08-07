import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type { StyleProps } from "../../utils/style-props.js";

import type { BoxSlotProps } from "../Box/Box.types.js";
import type { ButtonCopyProps } from "../ButtonCopy/ButtonCopy.types.js";
import type { TextSlotProps } from "../Text/Text.types.js";

export interface CodeHighlightLabels {
  copy: string;
  copied: string;
  region: (lang: string | undefined) => string;
}

/**
 * Bloque de código con superficie del tema, numeración, scroll y copia.
 *
 * **No resalta por sí solo** ([ADR-061](../../../../../docs/adr/ADR-061-rich-content-tiptap-y-dependencias-de-w43.md)):
 * `code` se pinta como texto plano y `html` espera markup ya resaltado, que se inyecta con
 * `dangerouslySetInnerHTML`. Sanear ese HTML es responsabilidad de quien lo produce.
 */
export interface CodeHighlightProps extends StyleProps {
  /** La cabecera. Solo se pinta si hay `filename` o `lang`. */
  headerProps?: BoxSlotProps | undefined;
  /** El rotulo de la cabecera, que pinta `filename` y cae en `lang` si no lo hay. */
  filenameProps?: TextSlotProps | undefined;
  /** El anclaje flotante de la copia. Solo existe SIN cabecera: con ella, el boton va dentro. */
  floatingCopyProps?: BoxSlotProps | undefined;
  /** El boton de copiar, en la cabecera o flotante. Su `value` lo calcula el componente. */
  copyProps?: Omit<ButtonCopyProps, "value"> | undefined;
  /**
   * El bloque de codigo, que es la region enfocable con nombre accesible. La numeracion y el codigo
   * no tienen ranura: comparten metrica de linea y separarlas descuadra los numeros.
   */
  preProps?: ComponentPropsWithoutRef<"pre"> | undefined;
  code?: string | undefined;
  html?: string | undefined;
  lang?: string | undefined;
  filename?: ReactNode | undefined;
  withLineNumbers?: boolean | undefined;
  withCopy?: boolean | undefined;
  firstLine?: number | undefined;
  maxHeight?: number | undefined;
  labels?: Partial<CodeHighlightLabels> | undefined;
  className?: string | undefined;
}

export interface CodeHighlightTab extends Omit<CodeHighlightProps, "className"> {
  value: string;
  label: ReactNode;
}

export interface CodeHighlightTabsProps extends StyleProps {
  tabs: readonly CodeHighlightTab[];
  value?: string | undefined;
  defaultValue?: string | undefined;
  onChange?: ((value: string) => void) | undefined;
  withLineNumbers?: boolean | undefined;
  withCopy?: boolean | undefined;
  maxHeight?: number | undefined;
  label?: string | undefined;
  labels?: Partial<CodeHighlightLabels> | undefined;
  className?: string | undefined;
}

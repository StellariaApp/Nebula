import type { ReactNode } from "react";

import type { StyleProps } from "../../utils/style-props.js";

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
export interface CodeHighlightProps extends Omit<StyleProps, "color"> {
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

export interface CodeHighlightTabsProps extends Omit<StyleProps, "color"> {
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

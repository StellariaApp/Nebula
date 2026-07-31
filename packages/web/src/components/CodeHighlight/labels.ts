import type { CodeHighlightLabels } from "./CodeHighlight.types.js";

export const CODE_HIGHLIGHT_LABELS: CodeHighlightLabels = {
  copy: "Copiar el código",
  copied: "Código copiado",
  region: (lang) => (lang === undefined ? "Bloque de código" : `Bloque de código en ${lang}`),
};

import type { CodeHighlightLabels } from "./CodeHighlight.types.js";

export const CODE_HIGHLIGHT_LABELS: CodeHighlightLabels = {
  copy: "Copy the code",
  copied: "Code copied",
  region: (lang) => (lang === undefined ? "Code block" : `${lang} code block`),
  expand: "Expand code",
  collapse: "Collapse code",
};

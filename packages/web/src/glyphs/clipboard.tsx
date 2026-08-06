import type { ReactElement } from "react";

import { Glyph, type GlyphProps } from "./glyph.js";

export function Clipboard(props: GlyphProps): ReactElement {
  return (
    <Glyph {...props}>
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15V5a2 2 0 0 1 2-2h10" />
    </Glyph>
  );
}

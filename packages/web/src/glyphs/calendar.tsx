import type { ReactElement } from "react";

import { Glyph, type GlyphProps } from "./glyph.js";

export function Calendar(props: GlyphProps): ReactElement {
  return (
    <Glyph {...props}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </Glyph>
  );
}

import type { ReactElement } from "react";

import { Glyph, type GlyphProps } from "./glyph.js";

export function Minus(props: GlyphProps): ReactElement {
  return (
    <Glyph {...props}>
      <path d="M6 12h12" />
    </Glyph>
  );
}

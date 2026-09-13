import type { ReactElement } from "react";

import { Glyph, type GlyphProps } from "./glyph.js";

export function Minimize(props: GlyphProps): ReactElement {
  return (
    <Glyph {...props}>
      <path d="M4 14h6v6" />
      <path d="M20 10h-6V4" />
      <path d="m14 10 7-7" />
      <path d="m3 21 7-7" />
    </Glyph>
  );
}

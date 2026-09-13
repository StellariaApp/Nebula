import type { ReactElement } from "react";

import { Glyph, type GlyphProps } from "./glyph.js";

export function Volume(props: GlyphProps): ReactElement {
  return (
    <Glyph {...props}>
      <path d="M11 5 6 9H2v6h4l5 4V5z" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </Glyph>
  );
}

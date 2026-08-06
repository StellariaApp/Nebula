import type { ReactElement } from "react";

import { Glyph, type GlyphProps } from "./glyph.js";

export function DotsHorizontal(props: GlyphProps): ReactElement {
  return (
    <Glyph fill="currentColor" stroke="none" {...props}>
      <circle cx="5" cy="12" r="1.6" />
      <circle cx="12" cy="12" r="1.6" />
      <circle cx="19" cy="12" r="1.6" />
    </Glyph>
  );
}

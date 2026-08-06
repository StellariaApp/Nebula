import type { ReactElement } from "react";

import { Glyph, type GlyphProps } from "./glyph.js";

export function DotsVertical(props: GlyphProps): ReactElement {
  return (
    <Glyph fill="currentColor" stroke="none" {...props}>
      <circle cx="12" cy="5" r="1.6" />
      <circle cx="12" cy="12" r="1.6" />
      <circle cx="12" cy="19" r="1.6" />
    </Glyph>
  );
}

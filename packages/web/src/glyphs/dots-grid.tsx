import type { ReactElement } from "react";

import { Glyph, type GlyphProps } from "./glyph.js";

export function DotsGrid(props: GlyphProps): ReactElement {
  return (
    <Glyph fill="currentColor" stroke="none" {...props}>
      <circle cx="9" cy="6" r="1.6" />
      <circle cx="15" cy="6" r="1.6" />
      <circle cx="9" cy="12" r="1.6" />
      <circle cx="15" cy="12" r="1.6" />
      <circle cx="9" cy="18" r="1.6" />
      <circle cx="15" cy="18" r="1.6" />
    </Glyph>
  );
}

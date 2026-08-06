import type { ReactElement } from "react";

import { Glyph, type GlyphProps } from "./glyph.js";

export function Filter(props: GlyphProps): ReactElement {
  return (
    <Glyph {...props}>
      <path d="M3 5h18l-7 8v6l-4-2v-4z" />
    </Glyph>
  );
}

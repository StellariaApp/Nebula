import type { ReactElement } from "react";

import { Glyph, type GlyphProps } from "./glyph.js";

export function Check(props: GlyphProps): ReactElement {
  return (
    <Glyph {...props}>
      <path d="M20 6 9 17l-5-5" />
    </Glyph>
  );
}

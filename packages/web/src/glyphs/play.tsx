import type { ReactElement } from "react";

import { Glyph, type GlyphProps } from "./glyph.js";

export function Play(props: GlyphProps): ReactElement {
  return (
    <Glyph {...props}>
      <path d="M6 4l14 8-14 8V4z" />
    </Glyph>
  );
}

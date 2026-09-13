import type { ReactElement } from "react";

import { Glyph, type GlyphProps } from "./glyph.js";

export function VolumeOff(props: GlyphProps): ReactElement {
  return (
    <Glyph {...props}>
      <path d="M11 5 6 9H2v6h4l5 4V5z" />
      <path d="m22 9-6 6" />
      <path d="m16 9 6 6" />
    </Glyph>
  );
}

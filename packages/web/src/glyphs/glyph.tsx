import type { ReactElement, SVGProps } from "react";

export type GlyphProps = SVGProps<SVGSVGElement>;

export function Glyph(props: GlyphProps): ReactElement {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable={false}
      {...props}
    />
  );
}

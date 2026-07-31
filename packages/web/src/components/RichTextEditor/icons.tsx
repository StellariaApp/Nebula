import type { ReactElement } from "react";

import type { RichTextAction } from "./RichTextEditor.types.js";

function Stroke(path: string): ReactElement {
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
    >
      <path d={path} />
    </svg>
  );
}

function Glyph(text: string): ReactElement {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true">
      <text
        x="12"
        y="16"
        textAnchor="middle"
        fontSize="13"
        fontWeight="600"
        fill="currentColor"
        fontFamily="inherit"
      >
        {text}
      </text>
    </svg>
  );
}

export const ACTION_ICONS: Record<RichTextAction, ReactElement> = {
  bold: Stroke("M7 5h6a3.5 3.5 0 010 7H7zM7 12h7a3.5 3.5 0 010 7H7z"),
  italic: Stroke("M15 5h-5M14 19H9M14 5l-4 14"),
  underline: Stroke("M7 4v6a5 5 0 0010 0V4M5 20h14"),
  strike: Stroke("M5 12h14M8 7a4 3 0 014-2c2 0 3.5 1 4 2M16 15a4 3 0 01-4 3c-2 0-3.5-1-4-2"),
  code: Stroke("M9 18l-6-6 6-6M15 6l6 6-6 6"),
  h1: Glyph("H1"),
  h2: Glyph("H2"),
  h3: Glyph("H3"),
  bulletList: Stroke("M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01"),
  orderedList: Stroke("M10 6h10M10 12h10M10 18h10M4 6h1v4M4 14h2v1H4v3h2"),
  blockquote: Stroke("M5 5v14M9 8h10M9 12h10M9 16h6"),
  codeBlock: Stroke("M4 5h16v14H4zM9 15l-2-3 2-3M15 9l2 3-2 3"),
  horizontalRule: Stroke("M4 12h16"),
  link: Stroke("M10 13a5 5 0 007 0l3-3a5 5 0 00-7-7l-1 1M14 11a5 5 0 00-7 0l-3 3a5 5 0 007 7l1-1"),
  unlink: Stroke("M17 7l3-3M4 20l3-3M10 13a5 5 0 007 0M14 11a5 5 0 00-7 0l-3 3a5 5 0 004 8"),
  clear: Stroke("M6 6l12 12M18 6L6 18"),
  undo: Stroke("M9 14L4 9l5-5M4 9h11a5 5 0 010 10h-4"),
  redo: Stroke("M15 14l5-5-5-5M20 9H9a5 5 0 000 10h4"),
};

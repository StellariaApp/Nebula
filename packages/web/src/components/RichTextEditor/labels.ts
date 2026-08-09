import type { RichTextGroup, RichTextLabels } from "./RichTextEditor.types.js";

export const RICH_TEXT_LABELS: RichTextLabels = {
  toolbar: "Text formatting",
  editor: "Rich text editor",
  linkPrompt: "Link address",
  bold: "Bold",
  italic: "Italic",
  underline: "Underline",
  strike: "Strikethrough",
  code: "Inline code",
  h1: "Heading 1",
  h2: "Heading 2",
  h3: "Heading 3",
  bulletList: "Bulleted list",
  orderedList: "Numbered list",
  blockquote: "Quote",
  codeBlock: "Code block",
  horizontalRule: "Separator",
  link: "Insert link",
  unlink: "Remove the link",
  clear: "Clear formatting",
  undo: "Undo",
  redo: "Redo",
};

export const DEFAULT_TOOLBAR: readonly RichTextGroup[] = [
  ["bold", "italic", "underline", "strike"],
  ["h1", "h2", "h3"],
  ["bulletList", "orderedList", "blockquote"],
  ["link", "unlink"],
  ["undo", "redo"],
];

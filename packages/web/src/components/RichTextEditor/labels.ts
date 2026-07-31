import type { RichTextGroup, RichTextLabels } from "./RichTextEditor.types.js";

export const RICH_TEXT_LABELS: RichTextLabels = {
  toolbar: "Formato del texto",
  editor: "Editor de texto enriquecido",
  linkPrompt: "Dirección del enlace",
  bold: "Negrita",
  italic: "Cursiva",
  underline: "Subrayado",
  strike: "Tachado",
  code: "Código en línea",
  h1: "Título 1",
  h2: "Título 2",
  h3: "Título 3",
  bulletList: "Lista con viñetas",
  orderedList: "Lista numerada",
  blockquote: "Cita",
  codeBlock: "Bloque de código",
  horizontalRule: "Separador",
  link: "Insertar enlace",
  unlink: "Quitar el enlace",
  clear: "Quitar el formato",
  undo: "Deshacer",
  redo: "Rehacer",
};

export const DEFAULT_TOOLBAR: readonly RichTextGroup[] = [
  ["bold", "italic", "underline", "strike"],
  ["h1", "h2", "h3"],
  ["bulletList", "orderedList", "blockquote"],
  ["link", "unlink"],
  ["undo", "redo"],
];

import type { ReactNode } from "react";

export interface Heading {
  id: string;
  text: string;
  level: 2 | 3;
}

const HEADING = /^(#{2,3})\s+(.+?)\s*$/gm;
const FENCE = /^```[\s\S]*?^```/gm;
const INLINE = /`([^`]+)`|\*\*([^*]+)\*\*|\*([^*]+)\*|\[([^\]]+)\]\([^)]*\)/g;

/** El texto plano de un título, sin el marcado que MDX le pone dentro. */
export function Plain(children: ReactNode): string {
  if (typeof children === "string" || typeof children === "number") return String(children);
  if (Array.isArray(children)) return children.map(Plain).join("");
  if (children !== null && typeof children === "object" && "props" in children) {
    const props = (children as { props?: { children?: ReactNode } }).props;
    return Plain(props?.children);
  }
  return "";
}

export function Slug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

/** Los `##` y `###` del cuerpo, saltando los que caen dentro de un bloque de código. */
export function Headings(source: string): Heading[] {
  const body = source.replace(FENCE, "");
  const found: Heading[] = [];
  for (const match of body.matchAll(HEADING)) {
    const text = (match[2] ?? "").replace(INLINE, (_all, code, bold, italic, link) =>
      String(code ?? bold ?? italic ?? link ?? ""),
    );
    found.push({ id: Slug(text), text, level: match[1] === "##" ? 2 : 3 });
  }
  return found;
}

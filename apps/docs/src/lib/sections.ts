export type SectionKind = "docs" | "catalog" | "reserved";

export interface Section {
  slug: string;
  /** Clave del diccionario: la pestaña, el carril y la cabecera leen el mismo rótulo. */
  label: string;
  kind: SectionKind;
  /** Qué aterriza aquí, para la pantalla reservada de las secciones sin contenido. */
  note?: string | undefined;
}

export const GUIDES = "/guides";

export const SECTIONS: readonly Section[] = [
  { slug: "getting-started", label: "section.gettingStarted", kind: "docs" },
  { slug: "components", label: "section.components", kind: "catalog" },
  {
    slug: "theming-styles",
    label: "section.themingStyles",
    kind: "reserved",
    note: "reserved.themingStyles",
  },
  { slug: "hooks", label: "section.hooks", kind: "reserved", note: "reserved.hooks" },
  { slug: "form", label: "section.form", kind: "reserved", note: "reserved.form" },
  { slug: "native", label: "section.native", kind: "reserved", note: "reserved.native" },
];

/** La sección que abre `/guides` y el destino de los enlaces heredados de `/docs`. */
export const DEFAULT_SECTION = "getting-started";

export function FindSection(slug: string): Section | undefined {
  return SECTIONS.find((section) => section.slug === slug);
}

export function SectionHref(slug: string, ...rest: string[]): string {
  return [GUIDES, slug, ...rest].join("/");
}

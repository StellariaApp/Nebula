"use client";

import { usePathname, useRouter, useSelectedLayoutSegment } from "next/navigation";
import type { ReactElement, ReactNode } from "react";

import { AppShell, Segment } from "@stellaria/nebula-web";

import { DEFAULT_SECTION, GUIDES } from "../lib/sections";

export interface SectionTab {
  value: string;
  label: string;
  /** Dónde aterriza la pestaña: la primera página de la sección, no su índice. */
  href: string;
}

function Active(segment: string | null): string {
  return segment ?? DEFAULT_SECTION;
}

export function GuidesTabs({
  sections,
  label,
}: {
  sections: readonly SectionTab[];
  label: string;
}): ReactElement {
  const router = useRouter();
  const segment = useSelectedLayoutSegment();

  return (
    <Segment
      value={Active(segment)}
      onChange={(value) => {
        const target = sections.find((section) => section.value === value);
        router.push(target?.href ?? `${GUIDES}/${value}`);
      }}
      size="sm"
      variant="light"
      draggable={false}
    >
      <Segment.Control aria-label={label} bg="transparent" bdw={0}>
        {sections.map((section) => (
          <Segment.Control.Item key={section.value} value={section.value}>
            {section.label}
          </Segment.Control.Item>
        ))}
      </Segment.Control>
    </Segment>
  );
}

/**
 * El carril de cada sección se monta con el layout y solo se muestra el de la activa: así el
 * segmento cambia sin remontar la barra ni perder su posición de scroll.
 */
export function GuidesRail({
  section,
  children,
}: {
  section: string;
  children: ReactNode;
}): ReactNode {
  const segment = useSelectedLayoutSegment();
  return Active(segment) === section ? children : null;
}

export function RailLink({ href, label }: { href: string; label: string }): ReactElement {
  const pathname = usePathname();
  return <AppShell.Link href={href} label={label} active={pathname === href} />;
}

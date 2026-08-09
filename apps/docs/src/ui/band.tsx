import { Section } from "@stellaria/nebula-web";
import type { ReactElement, ReactNode } from "react";

export type BandLevel = "major" | "minor" | "closing";

const SCALE = {
  major: { size: "xl", fz: "h2", measure: "58ch" },
  minor: { size: "lg", fz: "h3", measure: "62ch" },
  closing: { size: "lg", fz: "h2", measure: "52ch" },
} as const;

export interface BandProps {
  level: BandLevel;
  title: ReactNode;
  description?: ReactNode | undefined;
  footer?: ReactNode | undefined;
  glass?: boolean | undefined;
  id?: string | undefined;
  children: ReactNode;
}

export function Band({
  level,
  title,
  description,
  footer,
  glass = false,
  id,
  children,
}: BandProps): ReactElement {
  const scale = SCALE[level];

  return (
    <Section
      reveal
      size={scale.size}
      {...(glass ? { glass: true } : {})}
      {...(id === undefined ? {} : { id })}
      {...(footer === undefined ? {} : { footer })}
    >
      <Section.Header>
        <Section.Title fz={scale.fz}>{title}</Section.Title>
        {description === undefined ? null : (
          <Section.Description maw={scale.measure}>{description}</Section.Description>
        )}
      </Section.Header>
      {children}
    </Section>
  );
}

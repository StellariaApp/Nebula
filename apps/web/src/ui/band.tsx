import { Badge, Box, Section } from "@stellaria/nebula-web";
import type { ReactElement, ReactNode } from "react";

export type BandLevel = "major" | "minor" | "strip" | "closing";

const SCALE = {
  major: { size: "xl", fz: "h2", measure: "60ch" },
  minor: { size: "lg", fz: "h3", measure: "64ch" },
  strip: { size: "md", fz: "h3", measure: "64ch" },
  closing: { size: "lg", fz: "h2", measure: "52ch" },
} as const;

export interface BandProps {
  level: BandLevel;
  title: ReactNode;
  eyebrow?: ReactNode | undefined;
  description?: ReactNode | undefined;
  footer?: ReactNode | undefined;
  glass?: boolean | undefined;
  center?: boolean | undefined;
  id?: string | undefined;
  /** Alto reservado del cuerpo mientras espera a entrar en pantalla. Medido, no estimado. */
  children: ReactNode;
}

export function Band({
  level,
  title,
  eyebrow,
  description,
  footer,
  glass = false,
  center = false,
  id,
  children,
}: BandProps): ReactElement {
  const scale = SCALE[level];

  return (
    <Section
      reveal
      size={scale.size}
      gap="lg"
      {...(glass ? { glass: true } : {})}
      {...(id === undefined ? {} : { id })}
      {...(footer === undefined ? {} : { footer })}
    >
      <Section.Header {...(center ? { justify: "center" } : {})}>
        <Section.Heading gap="sm" w="100%" {...(center ? { align: "center", ta: "center" } : {})}>
          {eyebrow === undefined ? null : (
            <Box display="flex" {...(center ? { justify: "center" } : {})}>
              <Badge variant="light" size="sm">
                {eyebrow}
              </Badge>
            </Box>
          )}
          <Section.Title fz={scale.fz} ls="tight">
            {title}
          </Section.Title>
          {description === undefined ? null : (
            <Section.Description maw={scale.measure}>{description}</Section.Description>
          )}
        </Section.Heading>
      </Section.Header>
      <Section.Body>{children}</Section.Body>
    </Section>
  );
}

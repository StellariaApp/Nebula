import { Anchor, Box, Card, Text } from "@stellaria/nebula-web";
import Link from "next/link";
import type { ReactElement } from "react";

import type { DocEntry } from "../lib/content";
import type { Dictionary } from "../lib/dictionary";

export interface DocNavProps {
  previous: DocEntry | undefined;
  next: DocEntry | undefined;
  /** La raíz de la sección: los dos pasos cuelgan de ella. */
  base: string;
  dict: Dictionary;
}

function Step({
  entry,
  base,
  label,
  align,
}: {
  entry: DocEntry;
  base: string;
  label: string;
  align: "flex-start" | "flex-end";
}): ReactElement {
  return (
    <Anchor component={Link} href={`${base}/${entry.slug.join("/")}`} td="none" w="100%">
      <Card withBorder r="lg" padding="md">
        <Box display="flex" direction="column" gap="xxs" align={align}>
          <Text fz="caption" c="text.muted">
            {label}
          </Text>
          <Text fz="body2" fw="semibold" c="text.primary">
            {entry.title}
          </Text>
        </Box>
      </Card>
    </Anchor>
  );
}

export function DocNav({ previous, next, base, dict }: DocNavProps): ReactElement | null {
  if (previous === undefined && next === undefined) return null;

  return (
    <Box
      component="nav"
      aria-label={dict["nav.section.learn"]}
      display="flex"
      gap="md"
      mt="xl"
      pt="lg"
      bdtw={1}
      bdts="solid"
      bdc="border.subtle"
    >
      {previous === undefined ? (
        <Box w="100%" />
      ) : (
        <Step entry={previous} base={base} label={dict["doc.previous"] ?? ""} align="flex-start" />
      )}
      {next === undefined ? (
        <Box w="100%" />
      ) : (
        <Step entry={next} base={base} label={dict["doc.next"] ?? ""} align="flex-end" />
      )}
    </Box>
  );
}

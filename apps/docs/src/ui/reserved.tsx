import { Badge, Box, Button, EmptyState, Text } from "@stellaria/nebula-web";

import { GuidesHome } from "../lib/content";
import { Dict } from "../lib/dictionary";
import { CurrentLang } from "../lib/lang";
import { SectionHref } from "../lib/sections";
import { PageHeader } from "./page-header";

const CLOCK = (
  <svg
    viewBox="0 0 24 24"
    width="28"
    height="28"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

export interface ReservedProps {
  heading: string;
  /** Qué aterriza aquí y cuándo. Sin ella la pantalla dice lo genérico de `reserved.empty.body`. */
  note?: string | undefined;
}

export async function Reserved({ heading, note }: ReservedProps) {
  const lang = await CurrentLang();
  const dict = await Dict(lang, "chrome");

  return (
    <Box display="flex" direction="column">
      <PageHeader
        title={dict[heading]}
        description={dict["reserved.body"]}
        eyebrow={dict["reserved.title"]}
      />

      <Box position="relative" overflow="hidden" r="xl" bdw={1} bds="solid" bdc="border.subtle">
        <Box position="relative" z={1} py="xxl" px="lg">
          <EmptyState
            size="lg"
            icon={CLOCK}
            title={dict["reserved.empty.title"]}
            description={note === undefined ? dict["reserved.empty.body"] : dict[note]}
            actions={
              <Box display="flex" gap="sm" wrap="wrap" justify="center">
                <Button component="a" href={SectionHref("components")} variant="gradient">
                  {dict["section.components"]}
                </Button>
                <Button component="a" href={await GuidesHome(lang)} variant="glass">
                  {dict["nav.docs"]}
                </Button>
              </Box>
            }
          />
        </Box>
      </Box>

      <Box display="flex" justify="center" mt="lg">
        <Badge variant="light" color="warning" size="sm">
          <Text component="span" fz="caption">
            {dict["reserved.eta"]}
          </Text>
        </Badge>
      </Box>
    </Box>
  );
}

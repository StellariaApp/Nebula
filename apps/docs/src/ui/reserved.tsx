import { Anchor, Box, EmptyState } from "@stellaria/nebula-web";

import { Dict } from "../lib/dictionary";
import { PageHeader } from "./page-header";
import type { Lang } from "../lib/i18n";

const CLOCK = (
  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

export async function Reserved({ lang, heading }: { lang: Lang; heading: string }) {
  const dict = await Dict(lang, "chrome");

  return (
    <Box display="flex" direction="column">
      <PageHeader
        title={dict[heading]}
        description={dict["reserved.body"]}
        eyebrow={dict["reserved.title"]}
      />
      <EmptyState
        size="lg"
        icon={CLOCK}
        title={dict["reserved.empty.title"]}
        description={dict["reserved.empty.body"]}
        actions={<Anchor href="/components">{dict["nav.components"]}</Anchor>}
      />
    </Box>
  );
}

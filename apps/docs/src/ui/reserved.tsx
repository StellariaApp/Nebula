import { Anchor, Box, EmptyState } from "@stellaria/nebula-web";

import { Dict } from "../lib/dictionary";
import { CurrentLang } from "../lib/lang";
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

export async function Reserved({ heading }: { heading: string }) {
  const dict = await Dict(await CurrentLang(), "chrome");

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

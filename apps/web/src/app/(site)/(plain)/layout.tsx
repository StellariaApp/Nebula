import type { ReactNode } from "react";

import { AppShell, Box } from "@stellaria/nebula-web";

import { Dict } from "../../../lib/dictionary";
import { CurrentLang } from "../../../lib/lang";
import { Momentum } from "../../../islands/momentum";
import { NAV_HEIGHT, SHELL_WIDTH } from "../../../lib/layout";
import { SiteFooter } from "../../../ui/site-footer";

const MAIN_ID = "plain-main";

export default async function PlainLayout({ children }: { children: ReactNode }) {
  const lang = await CurrentLang();
  const dict = await Dict(lang, "chrome");

  return (
    <AppShell
      z={1}
      grow={1}
      miw={0}
      mih={0}
      h="auto"
      contentId={MAIN_ID}
      mainProps={{ pt: NAV_HEIGHT }}
      labels={{ skipToContent: dict["skip.content"] ?? "" }}
    >
      <Box display="flex" direction="column" w="100%" maw={SHELL_WIDTH} mx="auto">
        {children}
        <Box mt="xl">
          <SiteFooter dict={dict} id="plain-foot-logo" />
        </Box>
      </Box>
      <Momentum target={`#${MAIN_ID}`} />
    </AppShell>
  );
}

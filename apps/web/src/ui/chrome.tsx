import type { ReactElement, ReactNode } from "react";

import { Box } from "@stellaria/nebula-web";

import { GuidesHome } from "../lib/content";
import type { Dictionary } from "../lib/dictionary";
import { LANGS, type Lang } from "../lib/i18n";
import { NAV_HEIGHT, SHELL_WIDTH } from "../lib/layout";
import { SectionHref } from "../lib/sections";
import { LangSwitch } from "../islands/lang-switch";
import { Search } from "../islands/search";
import { SiteNav } from "../islands/site-nav";
import { ThemePanel } from "../islands/theme-panel";
import { GuidesDrawer } from "./guides-drawer";
import { SiteBackground } from "./site-background";

interface ChromeProps {
  lang: Lang;
  dict: Dictionary;
  children: ReactNode;
}

export async function Chrome({ lang, dict, children }: ChromeProps): Promise<ReactElement> {
  const guides = await GuidesHome(lang);

  const PANEL = {
    open: dict["panel.open"] ?? "",
    close: dict["panel.close"] ?? "",
    region: dict["panel.region"] ?? "",
    lede: dict["panel.lede"] ?? "",
    product: dict["panel.product"] ?? "",
    scheme: dict["panel.scheme"] ?? "",
    dark: dict["panel.dark"] ?? "",
    light: dict["panel.light"] ?? "",
    motion: dict["panel.motion"] ?? "",
    glass: dict["panel.glass"] ?? "",
    corner: dict["panel.corner"] ?? "",
    density: dict["panel.density"] ?? "",
  };

  return (
    <Box display="flex" direction="column" h="100dvh">
      <SiteBackground ambient />

      <Box position="fixed" top={0} left={0} right={0} z="sticky">
        <SiteNav
          floating={false}
          collapse="laptop"
          contentWidth={SHELL_WIDTH}
          height={NAV_HEIGHT}
          drawer={<GuidesDrawer lang={lang} dict={dict} />}
          links={[
            { href: guides, label: dict["nav.docs"] ?? "" },
            { href: SectionHref("components"), label: dict["section.components"] ?? "" },
            { href: "/theme", label: dict["nav.theme"] ?? "" },
          ]}
          labels={{
            site: dict["site.name"] ?? "",
            nav: dict["nav.section.reference"] ?? "",
            cta: dict["home.cta.start"] ?? "",
            menuOpen: dict["nav.menu.open"] ?? "",
            menuClose: dict["nav.menu.close"] ?? "",
            drawer: dict["nav.drawer.label"] ?? "",
          }}
          actions={
            <>
              <Search
                labels={{
                  trigger: dict["search.trigger"] ?? "",
                  input: dict["search.label"] ?? "",
                  placeholder: dict["search.placeholder"] ?? "",
                  empty: dict["search.empty"] ?? "",
                  loading: dict["search.loading"] ?? "",
                  frequent: dict["search.frequent"] ?? "",
                }}
              />
              <ThemePanel anchored labels={PANEL} />
              {LANGS.length > 1 && <LangSwitch lang={lang} label={dict["lang.switch"] ?? ""} />}
            </>
          }
        />
      </Box>

      {children}
    </Box>
  );
}

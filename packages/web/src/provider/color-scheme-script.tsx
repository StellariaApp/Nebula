import type { ColorScheme } from "@stellaria/nebula-tokens";
import type { ReactElement } from "react";

import {
  OFFICIAL_CLASSES,
  OFFICIAL_THEME,
  type ThemeClassMap,
} from "../theme/identity.js";

export interface ColorSchemeScriptProps {
  /** The identity to fall back to when nothing is stored, or what is stored is not recognised. */
  defaultTheme?: string;
  /** The scheme to fall back to, under that identity. */
  defaultScheme?: ColorScheme;
  storageKey?: string;
  nonce?: string;
  /**
   * Which themes this script knows, and the class each scheme of each one puts on `<html>`
   * (ADR-155, ADR-166). Defaults to the official pair, so leaving it out behaves as before.
   *
   * Pass your own to have a theme of your own survive the reload without a flash. Registering it
   * means materialising it as a class — `createTheme` at your build, or `CompileTheme` at runtime —
   * not as inline vars.
   *
   * The scheme is **read off this map**, not guessed from the name, so a theme can be called
   * whatever it likes.
   */
  themes?: ThemeClassMap;
}

export function ColorSchemeScript({
  defaultTheme = OFFICIAL_THEME,
  defaultScheme,
  storageKey = "nebula-theme",
  nonce,
  themes,
}: ColorSchemeScriptProps): ReactElement {
  /**
   * `defaultTheme="dark"` is how this was called before ADR-166, when the name of a theme WAS its
   * scheme. Reading it as an identity leaves `<html>` with no class at all and the page unstyled,
   * so a scheme here still means a scheme.
   */
  const named_scheme = defaultTheme === "dark" || defaultTheme === "light" ? defaultTheme : undefined;
  const identity = named_scheme === undefined ? defaultTheme : OFFICIAL_THEME;
  const scheme = defaultScheme ?? named_scheme ?? "dark";

  /** The official pair is always in the map: it is the floor that keeps the page from going bare. */
  const map = themes === undefined ? OFFICIAL_CLASSES : { ...OFFICIAL_CLASSES, ...themes };

  const script =
    `(function(){try{` +
    `var d=document.documentElement;` +
    `var c=${JSON.stringify(map)},o=${JSON.stringify(OFFICIAL_THEME)};` +
    `var dt=${JSON.stringify(identity)},ds=${JSON.stringify(scheme)};` +
    `var v=window.localStorage.getItem(${JSON.stringify(storageKey)})||"";` +
    `var i=v.indexOf(":");` +
    `var t=i>-1?v.slice(0,i):dt,s=i>-1?v.slice(i+1):(v==="dark"||v==="light"?v:ds);` +
    `if(s!=="dark"&&s!=="light")s=ds;` +
    `if(!c[t]||!c[t][s])t=dt;` +
    `if(!c[t]||!c[t][s])t=o;` +
    `if(!c[t]||!c[t][s])s=ds;` +
    `for(var k in c)for(var m in c[k])d.classList.remove(c[k][m]);` +
    `if(c[t]&&c[t][s])d.classList.add(c[t][s]);` +
    `d.setAttribute("data-theme",t);` +
    `d.setAttribute("data-scheme",s);` +
    `d.style.colorScheme=s;` +
    `}catch(e){}})();`;

  return (
    <script nonce={nonce} suppressHydrationWarning dangerouslySetInnerHTML={{ __html: script }} />
  );
}

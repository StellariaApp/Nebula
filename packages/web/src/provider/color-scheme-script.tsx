import type { ReactElement } from "react";

import { themeClass } from "../theme/themes.css.js";

export interface ColorSchemeScriptProps {
  defaultTheme?: string;
  storageKey?: string;
  nonce?: string;
  /**
   * Which theme names this script knows, and the class each one puts on `<html>`. Defaults to the
   * official themes, so leaving it out behaves as before (ADR-155).
   *
   * Pass your own to have a theme of your own survive the reload without a flash: a name the script
   * does not know falls back to `defaultTheme`, which is what makes a custom theme flash today.
   * Registering it means materialising it as a class — `createTheme` — not as inline vars.
   *
   * The scheme is read off the NAME: a key containing `dark` is taken as dark, anything else as
   * light. Name yours the way the official ones are named, or `color-scheme` will come out wrong.
   */
  themes?: Record<string, string>;
}

export function ColorSchemeScript({
  defaultTheme = "light",
  storageKey = "nebula-theme",
  nonce,
  themes = themeClass,
}: ColorSchemeScriptProps): ReactElement {
  const script =
    `(function(){try{` +
    `var d=document.documentElement;` +
    `var c=${JSON.stringify(themes)};` +
    `var t=window.localStorage.getItem(${JSON.stringify(storageKey)})||${JSON.stringify(defaultTheme)};` +
    `if(!c[t])t=${JSON.stringify(defaultTheme)};` +
    `var s=t.indexOf("dark")>-1?"dark":"light";` +
    `for(var k in c)d.classList.remove(c[k]);` +
    `if(c[t])d.classList.add(c[t]);` +
    `d.setAttribute("data-nebula-theme",t);` +
    `d.setAttribute("data-scheme",s);` +
    `d.style.colorScheme=s;` +
    `}catch(e){}})();`;

  return (
    <script nonce={nonce} suppressHydrationWarning dangerouslySetInnerHTML={{ __html: script }} />
  );
}

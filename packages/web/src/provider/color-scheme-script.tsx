import type { ReactElement } from "react";

import { themeClass } from "../theme/themes.css.js";

export interface ColorSchemeScriptProps {
  defaultTheme?: string;
  storageKey?: string;
  nonce?: string;
}

export function ColorSchemeScript({
  defaultTheme = "light",
  storageKey = "nebula-theme",
  nonce,
}: ColorSchemeScriptProps): ReactElement {
  const script =
    `(function(){try{` +
    `var d=document.documentElement;` +
    `var c=${JSON.stringify(themeClass)};` +
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

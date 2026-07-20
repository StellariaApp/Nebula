import type { ReactElement } from "react";

export interface ColorSchemeScriptProps {
  defaultTheme?: string;
  storageKey?: string;
  nonce?: string;
}

export function ColorSchemeScript({
  defaultTheme = "nebula-light",
  storageKey = "nebula-theme",
  nonce,
}: ColorSchemeScriptProps): ReactElement {
  const script =
    `(function(){try{` +
    `var d=document.documentElement;` +
    `var t=window.localStorage.getItem(${JSON.stringify(storageKey)})||${JSON.stringify(defaultTheme)};` +
    `d.setAttribute("data-nebula-theme",t);` +
    `d.style.colorScheme=t.indexOf("dark")>-1?"dark":"light";` +
    `}catch(e){}})();`;

  return (
    <script nonce={nonce} suppressHydrationWarning dangerouslySetInnerHTML={{ __html: script }} />
  );
}

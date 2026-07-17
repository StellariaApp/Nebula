import type { ReactElement } from "react";

export interface ColorSchemeScriptProps {
  /** Tema por defecto si no hay nada persistido. Default `nebula-light`. */
  defaultTheme?: string;
  /** Clave de storage — debe coincidir con la del `NebulaProvider`. Default `nebula-theme`. */
  storageKey?: string;
  /** `nonce` para CSP estricta (Next 16, etc.). */
  nonce?: string;
}

/**
 * Script anti-flash SSR (docs/02 §4). Se monta en el `<head>` y corre ANTES de
 * hidratar: lee el tema persistido y fija `data-nebula-theme` + `color-scheme` en
 * `<html>`, evitando el parpadeo de fondo entre el HTML del servidor y el tema del
 * usuario. El esquema se deriva del nombre del tema (heurística `*dark*`), suficiente
 * para el `color-scheme` inicial; el `NebulaProvider` fija el tema exacto al montar.
 */
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

  return <script nonce={nonce} suppressHydrationWarning dangerouslySetInnerHTML={{ __html: script }} />;
}

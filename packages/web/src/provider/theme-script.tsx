import type { ColorScheme } from "@stellaria/nebula-tokens";
import type { ReactElement } from "react";

import {
  DEFAULT_CLASSES,
  DEFAULT_STORAGE_KEYS,
  DEFAULT_THEME,
  type ThemeClassMap,
} from "@stellaria/nebula-themes/web";

export interface ThemeScriptProps {
  /** The identity to fall back to when nothing is stored, or what is stored is not recognised. */
  defaultTheme?: string;
  /** The scheme to fall back to, under that identity. */
  defaultScheme?: ColorScheme;
  /** Un nombre por eje (ADR-167). El provider tiene que recibir los mismos. */
  storageKeys?: { theme?: string; scheme?: string };
  nonce?: string;
  themesClasses?: ThemeClassMap;
  /**
   * El CSS de esos temas, que sale de `@stellaria/nebula-themes/all/web` o de `CompileTheme`.
   *
   * Se emite como `<style>` justo antes del script y con el mismo `nonce`: sin la regla puesta, la
   * clase que el script anade no pinta nada. Van juntos porque separarlos es una carrera.
   */
  themesCSS?: string;
}

export function ThemeScript({
  defaultTheme,
  defaultScheme,
  storageKeys,
  nonce,
  themesClasses,
  themesCSS,
}: ThemeScriptProps): ReactElement {
  const map =
    themesClasses === undefined ? DEFAULT_CLASSES : { ...DEFAULT_CLASSES, ...themesClasses };
  const keys = { ...DEFAULT_STORAGE_KEYS, ...storageKeys };
  const theme = defaultTheme ?? DEFAULT_THEME;
  const scheme = defaultScheme ?? "dark";

  const script = `
(function() {
  var keys = ${JSON.stringify(keys)};
  var map = ${JSON.stringify(map)};
  var html = window.document.documentElement;

  // localStorage tira en Safari privado y con cookies bloqueadas. Sin esto, la excepcion se lleva
  // por delante el resto del script y la pagina se queda sin ninguna clase de tema: HTML pelado.
  var read = function(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  };
  var write = function(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (error) {
      return;
    }
  };

  var storedTheme = read(keys.theme);
  var storedScheme = read(keys.scheme);
  if (!storedTheme) write(keys.theme, "${theme}");
  if (!storedScheme) write(keys.scheme, "${scheme}");

  var scheme = storedScheme === "dark" || storedScheme === "light" ? storedScheme : "${scheme}";
  // Se resuelve la identidad ANTES de anunciarla: si lo guardado no esta en el mapa, data-theme
  // tiene que decir el que de verdad se pinto, no el que no existe.
  var theme = storedTheme && map[storedTheme] ? storedTheme : "${theme}";
  if (!map[theme]) theme = "${DEFAULT_THEME}";
  if (!map[theme][scheme]) scheme = "${scheme}";

  // Se retiran TODAS las clases del mapa, no solo el otro esquema de la identidad elegida: al
  // cambiar de identidad entre recargas, la anterior se quedaba puesta y se apilaban.
  for (var name in map) {
    for (var variant in map[name]) html.classList.remove(map[name][variant]);
  }

  html.classList.add(map[theme][scheme]);
  html.setAttribute("data-theme", theme);
  html.setAttribute("data-scheme", scheme);
  html.style.colorScheme = scheme;
})();
  `;

  return (
    <>
      {themesCSS && <style dangerouslySetInnerHTML={{ __html: themesCSS }} />}
      <script nonce={nonce} suppressHydrationWarning dangerouslySetInnerHTML={{ __html: script }} />
    </>
  );
}

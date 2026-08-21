"use client";

import { THEME_NAMES, ThemeScheme } from "@stellaria/nebula-themes";
import { DEFAULT_THEME, type ThemeClassMap, type ThemeVariants } from "@stellaria/nebula-themes/web";
import { NebulaProvider, useTheme } from "@stellaria/nebula-web";
import { useEffect, type ReactNode } from "react";

import { EnsureThemeRest } from "../lib/theme-rest";

/**
 * Empareja los temas del panel con las clases que el servidor ya emitio.
 *
 * Del servidor solo cruzan los nombres de clase —20 cadenas—, no los temas. Los objetos se
 * reconstruyen aqui con `ThemeScheme`, que el panel ya importa de todas formas, asi que el bundle de
 * cliente no gana ni un tema serializado ni `CompileTheme`.
 */
function Registry(classes: ThemeClassMap): Record<string, ThemeVariants> {
  const out: Record<string, ThemeVariants> = {};
  for (const name of THEME_NAMES) {
    const pair = classes[name];
    if (pair === undefined) continue;
    out[name] = {
      dark: { theme: ThemeScheme(name, "dark"), className: pair.dark },
      light: { theme: ThemeScheme(name, "light"), className: pair.light },
    };
  }
  return out;
}

/**
 * La hoja de los quince temas que el HTML no incrusta, pedida desde el tema activo y no desde quien
 * lo cambia (ADR-175).
 *
 * El panel la pide al abrirse y el script de arranque cuando lo guardado no es el tema incrustado,
 * pero el panel no es el unico interruptor: el segmento de la portada tambien cambia la identidad, y
 * sin nada en `localStorage` el arranque no pide nada porque el tema activo ES el incrustado. La
 * clase entraba en `<html>` sin regla que la pintara, asi que el sitio no cambiaba hasta que abrir
 * el panel traia la hoja. Colgado del tema activo cubre a cualquier interruptor, este o el que venga.
 */
function ThemeRest(): null {
  const { themeName } = useTheme();

  useEffect(() => {
    if (themeName !== DEFAULT_THEME) EnsureThemeRest();
  }, [themeName]);

  return null;
}

export function ProductProvider({
  themesClasses,
  children,
}: {
  themesClasses: ThemeClassMap;
  children: ReactNode;
}) {
  return (
    <NebulaProvider themes={Registry(themesClasses)} defaultTheme="dark" applyTheme="root">
      <ThemeRest />
      {children}
    </NebulaProvider>
  );
}

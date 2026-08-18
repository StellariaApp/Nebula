"use client";

import { NebulaProvider } from "@stellaria/nebula-web";
import type { ThemeClassMap, ThemeVariants } from "@stellaria/nebula-themes/web";
import { THEME_NAMES, ThemeScheme } from "@stellaria/nebula-themes";
import type { ReactNode } from "react";

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

export function ProductProvider({
  classes,
  children,
}: {
  classes: ThemeClassMap;
  children: ReactNode;
}) {
  return (
    <NebulaProvider themes={Registry(classes)} defaultTheme="dark" applyTheme="root">
      {children}
    </NebulaProvider>
  );
}

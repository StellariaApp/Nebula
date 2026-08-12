import { StarField } from "@stellaria/nebula-web";
import type { ReactElement } from "react";

export interface SiteBackgroundProps {
  /**
   * Baja el campo un peldaño para las páginas de lectura y de tabla: menos estrellas y la rejilla al
   * mínimo. Es la calibración que ADR-129 fija para el cromado; sin ella manda la de la portada.
   */
  ambient?: boolean | undefined;
}

export function SiteBackground({ ambient = false }: SiteBackgroundProps = {}): ReactElement {
  return (
    <StarField
      fixed
      parallax
      aurora
      density={ambient ? "sm" : "md"}
      translucency={ambient ? 1 : 2}
    />
  );
}

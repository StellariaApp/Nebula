"use client";

import type { ComponentPropsWithoutRef, ReactElement, ReactNode } from "react";

import type { ColorExtended } from "@stellaria/nebula-tokens";
import { useTheme } from "@stellaria/nebula-hooks";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { ResolveVariant, VariantRefs, vars } from "@stellaria/nebula-themes/web";
import { LengthToCss } from "../../../utils/token-css.js";

import type { HeroProps, HeroVariant } from "../Hero.types.js";
import * as variables from "../Hero.vars.css.js";

const PERCENT = 100;

export interface HeroSurfaceProps extends ComponentPropsWithoutRef<"section"> {
  variant: HeroVariant;
  color: ColorExtended;
  overlayOpacity: number;
  contentWidth: NonNullable<HeroProps["contentWidth"]>;
  hasImage: boolean;
  children: ReactNode;
}

/**
 * La banda, y lo ÚNICO de `Hero` que necesita el tema en runtime.
 *
 * Existe para que `Hero` pueda ser de servidor: lo que un componente de servidor pasa como
 * `children` a uno de cliente SIGUE SIENDO DE SERVIDOR, así que el título, las acciones y todo lo
 * que la banda envuelve se quedan fuera del cliente. Solo hidrata esta cáscara.
 *
 * Es la alternativa al par `Body`/`Flat` de ADR-150: aquel duplica el marcado en dos archivos y sirve
 * para hojas; éste no lo duplica y sirve para contenedores, que es donde está el pago.
 */
export function HeroSurface(props: HeroSurfaceProps): ReactElement {
  const { variant, color, overlayOpacity, contentWidth, hasImage, children, style, ...section } =
    props;
  const { theme } = useTheme();
  const resolved = ResolveVariant(variant, color, theme);
  const refs = VariantRefs(variant, color, theme);

  const css_vars = assignInlineVars({
    [variables.contentMax]: LengthToCss(contentWidth),
    [variables.bg]: refs?.background ?? resolved.background,
    [variables.fg]: color === "transparent" ? vars.color.text.primary : resolved.foreground,
    [variables.borderColor]: refs?.borderColor ?? resolved.borderColor,
    [variables.borderWidth]: refs?.borderWidth ?? resolved.borderWidth,
    [variables.backdropFilter]: refs?.backdropFilter ?? resolved.backdropFilter,
    [variables.veil]: hasImage
      ? `color-mix(in srgb, ${resolved.background} ${String(Math.round(overlayOpacity * PERCENT))}%, transparent)`
      : "transparent",
  });

  return (
    <section {...section} style={{ ...css_vars, ...style }}>
      {children}
    </section>
  );
}

HeroSurface.displayName = "Hero.Surface";

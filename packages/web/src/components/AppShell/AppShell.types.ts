import type { ReactNode, RefObject } from "react";

import type { GlassLevel } from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";

export interface AppShellLabels {
  skipToContent: string;
  navigation: string;
  complementary: string;
}

export interface AppShellProps extends Omit<StyleProps, "color" | "header"> {
  children?: ReactNode | undefined;
  header?: ReactNode | undefined;
  navbar?: ReactNode | undefined;
  aside?: ReactNode | undefined;
  footer?: ReactNode | undefined;
  navbarOpened?: boolean | undefined;
  defaultNavbarOpened?: boolean | undefined;
  onNavbarChange?: ((opened: boolean) => void) | undefined;
  navbarWidth?: number | undefined;
  asideWidth?: number | undefined;
  headerHeight?: number | undefined;
  collapsedWidth?: number | undefined;
  collapsible?: boolean | undefined;
  padded?: boolean | undefined;
  labels?: Partial<AppShellLabels> | undefined;
  contentId?: string | undefined;
  className?: string | undefined;
  /** Barra a altura completa. Su presencia cambia el shell al montaje de carril. */
  sidebar?: ReactNode | undefined;
  /** Capa decorativa detrás de todo: es donde vive un `StarField`. */
  backdrop?: ReactNode | undefined;
  sidebarWidth?: number | undefined;
  /** Tercer estado del carril: la barra encoge a `sidebarMiniWidth` y sus rótulos se ocultan. */
  sidebarCollapsed?: boolean | undefined;
  sidebarMiniWidth?: number | undefined;
  chromeHeight?: number | undefined;
  /** El `main` es quien desplaza en el carril; se expone para engancharle un fondo con parallax. */
  mainRef?: RefObject<HTMLElement | null> | undefined;
  /** Vela de sombra al inicio del área que desplaza; aparece bajo el cromado, no sobre él. */
  scrollShadow?: boolean | undefined;
  /** Desde qué altura se pega la vela: sirve para dejarla bajo un cromado pegajoso. */
  scrollShadowOffset?: number | undefined;
}

export interface AppShellRailProps extends Omit<StyleProps, "color" | "header" | "background"> {
  children?: ReactNode | undefined;
  /** Barra a altura completa. Su presencia cambia el shell al modo carril. */
  sidebar?: ReactNode | undefined;
  /** Capa decorativa detrás de todo: es donde vive un `StarField`. */
  backdrop?: ReactNode | undefined;
  sidebarWidth?: number | undefined;
  chromeHeight?: number | undefined;
  labels?: Partial<AppShellLabels> | undefined;
  contentId?: string | undefined;
  className?: string | undefined;
}

export interface AppShellSlotProps {
  children?: ReactNode | undefined;
  className?: string | undefined;
}

export interface AppShellLinksProps extends StyleProps {
  children?: ReactNode | undefined;
  /** Rótulo del grupo. Se va al encoger, como el resto de rótulos del carril. */
  title?: ReactNode | undefined;
  action?: ReactNode | undefined;
  className?: string | undefined;
  deep?: boolean | undefined;
}

export interface AppShellSidebarProps {
  children?: ReactNode | undefined;
  level?: GlassLevel | undefined;
  /** Con callback, la barra pinta su propio botón de encoger. Desaparece bajo `laptop`. */
  collapsed?: boolean | undefined;
  onCollapse?: ((collapsed: boolean) => void) | undefined;
  collapseLabels?: { collapse: string; expand: string } | undefined;
  className?: string | undefined;
  "aria-label"?: string | undefined;
}

export interface AppShellSectionProps {
  children: ReactNode;
  className?: string | undefined;
  "aria-label"?: string | undefined;
  "aria-labelledby"?: string | undefined;
}

export interface AppShellHeaderProps {
  title?: ReactNode | undefined;
  subtitle?: ReactNode | undefined;
  order?: 1 | 2 | 3 | 4 | 5 | 6 | undefined;
  actions?: ReactNode | undefined;
  children?: ReactNode | undefined;
  level?: GlassLevel | undefined;
  /** En el montaje con rejilla, la cabecera se pega arriba y toma su área. */
  sticky?: boolean | undefined;
  className?: string | undefined;
}

export interface AppShellNavProps {
  children?: ReactNode | undefined;
  level?: GlassLevel | undefined;
  className?: string | undefined;
  "aria-label"?: string | undefined;
}

export interface AppShellFooterProps {
  children?: ReactNode | undefined;
  level?: GlassLevel | undefined;
  className?: string | undefined;
}

export interface AppShellSubbarProps {
  children: ReactNode;
  level?: GlassLevel | undefined;
  /** Se queda pegada justo debajo de la cabecera al desplazar. */
  sticky?: boolean | undefined;
  className?: string | undefined;
}

export interface AppShellContentProps extends Omit<StyleProps, "color"> {
  children: ReactNode;
  className?: string | undefined;
}

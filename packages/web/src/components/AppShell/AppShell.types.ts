import type { ComponentPropsWithoutRef, ReactNode, RefObject } from "react";

import type { GlassLevel } from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";
import type { ActionIconProps } from "../ActionIcon/ActionIcon.types.js";
import type { BoxSlotProps } from "../Box/Box.types.js";
import type { TextSlotProps } from "../Text/Text.types.js";
import type { TitleOrder, TitleSlotProps } from "../Title/Title.types.js";

export interface AppShellLabels {
  skipToContent: string;
  navigation: string;
  complementary: string;
}

export interface AppShellProps extends StyleProps {
  /** El enlace de salto al contenido, que solo se ve al recibir foco. Existe en los dos montajes. */
  skipProps?: ComponentPropsWithoutRef<"a"> | undefined;
  /** La banda del cromado superior. Solo existe en el montaje de carril, y solo si hay `header`. */
  chromeProps?: BoxSlotProps | undefined;
  /** El `main`. En el carril es ademas quien desplaza; su ref se pasa aparte, por `mainRef`. */
  mainProps?: BoxSlotProps | undefined;
  /** La vela de sombra del inicio del area que desplaza. Solo en el carril y con `scrollShadow`. */
  scrollShadowProps?: BoxSlotProps | undefined;
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
  /** @default 320 */
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

export interface AppShellRailProps extends StyleProps {
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

export interface AppShellSlotProps extends StyleProps {
  children?: ReactNode | undefined;
  className?: string | undefined;
}

export interface AppShellLinksProps extends StyleProps {
  /** La cabecera del grupo. No se pinta si no hay `title` ni `action`. */
  headerProps?: BoxSlotProps | undefined;
  /** El rótulo de esa cabecera. Solo se pinta con `title`. */
  titleProps?: TextSlotProps | undefined;
  /**
   * La columna de enlaces. Con el grupo `deep` pierde el borde inferior —y el relleno del carril
   * cuando está encogido o en pantalla estrecha—, para que el grupo anide sin costura.
   */
  contentProps?: BoxSlotProps | undefined;
  children?: ReactNode | undefined;
  /** Rótulo del grupo. Se va al encoger, como el resto de rótulos del carril. */
  title?: ReactNode | undefined;
  action?: ReactNode | undefined;
  className?: string | undefined;
  deep?: boolean | undefined;
}

export interface AppShellLabelProps extends Omit<StyleProps, "flex"> {
  children: ReactNode;
  className?: string | undefined;
  /** El rótulo ocupa el hueco libre de la fila. Tapa a la style prop `flex`, que aquí no aplica. */
  flex?: boolean | undefined;
}

export interface AppShellSidebarProps extends StyleProps {
  /** El anclaje del botón de encoger. No se pinta sin `onCollapse`. */
  toggleProps?: BoxSlotProps | undefined;
  /** Ese botón. Lleva `aria-expanded`, que es de donde sale el giro del chevron. */
  collapseProps?: ActionIconProps | undefined;
  children?: ReactNode | undefined;
  level?: GlassLevel | undefined;
  /** Con callback, la barra pinta su propio botón de encoger. Desaparece bajo `laptop`. */
  collapsed?: boolean | undefined;
  onCollapse?: ((collapsed: boolean) => void) | undefined;
  collapseLabels?: { collapse: string; expand: string } | undefined;
  className?: string | undefined;
  "aria-label"?: string | undefined;
}

export interface AppShellSectionProps extends StyleProps {
  children: ReactNode;
  className?: string | undefined;
  "aria-label"?: string | undefined;
  "aria-labelledby"?: string | undefined;
}

export interface AppShellHeaderProps extends Omit<StyleProps, "order"> {
  /** La columna de título y subtítulo. No se pinta si le pasas `children`, que la sustituye. */
  contentProps?: BoxSlotProps | undefined;
  /** El título. Su nivel de encabezado sale de `order`, no del tamaño. */
  titleProps?: TitleSlotProps | undefined;
  /** El subtítulo. Solo se pinta con `subtitle`. */
  subtitleProps?: TextSlotProps | undefined;
  title?: ReactNode | undefined;
  subtitle?: ReactNode | undefined;
  order?: TitleOrder | undefined;
  actions?: ReactNode | undefined;
  children?: ReactNode | undefined;
  level?: GlassLevel | undefined;
  /** En el montaje con rejilla, la cabecera se pega arriba y toma su área. */
  sticky?: boolean | undefined;
  className?: string | undefined;
}

export interface AppShellNavProps extends StyleProps {
  children?: ReactNode | undefined;
  level?: GlassLevel | undefined;
  className?: string | undefined;
  "aria-label"?: string | undefined;
}

export interface AppShellFooterProps extends StyleProps {
  children?: ReactNode | undefined;
  level?: GlassLevel | undefined;
  className?: string | undefined;
}

export interface AppShellSubbarProps extends StyleProps {
  children: ReactNode;
  level?: GlassLevel | undefined;
  /** Se queda pegada justo debajo de la cabecera al desplazar. */
  sticky?: boolean | undefined;
  className?: string | undefined;
}

export interface AppShellContentProps extends StyleProps {
  children: ReactNode;
  className?: string | undefined;
}

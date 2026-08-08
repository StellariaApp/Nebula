import type { ReactNode } from "react";

import type { OverlayTriggerElement, PopoverPlacement } from "../Popover/Popover.types.js";
import type { StyleProps } from "../../utils/style-props.js";

export interface TooltipProps extends Omit<StyleProps, "maw"> {
  /** El elemento que lo dispara. Recibe el `ref` y el `aria-describedby`, asi que tiene que reenviarlos. */
  trigger: OverlayTriggerElement;
  /**
   * El texto del globo. Llega por `aria-describedby`, que **describe**: no sustituye al nombre del
   * disparador, asi que un boton solo con icono sigue necesitando su `aria-label`.
   */
  label: ReactNode;
  /** La posicion PEDIDA. Si no cabe, React Aria la cambia. */
  placement?: PopoverPlacement | undefined;
  /** Separacion del disparador, en px, en el eje de `placement`. */
  offset?: number | undefined;
  /** Desplazamiento en el eje perpendicular, en px. */
  crossOffset?: number | undefined;
  /** Espera antes de abrir al apuntar. En cero abre al entrar. @default 0 */
  delay?: number | undefined;
  /** Espera antes de cerrar al salir, que es lo que permite cruzar del disparador al globo. @default 150 */
  closeDelay?: number | undefined;
  /** No se pinta ni se anuncia. El disparador se queda sin su descripcion, asi que no vale para ocultarlo a ratos. */
  disabled?: boolean | undefined;
  /** Pasarlo lo vuelve controlado: el puntero y el foco dejan de abrirlo y solo emite `onOpenChange`. */
  opened?: boolean | undefined;
  defaultOpened?: boolean | undefined;
  onOpenChange?: ((opened: boolean) => void) | undefined;
  withArrow?: boolean | undefined;
  color?: "neutral" | "inverted" | undefined;
  /** Ancho maximo del globo. Tapa a la style prop `maw`, que aqui caeria en el disparador. */
  maw?: number | string | undefined;
  className?: string | undefined;
}

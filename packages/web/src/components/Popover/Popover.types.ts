import type { ReactElement, ReactNode, Ref } from "react";
import type { StyleProps } from "../../utils/style-props.js";

export type OverlayTriggerElement = ReactElement<
  Record<string, unknown> & { ref?: Ref<HTMLElement> | undefined }
>;

export type PopoverPlacement =
  | "top"
  | "top start"
  | "top end"
  | "bottom"
  | "bottom start"
  | "bottom end"
  | "start"
  | "end"
  | "left"
  | "right";

export interface PopoverProps extends StyleProps {
  /** El elemento que abre y ancla el globo. Recibe el `ref` y los atributos de aria, asi que tiene que reenviarlos. */
  trigger: OverlayTriggerElement;
  children: ReactNode;
  /** Pasarlo lo vuelve controlado: el componente deja de abrir y cerrar por su cuenta y solo emite `onOpenChange`. */
  opened?: boolean | undefined;
  defaultOpened?: boolean | undefined;
  onOpenChange?: ((opened: boolean) => void) | undefined;
  /** La posicion PEDIDA. Si no cabe, React Aria la cambia, salvo que apagues `shouldFlip`. */
  placement?: PopoverPlacement | undefined;
  /** Separacion del disparador, en px, en el eje de `placement`. */
  offset?: number | undefined;
  /** Desplazamiento en el eje perpendicular, en px, para descentrarlo respecto al disparador. */
  crossOffset?: number | undefined;
  /** Apagarlo deja el globo en su `placement` aunque se salga de la pantalla: solo con posicion garantizada. */
  shouldFlip?: boolean | undefined;
  /** Margen minimo con el borde de la ventana antes de reposicionar. */
  containerPadding?: number | undefined;
  withArrow?: boolean | undefined;
  /**
   * Deja pasar la interaccion con el resto de la pagina: sin velo, sin atrapar el foco y sin cerrar al
   * pulsar fuera. Es lo que hace falta para un globo que acompana a un formulario, no para uno modal.
   */
  isNonModal?: boolean | undefined;
  /** Apagar el cierre con Escape deja al usuario de teclado sin salida: solo con otra via evidente. */
  isKeyboardDismissDisabled?: boolean | undefined;
  radius?: "sm" | "md" | "lg" | undefined;
  padding?: "none" | "sm" | "md" | "lg" | undefined;
  /** Ancho fijo del globo. Sin el, se ajusta a su contenido. */
  width?: number | string | undefined;
  className?: string | undefined;
  /** Nombra el globo para el lector de pantalla. Hace falta cuando dentro no hay un encabezado que lo haga. */
  "aria-label"?: string | undefined;
}

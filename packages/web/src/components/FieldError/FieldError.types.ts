import type { ReactNode } from "react";

import type { FieldStatus, NebulaField } from "@stellaria/nebula-tokens";
import type { StyleProps } from "../../utils/style-props.js";

export type ErrorDisplay = "tooltip" | "text";

export type FieldErrorPosition =
  "top" | "top-left" | "top-right" | "bottom" | "bottom-left" | "bottom-right";

export type FieldErrorSource = Pick<NebulaField<unknown>, "status" | "error" | "touched">;

export interface FieldErrorProps extends Omit<StyleProps, "position"> {
  /** El control que se envuelve. El globo se ancla a el, asi que no puede quedarse vacio. */
  children: ReactNode;
  /**
   * La via corta: de un `NebulaField` salen a la vez el estado, el mensaje y si se ha tocado. Manda
   * sobre `error`, `message` y `status`, que existen para cuando no hay campo de formulario detras.
   */
  field?: FieldErrorSource | undefined;
  /** Con `true` marca el control como invalido sin texto; con una cadena, esa cadena es el mensaje. */
  error?: string | boolean | undefined;
  /** El texto del globo cuando `error` es `true` y no trae mensaje propio. */
  message?: string | undefined;
  status?: FieldStatus | undefined;
  color?: "error" | "info" | undefined;
  /** Donde se ancla el globo. Tapa a la style prop `position`, que aqui no aplica. */
  position?: FieldErrorPosition | undefined;
  /** Separacion entre el globo y el control, en px. */
  offset?: number | undefined;
  /** Lo que anuncia mientras el campo valida. Se lee en voz alta, asi que no puede ser un simbolo. */
  validatingLabel?: string | undefined;
  className?: string | undefined;
}

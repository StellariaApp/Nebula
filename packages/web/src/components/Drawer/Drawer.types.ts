import type { Unit } from "@stellaria/nebula-tokens";

import type { ModalProps, ModalSide } from "../Modal/Modal.types.js";

export interface DrawerProps extends Omit<ModalProps, "drawer" | "centered" | "size"> {
  side?: ModalSide | undefined;
  size?: Unit | undefined;
}

import type { PressEvent } from "react-aria";

export interface PressLifecycleProps {
  onPress?: ((event: PressEvent) => void) | undefined;
  onPressStart?: ((event: PressEvent) => void) | undefined;
  onPressEnd?: ((event: PressEvent) => void) | undefined;
  onPressUp?: ((event: PressEvent) => void) | undefined;
  onPressChange?: ((pressed: boolean) => void) | undefined;
  preventFocusOnPress?: boolean | undefined;
}

interface PressHandlers {
  onPress?: (event: PressEvent) => void;
  onPressStart?: (event: PressEvent) => void;
  onPressEnd?: (event: PressEvent) => void;
  onPressUp?: (event: PressEvent) => void;
  onPressChange?: (pressed: boolean) => void;
  preventFocusOnPress?: boolean;
}

export function PressProps(source: PressLifecycleProps): PressHandlers {
  const picked: PressHandlers = {};
  if (source.onPress !== undefined) picked.onPress = source.onPress;
  if (source.onPressStart !== undefined) picked.onPressStart = source.onPressStart;
  if (source.onPressEnd !== undefined) picked.onPressEnd = source.onPressEnd;
  if (source.onPressUp !== undefined) picked.onPressUp = source.onPressUp;
  if (source.onPressChange !== undefined) picked.onPressChange = source.onPressChange;
  if (source.preventFocusOnPress !== undefined)
    picked.preventFocusOnPress = source.preventFocusOnPress;
  return picked;
}

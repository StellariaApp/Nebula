import { button } from "./Button/demos";
import { modal } from "./Modal/demos";
import { numberInput } from "./NumberInput/demos";
import { passwordInput } from "./PasswordInput/demos";
import { searchInput } from "./SearchInput/demos";
import { textarea } from "./Textarea/demos";
import { textInput } from "./TextInput/demos";
import type { Demo, DemoFamily } from "./types";

export type { Demo, DemoFamily } from "./types";

export const FAMILIES: readonly DemoFamily[] = [
  button,
  modal,
  numberInput,
  passwordInput,
  searchInput,
  textInput,
  textarea,
];

const BY_COMPONENT = new Map(FAMILIES.map((family) => [family.component, family]));

/** Las demos de un componente del catálogo, o vacío si todavía no tiene ninguna. */
export function DemosOf(component: string): readonly Demo[] {
  return BY_COMPONENT.get(component)?.demos ?? [];
}

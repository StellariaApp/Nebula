import { button } from "./Button/demos.js";
import { modal } from "./Modal/demos.js";
import { numberInput } from "./NumberInput/demos.js";
import { passwordInput } from "./PasswordInput/demos.js";
import { searchInput } from "./SearchInput/demos.js";
import { textarea } from "./Textarea/demos.js";
import { textInput } from "./TextInput/demos.js";
import type { Demo, DemoFamily } from "./types.js";

export type { Demo, DemoFamily } from "./types.js";

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

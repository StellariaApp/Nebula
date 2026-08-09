import { button } from "./Button/demos.js";
import type { DemoFamily } from "./types.js";

export type { Demo, DemoFamily } from "./types.js";

export const FAMILIES: readonly DemoFamily[] = [button];

const BY_COMPONENT = new Map(FAMILIES.map((family) => [family.component, family]));

/** Las demos de un componente del catálogo, o vacío si todavía no tiene ninguna. */
export function DemosOf(component: string): readonly DemoFamily["demos"][number][] {
  return BY_COMPONENT.get(component)?.demos ?? [];
}

import type { SurfaceRole } from "@stellaria/nebula-tokens";

/**
 * Cuánto se separa del fondo cada superficie, en canales.
 *
 * Un número mueve las ocho por igual, que es lo de siempre. Un objeto las mueve **una a una**, y es
 * lo que deja tintar la pila: `overlay` más claro sin tocar `base`, o `raised` quieto mientras el
 * resto sube.
 *
 * **El signo ya se ocupa del esquema.** Positivo es «sepárate del fondo» —más claro en dark, más
 * oscuro en light— y negativo lo contrario, así que un `overlay: -5` sale más oscuro en dark y más
 * claro en light sin declarar nada por esquema.
 *
 * `border` es la llave de escape para los filos: sin ella cada uno sigue a la superficie que bordea.
 */
export type Lift = number | Partial<Record<SurfaceRole | "border", number>>;

/**
 * Lo que le toca a un rol. Un rol que el objeto no nombra sigue a `base`, no a cero: son una pila, y
 * dejar `hover` quieto mientras `base` se mueve descoloca el estado respecto de su superficie. Para
 * fijar uno se escribe su cero.
 */
export function LiftOf(lift: Lift, role: string): number {
  if (typeof lift === "number") return lift;
  const named = lift[role as SurfaceRole];
  return named ?? lift.base ?? 0;
}

/**
 * La superficie que bordea cada filo, que es de donde saca su desplazamiento.
 *
 * Sin esto el borde se queda quieto mientras su superficie se mueve, y **se invierte**: en la base es
 * un escalón más claro que `base` en dark, y con `lift: 12` acaba más oscuro que ella —o sea, leído
 * como sombra en vez de como filo—. En light pasa lo simétrico y desaparece.
 */
const BORDER_PAIR: Record<string, SurfaceRole> = {
  subtle: "raised",
  default: "raised",
  strong: "raised",
  disabled: "disabled",
};

/** Lo que le toca a un filo. `focus` no pasa por aquí: sale de `primary` y no de la pila. */
export function BorderLiftOf(lift: Lift, role: string): number {
  if (typeof lift === "number") return lift;
  return lift.border ?? LiftOf(lift, BORDER_PAIR[role] ?? "raised");
}

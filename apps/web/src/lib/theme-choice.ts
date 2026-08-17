import { BASE_CHOICE, type ThemeChoice } from "@stellaria/nebula-demos/themes/products";

const KEY = "nebula-choice";

/**
 * Los siete ejes del panel, guardados enteros.
 *
 * `NebulaProvider` no puede hacerlo por nosotros: `setTheme` con un tema entero solo persiste su
 * `meta.scheme`, porque un `NebulaTheme` arbitrario no se reconstruye desde un nombre (ADR-121). Un
 * `ThemeChoice` sí: es la SEMILLA de la que `ResolveChoice` deriva el tema, y son siete escalares.
 *
 * Es la salida que `docs/02` §4 declara — «quien quiera persistir el suyo guarda su propio selector
 * y monta con el objeto en `defaultTheme`».
 */

function IsChoice(value: unknown): value is ThemeChoice {
  if (typeof value !== "object" || value === null) return false;
  const shape = value as Record<string, unknown>;
  return (
    typeof shape["name"] === "string" &&
    (shape["scheme"] === "dark" || shape["scheme"] === "light") &&
    typeof shape["motion"] === "string" &&
    typeof shape["glass"] === "boolean" &&
    typeof shape["corner"] === "string" &&
    typeof shape["density"] === "string" &&
    typeof shape["face"] === "string"
  );
}

export function SaveChoice(choice: ThemeChoice): void {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(choice));
  } catch {
    /* almacenamiento denegado: la elección vive lo que dure la pestaña */
  }
}

export function LoadChoice(): ThemeChoice | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw === null) return null;
    const parsed: unknown = JSON.parse(raw);
    return IsChoice(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export const DEFAULT_CHOICE = BASE_CHOICE;

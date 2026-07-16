import type {
  BorderRole,
  ColorShade,
  PaletteName,
  SemanticStatus,
  SurfaceRole,
  TextRole,
} from "../theme/primitives";

/** Escalas semánticas direccionables (roles de `colors` que son Scale11). */
export type SemanticScaleName = "primary" | "accent" | "gray" | SemanticStatus;

/** Cualquier escala direccionable desde una style prop: rol semántico o paleta cruda. */
export type ColorScaleName = SemanticScaleName | PaletteName;

/** Roles puntuales del tema (valores únicos, no escalas). */
export type ColorRoleToken =
  | `surface.${SurfaceRole}`
  | `text.${TextRole}`
  | `border.${BorderRole}`;

export type ColorToken = ColorScaleName | `${ColorScaleName}.${ColorShade}` | ColorRoleToken;

export type ColorExtended =
  | ColorToken
  /** Con alpha 0–100 (patrón del Collector de Stellaria): `primary.500.12`. */
  | `${ColorScaleName}.${ColorShade}.${number}`
  | "white"
  | "black"
  | "inherit"
  | "currentColor"
  | "transparent"
  | `#${string}`;

export type ColorsProps = {
  c?: ColorExtended;
  bg?: ColorExtended;
  opacity?: number;
};

export const KeysColors = ["c", "bg", "opacity"] as const;

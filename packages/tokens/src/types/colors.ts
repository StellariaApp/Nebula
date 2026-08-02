import type {
  BorderRole,
  ColorShade,
  PaletteName,
  SemanticStatus,
  SurfaceRole,
  TextRole,
} from "../theme/primitives.js";

export type SemanticScaleName = "primary" | "accent" | "gray" | SemanticStatus;

export type ColorScaleName = SemanticScaleName | PaletteName;

export type ColorRoleToken = `surface.${SurfaceRole}` | `text.${TextRole}` | `border.${BorderRole}`;

export type ColorToken = ColorScaleName | `${ColorScaleName}.${ColorShade}` | ColorRoleToken;

export type ColorAlpha =
  `${ColorScaleName}.${ColorShade}.${number}` | `${ColorRoleToken}.${number}`;

export type ColorExtended =
  | ColorToken
  | ColorAlpha
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

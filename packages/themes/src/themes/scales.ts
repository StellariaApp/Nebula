/**
 * Inversión de escala para temas dark (decisión del propietario, W1.1):
 * las escalas de ROLES (`colors.*`) tienen semántica relativa al scheme —
 * 50 = más cercano al fondo, 950 = máximo contraste contra el fondo. Así un
 * mismo variantMap (`scale.600`) y los mismos pares AA del gate funcionan
 * idénticos en light y dark. `palettes` (identidad) NUNCA se invierte.
 */
import type { Scale11 } from "@stellaria/nebula-tokens";

export function flipScale(scale: Scale11): Scale11 {
  return {
    50: scale["950"],
    100: scale["900"],
    200: scale["800"],
    300: scale["700"],
    400: scale["600"],
    500: scale["500"],
    600: scale["400"],
    700: scale["300"],
    800: scale["200"],
    900: scale["100"],
    950: scale["50"],
  };
}

import type { Scale11 } from "@stellaria/nebula-tokens";

export function FlipScale(scale: Scale11): Scale11 {
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

import { StarField, vars } from "@stellaria/nebula-web";
import type { ReactElement } from "react";

const WASH = [
  `radial-gradient(125% 75% at 50% -12%, color-mix(in srgb, ${vars.color.primary["500"]} 16%, transparent) 0%, transparent 62%)`,
  `radial-gradient(85% 55% at 88% 6%, color-mix(in srgb, ${vars.color.accent["400"]} 11%, transparent) 0%, transparent 58%)`,
  `radial-gradient(70% 45% at 8% 22%, color-mix(in srgb, ${vars.color.accent["500"]} 7%, transparent) 0%, transparent 55%)`,
  vars.color.surface.base,
].join(", ");

export function SiteBackground(): ReactElement {
  return (
    <>
      <div
        aria-hidden="true"
        style={{ position: "fixed", inset: 0, background: WASH, pointerEvents: "none" }}
      />
      <StarField fixed parallax translucency={2} aurora />
    </>
  );
}

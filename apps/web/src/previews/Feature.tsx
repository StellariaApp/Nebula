import { Feature } from "@stellaria/nebula-web";
import { STAR } from "./kit";
import type { Preview } from "./types";

const preview: Preview = {
  base: (
    <Feature
      w={320}
      icon={STAR}
      title="Accessibility is a gate"
      description="Every story runs axe on every commit."
    />
  ),
};

export default preview;

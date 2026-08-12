import { Timeline } from "@stellaria/nebula-web";
import type { Preview } from "./types";

const preview: Preview = {
  base: (
    <Timeline
      w={320}
      items={[
        { title: "Contract closed", description: "docs/02 fixes the theme contract." },
        { title: "Web catalogue complete", description: "158 components." },
      ]}
    />
  ),
};

export default preview;

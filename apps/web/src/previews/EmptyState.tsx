import { EmptyState } from "@stellaria/nebula-web";
import { STAR } from "./kit";
import type { Preview } from "./types";

const preview: Preview = {
  base: (
    <EmptyState
      w={360}
      icon={STAR}
      title="Nothing here yet"
      description="This section lands with web v1."
    />
  ),
};

export default preview;

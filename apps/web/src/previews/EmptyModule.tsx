import { EmptyModule } from "@stellaria/nebula-web";
import { STAR } from "./kit";
import type { Preview } from "./types";

const preview: Preview = {
  base: (
    <EmptyModule
      w={360}
      icon={STAR}
      title="No movements yet"
      description="They land when the first reconciliation runs."
    />
  ),
};

export default preview;

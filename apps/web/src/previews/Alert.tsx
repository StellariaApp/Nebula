import { Alert } from "@stellaria/nebula-web";
import { SOLID, ByVariant } from "./kit";
import type { Preview } from "./types";

const preview: Preview = {
  base: <Alert title="Heads up">The API is being normalised until v1.</Alert>,
  groups: [
    ByVariant(SOLID, (variant) => (
      <Alert variant={variant} title="Heads up" w={280}>
        The API is being normalised until v1.
      </Alert>
    )),
  ],
  usage: {
    code: `<Alert variant="light" color="warning" title="Unsaved changes">
Leaving now discards the draft.
</Alert>`,
    node: (
      <Alert variant="light" color="warning" title="Unsaved changes" w={320}>
        Leaving now discards the draft.
      </Alert>
    ),
  },
};

export default preview;

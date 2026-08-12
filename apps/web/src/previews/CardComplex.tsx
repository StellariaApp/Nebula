import { CardComplex } from "@stellaria/nebula-web";
import type { Preview } from "./types";

const preview: Preview = {
  base: (
    <CardComplex
      w={320}
      title="Reconciliation"
      description="24 movements pending since Monday."
      badges={{ title: [{ key: "state", label: "Open" }] }}
    />
  ),
};

export default preview;

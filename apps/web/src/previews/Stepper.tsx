import { Stepper } from "@stellaria/nebula-web";
import type { Preview } from "./types";

const preview: Preview = {
  base: (
    <Stepper
      w={420}
      active={1}
      steps={[{ label: "Account" }, { label: "Billing" }, { label: "Done" }]}
    />
  ),
};

export default preview;

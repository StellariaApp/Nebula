import { Fieldset, TextInput } from "@stellaria/nebula-web";
import type { Preview } from "./types";

const preview: Preview = {
  base: (
    <Fieldset legend="Billing" w={320}>
      <TextInput label="Company" placeholder="Stellaria" />
    </Fieldset>
  ),
};

export default preview;

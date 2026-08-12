import { FormField, TextInput } from "@stellaria/nebula-web";
import type { Preview } from "./types";

const preview: Preview = {
  base: (
    <FormField label="Email" description="We only use it for the receipt." w={300}>
      <TextInput placeholder="you@example.com" />
    </FormField>
  ),
};

export default preview;

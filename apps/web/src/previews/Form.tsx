import { Form, Button, TextInput } from "@stellaria/nebula-web";
import type { Preview } from "./types";

const preview: Preview = {
  base: (
    <Form w={320}>
      <TextInput label="Email" placeholder="you@example.com" />
      <Button type="submit" variant="light">
        Send
      </Button>
    </Form>
  ),
};

export default preview;

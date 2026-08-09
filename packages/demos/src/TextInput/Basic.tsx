import { Box, TextInput } from "@stellaria/nebula-web";
import type { ReactElement } from "react";

export default function TextInputBasic(): ReactElement {
  return (
    <Box display="flex" direction="column" gap="md" maw={360}>
      <TextInput
        label="Name"
        description="How it appears on your profile"
        placeholder="Ana García"
      />
      <TextInput label="Email" required placeholder="you@example.com" />
      <TextInput label="With error" error="This field is required" defaultValue="" />
    </Box>
  );
}

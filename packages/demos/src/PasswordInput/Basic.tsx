import { Box, PasswordInput } from "@stellaria/nebula-web";
import type { ReactElement } from "react";

export default function PasswordInputBasic(): ReactElement {
  return (
    <Box maw={360}>
      <PasswordInput
        label="Password"
        description="At least 8 characters"
        defaultValue="correct-horse"
      />
    </Box>
  );
}

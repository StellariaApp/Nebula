import { Box, Button } from "@stellaria/nebula-web";
import type { ReactElement } from "react";

export default function ButtonFullWidth(): ReactElement {
  return (
    <Box w={420} maw="100%">
      <Button fullWidth>Continue</Button>
    </Box>
  );
}

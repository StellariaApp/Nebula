import { Box, Button } from "@stellaria/nebula-web";
import type { ReactElement } from "react";

export default function ButtonStates(): ReactElement {
  return (
    <Box display="flex" gap="sm" wrap="wrap" align="center">
      <Button>Normal</Button>
      <Button disabled>Disabled</Button>
      <Button loading>Loading</Button>
      <Button variant="outline" disabled>
        Outline disabled
      </Button>
    </Box>
  );
}

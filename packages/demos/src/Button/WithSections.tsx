import { Box, Button } from "@stellaria/nebula-web";
import type { ReactElement } from "react";

function Arrow({ back = false }: { back?: boolean }): ReactElement {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d={back ? "M19 12H5m0 0 7 7m-7-7 7-7" : "M5 12h14m0 0-7-7m7 7-7 7"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ButtonWithSections(): ReactElement {
  return (
    <Box display="flex" gap="sm" wrap="wrap" align="center">
      <Button leftSection={<Arrow back />}>Previous</Button>
      <Button rightSection={<Arrow />}>Next</Button>
    </Box>
  );
}

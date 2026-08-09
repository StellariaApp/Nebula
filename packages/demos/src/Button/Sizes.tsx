import { Box, Button } from "@stellaria/nebula-web";
import type { ReactElement } from "react";

const SIZES = ["xs", "sm", "md", "lg", "xl"] as const;

export default function ButtonSizes(): ReactElement {
  return (
    <Box display="flex" gap="sm" align="center" wrap="wrap">
      {SIZES.map((size) => (
        <Button key={size} size={size}>
          {size}
        </Button>
      ))}
    </Box>
  );
}

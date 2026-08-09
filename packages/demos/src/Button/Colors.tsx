import { Box, Button } from "@stellaria/nebula-web";
import type { ReactElement } from "react";

const COLORS = ["primary", "accent", "success", "warning", "error", "info"] as const;

export default function ButtonColors(): ReactElement {
  return (
    <Box display="flex" gap="sm" wrap="wrap" maw={640}>
      {COLORS.map((color) => (
        <Button key={color} color={color}>
          {color}
        </Button>
      ))}
    </Box>
  );
}

import { Box, Button } from "@stellaria/nebula-web";
import type { ReactElement } from "react";

const VARIANTS = [
  "filled",
  "outline",
  "light",
  "glass",
  "ghost",
  "glow",
  "gradient",
  "unstyled",
] as const;

export default function ButtonVariants(): ReactElement {
  return (
    <Box display="flex" gap="sm" wrap="wrap" maw={640}>
      {VARIANTS.map((variant) => (
        <Button key={variant} variant={variant}>
          {variant}
        </Button>
      ))}
    </Box>
  );
}

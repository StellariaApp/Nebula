import { Box, TextInput } from "@stellaria/nebula-web";
import type { ReactElement } from "react";

const SIZES = ["xs", "sm", "md", "lg", "xl"] as const;

export default function TextInputSizes(): ReactElement {
  return (
    <Box display="flex" direction="column" gap="sm" maw={360}>
      {SIZES.map((size) => (
        <TextInput key={size} size={size} label={`size ${size}`} placeholder={size} />
      ))}
    </Box>
  );
}

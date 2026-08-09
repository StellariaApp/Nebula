import { Box, Textarea } from "@stellaria/nebula-web";
import type { ReactElement } from "react";

export default function TextareaAutosize(): ReactElement {
  return (
    <Box maw={420}>
      <Textarea label="Comment" description="Tell us more" rows={4} autosize />
    </Box>
  );
}

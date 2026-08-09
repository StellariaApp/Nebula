import { Box, Button, Text } from "@stellaria/nebula-web";
import type { ReactElement } from "react";

export default function ButtonComposition(): ReactElement {
  return (
    <Box display="flex" direction="column" gap="lg" maw="52ch">
      <Box display="flex" direction="column" gap="sm">
        <Text fz="h5" fw="semibold" lh="tight">
          Confirm disbursement
        </Text>
        <Text fz="body2" c="text.secondary">
          128 transfers will be sent, totalling MXN 1,248,300.00. Once settled, the operation cannot
          be reverted.
        </Text>
      </Box>
      <Box display="flex" gap="sm" wrap="wrap">
        <Button>Confirm disbursement</Button>
        <Button variant="outline">Review batch</Button>
        <Button variant="ghost">Cancel</Button>
      </Box>
    </Box>
  );
}

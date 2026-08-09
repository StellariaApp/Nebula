"use client";

import { Box, Button, Modal, TextInput } from "@stellaria/nebula-web";
import { useState, type ReactElement } from "react";

export default function ModalComposition(): ReactElement {
  const [opened, set_opened] = useState(false);

  return (
    <>
      <Button onPress={() => set_opened(true)}>Invite teammate</Button>
      <Modal
        opened={opened}
        onClose={() => set_opened(false)}
        size="sm"
        title="Invite to the team"
        subtitle="We'll email the invitation"
        footer={
          <>
            <Button variant="outline" onPress={() => set_opened(false)}>
              Cancel
            </Button>
            <Button onPress={() => set_opened(false)}>Send invitation</Button>
          </>
        }
      >
        <Box display="flex" direction="column" gap="md">
          <TextInput label="Email" placeholder="person@company.com" required />
          <TextInput label="Role" placeholder="Analyst" />
        </Box>
      </Modal>
    </>
  );
}

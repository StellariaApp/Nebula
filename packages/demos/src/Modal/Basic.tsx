"use client";

import { Button, Modal, Text } from "@stellaria/nebula-web";
import { useState, type ReactElement } from "react";

export default function ModalBasic(): ReactElement {
  const [opened, set_opened] = useState(false);

  return (
    <>
      <Button onPress={() => set_opened(true)}>Open modal</Button>
      <Modal
        opened={opened}
        onClose={() => set_opened(false)}
        title="Confirm action"
        subtitle="This cannot be undone"
      >
        <Text>The batch will be settled immediately.</Text>
      </Modal>
    </>
  );
}

"use client";

import { Button, Modal, Text } from "@stellaria/nebula-web";
import { useState, type ReactElement } from "react";

export default function ModalAsDrawer(): ReactElement {
  const [opened, set_opened] = useState(false);

  return (
    <>
      <Button onPress={() => set_opened(true)}>Open from the side</Button>
      <Modal drawer opened={opened} onClose={() => set_opened(false)} title="Filters">
        <Text>Same dialog semantics, anchored to the edge instead of centred.</Text>
      </Modal>
    </>
  );
}

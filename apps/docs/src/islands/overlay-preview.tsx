"use client";

import { Button, Dialog, Drawer, Modal, Text } from "@stellaria/nebula-web";
import { useState, type ReactElement } from "react";

/**
 * Los overlays controlados no se pueden enseñar quietos: la muestra es el disparador, que es como
 * se usan de verdad. Vive aquí y no en `previews.tsx` porque necesita estado.
 */
export function ModalPreview(): ReactElement {
  const [opened, set_opened] = useState(false);

  return (
    <>
      <Button
        variant="light"
        onPress={() => {
          set_opened(true);
        }}
      >
        Open modal
      </Button>
      <Modal
        opened={opened}
        onClose={() => {
          set_opened(false);
        }}
        title="Discard the draft?"
        footer={
          <Button
            variant="light"
            onPress={() => {
              set_opened(false);
            }}
          >
            Keep editing
          </Button>
        }
      >
        <Text fz="body3">Leaving now discards the changes you have not saved.</Text>
      </Modal>
    </>
  );
}

export function DrawerPreview(): ReactElement {
  const [opened, set_opened] = useState(false);

  return (
    <>
      <Button
        variant="light"
        onPress={() => {
          set_opened(true);
        }}
      >
        Open drawer
      </Button>
      <Drawer
        opened={opened}
        onClose={() => {
          set_opened(false);
        }}
        title="Filters"
        side="end"
      >
        <Text fz="body3">Everything a modal does, anchored to one side.</Text>
      </Drawer>
    </>
  );
}

export function DialogPreview(): ReactElement {
  const [opened, set_opened] = useState(false);

  return (
    <>
      <Button
        variant="light"
        onPress={() => {
          set_opened(true);
        }}
      >
        Open dialog
      </Button>
      <Dialog
        opened={opened}
        onClose={() => {
          set_opened(false);
        }}
        title="Theme saved"
        corner="bottom-end"
      >
        <Text fz="body3">A corner dialog does not take the screen.</Text>
      </Dialog>
    </>
  );
}

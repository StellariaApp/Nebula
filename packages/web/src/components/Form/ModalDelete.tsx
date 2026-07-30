"use client";

import type { ReactElement } from "react";

import { Modal } from "../Modal/Modal.js";

import { FormDelete } from "./FormDelete.js";
import type { ModalDeleteProps } from "./FormDelete.types.js";

export function ModalDelete(props: ModalDeleteProps): ReactElement {
  const { opened, onClose, title = "Confirmar eliminación", size = "sm", ...form } = props;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={title}
      size={size}
      closeOnClickOutside={form.isPending !== true}
      closeOnEscape={form.isPending !== true}
    >
      <FormDelete {...form} onCancel={onClose} />
    </Modal>
  );
}

ModalDelete.displayName = "ModalDelete";

"use client";

import type { ReactElement } from "react";

import { Modal } from "../Modal/Modal.js";

import type { DrawerProps } from "./Drawer.types.js";

const DEFAULT_SIZE = "22rem";

export function Drawer(props: DrawerProps): ReactElement {
  const { side = "end", size = DEFAULT_SIZE, radius = "none", ...modal_rest } = props;

  return <Modal {...modal_rest} drawer={side} size={size} radius={radius} />;
}

Drawer.displayName = "Drawer";

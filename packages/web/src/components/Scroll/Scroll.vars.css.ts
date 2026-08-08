import { createVar } from "@vanilla-extract/css";

const LENGTH = { syntax: "<length>", inherits: false, initialValue: "0px" } as const;

export const scrollbarSize = createVar();
export const bounceOffset = createVar();

export const blockStart = createVar(LENGTH);
export const blockEnd = createVar(LENGTH);
export const inlineStart = createVar(LENGTH);
export const inlineEnd = createVar(LENGTH);

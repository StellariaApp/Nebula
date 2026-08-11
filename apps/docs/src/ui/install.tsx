import { CodeHighlightTabs } from "@stellaria/nebula-web";
import type { ReactElement } from "react";

const MANAGERS = [
  { value: "pnpm", label: "pnpm", verb: "pnpm add" },
  { value: "npm", label: "npm", verb: "npm install" },
  { value: "yarn", label: "yarn", verb: "yarn add" },
];

export interface InstallProps {
  /** Uno o varios paquetes, separados por espacio, como se teclean. */
  packages: string;
}

export function Install({ packages }: InstallProps): ReactElement {
  return (
    <CodeHighlightTabs
      my="md"
      tabs={MANAGERS.map((manager) => ({
        value: manager.value,
        label: manager.label,
        lang: "bash",
        variant: "glass" as const,
        code: `${manager.verb} ${packages}`,
      }))}
    />
  );
}

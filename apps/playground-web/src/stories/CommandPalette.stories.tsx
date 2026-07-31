import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState, type ReactElement } from "react";

import { Box, Button, Card, Code, Kbd, PermissionProvider, Text, Title } from "@stellaria/nebula-web";
import { CommandPalette, type CommandItem } from "@stellaria/nebula-web/command";

import { MATRIX_A11Y, ThemeMatrix } from "../fixtures/themes.js";

const meta: Meta<typeof CommandPalette> = {
  title: "Search/CommandPalette",
  component: CommandPalette,
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof CommandPalette>;

const ICON_PLUS = (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const ICON_UP = (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M12 19V5M5 12l7-7 7 7" />
  </svg>
);

const ICON_GEAR = (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth={2}>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
  </svg>
);

function Items(log: (key: string) => void): CommandItem[] {
  return [
    {
      key: "nuevo",
      label: "Nuevo cobro",
      description: "Alta manual de un movimiento",
      group: "Cobros",
      shortcut: "N",
      icon: ICON_PLUS,
      keywords: ["alta", "crear", "movimiento"],
      onAction: () => {
        log("nuevo");
      },
    },
    {
      key: "conciliar",
      label: "Conciliar extracto",
      description: "Subir un archivo del banco",
      group: "Cobros",
      icon: ICON_UP,
      keywords: ["banco", "extracto", "importar"],
      onAction: () => {
        log("conciliar");
      },
    },
    {
      key: "exportar",
      label: "Exportar reporte",
      group: "Reportes",
      shortcut: "E",
      keywords: ["csv", "descargar", "excel"],
      onAction: () => {
        log("exportar");
      },
    },
    {
      key: "ajustes",
      label: "Abrir ajustes",
      group: "Sistema",
      icon: ICON_GEAR,
      onAction: () => {
        log("ajustes");
      },
    },
    {
      key: "anular",
      label: "Anular cobro",
      description: "Requiere permiso",
      group: "Cobros",
      permission: "cobros.anular",
      onAction: () => {
        log("anular");
      },
    },
  ];
}

function Demo(props: { gated?: boolean }): ReactElement {
  const [opened, set_opened] = useState(false);
  const [last, set_last] = useState<string | null>(null);

  const palette = (
    <CommandPalette
      items={Items(set_last)}
      opened={opened}
      onOpenChange={set_opened}
      hotkey="mod+k"
    />
  );

  return (
    <Box display="flex" direction="column" gap="md">
      <Card p="md" withBorder radius="md">
        <Box display="flex" direction="column" gap="sm">
          <Title order={6}>Paleta de comandos</Title>
          <Text fz="body3" c="text.secondary">
            Pulsa <Kbd>Ctrl</Kbd> + <Kbd>K</Kbd> o el botón. Escribe para filtrar: el scoring ordena
            exacto, prefijo, inicio de palabra, contiene y subsecuencia — prueba <Code>nc</Code>.
          </Text>
          <Box display="flex" gap="sm" align="center">
            <Button
              size="sm"
              onPress={() => {
                set_opened(true);
              }}
            >
              Abrir paleta
            </Button>
            <Text fz="caption" c="text.muted">
              {last === null ? "Sin comando ejecutado" : `Último comando: ${last}`}
            </Text>
          </Box>
        </Box>
      </Card>

      {props.gated === true ? (
        <PermissionProvider resolver={(key) => key !== "cobros.anular"}>{palette}</PermissionProvider>
      ) : (
        palette
      )}
    </Box>
  );
}

export const Default: Story = {
  render: () => <Demo />,
};

export const ConPermisos: Story = {
  render: () => (
    <Box display="flex" direction="column" gap="sm">
      <Text fz="body3" c="text.secondary">
        «Anular cobro» lleva <Code>permission</Code> y el resolver la deniega, así que no aparece
        entre los resultados.
      </Text>
      <Demo gated />
    </Box>
  ),
};

export const Abierta: Story = {
  parameters: MATRIX_A11Y,
  render: () => <CommandPalette items={Items(() => {})} defaultOpened hotkey={false} />,
};

export const AllThemes: Story = {
  parameters: MATRIX_A11Y,
  render: () => (
    <ThemeMatrix>
      <Text fz="body3">
        La paleta se monta en un Modal; aquí se muestra el disparador en los cuatro temas.
      </Text>
    </ThemeMatrix>
  ),
};

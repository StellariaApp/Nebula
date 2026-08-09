import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";

import {
  Box,
  Button,
  Checkbox,
  Drawer,
  nebulaOverlays,
  SearchInput,
  Text,
  Title,
  useOverlayState,
} from "@stellaria/nebula-web";
import type { ModalSide } from "@stellaria/nebula-web";

import { MATRIX_A11Y, ThemeMatrix } from "../fixtures/themes.js";

const meta: Meta<typeof Drawer> = {
  title: "Overlays/Drawer",
  component: Drawer,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Drawer>;

function Demo(props: { side?: ModalSide; label?: string }): React.ReactElement {
  const { side = "end", label = "Abrir drawer" } = props;
  const [opened, set_opened] = useState(false);
  return (
    <>
      <Button onPress={() => set_opened(true)}>{label}</Button>
      <Drawer opened={opened} onClose={() => set_opened(false)} side={side} title="Filtros">
        <Text>Panel lateral anclado a {side}.</Text>
      </Drawer>
    </>
  );
}

export const Default: Story = { render: () => <Demo /> };

export const Sides: Story = {
  render: () => (
    <Box display="flex" gap="sm" style={{ flexWrap: "wrap" }}>
      {(["start", "end", "top", "bottom"] as const).map((side) => (
        <Demo key={side} side={side} label={side} />
      ))}
    </Box>
  ),
};

/** Abierto desde el registro por id: sin prop-drilling entre el botón y el panel. */
export const FromRegistry: Story = {
  render: () => {
    function Panel(): React.ReactElement {
      const filters = useOverlayState("filtros");
      return (
        <Drawer opened={filters.isOpen} onClose={filters.close} title="Filtros">
          <Box display="flex" direction="column" gap="sm">
            <SearchInput label="Buscar" placeholder="Nombre del cliente" />
            <Checkbox label="Solo activos" />
            <Checkbox label="Con saldo pendiente" />
          </Box>
        </Drawer>
      );
    }
    return (
      <Box display="flex" direction="column" gap="md" maw={420}>
        <Title order={4}>Listado de clientes</Title>
        <Text c="text.secondary">
          El botón no conoce al panel: lo abre por id a través de <code>nebulaOverlays</code>.
        </Text>
        <Button onPress={() => nebulaOverlays.open("filtros")}>Filtros</Button>
        <Panel />
      </Box>
    );
  },
};

export const Composition: Story = {
  render: () => (
    <Box maw={480} display="flex" direction="column" gap="md">
      <Title order={4}>Panel de filtros</Title>
      <Text c="text.secondary">
        El drawer ocupa el alto completo y su cuerpo desplaza de forma independiente.
      </Text>
      <Demo label="Abrir filtros" />
    </Box>
  ),
};

export const Dark: Story = { ...Composition, globals: { theme: "dark" } };

export const AllThemes: Story = {
  parameters: MATRIX_A11Y,
  render: (args, ctx) => <ThemeMatrix>{Composition.render?.(args, ctx)}</ThemeMatrix>,
};

export const ReducedMotion: Story = { ...Default, globals: { reducedMotion: "reduce" } };

/**
 * Abre con teclado y cierra con el botón de cierre. El cierre por `Esc` cuelga del evento
 * `cancel` nativo del `<dialog>`, que el navegador solo emite ante teclado real: no se puede
 * provocar con eventos sintéticos, así que su cobertura vive en el test unitario.
 */
export const KeyboardFlow: Story = {
  render: () => <Demo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    canvas.getByRole("button", { name: "Abrir drawer" }).focus();
    await userEvent.keyboard("{Enter}");

    const body = within(document.body);
    await expect(await body.findByRole("dialog", { name: "Filtros" })).toBeInTheDocument();

    await userEvent.click(body.getByRole("button", { name: "Close" }));
    await waitFor(() => {
      void expect(body.queryByRole("dialog")).toBeNull();
    });
  },
};

import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState, type ReactElement } from "react";

import { Box, Dock, Segment, Select, Text, Title } from "@stellaria/nebula-web";

import { MATRIX_A11Y, ThemeMatrix } from "../fixtures/themes.js";

const meta: Meta<typeof Dock> = {
  title: "Layout/Dock",
  component: Dock,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Dock>;

const LANGUAGES = [
  { value: "es", label: "ES" },
  { value: "en", label: "EN" },
];
const CURRENCIES = [
  { value: "MXN", label: "MXN" },
  { value: "USD", label: "USD" },
  { value: "COP", label: "COP" },
];

function Controls(props: { stacked: boolean }): ReactElement {
  const { stacked } = props;
  const [locale, set_locale] = useState("es");
  const [currency, set_currency] = useState("MXN");
  const [scheme, set_scheme] = useState("dark");

  return (
    <>
      <Box
        display="flex"
        direction={stacked ? "column" : "row"}
        gap="sm"
        w={stacked ? "100%" : undefined}
      >
        <Select
          aria-label="Idioma"
          data={LANGUAGES}
          onChange={set_locale}
          size="sm"
          value={locale}
          w={stacked ? "100%" : 72}
        />
        <Select
          aria-label="Divisa"
          data={CURRENCIES}
          onChange={set_currency}
          size="sm"
          value={currency}
          w={stacked ? "100%" : 85}
        />
      </Box>
      <Segment onChange={set_scheme} size="xs" value={scheme} w="100%">
        <Segment.Control aria-label="Tema" w="100%">
          <Segment.Control.Item value="light">Claro</Segment.Control.Item>
          <Segment.Control.Item value="dark">Oscuro</Segment.Control.Item>
        </Segment.Control>
      </Segment>
    </>
  );
}

function Page(): ReactElement {
  return (
    <Box p="xl" mih="60vh" display="flex" direction="column" gap="sm">
      <Title order={1} fz="h3">
        Una landing cualquiera
      </Title>
      <Text c="text.muted" maw="60ch">
        El dock flota abajo a la derecha. Baja el visor a «phone» en la toolbar: la fila se recoge
        en un botón y los mismos controles salen apilados en un popover.
      </Text>
    </Box>
  );
}

export const Default: Story = {
  render: () => (
    <>
      <Page />
      <Dock aria-label="Preferencias">{(stacked) => <Controls stacked={stacked} />}</Dock>
    </>
  ),
};

export const Compact: Story = {
  name: "Plegado (phone)",
  parameters: { viewport: { defaultViewport: "phone" } },
  globals: { viewport: { value: "phone", isRotated: false } },
  render: () => (
    <>
      <Page />
      <Dock aria-label="Preferencias">{(stacked) => <Controls stacked={stacked} />}</Dock>
    </>
  ),
};

export const NeverFolds: Story = {
  name: "Sin pliegue",
  render: () => (
    <>
      <Page />
      <Dock aria-label="Preferencias" compactBelow={false}>
        {(stacked) => <Controls stacked={stacked} />}
      </Dock>
    </>
  ),
};

export const Composition: Story = { ...Default };

export const AllThemes: Story = {
  parameters: MATRIX_A11Y,
  render: () => (
    <ThemeMatrix>
      <Box mih={160} position="relative">
        <Dock aria-label="Preferencias" withinPortal={false} position={{ bottom: 12, right: 12 }}>
          {(stacked) => <Controls stacked={stacked} />}
        </Dock>
      </Box>
    </ThemeMatrix>
  ),
};

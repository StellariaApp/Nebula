import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Box,
  CardComplex,
  PermissionProvider,
  SimpleGrid,
  Text,
  type CardAction,
} from "@stellaria/nebula-web";

import { MATRIX_A11Y, ThemeMatrix } from "../fixtures/themes.js";

const meta: Meta<typeof CardComplex> = {
  title: "Data Display/CardComplex",
  component: CardComplex,
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof CardComplex>;

const ICON_EDIT = (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M4 20h4L20 8l-4-4L4 16v4z" />
  </svg>
);

const ICON_DOWNLOAD = (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M12 3v12M7 10l5 5 5-5M4 21h16" />
  </svg>
);

const ICON_TRASH = (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" />
  </svg>
);

const ACTIONS: readonly CardAction[] = [
  { key: "editar", label: "Editar factura", slot: "header", icon: ICON_EDIT },
  { key: "descargar", label: "Descargar PDF", slot: "media", icon: ICON_DOWNLOAD },
  {
    key: "anular",
    label: "Anular factura",
    slot: "footer",
    icon: ICON_TRASH,
    color: "error",
    permission: "facturas.anular",
  },
];

const IMAGE = "https://placehold.co/600x300/1e1b4b/e9d5ff?text=Factura";

export const Default: Story = {
  render: () => (
    <Box maw={420}>
      <CardComplex
        title="Factura F-1042"
        description="Aurora S.A. · servicios de conciliación del trimestre"
        media={{ image: IMAGE, alt: "Vista previa de la factura", height: 160 }}
        badges={{
          title: [{ key: "urgente", label: "Urgente", color: "error", variant: "light" }],
          main: [
            { key: "spei", label: "SPEI" },
            { key: "conciliada", label: "Conciliada", color: "success" },
          ],
        }}
        actions={ACTIONS}
        meta={{
          createdAt: "2026-07-22",
          responsible: { name: "Ada Lovelace" },
          locale: "es-MX",
        }}
      />
    </Box>
  ),
};

export const Ranuras: Story = {
  render: () => (
    <Box display="flex" direction="column" gap="sm">
      <Text fz="body3" c="text.secondary">
        Cada acción declara su <code>slot</code>: <code>header</code> junto al título,{" "}
        <code>media</code> flotando sobre la imagen y <code>footer</code> en la fila inferior. Sin
        slot, cae en la cabecera.
      </Text>
      <Box maw={420}>
        <CardComplex
          title="Las tres ranuras"
          media={{ image: IMAGE, alt: "", height: 140 }}
          actions={[
            { key: "h", label: "Acción de cabecera", slot: "header", icon: ICON_EDIT },
            { key: "m", label: "Acción sobre la imagen", slot: "media", icon: ICON_DOWNLOAD },
            { key: "f", label: "Acción de pie", slot: "footer", icon: ICON_TRASH },
          ]}
        />
      </Box>
    </Box>
  ),
};

export const ConPermisos: Story = {
  render: () => (
    <Box display="flex" direction="column" gap="sm">
      <Text fz="body3" c="text.secondary">
        «Anular factura» lleva <code>permission</code> y el resolver la deniega, así que desaparece de
        la tarjeta — mismo contrato de ADR-056 que Menu, Tabs y CommandPalette.
      </Text>
      <PermissionProvider resolver={(key) => key !== "facturas.anular"}>
        <Box maw={420}>
          <CardComplex
            title="Factura F-1043"
            description="Nébula Ltda."
            actions={ACTIONS}
            media={{ image: IMAGE, alt: "", height: 140 }}
          />
        </Box>
      </PermissionProvider>
    </Box>
  ),
};

export const Estados: Story = {
  render: () => (
    <SimpleGrid cols={{ base: 1, tablet: 3 }} spacing="md">
      <CardComplex title="Cargando" loading />
      <CardComplex
        title="Sin imagen"
        description="media.hidden retira el hueco entero, no lo deja vacío."
        media={{ image: IMAGE, alt: "", hidden: true }}
        badges={{ main: [{ key: "b", label: "Borrador" }] }}
      />
      <CardComplex
        title="Descripción recortada"
        description="Con lines=2 la descripción se corta a dos líneas aunque el texto siga y siga y siga hasta bastante más allá de lo que cabe."
        lines={2}
      />
    </SimpleGrid>
  ),
};

export const AllThemes: Story = {
  parameters: MATRIX_A11Y,
  render: () => (
    <ThemeMatrix>
      <CardComplex
        title="Factura F-1042"
        description="Aurora S.A."
        badges={{ main: [{ key: "spei", label: "SPEI" }] }}
        actions={[{ key: "editar", label: "Editar", icon: ICON_EDIT }]}
        meta={{ createdAt: "2026-07-22", locale: "es-MX" }}
      />
    </ThemeMatrix>
  ),
};

import type { Meta, StoryObj } from "@storybook/react-vite";
import { useMemo, useState, type ReactElement } from "react";

import {
  ActionIcon,
  Box,
  Button,
  Card,
  Checkbox,
  Code,
  Divider,
  Menu,
  PermissionGate,
  PermissionProvider,
  QuickAction,
  SimpleGrid,
  Tabs,
  Text,
  Title,
  type PermissionGateProps,
} from "@stellaria/nebula-web";

import { MATRIX_A11Y, ThemeMatrix } from "../fixtures/themes.js";

const meta: Meta<typeof PermissionGate> = {
  title: "Domain Generics/PermissionGate",
  component: PermissionGate,
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof PermissionGate>;

type AppPermission = "cobros.ver" | "cobros.crear" | "cobros.anular" | "reportes.exportar";

const ALL: AppPermission[] = ["cobros.ver", "cobros.crear", "cobros.anular", "reportes.exportar"];

const LABELS: Record<AppPermission, string> = {
  "cobros.ver": "Ver cobros",
  "cobros.crear": "Crear cobros",
  "cobros.anular": "Anular cobros",
  "reportes.exportar": "Exportar reportes",
};

const Gate: (props: PermissionGateProps<AppPermission>) => ReactElement = PermissionGate;

const ICON_TRASH = (
  <svg
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" />
  </svg>
);

const ICON_DOWNLOAD = (
  <svg
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path d="M12 3v12M7 10l5 5 5-5M4 21h16" />
  </svg>
);

const ICON_DOTS = (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor">
    <circle cx="5" cy="12" r="1.6" />
    <circle cx="12" cy="12" r="1.6" />
    <circle cx="19" cy="12" r="1.6" />
  </svg>
);

function Panel(): ReactElement {
  return (
    <Card p="md" withBorder radius="md">
      <Box display="flex" direction="column" gap="md">
        <Box display="flex" align="center" justify="space-between" gap="sm">
          <Title order={5}>Cobro M-1042</Title>
          <Box display="flex" gap="xs">
            <ActionIcon
              aria-label="Anular cobro"
              variant="light"
              color="error"
              permission="cobros.anular"
              permissionMode="disable"
            >
              {ICON_TRASH}
            </ActionIcon>
            <ActionIcon
              aria-label="Exportar reporte"
              variant="light"
              permission="reportes.exportar"
            >
              {ICON_DOWNLOAD}
            </ActionIcon>
            <Menu
              trigger={
                <ActionIcon aria-label="Más acciones" variant="ghost">
                  {ICON_DOTS}
                </ActionIcon>
              }
              aria-label="Más acciones"
              items={[
                { key: "ver", label: "Ver detalle", permission: "cobros.ver" },
                { key: "duplicar", label: "Duplicar", permission: "cobros.crear" },
                {
                  key: "anular",
                  label: "Anular",
                  danger: true,
                  permission: "cobros.anular",
                  permissionMode: "disable",
                },
                { key: "copiar", label: "Copiar folio" },
              ]}
            />
          </Box>
        </Box>

        <Divider />

        <Gate
          permission="cobros.ver"
          fallback={
            <Text fz="body3" c="text.muted">
              No tienes acceso al detalle de este cobro.
            </Text>
          }
        >
          <Text fz="body3">Aurora S.A. · conciliado el 29 de julio · 12 400,00 MXN</Text>
        </Gate>

        <Box display="flex" gap="xs" wrap="wrap">
          <Button size="sm" permission="cobros.crear">
            Duplicar cobro
          </Button>
          <Button size="sm" variant="ghost" permission="reportes.exportar">
            Exportar
          </Button>
        </Box>

        <SimpleGrid cols={{ base: 1, tablet: 2 }} spacing="sm">
          <QuickAction
            label="Nuevo cobro"
            description="Alta manual"
            size="sm"
            fullWidth
            permission="cobros.crear"
          />
          <QuickAction
            label="Anular en lote"
            description="Selección múltiple"
            size="sm"
            fullWidth
            permission="cobros.anular"
            permissionMode="disable"
          />
        </SimpleGrid>

        <Tabs
          aria-label="Secciones del cobro"
          data={[
            {
              value: "resumen",
              label: "Resumen",
              content: <Text fz="body3">Resumen del cobro.</Text>,
            },
            {
              value: "auditoria",
              label: "Auditoría",
              content: <Text fz="body3">Traza completa de cambios.</Text>,
              permission: "reportes.exportar",
            },
          ]}
        />
      </Box>
    </Card>
  );
}

function Demo(): ReactElement {
  const [granted, set_granted] = useState<AppPermission[]>(["cobros.ver", "cobros.crear"]);

  const resolver = useMemo(() => {
    const current = new Set(granted);
    return (key: AppPermission): boolean => current.has(key);
  }, [granted]);

  return (
    <Box display="flex" direction="column" gap="lg">
      <Card p="md" withBorder radius="md" bg="surface.sunken">
        <Box display="flex" direction="column" gap="sm">
          <Title order={6}>Resolver de ejemplo</Title>
          <Text fz="body3" c="text.secondary">
            La app inyecta <Code>{"resolver: (key: AppPermission) => boolean"}</Code>. Nebula no
            conoce ninguna de estas keys: solo las transporta tipadas.
          </Text>
          <Box display="flex" gap="md" wrap="wrap">
            {ALL.map((key) => (
              <Checkbox
                key={key}
                label={LABELS[key]}
                checked={granted.includes(key)}
                onChange={(checked) => {
                  set_granted((current) =>
                    checked ? [...current, key] : current.filter((entry) => entry !== key),
                  );
                }}
              />
            ))}
          </Box>
        </Box>
      </Card>

      <PermissionProvider<AppPermission> resolver={resolver}>
        <Panel />
      </PermissionProvider>

      <Text fz="caption" c="text.muted">
        Los controles y los items de colección llevan la prop <Code>permission</Code>: sin permiso
        desaparecen, y con <Code>permissionMode=&quot;disable&quot;</Code> se quedan deshabilitados
        de verdad. <Code>PermissionGate</Code> cubre lo que no es un control —aquí, el detalle del
        cobro— y es el único que necesita <Code>inert</Code>, porque su contenido es arbitrario.
      </Text>
    </Box>
  );
}

export const Default: Story = {
  render: () => <Demo />,
};

export const WithoutProvider: Story = {
  render: () => (
    <Box display="flex" direction="column" gap="sm">
      <Text fz="body3" c="text.secondary">
        Sin <Code>PermissionProvider</Code> montado, la ausencia de permiso es una denegación
        explícita: no se muestra nada por defecto.
      </Text>
      <Card p="md" withBorder radius="md">
        <Box display="flex" direction="column" gap="sm">
          <Gate
            permission="cobros.anular"
            fallback={
              <Text fz="body3" c="text.muted">
                Región oculta por el gate (sin provider).
              </Text>
            }
          >
            <Text fz="body3">Detalle del cobro</Text>
          </Gate>
          <Button size="sm" color="error" permission="cobros.anular">
            Anular cobro
          </Button>
          <Text fz="caption" c="text.muted">
            El botón de arriba no está: la prop <Code>permission</Code> lo retiró sin provider.
          </Text>
        </Box>
      </Card>
    </Box>
  ),
};

export const AllThemes: Story = {
  parameters: MATRIX_A11Y,
  render: () => (
    <ThemeMatrix>
      <PermissionProvider<AppPermission> resolver={(key) => key === "cobros.ver"}>
        <Box display="flex" direction="column" gap="sm">
          <Button size="sm" fullWidth permission="cobros.ver">
            Ver detalle
          </Button>
          <Button
            size="sm"
            variant="light"
            color="error"
            fullWidth
            permission="cobros.anular"
            permissionMode="disable"
          >
            Anular
          </Button>
        </Box>
      </PermissionProvider>
    </ThemeMatrix>
  ),
};

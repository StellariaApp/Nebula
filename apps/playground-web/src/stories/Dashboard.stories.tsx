import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactElement, ReactNode } from "react";

import { CreateIcons, type IconComponentProps } from "@stellaria/nebula-icons";
import { CommonPack } from "@stellaria/nebula-icons/packs";
import { palettes } from "@stellaria/nebula-tokens";
import {
  ActionIcon,
  AppShell,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Divider,
  Header,
  Indicator,
  Menu,
  NavLink,
  SimpleGrid,
  Text,
  Title,
  Tooltip,
  VisuallyHidden,
  type MenuItemData,
} from "@stellaria/nebula-web";

const Stroke = (path: ReactNode) => {
  function Glyph({ size = 16, ...rest }: IconComponentProps): ReactElement {
    return (
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        {...rest}
      >
        {path}
      </svg>
    );
  }
  return Glyph;
};

const { Icon } = CreateIcons({
  ...CommonPack,
  calendar: Stroke(
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M8 3v4M16 3v4M3 11h18" />
    </>,
  ),
  building: Stroke(
    <>
      <path d="M4 21V6l7-3v18M11 21h9V10l-9-3" />
      <path d="M15 13h1M15 17h1" />
    </>,
  ),
  globe: Stroke(
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18" />
    </>,
  ),
  film: Stroke(
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M7 4v16M17 4v16M3 10h18M3 14h18" />
    </>,
  ),
  expand: Stroke(
    <path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3" />,
  ),
  activity: Stroke(<path d="M3 12h4l3 8 4-16 3 8h4" />),
  lifebuoy: Stroke(
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="3.5" />
      <path d="m5.6 5.6 3.9 3.9M14.5 14.5l3.9 3.9M18.4 5.6l-3.9 3.9M9.5 14.5l-3.9 3.9" />
    </>,
  ),
  history: Stroke(
    <>
      <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
      <path d="M3 4v4h4M12 8v4l3 2" />
    </>,
  ),
  code: Stroke(<path d="m9 8-4 4 4 4M15 8l4 4-4 4" />),
});

interface Company {
  name: string;
  tagline: string;
  sector: string;
  services: ("film" | "building" | "globe")[];
  created: string;
  renews: string;
  owner: { name: string; email: string };
  mark: ReactNode;
}

const CARD_ACTIONS: MenuItemData[] = [
  { key: "open", label: "Abrir empresa" },
  { key: "edit", label: "Editar datos" },
  { key: "members", label: "Gestionar equipo" },
  { key: "leave", label: "Salir de la empresa", danger: true },
];

const OWNED: Company[] = [
  {
    name: "The Film Vault",
    tagline: "El orden y la tecnología serán una herramienta sencilla",
    sector: "Productoras de Contenido (Cine, Series…)",
    services: ["film", "building", "globe"],
    created: "10/12/2024",
    renews: "20/10/2025",
    owner: { name: "Administrador The Film Vault", email: "admin@thefilmvault.app" },
    mark: (
      <svg viewBox="0 0 64 64" width="72" height="72" aria-hidden="true">
        <circle cx="32" cy="26" r="15" fill="none" stroke="currentColor" strokeWidth="3" />
        <circle cx="32" cy="26" r="4" fill="currentColor" />
        <circle cx="32" cy="16" r="3.4" fill="currentColor" />
        <circle cx="41" cy="31" r="3.4" fill="currentColor" />
        <circle cx="23" cy="31" r="3.4" fill="currentColor" />
        <rect x="18" y="44" width="28" height="4" rx="2" fill="currentColor" />
      </svg>
    ),
  },
];

const INVITED: Company[] = [
  {
    name: "Pixit Company",
    tagline: "Join The Fun",
    sector: "Comercio Electrónico",
    services: ["building", "globe"],
    created: "25/01/2025",
    renews: "23/07/2026",
    owner: { name: "Pixit Admin", email: "rbabajanov@gmail.com" },
    mark: (
      <Text fz="h3" fw="bold" ff="mono" ls="wide">
        PIXIT
      </Text>
    ),
  },
];

function Cover({ company }: { company: Company }): ReactElement {
  return (
    <Box
      position="relative"
      h={190}
      display="flex"
      align="center"
      justify="center"
      style={{ background: palettes.dark["100"] }}
    >
      <Box c="warning.400" display="flex" align="center" justify="center">
        {company.mark}
      </Box>

      <Box position="absolute" style={{ top: 12, left: 12 }}>
        <ActionIcon variant="light" size="sm" aria-label={`Ampliar ${company.name}`}>
          <Icon name="expand" />
        </ActionIcon>
      </Box>

      <Box position="absolute" style={{ top: 12, right: 12 }}>
        <Menu
          items={CARD_ACTIONS}
          aria-label={`Acciones de ${company.name}`}
          trigger={
            <ActionIcon variant="light" size="sm" aria-label={`Acciones de ${company.name}`}>
              <Icon name="more" />
            </ActionIcon>
          }
        />
      </Box>

      <Box
        position="absolute"
        style={{ bottom: 12, right: 12 }}
        display="flex"
        gap="xxs"
        bg="surface.overlay"
        r="sm"
        p="xxs"
      >
        {company.services.map((service) => (
          <Tooltip
            key={service}
            label={SERVICE_LABEL[service]}
            trigger={
              <ActionIcon variant="ghost" size="xs" aria-label={SERVICE_LABEL[service]}>
                <Icon name={service} />
              </ActionIcon>
            }
          />
        ))}
      </Box>
    </Box>
  );
}

const SERVICE_LABEL = {
  film: "Producciones",
  building: "Bodegas",
  globe: "Página web",
} as const;

function CompanyCard({ company }: { company: Company }): ReactElement {
  return (
    <Card withBorder radius="md" padding="none">
      <Card.Section>
        <Cover company={company} />
      </Card.Section>

      <Box p="md" display="flex" direction="column" gap="xxs">
        <Text component="h3" fz="body2" fw="semibold">
          {company.name}
        </Text>
        <Text fz="body3" c="accent.600">
          {company.tagline}
        </Text>
      </Box>

      <Divider />

      <Box p="md" display="flex" direction="column" gap="xs">
        <Text fz="caption" c="text.muted">
          Sectores
        </Text>
        <Box>
          <Badge variant="light" color="gray">
            {company.sector}
          </Badge>
        </Box>
      </Box>

      <Divider />

      <Box p="md" display="flex" align="center" justify="space-between" gap="sm">
        <Box display="flex" align="center" gap="xxs" c="text.muted">
          <Icon name="calendar" />
          <Text fz="caption">{company.created}</Text>
        </Box>
        <Box display="flex" align="center" gap="xxs" c="text.muted">
          <Icon name="calendar" />
          <Text fz="caption">{company.renews}</Text>
        </Box>
      </Box>

      <Divider />

      <Box p="md" display="flex" align="center" gap="sm">
        <Avatar name={company.owner.name} size="sm" radius="full" />
        <Box display="flex" direction="column" miw={0}>
          <Text fz="caption" fw="semibold">
            {company.owner.name}
          </Text>
          <Text fz="caption" c="text.muted">
            {company.owner.email}
          </Text>
        </Box>
      </Box>
    </Card>
  );
}

function Side(): ReactElement {
  return (
    <Box display="flex" direction="column" h="100%">
      <Box p="md" display="flex" align="center" gap="sm">
        <Box c="text.primary" display="flex">
          <Icon name="film" size={22} />
        </Box>
        <Text fz="body2" fw="bold" ls="wide">
          THE FILM VAULT
        </Text>
      </Box>

      <Divider />

      <Box p="sm">
        <Card withBorder radius="md" padding="md" variant="light" color="primary">
          <Text fz="caption" c="text.muted">
            Super Administrador
          </Text>
          <Box display="flex" align="center" gap="xs" mt="xxs">
            <Icon name="code" />
            <Text fz="body3" fw="semibold">
              Super Administrador
            </Text>
          </Box>
        </Card>
      </Box>

      <Box px="md" py="xs" display="flex" align="center" justify="space-between">
        <Text fz="caption" c="text.muted">
          Administrador
        </Text>
        <ActionIcon variant="ghost" size="xs" aria-label="Recargar permisos">
          <Icon name="history" />
        </ActionIcon>
      </Box>

      <Box px="sm" display="flex" direction="column" gap="xxs">
        <NavLink label="Actividad" href="#actividad" leftSection={<Icon name="activity" />} />
        <NavLink label="Soporte" href="#soporte" disabled leftSection={<Icon name="lifebuoy" />} />
        <NavLink
          label="Ir a Mis Empresas"
          href="#empresas"
          active
          leftSection={<Icon name="building" />}
        />
      </Box>

      <Box style={{ marginTop: "auto" }}>
        <Divider />
        <Box p="sm" display="flex" align="center" gap="sm">
          <Avatar name="William Jesus Covarrubias" size="sm" radius="full" />
          <Box display="flex" direction="column" miw={0} style={{ flex: 1 }}>
            <Text fz="caption" fw="semibold">
              William Jesus Covarrubias
            </Text>
            <Text fz="caption" c="text.muted">
              skr13@outlook.com
            </Text>
          </Box>
          <Indicator color="error" size="xs">
            <ActionIcon variant="ghost" size="sm" aria-label="Notificaciones">
              <Icon name="bell" />
            </ActionIcon>
          </Indicator>
        </Box>
      </Box>
    </Box>
  );
}

function CompanyGrid({ companies }: { companies: Company[] }): ReactElement {
  return (
    <SimpleGrid cols={{ base: 1, tablet: 2, desktop: 3, wide: 4 }} spacing="md">
      {companies.map((company) => (
        <CompanyCard key={company.name} company={company} />
      ))}
    </SimpleGrid>
  );
}

function CompanyBoard(): ReactElement {
  return (
    <AppShell
      navbarWidth={300}
      headerHeight={76}
      header={
        <Header
          title="Mis Empresas"
          subtitle="Ve todas las empresas que has creado y administras"
          rightSection={
            <Button size="sm" rightSection={<Icon name="plus" />}>
              Crear Empresa
            </Button>
          }
        />
      }
      navbar={<Side />}
    >
      <Box display="flex" direction="column" gap="xl">
        <VisuallyHidden>
          <Title order={2}>Empresas que administras</Title>
        </VisuallyHidden>
        <CompanyGrid companies={OWNED} />

        <Box display="flex" direction="column" gap="xxs">
          <Title order={2} fz="body1">
            Empresas invitadas
          </Title>
          <Text fz="body3" c="text.secondary">
            Estas son las empresas que te han invitado a unirte a su equipo
          </Text>
        </Box>

        <CompanyGrid companies={INVITED} />
      </Box>
    </AppShell>
  );
}

const meta: Meta = {
  title: "Patterns/Dashboard",
  parameters: { layout: "fullscreen" },
};

export default meta;

type Story = StoryObj;

/**
 * Listado de empresas del panel: la pantalla que comparten `The Film Vault` y `Polaris`.
 * A diferencia de la landing —19 componentes, ninguno interactivo— esta compone `AppShell`,
 * `NavLink`, `Menu`, `Tooltip`, `Indicator`, `Avatar` y `Card` compuesta.
 */
export const Empresas: Story = {
  render: () => <CompanyBoard />,
};

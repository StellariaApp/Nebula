import type { Meta, StoryObj } from "@storybook/react-vite";
import { useRef, useState, type ReactElement, type ReactNode } from "react";

import { CreateIcons, type IconComponentProps } from "@stellaria/nebula-icons";
import { CommonPack } from "@stellaria/nebula-icons/packs";
import { palettes } from "@stellaria/nebula-tokens";
import {
  ActionIcon,
  Avatar,
  Badge,
  AppShell,
  Box,
  Breadcrumbs,
  Button,
  Card,
  Divider,
  GlassSurface,
  GradientText,
  Indicator,
  Menu,
  NavLink,
  SimpleGrid,
  Table,
  Tabs,
  Progress,
  StarField,
  Text,
  Title,
  Tooltip,
  VisuallyHidden,
  type BreadcrumbItem,
  type MenuItemData,
  Flex,
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
      <Text fz="h3" fw="bold" ff="mono" ls="wide" style={{ color: palettes.light["200"] }}>
        PIXIT
      </Text>
    ),
  },
];

/**
 * El cover es lienzo de marca: negro en los dos esquemas. Su cromado no puede seguir al tema
 * -- en claro saldria gris sobre negro -- asi que va en blanco fijo, como en las dos referencias.
 */
const ON_CANVAS = {
  background: "rgba(255, 255, 255, 0.07)",
  backdropFilter: "blur(10px) saturate(130%)",
  border: "1px solid rgba(255, 255, 255, 0.10)",
  color: palettes.light["50"],
} as const;

function Cover({ company }: { company: Company }): ReactElement {
  return (
    <Box
      position="relative"
      h={200}
      display="flex"
      align="center"
      justify="center"
      style={{
        background: `radial-gradient(120% 90% at 50% 0%, ${palettes.dark["300"]} 0%, ${palettes.dark["100"]} 70%)`,
      }}
    >
      <Box c="warning.400" display="flex" align="center" justify="center">
        {company.mark}
      </Box>

      <Box position="absolute" style={{ top: 12, left: 12 }}>
        <ActionIcon
          variant="unstyled"
          size="xs"
          r="sm"
          style={ON_CANVAS}
          aria-label={`Ampliar ${company.name}`}
        >
          <Icon name="expand" />
        </ActionIcon>
      </Box>

      <Box position="absolute" style={{ top: 12, right: 12 }}>
        <Menu
          items={CARD_ACTIONS}
          aria-label={`Acciones de ${company.name}`}
          trigger={
            <ActionIcon
              variant="unstyled"
              size="xs"
              r="sm"
              style={ON_CANVAS}
              aria-label={`Acciones de ${company.name}`}
            >
              <Icon name="more" />
            </ActionIcon>
          }
        />
      </Box>

      <Box
        position="absolute"
        style={{ bottom: 12, right: 12, ...ON_CANVAS }}
        r="md"
        display="flex"
        gap="xxs"
        p="xxs"
      >
        {company.services.map((service) => (
          <Tooltip
            key={service}
            label={SERVICE_LABEL[service]}
            trigger={
              <ActionIcon
                variant="unstyled"
                size="xs"
                aria-label={SERVICE_LABEL[service]}
                style={{ color: palettes.light["50"] }}
              >
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
    <Card withBorder radius="lg" padding="none" variant="glass" glass="strong">
      <Card.Section>
        <Cover company={company} />
      </Card.Section>

      <Box px="md" py="sm" display="flex" direction="column" gap="none">
        <Text component="h3" fz="body2" fw="semibold">
          {company.name}
        </Text>
        <Text fz="body3" c="text.secondary">
          {company.tagline}
        </Text>
      </Box>

      <Divider />

      <Box px="md" py="sm" display="flex" direction="column" gap="xxs">
        <Text fz="caption" c="text.muted" tt="uppercase" ls="wide" fw="semibold">
          Sectores
        </Text>
        <Box>
          <Badge size="xs" variant="light" color="gray">
            {company.sector}
          </Badge>
        </Box>
      </Box>

      <Divider />

      <Box px="md" py="sm" display="flex" align="center" justify="space-between" gap="sm">
        <Box display="flex" align="center" gap="xs" c="text.muted">
          <Icon name="calendar" />
          <Text fz="caption">{company.created}</Text>
        </Box>
        <Box display="flex" align="center" gap="xs" c="text.muted">
          <Icon name="calendar" />
          <Text fz="caption">{company.renews}</Text>
        </Box>
      </Box>

      <Divider />

      <Box px="md" py="sm" display="flex" align="center" gap="sm">
        <Avatar name={company.owner.name} size="sm" radius="full" variant="light" color="accent" />
        <Box display="flex" direction="column" gap="none">
          <Text fz="caption" fw="semibold" lh="tight" tt="capitalize">
            {company.owner.name}
          </Text>
          <Text fz="caption" c="text.muted" lh="tight" tt="lowercase">
            {company.owner.email}
          </Text>
        </Box>
      </Box>
    </Card>
  );
}

type IconName = Parameters<typeof Icon>[0]["name"];

function NavIcon({ name, muted = false }: { name: IconName; muted?: boolean }): ReactElement {
  return (
    <Box
      display="flex"
      align="center"
      justify="center"
      w={24}
      h={24}
      r="sm"
      bg={muted ? "surface.hover" : "primary.100"}
      c={muted ? "text.disabled" : "primary.700"}
    >
      <Icon name={name} size={14} />
    </Box>
  );
}

function Brand(): ReactElement {
  return (
    <Flex w="100%" display="flex" align="center" justify="center" gap="md">
      <Box c="primary.600" display="flex">
        <Icon name="building" size={28} />
      </Box>
      <AppShell.RailLabel>
        <Text fz="h6" fw="bold" lh="tight" style={{ whiteSpace: "nowrap" }}>
          <GradientText>Company</GradientText>
        </Text>
      </AppShell.RailLabel>
    </Flex>
  );
}

function UserRow(): ReactElement {
  return (
    <>
      <Avatar name="William Jesus Covarrubias" size="sm" radius="full" />
      <AppShell.RailLabel>
        <Box display="flex" direction="column" miw={0} style={{ flex: 1 }}>
          <Text fz="caption" fw="semibold" truncate>
            William Jesus Covarrubias
          </Text>
          <Text fz="caption" c="text.muted" truncate>
            skr13@outlook.com
          </Text>
        </Box>
      </AppShell.RailLabel>
      <Indicator color="error" size="xs">
        <ActionIcon variant="ghost" size="sm" aria-label="Notificaciones">
          <Icon name="bell" />
        </ActionIcon>
      </Indicator>
    </>
  );
}

function SideNav(): ReactElement {
  return (
    <Box display="flex" direction="column">
      <AppShell.RailLabel>
        <Box px="md" pt="md">
          <GlassSurface level="subtle" radius="md" withBorder p="md">
          <Text fz="caption" c="text.muted" tt="uppercase" ls="wide" fw="semibold">
            Super Administrador
          </Text>
          <Box display="flex" align="center" gap="xs" mt="xxs" c="accent.600">
            <Icon name="code" />
            <Text fz="body3" fw="semibold" c="text.primary">
              Super Administrador
            </Text>
          </Box>
          </GlassSurface>
        </Box>
      </AppShell.RailLabel>

      <AppShell.RailLabel>
        <Box px="md" pt="md" pb="xs" display="flex" align="center" justify="space-between">
          <Text fz="caption" c="text.muted" tt="uppercase" ls="wide" fw="semibold">
            Administrador
          </Text>
          <ActionIcon variant="ghost" size="xs" aria-label="Recargar permisos">
            <Icon name="history" />
          </ActionIcon>
        </Box>
      </AppShell.RailLabel>

      <AppShell.RailNav>
        <NavLink
          label={<AppShell.RailLabel>Actividad</AppShell.RailLabel>}
          href="#actividad"
          py="xxs"
          leftSection={<NavIcon name="activity" />}
        />
        <NavLink
          label={<AppShell.RailLabel>Soporte</AppShell.RailLabel>}
          href="#soporte"
          disabled
          py="xxs"
          c="text.disabled"
          leftSection={<NavIcon name="lifebuoy" muted />}
        />
        <NavLink
          label={<AppShell.RailLabel>Ir a Mis Empresas</AppShell.RailLabel>}
          href="#empresas"
          active
          py="xxs"
          leftSection={<NavIcon name="building" />}
        />
      </AppShell.RailNav>
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

const TRAIL: BreadcrumbItem[] = [
  { key: "home", label: "Inicio", href: "#inicio" },
  { key: "companies", label: "Mis Empresas" },
];

function CompanyBoard(): ReactElement {
  const scroller = useRef<HTMLElement | null>(null);
  const [mini, set_mini] = useState(false);

  return (
    <AppShell
      mainRef={scroller}
      scrollShadowOffset={116}
      sidebarCollapsed={mini}
      backdrop={<StarField fixed parallax aurora density="sm" scroller={scroller} />}
      sidebar={
        <AppShell.Sidebar
          aria-label="Navegación principal"
          collapsed={mini}
          onCollapse={set_mini}
          top={<Brand />}
          bottom={<UserRow />}
        >
          <SideNav />
        </AppShell.Sidebar>
      }
    >
      <VisuallyHidden>
        <Title order={1}>Panel de empresas</Title>
      </VisuallyHidden>

      <AppShell.Section aria-label="Mis Empresas">
        <AppShell.Header
          sticky
          title="Mis Empresas"
          subtitle="Ve todas las empresas que has creado y administras"
          actions={
            <Button size="sm" rightSection={<Icon name="plus" />}>
              Crear Empresa
            </Button>
          }
        />
        <AppShell.Subbar sticky>
          <Breadcrumbs items={TRAIL} />
        </AppShell.Subbar>
        <AppShell.Content>
          <CompanyGrid companies={OWNED} />
        </AppShell.Content>
      </AppShell.Section>

      <AppShell.Section aria-label="Empresas invitadas">
        <AppShell.Header
          sticky
          title="Empresas invitadas"
          subtitle="Estas son las empresas que te han invitado a unirte a su equipo"
        />
        <AppShell.Content>
          <CompanyGrid companies={INVITED} />
        </AppShell.Content>
      </AppShell.Section>
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

const TEAM = [
  { name: "Administrador The Film Vault", email: "admin@thefilmvault.app", role: "Propietario" },
  { name: "Marta Ibáñez", email: "marta@thefilmvault.app", role: "Administrador" },
  { name: "Diego Serrano", email: "diego@thefilmvault.app", role: "Operador" },
  { name: "Lucía Prats", email: "lucia@thefilmvault.app", role: "Invitado" },
] as const;

const ROLE_TONE = {
  Propietario: "primary",
  Administrador: "accent",
  Operador: "info",
  Invitado: "gray",
} as const;

const COMPANY_TRAIL: BreadcrumbItem[] = [
  { key: "home", label: "Inicio", href: "#inicio" },
  { key: "companies", label: "Mis Empresas", href: "#empresas" },
  { key: "current", label: "The Film Vault" },
];

function Metric({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}): ReactElement {
  return (
    <GlassSurface level="subtle" radius="md" withBorder p="md">
      <Text fz="caption" c="text.muted" tt="uppercase" ls="wide" fw="semibold">
        {label}
      </Text>
      <Text fz="h4" fw="bold" lh="tight" mt="xxs">
        {value}
      </Text>
      <Text fz="caption" c="text.muted">
        {hint}
      </Text>
    </GlassSurface>
  );
}

function ServiceCard({
  icon,
  name,
  note,
  used,
  quota,
}: {
  icon: IconName;
  name: string;
  note: string;
  used: number;
  quota: number;
}): ReactElement {
  const pct = Math.round((used / quota) * 100);
  return (
    <Card withBorder radius="lg" p="md">
      <Flex align="center" gap="sm">
        <Box c="primary.600" display="flex">
          <Icon name={icon} size={22} />
        </Box>
        <Box miw={0} style={{ flex: 1 }}>
          <Text fz="body2" fw="semibold" truncate>
            {name}
          </Text>
          <Text fz="caption" c="text.muted" truncate>
            {note}
          </Text>
        </Box>
        <Badge variant="light" color={pct > 85 ? "warning" : "success"}>
          {pct} %
        </Badge>
      </Flex>
      <Progress
        value={pct}
        size="xs"
        mt="sm"
        color={pct > 85 ? "warning" : "primary"}
        label={`Consumo de ${name}`}
      />
      <Text fz="caption" c="text.muted" mt="xxs">
        {used} de {quota} unidades
      </Text>
    </Card>
  );
}

function TeamTable(): ReactElement {
  return (
    <Table.ScrollContainer>
      <Table highlightOnHover density="comfortable" caption="Equipo de The Film Vault">
        <Table.Head>
          <Table.Row>
            <Table.Title>Persona</Table.Title>
            <Table.Title>Rol</Table.Title>
            <Table.Title align="end">Acciones</Table.Title>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {TEAM.map((person) => (
            <Table.Row key={person.email}>
              <Table.Cell>
                <Flex align="center" gap="sm">
                  <Avatar name={person.name} size="sm" radius="full" />
                  <Box miw={0}>
                    <Text fz="body3" fw="semibold" truncate>
                      {person.name}
                    </Text>
                    <Text fz="caption" c="text.muted" truncate>
                      {person.email}
                    </Text>
                  </Box>
                </Flex>
              </Table.Cell>
              <Table.Cell>
                <Badge variant="light" color={ROLE_TONE[person.role]}>
                  {person.role}
                </Badge>
              </Table.Cell>
              <Table.Cell align="end">
                <Menu
                  items={CARD_ACTIONS}
                  aria-label={`Acciones de ${person.name}`}
                  trigger={
                    <ActionIcon variant="ghost" size="sm" aria-label={`Acciones de ${person.name}`}>
                      <Icon name="more" />
                    </ActionIcon>
                  }
                />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Table.ScrollContainer>
  );
}

function CompanyDetail(): ReactElement {
  const scroller = useRef<HTMLElement | null>(null);
  const [mini, set_mini] = useState(false);
  const company = OWNED[0] as Company;

  const tabs = [
    {
      value: "resumen",
      label: "Resumen",
      content: (
        <Box display="flex" direction="column" gap="lg" pt="md">
          <SimpleGrid cols={{ base: 1, tablet: 3 }} spacing="md">
            <Metric label="Servicios activos" value="3" hint="de 5 contratados" />
            <Metric label="Personas" value="4" hint="1 propietario, 3 con acceso" />
            <Metric label="Renueva" value={company.renews} hint="plan anual" />
          </SimpleGrid>
          <Box>
            <Title order={2} fz="h6" mb="sm">
              Servicios
            </Title>
            <SimpleGrid cols={{ base: 1, tablet: 2, laptop: 3 }} spacing="md">
              <ServiceCard
                icon="film"
                name="Warehouse"
                note="Almacén de material y copias"
                used={412}
                quota={500}
              />
              <ServiceCard
                icon="building"
                name="Producción"
                note="Rodajes y equipos"
                used={38}
                quota={120}
              />
              <ServiceCard
                icon="globe"
                name="Distribución"
                note="Ventanas y territorios"
                used={91}
                quota={100}
              />
            </SimpleGrid>
          </Box>
        </Box>
      ),
    },
    {
      value: "equipo",
      label: "Equipo",
      content: (
        <Box pt="md">
          <TeamTable />
        </Box>
      ),
    },
    {
      value: "ajustes",
      label: "Ajustes",
      content: (
        <Box pt="md">
          <GlassSurface level="subtle" radius="md" withBorder p="lg">
            <Title order={2} fz="h6">
              Datos de la empresa
            </Title>
            <Text fz="body3" c="text.secondary" mt="xxs">
              {company.sector}
            </Text>
            <Divider my="md" />
            <Text fz="caption" c="text.muted" tt="uppercase" ls="wide" fw="semibold">
              Creada
            </Text>
            <Text fz="body3">{company.created}</Text>
          </GlassSurface>
        </Box>
      ),
    },
  ];

  return (
    <AppShell
      mainRef={scroller}
      scrollShadowOffset={116}
      sidebarCollapsed={mini}
      backdrop={<StarField fixed parallax aurora density="sm" scroller={scroller} />}
      sidebar={
        <AppShell.Sidebar
          aria-label="Navegación principal"
          collapsed={mini}
          onCollapse={set_mini}
          top={<Brand />}
          bottom={<UserRow />}
        >
          <SideNav />
        </AppShell.Sidebar>
      }
    >
      <VisuallyHidden>
        <Title order={1}>{company.name}</Title>
      </VisuallyHidden>

      <AppShell.Section aria-label={company.name}>
        <AppShell.Header
          sticky
          title={company.name}
          subtitle={company.tagline}
          actions={
            <Button size="sm" variant="glass" rightSection={<Icon name="edit" />}>
              Editar
            </Button>
          }
        />
        <AppShell.Subbar sticky>
          <Breadcrumbs items={COMPANY_TRAIL} />
        </AppShell.Subbar>
        <AppShell.Content>
          <Tabs data={tabs} defaultValue="resumen" />
        </AppShell.Content>
      </AppShell.Section>
    </AppShell>
  );
}

/**
 * Detalle de empresa: la pantalla a la que lleva una tarjeta del listado. Compone `Tabs`,
 * `Table` con desplazamiento, `Progress` y `Metric` sobre el mismo carril que `Empresas`.
 */
export const CompanyPage: Story = {
  render: () => <CompanyDetail />,
};

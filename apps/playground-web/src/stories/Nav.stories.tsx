import { expect, userEvent, within } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactElement } from "react";

import { Badge, Box, Button, Card, Nav, Text, Title } from "@stellaria/nebula-web";

import { MATRIX_A11Y, rosette, ThemeMatrix } from "../fixtures/themes.js";

const meta: Meta<typeof Nav> = {
  title: "Navigation/Nav",
  component: Nav,
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof Nav>;

const ANCHORS = [
  { href: "#solucion", label: "Solución" },
  { href: "#capacidades", label: "Capacidades" },
  { href: "#estimador", label: "Precios" },
  { href: "#seguridad", label: "Seguridad" },
] as const;

const ROUTES = [
  { href: "/", label: "Inicio" },
  { href: "/docs", label: "Docs" },
  { href: "/docs/api", label: "API" },
  { href: "/precios", label: "Precios" },
] as const;

const MARK = (
  <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
    <circle cx="12" cy="6" r="4" fill="currentColor" />
    <circle cx="6" cy="16" r="4" fill="currentColor" opacity="0.75" />
    <circle cx="18" cy="16" r="4" fill="currentColor" opacity="0.5" />
  </svg>
);

function Brand(): ReactElement {
  return (
    <Nav.Logo href="#inicio" aria-label="Inicio">
      {MARK}
      <span>Rosette</span>
    </Nav.Logo>
  );
}

export const Default: Story = {
  render: () => (
    <Nav>
      <Brand />
      <Nav.Links>
        {ANCHORS.map((item) => (
          <Nav.Links.Link key={item.href} href={item.href}>
            {item.label}
          </Nav.Links.Link>
        ))}
      </Nav.Links>
      <Badge>en línea</Badge>
    </Nav>
  ),
};

export const Variants: Story = {
  name: "Variants (color del indicador)",
  render: () => (
    <Box display="flex" direction="column" gap="lg">
      <Text fz="body3" c="text.secondary">
        El indicador sale de `ResolveVariant`: cambia con `variant` y `color`, nunca con un hex.
      </Text>
      {(["light", "filled", "outline", "glass"] as const).map((variant) => (
        <Box key={variant} display="flex" direction="column" gap="xxs">
          <Text fz="caption" c="text.muted" ff="mono">
            variant={variant}
          </Text>
          <Nav withBorder>
            <Brand />
            <Nav.Links
              aria-label={`Principal (${variant})`}
              variant={variant}
              activeMode="manual"
              active="#capacidades"
            >
              {ANCHORS.map((item) => (
                <Nav.Links.Link key={item.href} href={item.href}>
                  {item.label}
                </Nav.Links.Link>
              ))}
            </Nav.Links>
          </Nav>
        </Box>
      ))}
    </Box>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Box display="flex" direction="column" gap="lg">
      {(["sm", "md", "lg"] as const).map((size) => (
        <Box key={size} display="flex" direction="column" gap="xxs">
          <Text fz="caption" c="text.muted" ff="mono">
            size={size}
          </Text>
          <Nav size={size} withBorder>
            <Brand />
            <Nav.Links aria-label={`Principal (${size})`} activeMode="manual" active="#solucion">
              {ANCHORS.map((item) => (
                <Nav.Links.Link key={item.href} href={item.href}>
                  {item.label}
                </Nav.Links.Link>
              ))}
            </Nav.Links>
            <Badge>beta</Badge>
          </Nav>
        </Box>
      ))}
    </Box>
  ),
};

export const States: Story = {
  render: () => (
    <Box display="flex" direction="column" gap="lg">
      <Text fz="body3" c="text.secondary">
        El activo lleva `aria-current`; el deshabilitado pierde el `href` y anuncia `aria-disabled`.
        Con el tabulador se ve el anillo de foco de `styles/focus.css.ts`.
      </Text>
      <Nav withBorder>
        <Brand />
        <Nav.Links activeMode="manual" active="#solucion">
          <Nav.Links.Link href="#solucion">Activo</Nav.Links.Link>
          <Nav.Links.Link href="#capacidades">Normal</Nav.Links.Link>
          <Nav.Links.Link href="#estimador" disabled>
            Deshabilitado
          </Nav.Links.Link>
          <Nav.Divider />
          <Nav.Links.Link onPress={() => undefined}>Sin href (botón)</Nav.Links.Link>
        </Nav.Links>
      </Nav>
    </Box>
  ),
};

export const Alignment: Story = {
  render: () => (
    <Box display="flex" direction="column" gap="lg">
      {(["start", "center", "end"] as const).map((align) => (
        <Box key={align} display="flex" direction="column" gap="xxs">
          <Text fz="caption" c="text.muted" ff="mono">
            align={align}
          </Text>
          <Nav withBorder>
            <Brand />
            <Nav.Links
              aria-label={`Principal (${align})`}
              align={align}
              activeMode="manual"
              active="#solucion"
            >
              {ANCHORS.slice(0, 3).map((item) => (
                <Nav.Links.Link key={item.href} href={item.href}>
                  {item.label}
                </Nav.Links.Link>
              ))}
            </Nav.Links>
            <Nav.Actions>
              <Button size="sm">Entrar</Button>
            </Nav.Actions>
          </Nav>
        </Box>
      ))}
    </Box>
  ),
};

export const Pathname: Story = {
  render: () => (
    <Box display="flex" direction="column" gap="lg">
      <Text fz="body3" c="text.secondary">
        Con rutas en vez de anclas, `auto` resuelve el modo `pathname` y gana el prefijo más largo:
        en `/docs/api/v2` se marca `/docs/api`, no `/docs` ni `/`. Aquí se fija con `active` para
        que la lámina no dependa de la URL de Storybook.
      </Text>
      <Nav withBorder>
        <Brand />
        <Nav.Links active="/docs/api">
          {ROUTES.map((item) => (
            <Nav.Links.Link key={item.href} href={item.href}>
              {item.label}
            </Nav.Links.Link>
          ))}
        </Nav.Links>
        <Nav.Actions>
          <Button size="sm" variant="outline">
            Iniciar sesión
          </Button>
        </Nav.Actions>
      </Nav>
    </Box>
  ),
};

function Landing(props: { scrolled?: boolean | undefined }): ReactElement {
  const { scrolled } = props;
  return (
    <>
      <Nav
        component="header"
        aria-label="Cabecera del sitio"
        floating
        {...(scrolled === undefined ? {} : { scrolled })}
      >
        <Brand />
        <Nav.Links>
          {ANCHORS.map((item) => (
            <Nav.Links.Link key={item.href} href={item.href}>
              {item.label}
            </Nav.Links.Link>
          ))}
        </Nav.Links>
        <Nav.Actions>
          <Badge>en línea</Badge>
        </Nav.Actions>
      </Nav>
      <Box pt="xxxl" px="md" pb="xl" display="flex" direction="column" gap="xxl">
        {ANCHORS.map((item) => (
          <Box key={item.href} id={item.href.slice(1)} display="flex" direction="column" gap="sm">
            <Title order={2}>{item.label}</Title>
            <Text fz="body3" c="text.secondary" maw="62ch">
              El indicador sigue a la sección que cruza el marcador del scroll-spy, situado en el
              primer tercio del viewport. Al pasar de 24 px la barra se recoge en pastilla con el
              cristal del tema.
            </Text>
            {Array.from({ length: 3 }, (_, index) => (
              <Card key={index} p="md" withBorder radius="md">
                <Text fz="body3">
                  {item.label} · bloque {String(index + 1)}
                </Text>
              </Card>
            ))}
          </Box>
        ))}
      </Box>
    </>
  );
}

export const Composition: Story = {
  name: "Composition (landing con scroll-spy)",
  parameters: { layout: "fullscreen" },
  render: () => <Landing />,
};

function Pinned(props: { scrolled: boolean; label: string }): ReactElement {
  const { scrolled, label } = props;
  return (
    <Box display="flex" direction="column" gap="xs">
      <Text fz="caption" c="text.muted" ff="mono">
        {label}
      </Text>
      <Box h={120} r="md" bg="surface.sunken" style={{ transform: "translateZ(0)" }}>
        <Nav floating scrolled={scrolled}>
          <Brand />
          <Nav.Links activeMode="manual" active="#solucion">
            {ANCHORS.slice(0, 3).map((item) => (
              <Nav.Links.Link key={item.href} href={item.href}>
                {item.label}
              </Nav.Links.Link>
            ))}
          </Nav.Links>
          <Badge>en línea</Badge>
        </Nav>
      </Box>
    </Box>
  );
}

export const FloatingStates: Story = {
  parameters: MATRIX_A11Y,
  render: () => (
    <Box display="flex" direction="column" gap="lg">
      <Text fz="body3" c="text.secondary">
        `scrolled` controlado permite ver los dos estados sin hacer scroll — y es lo que usan los
        tests. El contenedor lleva un `transform` para que `position: fixed` se ancle a él.
      </Text>
      <Pinned scrolled={false} label="scrolled=false" />
      <Pinned scrolled label="scrolled=true" />
    </Box>
  ),
};

export const Dark: Story = {
  globals: { theme: "nebula-dark" },
  render: () => (
    <Nav withBorder>
      <Brand />
      <Nav.Links activeMode="manual" active="#capacidades">
        {ANCHORS.map((item) => (
          <Nav.Links.Link key={item.href} href={item.href}>
            {item.label}
          </Nav.Links.Link>
        ))}
      </Nav.Links>
      <Badge>en línea</Badge>
    </Nav>
  ),
};

export const ReducedMotion: Story = {
  globals: { reducedMotion: "reduce" },
  render: () => (
    <Box display="flex" direction="column" gap="sm">
      <Text fz="body3" c="text.secondary">
        Con reduced-motion el indicador salta en vez de deslizarse y la pastilla deja de
        transicionar — el estado sigue cambiando.
      </Text>
      <Nav withBorder>
        <Brand />
        <Nav.Links activeMode="manual" active="#estimador">
          {ANCHORS.map((item) => (
            <Nav.Links.Link key={item.href} href={item.href}>
              {item.label}
            </Nav.Links.Link>
          ))}
        </Nav.Links>
      </Nav>
    </Box>
  ),
};

export const AllThemes: Story = {
  parameters: { ...MATRIX_A11Y, layout: "padded" },
  render: () => (
    <ThemeMatrix extra={[{ theme: rosette, label: "rosette" }]}>
      <Nav size="sm" withBorder>
        <Nav.Logo href="#inicio" aria-label="Inicio">
          {MARK}
        </Nav.Logo>
        <Nav.Links activeMode="manual" active="#solucion">
          {ANCHORS.slice(0, 3).map((item) => (
            <Nav.Links.Link key={item.href} href={item.href}>
              {item.label}
            </Nav.Links.Link>
          ))}
        </Nav.Links>
      </Nav>
    </ThemeMatrix>
  ),
};

export const KeyboardActivation: Story = {
  render: () => (
    <Nav withBorder>
      <Brand />
      <Nav.Links activeMode="manual" active="#solucion">
        {ANCHORS.map((item) => (
          <Nav.Links.Link key={item.href} href={item.href}>
            {item.label}
          </Nav.Links.Link>
        ))}
      </Nav.Links>
    </Nav>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const first = canvas.getByRole("link", { name: "Solución" });

    first.focus();
    await expect(first).toHaveFocus();
    await expect(first).toHaveAttribute("aria-current", "location");

    await userEvent.tab();
    await expect(canvas.getByRole("link", { name: "Capacidades" })).toHaveFocus();
  },
};

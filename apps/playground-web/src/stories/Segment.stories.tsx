import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { Box, Button, Paper, Segment, Text, TextInput, Title } from "@stellaria/nebula-web";

import { MATRIX_A11Y, ThemeMatrix } from "../fixtures/themes.js";

const meta: Meta = {
  title: "Navigation/Segment",
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj;

const SECCIONES = [
  { value: "resumen", label: "Resumen" },
  { value: "movimientos", label: "Movimientos" },
  { value: "documentos", label: "Documentos" },
];

/** Caso 1 — selector de valor: sin `Segment.Content` el control es un `radiogroup`. */
export const Default: Story = {
  render: function ValuePicker() {
    const [view, set_view] = useState("lista");
    return (
      <Box display="flex" direction="column" gap="md" align="flex-start">
        <Segment value={view} onChange={set_view}>
          <Segment.Control
            aria-label="Vista"
            data={[
              { value: "lista", label: "Lista" },
              { value: "cuadricula", label: "Cuadrícula" },
              { value: "tabla", label: "Tabla" },
            ]}
          />
        </Segment>
        <Text c="text.secondary">Vista seleccionada: {view}</Text>
      </Box>
    );
  },
};

/** `data` admite strings sueltos cuando el valor y la etiqueta coinciden. */
export const FromStrings: Story = {
  render: () => (
    <Segment defaultValue="Semana" fullWidth>
      <Segment.Control aria-label="Rango" data={["Día", "Semana", "Mes", "Año"]} />
    </Segment>
  ),
};

/** Caso 2 — con paneles: el mismo control pasa a `tablist` y conecta cada tab con su panel. */
export const WithPanels: Story = {
  render: () => (
    <Segment defaultValue="resumen">
      <Segment.Control aria-label="Secciones" data={SECCIONES} />
      <Segment.Content>
        <Segment.Content.Item value="resumen">
          <Paper withBorder r="md" p="lg">
            <Title order={5}>Resumen</Title>
            <Text c="text.secondary">Saldo disponible y próximos vencimientos.</Text>
          </Paper>
        </Segment.Content.Item>
        <Segment.Content.Item value="movimientos">
          <Paper withBorder r="md" p="lg">
            <Title order={5}>Movimientos</Title>
            <Text c="text.secondary">Últimos 30 días de actividad.</Text>
          </Paper>
        </Segment.Content.Item>
        <Segment.Content.Item value="documentos">
          <Paper withBorder r="md" p="lg">
            <Title order={5}>Documentos</Title>
            <Text c="text.secondary">Contratos y anexos firmados.</Text>
          </Paper>
        </Segment.Content.Item>
      </Segment.Content>
    </Segment>
  ),
};

/** Con `Segment.Item` en vez de `data`, para etiquetas con contenido propio. */
export const WithChildren: Story = {
  render: () => (
    <Segment defaultValue="pendientes">
      <Segment.Control aria-label="Estado">
        <Segment.Control.Item value="pendientes">Pendientes</Segment.Control.Item>
        <Segment.Control.Item value="aprobadas">Aprobadas</Segment.Control.Item>
        <Segment.Control.Item value="canceladas" disabled>
          Canceladas
        </Segment.Control.Item>
      </Segment.Control>
    </Segment>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Box display="flex" direction="column" gap="md" align="flex-start">
      {(["sm", "md", "lg", "xl"] as const).map((size) => (
        <Segment key={size} size={size} defaultValue="lista">
          <Segment.Control aria-label={size} data={["Lista", "Tabla"]} />
        </Segment>
      ))}
    </Box>
  ),
};

export const States: Story = {
  render: () => (
    <Box display="flex" direction="column" gap="lg" align="flex-start">
      <Segment defaultValue="uno">
        <Segment.Control
          aria-label="Con deshabilitado"
          data={[
            { value: "uno", label: "Uno" },
            { value: "dos", label: "Dos", disabled: true },
            { value: "tres", label: "Tres" },
          ]}
        />
      </Segment>
      <Segment defaultValue="uno" disabled>
        <Segment.Control aria-label="Todo deshabilitado" data={["Uno", "Dos", "Tres"]} />
      </Segment>
      <Segment defaultValue="uno" draggable={false}>
        <Segment.Control aria-label="Sin gesto" data={["Uno", "Dos", "Tres"]} />
      </Segment>
    </Box>
  ),
};

/** Caso 3 — composición completa con cabecera y pie, como el Segment de fonicredito. */
export const Composition: Story = {
  render: () => (
    <Box maw={560}>
      <Segment defaultValue="datos" fullWidth>
        <Segment.Header>
          <Title order={4}>Solicitud #2041</Title>
          <Text c="text.secondary">Revisa cada bloque antes de enviar a comité.</Text>
        </Segment.Header>
        <Segment.Control
          aria-label="Bloques de la solicitud"
          data={[
            { value: "datos", label: "Datos" },
            { value: "garantias", label: "Garantías" },
            { value: "adjuntos", label: "Adjuntos" },
          ]}
        />
        <Segment.Content>
          <Segment.Content.Item value="datos">
            <Box display="flex" direction="column" gap="sm" py="md">
              <TextInput label="Solicitante" defaultValue="Ana García" />
              <TextInput label="Monto" defaultValue="45 000" />
            </Box>
          </Segment.Content.Item>
          <Segment.Content.Item value="garantias">
            <Box py="md">
              <Text>Sin garantías registradas.</Text>
            </Box>
          </Segment.Content.Item>
          <Segment.Content.Item value="adjuntos">
            <Box py="md">
              <Text>3 documentos cargados.</Text>
            </Box>
          </Segment.Content.Item>
        </Segment.Content>
        <Segment.Footer>
          <Button>Enviar a comité</Button>
        </Segment.Footer>
      </Segment>
    </Box>
  ),
};

/** `auto` mide el panel activo, `loop` da la vuelta al arrastrar y `gap` separa las diapositivas. */
export const AutoHeightAndLoop: Story = {
  render: () => (
    <Box maw={480}>
      <Segment defaultValue="corto" fullWidth>
        <Segment.Control
          aria-label="Alturas"
          data={[
            { value: "corto", label: "Corto" },
            { value: "largo", label: "Largo" },
            { value: "medio", label: "Medio" },
          ]}
        />
        <Segment.Content auto loop gap="md">
          <Segment.Content.Item value="corto">
            <Paper withBorder r="md" p="lg">
              <Text>Una sola línea.</Text>
            </Paper>
          </Segment.Content.Item>
          <Segment.Content.Item value="largo">
            <Paper withBorder r="md" p="lg">
              <Box display="flex" direction="column" gap="sm">
                <Title order={5}>Panel largo</Title>
                {["Primero", "Segundo", "Tercero", "Cuarto", "Quinto"].map((line) => (
                  <Text key={line} c="text.secondary">
                    {line} de cinco párrafos, para que la caja tenga que crecer.
                  </Text>
                ))}
              </Box>
            </Paper>
          </Segment.Content.Item>
          <Segment.Content.Item value="medio">
            <Paper withBorder r="md" p="lg">
              <Box display="flex" direction="column" gap="sm">
                <Title order={5}>Panel medio</Title>
                <Text c="text.secondary">Dos líneas bastan para verlo encoger.</Text>
              </Box>
            </Paper>
          </Segment.Content.Item>
        </Segment.Content>
      </Segment>
    </Box>
  ),
};

/** `autoWidth` hace lo mismo en horizontal: cada panel trae su ancho y la caja va al del activo. */
export const AutoWidth: Story = {
  render: () => (
    <Box display="flex" direction="column" gap="md" align="flex-start">
      <Segment defaultValue="Estrecho">
        <Segment.Control aria-label="Anchos" data={["Estrecho", "Ancho"]} />
        <Segment.Content auto autoWidth loop gap="md">
          <Segment.Content.Item value="Estrecho">
            <Paper withBorder r="md" p="lg" w={240}>
              <Text>240 de ancho.</Text>
            </Paper>
          </Segment.Content.Item>
          <Segment.Content.Item value="Ancho">
            <Paper withBorder r="md" p="lg" w={480}>
              <Text>480 de ancho, y la caja tiene que crecer hasta aquí.</Text>
            </Paper>
          </Segment.Content.Item>
        </Segment.Content>
      </Segment>
    </Box>
  ),
};

/** Dentro de un contenedor `max-content` la caja no puede medir la suma de sus diapositivas. */
export const InsideIntrinsicWidth: Story = {
  render: () => (
    <Box w="max-content" p="md" bd="1px dashed" bdc="border.default" r="md">
      <Segment defaultValue="Corto">
        <Segment.Control aria-label="Anchos" data={["Corto", "Largo"]} />
        <Segment.Content loop gap="md">
          <Segment.Content.Item value="Corto">
            <Text>Breve.</Text>
          </Segment.Content.Item>
          <Segment.Content.Item value="Largo">
            <Text>
              Un panel con bastante más texto que el anterior, para que su ancho intrínseco sea
              claramente mayor y se note si la caja lo suma.
            </Text>
          </Segment.Content.Item>
        </Segment.Content>
      </Segment>
    </Box>
  ),
};

export const Dark: Story = { ...Composition, globals: { theme: "dark" } };

export const AllThemes: Story = {
  parameters: MATRIX_A11Y,
  render: (args, ctx) => <ThemeMatrix>{Composition.render?.(args, ctx)}</ThemeMatrix>,
};

/** Con reduced-motion el indicador salta sin spring y el gesto queda desactivado. */
export const ReducedMotion: Story = { ...WithPanels, globals: { reducedMotion: "reduce" } };

/** APG tabs: flechas navegan saltando deshabilitados, Home/End van a los extremos. */
export const KeyboardFlow: Story = {
  render: () => (
    <Segment defaultValue="resumen">
      <Segment.Control
        aria-label="Secciones"
        data={[
          { value: "resumen", label: "Resumen" },
          { value: "movimientos", label: "Movimientos" },
          { value: "bloqueado", label: "Bloqueado", disabled: true },
          { value: "documentos", label: "Documentos" },
        ]}
      />
      <Segment.Content>
        <Segment.Content.Item value="resumen">
          <Text>Panel de resumen</Text>
        </Segment.Content.Item>
        <Segment.Content.Item value="movimientos">
          <Text>Panel de movimientos</Text>
        </Segment.Content.Item>
        <Segment.Content.Item value="bloqueado">
          <Text>Panel bloqueado</Text>
        </Segment.Content.Item>
        <Segment.Content.Item value="documentos">
          <Text>Panel de documentos</Text>
        </Segment.Content.Item>
      </Segment.Content>
    </Segment>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitFor(() => {
      void expect(canvas.getByRole("tablist")).toBeInTheDocument();
    });

    const first = canvas.getByRole("tab", { name: "Resumen" });
    first.focus();
    await expect(first).toHaveAttribute("aria-selected", "true");

    await userEvent.keyboard("{ArrowRight}");
    await expect(canvas.getByRole("tab", { name: "Movimientos" })).toHaveAttribute(
      "aria-selected",
      "true",
    );

    await userEvent.keyboard("{ArrowRight}");
    await expect(canvas.getByRole("tab", { name: "Documentos" })).toHaveAttribute(
      "aria-selected",
      "true",
    );

    await userEvent.keyboard("{Home}");
    await expect(canvas.getByRole("tab", { name: "Resumen" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  },
};

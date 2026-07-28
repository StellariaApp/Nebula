import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";

import {
  Alert,
  Box,
  Button,
  Loader,
  nebulaToast,
  Paper,
  Progress,
  Skeleton,
  Text,
  Title,
  ToastProvider,
} from "@stellaria/nebula-web";

import { MATRIX_A11Y, ThemeMatrix } from "../fixtures/themes.js";

const meta: Meta = {
  title: "Feedback/Overview",
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj;

const COLORS = ["info", "success", "warning", "error"] as const;

export const Alerts: Story = {
  render: () => (
    <Box display="flex" direction="column" gap="md" maw={520}>
      {COLORS.map((color) => (
        <Alert key={color} color={color} title={`Aviso ${color}`}>
          Mensaje de ejemplo para el estado {color}.
        </Alert>
      ))}
    </Box>
  ),
};

export const AlertVariants: Story = {
  render: () => (
    <Box display="flex" direction="column" gap="md" maw={520}>
      {(["light", "filled", "outline"] as const).map((variant) => (
        <Alert key={variant} variant={variant} color="success" title={variant}>
          Variante {variant} del aviso.
        </Alert>
      ))}
    </Box>
  ),
};

export const AlertDismissible: Story = {
  render: () => (
    <Box maw={520}>
      <Alert
        color="warning"
        title="Sesión por expirar"
        withCloseButton
        actions={<Button size="xs">Renovar</Button>}
      >
        Tu sesión se cerrará en 5 minutos.
      </Alert>
    </Box>
  ),
};

export const Loaders: Story = {
  render: () => (
    <Box display="flex" gap="xl" style={{ alignItems: "center" }}>
      {(["spinner", "dots", "bars"] as const).map((variant) => (
        <Box key={variant} display="flex" direction="column" gap="xs" style={{ alignItems: "center" }}>
          <Loader variant={variant} size="lg" />
          <Text fz="caption" c="text.secondary">
            {variant}
          </Text>
        </Box>
      ))}
    </Box>
  ),
};

export const Skeletons: Story = {
  render: () => (
    <Box display="flex" direction="column" gap="lg" maw={420}>
      <Box display="flex" gap="md" style={{ alignItems: "center" }}>
        <Skeleton circle width={48} height={48} />
        <Box style={{ flex: 1 }}>
          <Skeleton lines={2} />
        </Box>
      </Box>
      <Skeleton height={140} radius="md" />
      <Skeleton animation="pulse" height="1.5em" width="60%" />
    </Box>
  ),
};

/** El progreso admite un valor único o varios segmentos con color propio. */
export const Progresses: Story = {
  render: () => (
    <Box display="flex" direction="column" gap="lg" maw={480}>
      <Progress value={62} label="Descarga" />
      <Progress value={62} label="Con rayas" striped size="lg" />
      <Progress indeterminate label="Procesando" />
      <Progress
        label="Cartera por estado"
        segments={[
          { value: 45, color: "success", label: "Al corriente" },
          { value: 25, color: "warning", label: "Por vencer" },
          { value: 12, color: "error", label: "Vencida" },
        ]}
        size="lg"
      />
      <Box display="flex" gap="xl" style={{ alignItems: "center" }}>
        <Progress type="ring" value={72} label="Avance">
          72%
        </Progress>
        <Progress
          type="ring"
          size="lg"
          label="Cartera"
          segments={[
            { value: 45, color: "success" },
            { value: 25, color: "warning" },
            { value: 12, color: "error" },
          ]}
        />
        <Progress type="ring" indeterminate label="Cargando" />
      </Box>
    </Box>
  ),
};

/** `nebulaToast` se invoca desde cualquier punto, sin pasar props. */
export const Toasts: Story = {
  render: () => (
    <ToastProvider>
      <Box display="flex" gap="sm" style={{ flexWrap: "wrap" }}>
        <Button onPress={() => nebulaToast.success("Cambios guardados")}>Success</Button>
        <Button
          variant="outline"
          onPress={() => nebulaToast.error("No se pudo guardar", { title: "Error" })}
        >
          Error
        </Button>
        <Button variant="outline" onPress={() => nebulaToast.warning("Revisa los campos")}>
          Warning
        </Button>
        <Button variant="outline" onPress={() => nebulaToast.info("Sincronizando…")}>
          Info
        </Button>
      </Box>
    </ToastProvider>
  ),
};

export const Composition: Story = {
  render: () => (
    <Box maw={560} display="flex" direction="column" gap="md">
      <Title order={4}>Estado de la solicitud</Title>
      <Alert color="info" title="En revisión">
        Un analista está validando la documentación.
      </Alert>
      <Paper withBorder radius="md" p="lg">
        <Box display="flex" direction="column" gap="sm">
          <Text fw="semibold">Avance del expediente</Text>
          <Progress
            label="Avance"
            segments={[
              { value: 40, color: "success" },
              { value: 30, color: "warning" },
            ]}
          />
          <Text fz="caption" c="text.secondary">
            70% completado
          </Text>
        </Box>
      </Paper>
      <Box display="flex" gap="sm" style={{ alignItems: "center" }}>
        <Loader size="sm" />
        <Text c="text.secondary">Comprobando documentos…</Text>
      </Box>
    </Box>
  ),
};

export const Dark: Story = { ...Composition, globals: { theme: "nebula-dark" } };

export const AllThemes: Story = {
  parameters: MATRIX_A11Y,
  render: (args, ctx) => <ThemeMatrix>{Composition.render?.(args, ctx)}</ThemeMatrix>,
};

export const ReducedMotion: Story = { ...Progresses, globals: { reducedMotion: "reduce" } };

/** El toast aparece por API imperativa y se cierra desde su botón. */
export const ToastFlow: Story = {
  render: () => (
    <ToastProvider>
      <Button onPress={() => nebulaToast.success("Cambios guardados", { duration: 0 })}>
        Guardar
      </Button>
    </ToastProvider>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);

    await userEvent.click(canvas.getByRole("button", { name: "Guardar" }));

    const toast = await body.findByRole("status");
    await expect(toast).toHaveTextContent("Cambios guardados");

    await userEvent.click(body.getByRole("button", { name: "Cerrar notificación" }));
    await waitFor(() => {
      void expect(body.queryByRole("status")).toBeNull();
    });
  },
};

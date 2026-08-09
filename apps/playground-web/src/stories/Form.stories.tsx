import { useMemo, useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { z } from "zod";

import { useStepper } from "@stellaria/nebula-hooks";
import {
  AsyncSelect,
  Autocomplete,
  Box,
  Button,
  CreatableSelect,
  Form,
  FormDelete,
  InputCurrency,
  InputPhone,
  ModalDelete,
  Paper,
  SearchableSelect,
  Stepper,
  Text,
  TextInput,
  type SelectOption,
} from "@stellaria/nebula-web";

import { MATRIX_A11Y, ThemeMatrix } from "../fixtures/themes.js";

const meta: Meta<typeof Form> = {
  title: "Forms/Form",
  component: Form,
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof Form>;

const PAISES: SelectOption[] = [
  { value: "mx", label: "México" },
  { value: "co", label: "Colombia" },
  { value: "cl", label: "Chile" },
  { value: "ar", label: "Argentina" },
];

export const Default: Story = {
  render: () => (
    <Paper maw={560} p="xl" r="lg" withBorder>
      <Form onSubmit={() => undefined}>
        <Form.Header title="Alta de cliente" description="Los datos mínimos para facturar." />
        <Form.Content columns={2}>
          <TextInput label="Nombre" required />
          <TextInput label="RFC" />
          <InputPhone label="Teléfono" defaultDialValue="MX" />
          <InputCurrency label="Cupo" currency="MXN" locale="es-MX" defaultValue={50000} />
        </Form.Content>
        <Form.Footer submitText="Crear cliente" cancelText="Descartar" onCancel={() => undefined} />
      </Form>
    </Paper>
  ),
};

export const WithBanderole: Story = {
  render: () => (
    <Paper maw={560} p="xl" r="lg" withBorder>
      <Form color="warning">
        <Form.Banderole>Este formulario está en borrador y no se ha enviado.</Form.Banderole>
        <Form.Header title="Solicitud" />
        <Form.Content>
          <TextInput label="Asunto" />
        </Form.Content>
        <Form.Footer submitText="Enviar" />
      </Form>
    </Paper>
  ),
};

export const Pending: Story = {
  render: () => (
    <Paper maw={480} p="xl" r="lg" withBorder>
      <Form isPending>
        <Form.Header title="Guardando" description="Todos los campos quedan bloqueados." />
        <Form.Content>
          <TextInput label="Nombre" defaultValue="Ada" />
        </Form.Content>
        <Form.Footer onCancel={() => undefined} />
      </Form>
    </Paper>
  ),
};

export const WithError: Story = {
  render: () => (
    <Paper maw={480} p="xl" r="lg" withBorder>
      <Form>
        <Form.Header title="Alta" />
        <Form.Content>
          <TextInput
            label="Correo"
            error="Ya existe una cuenta con este correo"
            errorDisplay="text"
          />
        </Form.Content>
        <Form.Footer error="Revisa los campos marcados." onCancel={() => undefined} />
      </Form>
    </Paper>
  ),
};

export const Delete: Story = {
  render: function Render() {
    const [opened, set_opened] = useState(false);
    return (
      <Box display="flex" direction="column" gap="xl" maw={480}>
        <Paper p="xl" r="lg" withBorder>
          <FormDelete
            alert={{
              title: "Vas a eliminar la factura F-1042",
              description: "Esta acción no se puede deshacer.",
            }}
            onCancel={() => undefined}
          />
        </Paper>
        <Box>
          <Button color="error" variant="light" onPress={() => set_opened(true)}>
            Abrir ModalDelete
          </Button>
          <ModalDelete
            opened={opened}
            onClose={() => set_opened(false)}
            title="Eliminar cliente"
            alert={{
              title: "Se eliminará el cliente y sus 12 facturas",
              description: "Escribe el nombre para confirmar.",
            }}
          >
            <TextInput label="Nombre del cliente" />
          </ModalDelete>
        </Box>
      </Box>
    );
  },
};

export const Steps: Story = {
  render: () => (
    <Box display="flex" direction="column" gap="xl" maw={640}>
      {(["filled", "light", "outline"] as const).map((variant) => (
        <Box key={variant}>
          <Text fz="caption" c="text.muted" mb="xs">
            variant=&quot;{variant}&quot;
          </Text>
          <Stepper
            variant={variant}
            active={1}
            steps={[
              { label: "Datos", description: "Identidad" },
              { label: "Contacto", description: "Teléfono y correo" },
              { label: "Revisión", description: "Confirmar" },
            ]}
          />
        </Box>
      ))}
      <Stepper
        active={1}
        orientation="vertical"
        steps={[{ label: "Datos" }, { label: "Contacto", error: true }, { label: "Revisión" }]}
      />
    </Box>
  ),
};

export const ComboboxPatterns: Story = {
  render: function Render() {
    const Load = useMemo(
      () => async (query: string) => {
        await new Promise((resolve) => setTimeout(resolve, 400));
        return PAISES.filter((option) => option.label.toLowerCase().includes(query.toLowerCase()));
      },
      [],
    );

    return (
      <Box maw={480} display="flex" direction="column" gap="lg">
        <Autocomplete label="Autocomplete (admite valor libre)" data={PAISES} />
        <SearchableSelect label="SearchableSelect (solo de la lista)" data={PAISES} />
        <CreatableSelect
          label="CreatableSelect (crea lo que falte)"
          data={PAISES}
          onCreate={(label) => ({ value: label.toLowerCase(), label })}
        />
        <AsyncSelect label="AsyncSelect (debounce + carga)" load={Load} minQueryLength={2} />
      </Box>
    );
  },
};

const ESQUEMA = z.object({
  nombre: z.string().min(3, "Al menos 3 caracteres"),
  telefono: z.string().min(8, "Teléfono incompleto"),
  pais: z.string().min(1, "Elige un país"),
  cupo: z.number().min(1, "Debe ser mayor que 0"),
});

type Errores = Partial<Record<keyof z.infer<typeof ESQUEMA>, string>>;

export const MultiStep: Story = {
  parameters: { layout: "padded" },
  render: function Render() {
    const [nombre, set_nombre] = useState("");
    const [telefono, set_telefono] = useState("");
    const [dial, set_dial] = useState("MX");
    const [pais, set_pais] = useState("");
    const [cupo, set_cupo] = useState(Number.NaN);
    const [errores, set_errores] = useState<Errores>({});
    const [enviado, set_enviado] = useState(false);

    const stepper = useStepper({ count: 3 });

    const CAMPOS_POR_PASO: (keyof Errores)[][] = [["nombre"], ["telefono", "pais"], ["cupo"]];

    const Validar = (campos: (keyof Errores)[]): boolean => {
      const resultado = ESQUEMA.safeParse({ nombre, telefono, pais, cupo });
      if (resultado.success) {
        set_errores({});
        return true;
      }
      const encontrados: Errores = {};
      for (const issue of resultado.error.issues) {
        const campo = issue.path[0] as keyof Errores;
        if (campos.includes(campo)) encontrados[campo] = issue.message;
      }
      set_errores(encontrados);
      return Object.keys(encontrados).length === 0;
    };

    const Siguiente = (): void => {
      if (Validar(CAMPOS_POR_PASO[stepper.step] ?? [])) stepper.next();
    };

    const Enviar = (): void => {
      if (Validar(["nombre", "telefono", "pais", "cupo"])) set_enviado(true);
    };

    return (
      <Paper maw={620} p="xl" r="lg" withBorder shadow="sm">
        <Form onSubmit={stepper.isLast ? Enviar : Siguiente}>
          <Form.Header
            title="Alta de proveedor"
            description={`Paso ${String(stepper.step + 1)} de ${String(stepper.count)}`}
          />
          <Stepper
            active={stepper.step}
            onStepClick={stepper.goTo}
            steps={[
              { label: "Identidad", description: "Nombre fiscal" },
              {
                label: "Contacto",
                description: "Teléfono y país",
                error: errores.telefono !== undefined || errores.pais !== undefined,
              },
              { label: "Condiciones", description: "Cupo autorizado" },
            ]}
          />
          {enviado ? (
            <Form.Banderole color="success">
              Solicitud enviada. Zod validó los cuatro campos.
            </Form.Banderole>
          ) : null}
          <Form.Content>
            {stepper.step === 0 ? (
              <TextInput
                label="Nombre o razón social"
                required
                value={nombre}
                onChange={set_nombre}
                error={errores.nombre}
                errorDisplay="text"
              />
            ) : null}
            {stepper.step === 1 ? (
              <>
                <InputPhone
                  label="Teléfono"
                  required
                  value={telefono}
                  onChange={set_telefono}
                  dialValue={dial}
                  onDialChange={set_dial}
                  error={errores.telefono}
                  errorDisplay="text"
                />
                <SearchableSelect
                  label="País"
                  data={PAISES}
                  value={pais}
                  onChange={set_pais}
                  error={errores.pais}
                  errorDisplay="text"
                />
              </>
            ) : null}
            {stepper.step === 2 ? (
              <InputCurrency
                label="Cupo autorizado"
                currency="MXN"
                locale="es-MX"
                value={cupo}
                onChange={set_cupo}
                error={errores.cupo}
                errorDisplay="text"
              />
            ) : null}
          </Form.Content>
          <Form.Footer align="between">
            <Button
              variant="ghost"
              color="gray"
              disabled={stepper.isFirst}
              onPress={stepper.previous}
            >
              Atrás
            </Button>
            <Button type="submit" variant="filled">
              {stepper.isLast ? "Enviar solicitud" : "Continuar"}
            </Button>
          </Form.Footer>
        </Form>
      </Paper>
    );
  },
};

export const AllThemes: Story = {
  parameters: MATRIX_A11Y,
  render: () => (
    <ThemeMatrix>
      <Form>
        <Form.Header title="Alta" />
        <Form.Content>
          <TextInput label="Nombre" />
        </Form.Content>
        <Form.Footer />
      </Form>
    </ThemeMatrix>
  ),
};

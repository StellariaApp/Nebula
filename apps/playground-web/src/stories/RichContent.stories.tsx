import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState, type ReactElement } from "react";

import {
  Box,
  Button,
  CodeHighlight,
  CodeHighlightTabs,
  DirectionProvider,
  GlobalSearch,
  Paper,
  Text,
  Title,
  TransferList,
  TypographyStylesProvider,
  VirtualizedSelect,
  useDirection,
  type GlobalSearchResult,
} from "@stellaria/nebula-web";
import { RichTextEditor } from "@stellaria/nebula-web/editor";

import { MATRIX_A11Y, ThemeMatrix } from "../fixtures/themes.js";

const meta: Meta<typeof CodeHighlight> = {
  title: "Rich content/Contenido y utilidades",
  component: CodeHighlight,
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof CodeHighlight>;

const SNIPPET = `import { Button } from "@stellaria/nebula-web";

export function Save() {
  return <Button variant="filled">Guardar</Button>;
}`;

const CSS_SNIPPET = `export const save = style({
  background: vars.color.primary["600"],
});`;

const PERMISSIONS = [
  { value: "read", label: "Lectura" },
  { value: "write", label: "Escritura" },
  { value: "delete", label: "Borrado" },
  { value: "admin", label: "Administración" },
  { value: "audit", label: "Auditoría", disabled: true },
];

const BRANCHES = Array.from({ length: 400 }, (_, index) => ({
  value: `b${String(index)}`,
  label: `Sucursal ${String(index + 1).padStart(3, "0")}`,
}));

const ARTICLE = `
<h2>Contrato de servicio</h2>
<p>Este texto <strong>no lo genera Nebula</strong>: viene de un CMS y solo se le aplica la
tipografía del tema.</p>
<ul><li>Primer punto</li><li>Segundo punto</li></ul>
<blockquote>Una cita dentro del contenido.</blockquote>
<p>Un enlace de <a href="#x">ejemplo</a> y algo de <code>código en línea</code>.</p>
`;

export const Default: Story = {
  render: () => (
    <Box maw={620}>
      <CodeHighlight code={SNIPPET} lang="tsx" filename="Save.tsx" withLineNumbers />
      <Text component="p" fz="caption" c="text.muted" mt="sm">
        Sin <code>html</code> el bloque pinta texto plano: no resalta y no interpreta nada.
      </Text>
    </Box>
  ),
};

export const CodigoPorFichero: Story = {
  render: () => (
    <Box maw={620}>
      <CodeHighlightTabs
        label="Ficheros del componente"
        withLineNumbers
        tabs={[
          { value: "tsx", label: "Save.tsx", code: SNIPPET, lang: "tsx" },
          { value: "css", label: "Save.css.ts", code: CSS_SNIPPET, lang: "ts" },
        ]}
      />
    </Box>
  ),
};

function Editor(): ReactElement {
  const [html, set_html] = useState("<p>Escribe la descripción del expediente…</p>");
  return (
    <Box maw={620}>
      <RichTextEditor
        label="Descripción"
        description="Se guarda como HTML"
        value={html}
        onChange={set_html}
        placeholder="Escribe aquí…"
      />
    </Box>
  );
}

export const EditorDeTexto: Story = { render: () => <Editor /> };

function Transfer(): ReactElement {
  const [value, set_value] = useState<string[]>(["read"]);
  return (
    <Box maw={720}>
      <TransferList
        data={PERMISSIONS}
        value={value}
        onChange={set_value}
        searchable
        source={{ title: "Disponibles", empty: "Nada disponible" }}
        target={{ title: "Asignados", empty: "Sin permisos" }}
      />
    </Box>
  );
}

export const Transferencia: Story = { render: () => <Transfer /> };

export const SelectVirtualizado: Story = {
  render: () => (
    <Box maw={420}>
      <VirtualizedSelect
        data={BRANCHES}
        label="Sucursal"
        description="400 opciones: solo se pinta la ventana visible"
        placeholder="Busca una sucursal"
      />
    </Box>
  ),
};

function Search(): ReactElement {
  const [query, set_query] = useState("");
  const results: GlobalSearchResult[] =
    query.trim() === ""
      ? []
      : [
          { id: "c1", title: `Cliente ${query}`, group: "Clientes", description: "RFC ACM010101" },
          { id: "f1", title: `Factura ${query}`, group: "Facturas" },
        ];
  return <GlobalSearch results={results} onQueryChange={set_query} />;
}

export const BusquedaGlobal: Story = { render: () => <Search /> };

export const Prosa: Story = {
  render: () => (
    <TypographyStylesProvider maw={620} dangerouslySetInnerHTML={{ __html: ARTICLE }} />
  ),
};

function DirectionToggle(): ReactElement {
  const { direction, toggleDirection } = useDirection();
  return (
    <Button variant="outline" size="sm" onPress={toggleDirection}>
      {direction === "ltr" ? "Cambiar a RTL" : "Cambiar a LTR"}
    </Button>
  );
}

export const Rtl: Story = {
  name: "Dirección RTL",
  render: () => (
    <DirectionProvider>
      <Box display="flex" direction="column" gap="md" maw={620}>
        <DirectionToggle />
        <Paper p="md" radius="md" withBorder>
          <Box ps="lg" style={{ borderInlineStart: "3px solid currentColor" }}>
            <Text fz="body2">
              El borde y el espaciado usan propiedades lógicas (<code>ps</code>), así que cambian de
              lado con la dirección.
            </Text>
          </Box>
        </Paper>
        <CodeHighlight code={SNIPPET} lang="tsx" />
        <Text component="p" fz="caption" c="text.muted">
          El bloque de código se queda en LTR a propósito: el código fuente no se lee al revés.
        </Text>
      </Box>
    </DirectionProvider>
  ),
};

export const Dark: Story = {
  globals: { theme: "nebula-dark" },
  render: () => (
    <Box maw={560}>
      <CodeHighlight code={SNIPPET} lang="tsx" filename="Save.tsx" withLineNumbers />
    </Box>
  ),
};

export const ReducedMotion: Story = {
  globals: { reducedMotion: "reduce" },
  render: () => <Transfer />,
};

export const Composition: Story = {
  render: () => (
    <Box maw={760}>
      <Title order={3} mb="xxs">
        Documentación del componente
      </Title>
      <Text component="p" c="text.secondary" mb="lg" maw={520}>
        Prosa del CMS, ejemplo de uso por fichero y editor de notas: las tres superficies comparten
        la tipografía y la escala del tema.
      </Text>
      <TypographyStylesProvider mb="lg" dangerouslySetInnerHTML={{ __html: ARTICLE }} />
      <CodeHighlightTabs
        label="Ficheros"
        withLineNumbers
        tabs={[
          { value: "tsx", label: "Save.tsx", code: SNIPPET, lang: "tsx" },
          { value: "css", label: "Save.css.ts", code: CSS_SNIPPET, lang: "ts" },
        ]}
      />
    </Box>
  ),
};

export const AllThemes: Story = {
  parameters: MATRIX_A11Y,
  render: () => (
    <ThemeMatrix>
      <CodeHighlight code={CSS_SNIPPET} lang="ts" filename="save.css.ts" />
    </ThemeMatrix>
  ),
};

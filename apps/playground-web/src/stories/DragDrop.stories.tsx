import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { Badge, Box, Paper, Text, Title } from "@stellaria/nebula-web";
import {
  DragDropContext,
  Draggable,
  Droppable,
  KanbanBoard,
  KanbanCard,
  SortableList,
  type KanbanMove,
} from "@stellaria/nebula-web/dnd";

import { MATRIX_A11Y, ThemeMatrix } from "../fixtures/themes.js";

const meta: Meta<typeof SortableList> = {
  title: "DnD/Arrastrar y soltar",
  component: SortableList,
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof SortableList>;

interface Task {
  id: string;
  title: string;
  owner: string;
  status: string;
}

const TASKS: Task[] = [
  { id: "t1", title: "Cerrar el tramo W4.1", owner: "William", status: "doing" },
  { id: "t2", title: "Medir los subpaths nuevos", owner: "William", status: "todo" },
  { id: "t3", title: "Revisar el contrato a11y de arrastre", owner: "Equipo", status: "todo" },
  { id: "t4", title: "Publicar el ADR de dependencias", owner: "William", status: "done" },
  { id: "t5", title: "Calibrar la retícula de estrellas", owner: "Equipo", status: "doing" },
];

const COLUMNS = [
  { id: "todo", title: "Por hacer", empty: "Arrastra una tarjeta aquí" },
  { id: "doing", title: "En curso", limit: 2 },
  { id: "done", title: "Hecho", empty: "Nada terminado todavía" },
];

function Lista(): React.ReactElement {
  const [items, set_items] = useState(["Colocación", "Morosidad", "Clientes", "Sucursales"]);
  return (
    <Box maw={420}>
      <SortableList
        items={items}
        getKey={(item) => item}
        renderItem={(item) => (
          <Paper p="sm" radius="md" withBorder>
            <Text fz="body2">{item}</Text>
          </Paper>
        )}
        onReorder={set_items}
        label="Métricas del panel"
      />
    </Box>
  );
}

export const Default: Story = { render: () => <Lista /> };

export const SinAsa: Story = {
  render: () => {
    const [items, set_items] = useState(["Uno", "Dos", "Tres"]);
    return (
      <Box maw={360}>
        <Text component="p" fz="caption" c="text.muted" mb="xs">
          Con <code>withHandle=false</code> la fila entera arrastra. El sensor solo activa a partir
          de 6 px, así que un click sobre la fila sigue funcionando.
        </Text>
        <SortableList
          items={items}
          getKey={(item) => item}
          renderItem={(item) => (
            <Paper p="sm" radius="md" withBorder>
              <Text fz="body2">{item}</Text>
            </Paper>
          )}
          onReorder={set_items}
          withHandle={false}
          label="Lista sin asa"
        />
      </Box>
    );
  },
};

export const Horizontal: Story = {
  render: () => {
    const [items, set_items] = useState(["Lun", "Mar", "Mié", "Jue", "Vie"]);
    return (
      <SortableList
        items={items}
        getKey={(item) => item}
        renderItem={(item) => (
          <Paper p="sm" radius="md" withBorder>
            <Text fz="body2">{item}</Text>
          </Paper>
        )}
        onReorder={set_items}
        axis="x"
        label="Días"
      />
    );
  },
};

export const Primitivas: Story = {
  render: () => (
    <DragDropContext>
      <Box display="flex" gap="md" wrap="wrap">
        <Droppable id="origen" label="Origen" p="md" miw={200}>
          <Draggable id="ficha" withHandle>
            <Paper p="sm" radius="md" withBorder>
              <Text fz="body2">Ficha suelta</Text>
            </Paper>
          </Draggable>
        </Droppable>
        <Droppable id="destino" label="Destino" p="md" miw={200}>
          <Text component="p" fz="caption" c="text.muted">
            Zona de destino
          </Text>
        </Droppable>
      </Box>
    </DragDropContext>
  ),
};

function Tablero(): React.ReactElement {
  const [tasks, set_tasks] = useState(TASKS);
  const OnMove = (move: KanbanMove): void => {
    set_tasks((current) =>
      current.map((task) => (task.id === move.key ? { ...task, status: move.to } : task)),
    );
  };
  return (
    <KanbanBoard
      columns={COLUMNS}
      items={tasks}
      getKey={(task) => task.id}
      getColumn={(task) => task.status}
      renderCard={(task) => (
        <KanbanCard
          title={task.title}
          meta={<span>{task.owner}</span>}
          badge={
            <Badge variant="light" size="sm">
              {task.id}
            </Badge>
          }
        />
      )}
      onMove={OnMove}
      label="Tablero de trabajo"
    />
  );
}

export const Kanban: Story = { render: () => <Tablero /> };

export const ReducedMotion: Story = {
  globals: { reducedMotion: "reduce" },
  render: () => (
    <Box maw={520}>
      <Lista />
      <Text component="p" fz="caption" c="text.muted" mt="sm">
        El reordenamiento sigue funcionando: lo que se reduce es la transición de la fila que cede
        el sitio, no la operación.
      </Text>
    </Box>
  ),
};

export const Composition: Story = {
  render: () => (
    <Box maw={960}>
      <Title order={3} mb="xxs">
        Sprint en curso
      </Title>
      <Text component="p" c="text.secondary" mb="lg" maw={520}>
        Las tarjetas se arrastran enteras y las columnas aceptan soltar aunque estén vacías. Con
        teclado: tabula hasta una tarjeta, pulsa espacio, mueve con las flechas y suelta con
        espacio.
      </Text>
      <Tablero />
    </Box>
  ),
};

export const AllThemes: Story = {
  parameters: MATRIX_A11Y,
  render: () => (
    <ThemeMatrix>
      <Lista />
    </ThemeMatrix>
  ),
};

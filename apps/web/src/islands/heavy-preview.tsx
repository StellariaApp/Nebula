"use client";

import { Box, Button, Card, Skeleton, Text } from "@stellaria/nebula-web";
import dynamic from "next/dynamic";
import type { Carousel as CarouselType } from "@stellaria/nebula-web/carousel";
import type {
  KanbanBoard as KanbanBoardType,
  SortableList as SortableListType,
} from "@stellaria/nebula-web/dnd";
import { useState, type ReactElement } from "react";

/**
 * Las muestras de los nueve componentes que viven detrás de un subpath. El mapa de `previews.tsx` es
 * un solo módulo, así que importarlos ahí metería Recharts, TanStack y TipTap en el bundle de LAS
 * 158 fichas. Aquí cada uno entra por `dynamic`, y su peso solo baja en su propia ficha.
 */
const LOADING = <Skeleton w={360} h={160} />;

const BarChart = dynamic(async () => (await import("@stellaria/nebula-web/charts")).BarChart, {
  ssr: false,
  loading: () => LOADING,
});

const DataGrid = dynamic(async () => (await import("@stellaria/nebula-web/datagrid")).DataGrid, {
  ssr: false,
  loading: () => LOADING,
});

const Carousel = dynamic(async () => (await import("@stellaria/nebula-web/carousel")).Carousel, {
  ssr: false,
  loading: () => LOADING,
}) as typeof CarouselType;

const KanbanBoard = dynamic(async () => (await import("@stellaria/nebula-web/dnd")).KanbanBoard, {
  ssr: false,
  loading: () => LOADING,
}) as typeof KanbanBoardType;

const SortableList = dynamic(async () => (await import("@stellaria/nebula-web/dnd")).SortableList, {
  ssr: false,
  loading: () => LOADING,
}) as typeof SortableListType;

const RichTextEditor = dynamic(
  async () => (await import("@stellaria/nebula-web/editor")).RichTextEditor,
  { ssr: false, loading: () => LOADING },
);

const EditorImage = dynamic(
  async () => (await import("@stellaria/nebula-web/editor")).EditorImage,
  { ssr: false, loading: () => LOADING },
);

const Player = dynamic(async () => (await import("@stellaria/nebula-web/media")).Player, {
  ssr: false,
  loading: () => LOADING,
});

const CommandPalette = dynamic(
  async () => (await import("@stellaria/nebula-web/command")).CommandPalette,
  { ssr: false, loading: () => LOADING },
);

const MOVEMENTS = [
  { month: "May", web: 128, native: 0 },
  { month: "Jun", web: 141, native: 4 },
  { month: "Jul", web: 152, native: 9 },
  { month: "Aug", web: 158, native: 12 },
];

const ROWS = [
  { name: "Button", subpath: ".", budget: "42.25 kB" },
  { name: "Charts", subpath: "/charts", budget: "23.5 kB" },
  { name: "DataGrid", subpath: "/datagrid", budget: "80 kB" },
];

function Slide(item: string): ReactElement {
  return (
    <Card withBorder r="lg" padding="lg">
      <Text fz="body2" fw="semibold">
        {item}
      </Text>
    </Card>
  );
}

export function ChartsPreview(): ReactElement {
  return (
    <Box w={420}>
      <BarChart
        data={MOVEMENTS}
        series={[
          { key: "web", label: "Web" },
          { key: "native", label: "Native" },
        ]}
        xAxis={{ key: "month" }}
        height={220}
        title="Components per month"
      />
    </Box>
  );
}

export function DataGridPreview(): ReactElement {
  return (
    <Box w={520}>
      <DataGrid
        data={ROWS}
        columns={[
          { accessorKey: "name", header: "Component" },
          { accessorKey: "subpath", header: "Subpath" },
          { accessorKey: "budget", header: "Budget" },
        ]}
      />
    </Box>
  );
}

export function CarouselPreview(): ReactElement {
  return (
    <Box w={420}>
      <Carousel
        items={["One catalogue", "Two platforms", "Zero forks"]}
        getKey={(item) => item}
        renderItem={Slide}
        withControls
        withIndicators
        slideSize="80%"
      />
    </Box>
  );
}

export function KanbanPreview(): ReactElement {
  const [items, set_items] = useState([
    { key: "button", label: "Button", column: "done" },
    { key: "charts", label: "Charts", column: "doing" },
    { key: "native", label: "Native", column: "todo" },
  ]);

  return (
    <Box w={560}>
      <KanbanBoard
        label="Roadmap"
        columns={[
          { id: "todo", title: "To do" },
          { id: "doing", title: "Doing" },
          { id: "done", title: "Done" },
        ]}
        items={items}
        getKey={(item) => item.key}
        getColumn={(item) => item.column}
        renderCard={(item) => <Text fz="body3">{item.label}</Text>}
        onMove={(move) => {
          set_items((all) =>
            all.map((item) => (item.key === move.key ? { ...item, column: move.to } : item)),
          );
        }}
        columnWidth={160}
      />
    </Box>
  );
}

export function DragDropPreview(): ReactElement {
  const [items, set_items] = useState(["Tokens", "Hooks", "Web", "Native"]);

  return (
    <Box w={320}>
      <SortableList
        items={items}
        getKey={(item) => item}
        renderItem={(item) => (
          <Card withBorder r="md" padding="md">
            <Text fz="body3">{item}</Text>
          </Card>
        )}
        onReorder={set_items}
        withHandle
      />
    </Box>
  );
}

export function RichTextEditorPreview(): ReactElement {
  return (
    <Box w={480}>
      <RichTextEditor defaultValue="<p>The contract lives in the tokens.</p>" />
    </Box>
  );
}

export function EditorImagePreview(): ReactElement {
  return (
    <Box w={320}>
      <EditorImage src="/logo.svg" alt="Nebula" />
    </Box>
  );
}

export function PlayerPreview(): ReactElement {
  return (
    <Box w={420}>
      <Player src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" />
    </Box>
  );
}

export function CommandPalettePreview(): ReactElement {
  const [opened, set_opened] = useState(false);

  return (
    <>
      <Button
        variant="light"
        onPress={() => {
          set_opened(true);
        }}
      >
        Open the palette
      </Button>
      <CommandPalette
        opened={opened}
        onOpenChange={set_opened}
        items={[
          { key: "guides", label: "Go to Guides", group: "Navigate" },
          { key: "components", label: "Go to Components", group: "Navigate" },
          { key: "theme", label: "Switch scheme", group: "Theme", shortcut: "⌘J" },
        ]}
      />
    </>
  );
}

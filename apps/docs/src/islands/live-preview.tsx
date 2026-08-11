"use client";

import {
  Box,
  Button,
  Card,
  Dialog,
  Drawer,
  FileButton,
  Filters,
  GlobalSearch,
  GridList,
  InfiniteList,
  Lightbox,
  Modal,
  SearchableList,
  Text,
} from "@stellaria/nebula-web";
import { useState, type ReactElement } from "react";

/**
 * Las muestras que no cruzan la frontera RSC: las de estado y las de render-prop, porque una función
 * no se serializa de servidor a cliente. Los overlays controlados no se pueden enseñar quietos: la muestra es el disparador, que es como
 * se usan de verdad. Vive aquí y no en `previews.tsx` porque necesita estado.
 */
export function ModalPreview(): ReactElement {
  const [opened, set_opened] = useState(false);

  return (
    <>
      <Button
        variant="light"
        onPress={() => {
          set_opened(true);
        }}
      >
        Open modal
      </Button>
      <Modal
        opened={opened}
        onClose={() => {
          set_opened(false);
        }}
        title="Discard the draft?"
        footer={
          <Button
            variant="light"
            onPress={() => {
              set_opened(false);
            }}
          >
            Keep editing
          </Button>
        }
      >
        <Text fz="body3">Leaving now discards the changes you have not saved.</Text>
      </Modal>
    </>
  );
}

export function DrawerPreview(): ReactElement {
  const [opened, set_opened] = useState(false);

  return (
    <>
      <Button
        variant="light"
        onPress={() => {
          set_opened(true);
        }}
      >
        Open drawer
      </Button>
      <Drawer
        opened={opened}
        onClose={() => {
          set_opened(false);
        }}
        title="Filters"
        side="end"
      >
        <Text fz="body3">Everything a modal does, anchored to one side.</Text>
      </Drawer>
    </>
  );
}

export function DialogPreview(): ReactElement {
  const [opened, set_opened] = useState(false);

  return (
    <>
      <Button
        variant="light"
        onPress={() => {
          set_opened(true);
        }}
      >
        Open dialog
      </Button>
      <Dialog
        opened={opened}
        onClose={() => {
          set_opened(false);
        }}
        title="Theme saved"
        corner="bottom-end"
      >
        <Text fz="body3">A corner dialog does not take the screen.</Text>
      </Dialog>
    </>
  );
}

/** `getKey` y `renderItem` son funciones: tienen que nacer en cliente. */
export function GridListPreview(): ReactElement {
  return (
    <GridList
      w={360}
      items={["Button", "Badge", "Card", "Table"]}
      getKey={(item) => item}
      renderItem={(item) => (
        <Card withBorder r="md" padding="md">
          <Text fz="body3">{item}</Text>
        </Card>
      )}
    />
  );
}

const ITEMS = ["Button", "Badge", "Card", "Table", "Alert", "Chip"];

function Row(item: string): ReactElement {
  return (
    <Card withBorder r="md" padding="md">
      <Text fz="body3">{item}</Text>
    </Card>
  );
}

/** Lista con paginado: `getKey` y `renderItem` son funciones y no cruzan la frontera RSC. */
export function InfiniteListPreview(): ReactElement {
  return (
    <Box w={320}>
      <InfiniteList items={ITEMS} getKey={(item) => item} renderItem={Row} hasMore />
    </Box>
  );
}

export function SearchableListPreview(): ReactElement {
  return (
    <Box w={320}>
      <SearchableList items={ITEMS} getKey={(item) => item} renderItem={Row} />
    </Box>
  );
}

export function FileButtonPreview(): ReactElement {
  const [name, set_name] = useState<string | null>(null);

  return (
    <Box display="flex" align="center" gap="sm">
      <FileButton
        accept="application/json"
        onChange={(payload) => {
          const file = Array.isArray(payload) ? payload[0] : payload;
          set_name(file?.name ?? null);
        }}
      >
        {({ onClick }) => (
          <Button variant="light" onPress={onClick}>
            Pick a theme
          </Button>
        )}
      </FileButton>
      <Text fz="caption" c="text.muted">
        {name ?? "nothing picked"}
      </Text>
    </Box>
  );
}

export function LightboxPreview(): ReactElement {
  const [opened, set_opened] = useState(false);

  return (
    <>
      <Button
        variant="light"
        onPress={() => {
          set_opened(true);
        }}
      >
        Open the viewer
      </Button>
      <Lightbox
        opened={opened}
        onClose={() => {
          set_opened(false);
        }}
        images={[
          { src: "/logo.svg", alt: "Nebula", caption: "The wordmark" },
          { src: "/icon.svg", alt: "Nebula mark", caption: "The mark" },
        ]}
      />
    </>
  );
}

export function GlobalSearchPreview(): ReactElement {
  const [query, set_query] = useState("");
  const results = ITEMS.filter((item) => item.toLowerCase().includes(query.toLowerCase())).map(
    (item) => ({ id: item, title: item, group: "Components" }),
  );

  return (
    <Box w={420}>
      <GlobalSearch results={results} query={query} onQueryChange={set_query} />
    </Box>
  );
}

export function FiltersPreview(): ReactElement {
  return (
    <Box w={320}>
      <Filters
        filters={[
          {
            key: "boundary",
            label: "RSC",
            type: "select",
            options: [
              { value: "server", label: "Server" },
              { value: "client", label: "Client" },
            ],
          },
          { key: "name", label: "Name", type: "text", placeholder: "Button" },
        ]}
      />
    </Box>
  );
}

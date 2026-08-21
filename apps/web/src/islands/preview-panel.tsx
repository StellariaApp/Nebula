"use client";

import { Badge, Box, Card, CodeHighlight, Skeleton, Text, Title } from "@stellaria/nebula-web";
import { useEffect, useState, type ReactElement, type ReactNode } from "react";

import { FindPreview } from "../previews";
import type { Preview } from "../previews/types";

/**
 * La muestra se resuelve en el cliente a propósito. Con el `import()` en el componente de servidor,
 * Next sigue mandando a la página TODAS las referencias de cliente alcanzables desde su grafo —
 * medido: la ficha de `Button` seguía sirviendo `TagsInput`, `Dropzone` y `MonthPicker`—, así que la
 * frontera tiene que estar aquí. Es lo mismo que ya hacía `heavy-preview` para los nueve de subpath.
 */
export interface PreviewPanelLabels {
  preview: string;
  variants: string;
  usage: string;
}

function Anchored({
  id,
  title,
  count,
  children,
}: {
  id: string;
  title: string;
  count?: number | undefined;
  children: ReactNode;
}): ReactElement {
  return (
    <Box component="section" id={id} aria-labelledby={`${id}-title`} mt="xxl">
      <Box display="flex" align="center" gap="sm" mb="sm" data-pagefind-ignore="all">
        <Title id={`${id}-title`} order={2} fz="h5" c="text.primary">
          {title}
        </Title>
        {count === undefined ? null : (
          <Badge variant="light" size="sm">
            {count}
          </Badge>
        )}
      </Box>
      {children}
    </Box>
  );
}

function Stage({ children }: { children: ReactNode }): ReactElement {
  return (
    <Card withBorder r="lg" p="lg">
      <Box display="flex" gap="lg" wrap="wrap" align="flex-end">
        {children}
      </Box>
    </Card>
  );
}

export function PreviewPanel({
  name,
  labels,
}: {
  name: string;
  labels: PreviewPanelLabels;
}): ReactElement | null {
  const [preview, set_preview] = useState<Preview | null>(null);
  const [settled, set_settled] = useState(false);

  useEffect(() => {
    let live = true;
    void FindPreview(name).then((found) => {
      if (!live) return;
      set_preview(found ?? null);
      set_settled(true);
    });
    return () => {
      live = false;
    };
  }, [name]);

  if (preview === null) {
    if (settled) return null;
    return (
      <Anchored id="preview" title={labels.preview}>
        <Stage>
          <Skeleton w={240} h={40} r="md" />
        </Stage>
      </Anchored>
    );
  }

  return (
    <>
      <Anchored id="preview" title={labels.preview}>
        <Stage>{preview.base}</Stage>
      </Anchored>

      {preview.groups === undefined ? null : (
        <Anchored id="variants" title={labels.variants}>
          <Box display="flex" direction="column" gap="md">
            {preview.groups.map((group) => (
              <Box key={group.title} display="flex" direction="column" gap="xs">
                <Text fz="caption" c="text.muted" tt="uppercase" ls="wide" fw="semibold">
                  {group.title}
                </Text>
                <Stage>
                  {group.items.map((item) => (
                    <Box
                      key={item.label}
                      display="flex"
                      direction="column"
                      gap="xs"
                      align="flex-start"
                    >
                      {item.node}
                      <Text fz="caption" c="text.muted">
                        {item.label}
                      </Text>
                    </Box>
                  ))}
                </Stage>
              </Box>
            ))}
          </Box>
        </Anchored>
      )}

      {preview.usage === undefined ? null : (
        <Anchored id="usage" title={labels.usage}>
          <Box display="flex" direction="column" gap="md">
            <Stage>{preview.usage.node}</Stage>
            <CodeHighlight code={preview.usage.code} lang="tsx" variant="glass" withCopy r="lg" />
          </Box>
        </Anchored>
      )}
    </>
  );
}

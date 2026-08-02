import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState, type ReactElement } from "react";

import {
  Badge,
  Box,
  Button,
  Card,
  ImageGallery,
  Lightbox,
  Paper,
  Text,
  Title,
  type LightboxImage,
} from "@stellaria/nebula-web";
import { Carousel } from "@stellaria/nebula-web/carousel";
import { Player } from "@stellaria/nebula-web/media";

import { MATRIX_A11Y, ThemeMatrix } from "../fixtures/themes.js";

const meta: Meta<typeof Carousel> = {
  title: "Media/Carrusel y galería",
  component: Carousel,
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof Carousel>;

const HUES = ["#3f37c9", "#9d4edd", "#22b8cf", "#f43f5e", "#12b886"];

function Placeholder(hue: string, text: string): string {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='640' height='480'><rect width='640' height='480' fill='${hue}'/><text x='50%' y='50%' fill='white' font-family='sans-serif' font-size='40' text-anchor='middle' dominant-baseline='middle'>${text}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const IMAGES: LightboxImage[] = HUES.map((hue, index) => ({
  src: Placeholder(hue, `Imagen ${String(index + 1)}`),
  alt: `Imagen de ejemplo ${String(index + 1)}`,
  caption: `Pie de la imagen ${String(index + 1)}`,
}));

const SLIDES = [
  { id: "s1", title: "Colocación mensual", value: "4,2 M" },
  { id: "s2", title: "Cartera vencida", value: "1,8 %" },
  { id: "s3", title: "Clientes activos", value: "9.140" },
  { id: "s4", title: "Sucursales", value: "12" },
];

export const Default: Story = {
  render: () => (
    <Box maw={520}>
      <Carousel
        items={SLIDES}
        getKey={(slide) => slide.id}
        renderItem={(slide) => (
          <Paper p="lg" radius="lg" withBorder>
            <Text component="p" fz="caption" c="text.muted" mb="xxs">
              {slide.title}
            </Text>
            <Title order={2}>{slide.value}</Title>
          </Paper>
        )}
        label="Indicadores"
      />
    </Box>
  ),
};

export const VariosPorVista: Story = {
  render: () => (
    <Carousel
      items={SLIDES}
      getKey={(slide) => slide.id}
      renderItem={(slide) => (
        <Paper p="md" radius="md" withBorder>
          <Text component="p" fz="caption" c="text.muted">
            {slide.title}
          </Text>
          <Text fz="h4" fw="semibold">
            {slide.value}
          </Text>
        </Paper>
      )}
      slideSize="33.333%"
      gap="sm"
      withIndicators
      label="Indicadores"
    />
  ),
};

export const CarruselDeImagenes: Story = {
  render: () => (
    <Box maw={560}>
      <Carousel
        items={IMAGES}
        getKey={(image) => image.src}
        renderItem={(image) => (
          <Box r="lg" style={{ overflow: "hidden" }}>
            <img src={image.src} alt={image.alt} style={{ width: "100%", display: "block" }} />
          </Box>
        )}
        loop
        withIndicators
        label="Fotos del inmueble"
      />
    </Box>
  ),
};

export const Galeria: Story = {
  render: () => (
    <Box maw={720}>
      <ImageGallery images={IMAGES} label="Fotos del expediente" withSlideshow />
      <Text component="p" fz="caption" c="text.muted" mt="sm">
        Activa una miniatura para abrir el visor: rueda o <code>+</code>/<code>-</code> para el
        zoom, arrastre o flechas para el encuadre, <code>0</code> para restablecer.
      </Text>
    </Box>
  ),
};

function VisorSuelto(): ReactElement {
  const [opened, set_opened] = useState(false);
  return (
    <>
      <Button
        variant="outline"
        onPress={() => {
          set_opened(true);
        }}
      >
        Abrir el visor
      </Button>
      <Lightbox
        images={IMAGES}
        opened={opened}
        onClose={() => {
          set_opened(false);
        }}
        withThumbnails
        withSlideshow
      />
    </>
  );
}

export const Visor: Story = { render: () => <VisorSuelto /> };

export const Video: Story = {
  render: () => (
    <Box maw={560}>
      <Player src="https://www.w3schools.com/html/mov_bbb.mp4" />
      <Text component="p" fz="caption" c="text.muted" mt="sm">
        Sin <code>opened</code>, <code>Player</code> es un marco incrustado. Con <code>opened</code>
        , el mismo marco va dentro de un <code>Modal</code>.
      </Text>
    </Box>
  ),
};

export const ReducedMotion: Story = {
  globals: { reducedMotion: "reduce" },
  render: () => (
    <Box maw={520}>
      <Carousel
        items={SLIDES}
        getKey={(slide) => slide.id}
        renderItem={(slide) => (
          <Paper p="lg" radius="lg" withBorder>
            <Text fz="body2">{slide.title}</Text>
          </Paper>
        )}
        withIndicators
        label="Indicadores"
      />
      <Text component="p" fz="caption" c="text.muted" mt="sm">
        El carrusel salta entre slides en vez de recorrerlos, y sigue siendo navegable con los
        controles y los indicadores.
      </Text>
    </Box>
  ),
};

export const Composition: Story = {
  render: () => (
    <Card maw={760} p="lg" radius="lg" withBorder>
      <Box display="flex" justify="space-between" align="center" mb="md">
        <Box>
          <Text component="p" fz="caption" fw="semibold" tt="uppercase" ls="wide" c="text.muted">
            Expediente 40-118
          </Text>
          <Title order={3}>Nave industrial, Zona Norte</Title>
        </Box>
        <Badge variant="light">En revisión</Badge>
      </Box>
      <ImageGallery images={IMAGES.slice(0, 4)} cols={4} ratio={1} label="Fotos del inmueble" />
      <Text component="p" c="text.secondary" mt="md" maw={520}>
        La galería abre el visor con zoom, encuadre y pase de diapositivas. El carrusel de abajo
        repite el mismo contrato de items para una lectura secuencial.
      </Text>
    </Card>
  ),
};

export const AllThemes: Story = {
  parameters: MATRIX_A11Y,
  render: () => (
    <ThemeMatrix>
      <Carousel
        items={SLIDES}
        getKey={(slide) => slide.id}
        renderItem={(slide) => (
          <Paper p="md" radius="md" withBorder>
            <Text fz="body3">{slide.title}</Text>
          </Paper>
        )}
        withIndicators
        label="Indicadores"
      />
    </ThemeMatrix>
  ),
};

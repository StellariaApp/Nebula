import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useState, type ReactElement } from "react";

import {
  AspectRatio,
  Badge,
  Box,
  Button,
  Card,
  ImageGallery,
  Lightbox,
  MediaCard,
  Paper,
  SimpleGrid,
  Skeleton,
  Viewer,
  Text,
  Title,
  type LightboxImage,
} from "@stellaria/nebula-web";
import { Carousel } from "@stellaria/nebula-web/carousel";
import { AudioPlayer, LiveVideo, Player, VideoPlayer } from "@stellaria/nebula-web/media";

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
          <Paper p="lg" r="lg" withBorder>
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
        <Paper p="md" r="md" withBorder>
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
          <Paper p="lg" r="lg" withBorder>
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
    <Card maw={760} p="lg" r="lg" withBorder>
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
          <Paper p="md" r="md" withBorder>
            <Text fz="body3">{slide.title}</Text>
          </Paper>
        )}
        withIndicators
        label="Indicadores"
      />
    </ThemeMatrix>
  ),
};

const CLIP = "data:video/mp4;base64,";
const POSTER = Placeholder("#3f37c9", "Clip");

/** El reproductor en línea (ADR-195): parado enseña la carátula y el play; `defer` no abre el fichero. */
export const VideoEnLinea: Story = {
  render: () => (
    <Box maw={360}>
      <VideoPlayer defer duration={5} label="Clip de ejemplo" poster={POSTER} src={CLIP} />
    </Box>
  ),
};

const FEED_WIDTH = 640;
const FEED_HEIGHT = 360;
const FEED_FPS = 24;

function useCanvasFeed(): MediaStream | null {
  const [stream, set_stream] = useState<MediaStream | null>(null);
  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.width = FEED_WIDTH;
    canvas.height = FEED_HEIGHT;
    const context = canvas.getContext("2d");
    if (context === null || typeof canvas.captureStream !== "function") return;
    let frame = 0;
    let handle = 0;
    const Draw = (): void => {
      frame += 1;
      context.fillStyle = "#1f1b4d";
      context.fillRect(0, 0, FEED_WIDTH, FEED_HEIGHT);
      context.fillStyle = "#9d4edd";
      context.fillRect((frame * 4) % FEED_WIDTH, FEED_HEIGHT / 2 - 40, 80, 80);
      handle = requestAnimationFrame(Draw);
    };
    Draw();
    const feed = canvas.captureStream(FEED_FPS);
    const timer = window.setTimeout(() => {
      set_stream(feed);
    }, 1200);
    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(handle);
      feed.getTracks().forEach((track) => {
        track.stop();
      });
    };
  }, []);
  return stream;
}

function DirectoDeEjemplo(): ReactElement {
  const stream = useCanvasFeed();
  return (
    <SimpleGrid cols={{ base: 1, tablet: 2 }} maw={880} spacing="md">
      <AspectRatio ratio={16 / 9}>
        <LiveVideo
          label="Directo en contain"
          placeholder={<Skeleton h="100%" r="lg" w="100%" />}
          stream={stream}
          withFullscreen
          withLiveBadge
        />
      </AspectRatio>
      <AspectRatio ratio={1}>
        <LiveVideo fit="cover" label="Directo en cover" stream={stream} />
      </AspectRatio>
      <AspectRatio ratio={16 / 9}>
        <LiveVideo
          label="Directo con mandos"
          overlay={{
            topEnd: (
              <Button size="xs" variant="glass">
                Más
              </Button>
            ),
            bottomStart: (
              <Badge size="sm" variant="light">
                Recepción 01
              </Badge>
            ),
            bottomEnd: (
              <Button size="sm" variant="gradient">
                Tomar control
              </Button>
            ),
          }}
          placeholder={<Skeleton h="100%" r="lg" w="100%" />}
          stream={stream}
          withFullscreen
          withLiveBadge
        />
      </AspectRatio>
    </SimpleGrid>
  );
}

/**
 * El vídeo en directo (ADR-205): un `MediaStream` en `srcObject`; aquí, el de un canvas que llega
 * al segundo. El tercero lleva mandos por esquina (ADR-206): aparecen al mover el puntero y se van.
 */
export const VideoEnDirecto: Story = {
  render: () => <DirectoDeEjemplo />,
};

/** La nota de voz (ADR-195): la misma pista, el mismo pulgar y el mismo volumen que el vídeo. */
export const Audio: Story = {
  render: () => (
    <Card maw={420} p="md" r="lg" variant="glass" withBorder>
      <AudioPlayer label="Nota de voz" src={CLIP} />
    </Card>
  ),
};

function VisorSinPanel(): ReactElement {
  const [opened, set_opened] = useState(false);
  const [index, set_index] = useState(0);
  return (
    <>
      <Button
        onPress={() => {
          set_opened(true);
        }}
        variant="glass"
      >
        Abrir el visor
      </Button>
      <Viewer
        caption="Estudio Aurora · publicada"
        images={IMAGES.map((image) => ({ src: image.src, alt: image.alt ?? "" }))}
        index={index}
        labels={{
          region: "Visor de imágenes",
          close: "Cerrar",
          previous: "Anterior",
          next: "Siguiente",
          download: "Descargar",
          counter: (position, total) => `${String(position)} de ${String(total)}`,
        }}
        onClose={() => {
          set_opened(false);
        }}
        onIndexChange={set_index}
        opened={opened}
        withDownload
      />
    </>
  );
}

/** El visor sin panel (ADR-196): arrastre continuo, pellizco, rueda, tira de miniaturas. */
export const VisorSinPanelStory: Story = {
  name: "Visor sin panel",
  render: () => <VisorSinPanel />,
};

const PIECES = HUES.map((hue, index) => ({
  title: `Pieza ${String(index + 1)}`,
  frames: [Placeholder(hue, `Pieza ${String(index + 1)}`), Placeholder("#1f1b4d", "Detalle")],
}));

/** La tarjeta de medio (ADR-198): una sola para todas las rejillas; pasa por encima para ver las láminas. */
export const Tarjetas: Story = {
  render: () => (
    <SimpleGrid cols={{ base: 2, tablet: 3, laptop: 5 }} spacing="md">
      {PIECES.map((piece, index) => (
        <MediaCard
          avatar={{ name: "Aurora" }}
          ceiling="Pro"
          ceilingLabel="Escalón"
          clock={index === 0 ? "0:05" : null}
          cornerEnd={index === 1 ? { text: "nueva", tone: "accent" } : null}
          cornerStart={{ text: "Pública", tone: "plain" }}
          frames={piece.frames}
          index={index}
          key={piece.title}
          onOpen={() => undefined}
          openLabel={`Abrir ${piece.title}`}
          subtitle="Estudio Aurora"
          title={piece.title}
        />
      ))}
    </SimpleGrid>
  ),
};

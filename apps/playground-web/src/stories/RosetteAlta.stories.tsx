import type { Meta, StoryObj } from "@storybook/react-vite";
import { useMemo, useState, type ReactElement, type ReactNode } from "react";

import {
  Alert,
  AppShell,
  Badge,
  Box,
  Button,
  Card,
  Checkbox,
  Divider,
  Dropzone,
  Flex,
  GlassSurface,
  Group,
  Segment,
  SimpleGrid,
  Stepper,
  Text,
  Textarea,
  TextInput,
  Tooltip,
  type StepperStep,
} from "@stellaria/nebula-web";

import {
  Cols,
  CuentaDeAlta,
  Escena,
  Icon,
  Placeholder,
  Rosets,
  Rotulo,
  SALDO,
  Shell,
  TARIFA,
} from "../fixtures/rosette.js";

/* ── El esquema de extracción ─────────────────────────────────────────────────
 * §6.3: es UNO solo, de diecisiete paths, y el techo RESTA cuatro. Nunca añade.
 * Aquí se ve la resta, que es la parte que un formulario suele esconder.       */

interface Campo {
  path: string;
  etiqueta: string;
  valor?: string | undefined;
  origen?: "extraido" | "generated" | "directed" | "derived" | undefined;
  confianza?: string | undefined;
  nota?: string | undefined;
  intimo?: boolean | undefined;
}

const ESQUEMA: Campo[] = [
  { path: "identity.name", etiqueta: "Nombre", valor: "Cleo Marchand", origen: "directed" },
  { path: "identity.declaredAge", etiqueta: "Edad declarada", valor: "32", origen: "directed" },
  { path: "identity.renderAge", etiqueta: "Edad de render", origen: undefined },
  {
    path: "physical.height",
    etiqueta: "Altura",
    valor: "1,68 m",
    origen: "extraido",
    confianza: "0,54",
  },
  {
    path: "physical.build",
    etiqueta: "Complexión",
    valor: "media",
    origen: "extraido",
    confianza: "0,81",
  },
  {
    path: "physical.hair.color",
    etiqueta: "Color de pelo",
    valor: "castaño oscuro",
    origen: "extraido",
    confianza: "0,62",
    nota: "Dos fotos discrepaban. Gana la de 4032 × 3024 y la confianza baja.",
  },
  {
    path: "physical.hair.length",
    etiqueta: "Largo de pelo",
    valor: "por el hombro",
    origen: "extraido",
    confianza: "0,88",
  },
  {
    path: "physical.hair.texture",
    etiqueta: "Textura",
    valor: "ondulado",
    origen: "extraido",
    confianza: "0,74",
  },
  {
    path: "physical.eyes",
    etiqueta: "Ojos",
    valor: "avellana",
    origen: "extraido",
    confianza: "0,79",
  },
  { path: "physical.brows", etiqueta: "Cejas", origen: undefined },
  {
    path: "physical.skinTone",
    etiqueta: "Tono de piel",
    valor: "medio cálido",
    origen: "extraido",
    confianza: "0,85",
  },
  { path: "physical.proportions", etiqueta: "Proporciones", origen: undefined },
  {
    path: "constants.marks",
    etiqueta: "Marcas y lunares",
    valor: "lunar bajo el ojo izquierdo",
    origen: "extraido",
    confianza: "0,66",
  },
  { path: "intimacyAxes.descriptors.bust", etiqueta: "Busto", intimo: true },
  { path: "intimacyAxes.descriptors.rear", etiqueta: "Trasero", intimo: true },
  { path: "intimacyAxes.descriptors.vulvaShape", etiqueta: "Forma", intimo: true },
  { path: "intimacyAxes.descriptors.vulvaHair", etiqueta: "Vello", intimo: true },
];

const ORIGEN_TONO = {
  extraido: "info",
  generated: "accent",
  directed: "success",
  derived: "gray",
} as const;

const TECHOS = [
  { valor: "A", texto: "sugerente. Sin desnudo" },
  { valor: "B", texto: "desnudo parcial o implícito" },
  { valor: "C", texto: "desnudo completo, sin actos" },
  { valor: "D", texto: "actos en solitario" },
];

/* ── Paso 1 · de dónde sale el avatar ─────────────────────────────────────── */

const FOTOS = [
  { nombre: "frontal de cara", ok: true },
  { nombre: "cuerpo entero", ok: true },
  { nombre: "perfil", ok: true },
  { nombre: "tres cuartos", ok: true },
  { nombre: "manos", ok: true },
  { nombre: "detalle de pelo", ok: true },
];

function PasoOrigen({
  origen,
  onOrigen,
}: {
  origen: string;
  onOrigen: (valor: string) => void;
}): ReactElement {
  return (
    <Box>
      <Segment value={origen} onChange={onOrigen} fullWidth>
        <Segment.Control aria-label="De dónde sale el avatar">
          <Segment.Control.Item value="fotos">Desde fotos</Segment.Control.Item>
          <Segment.Control.Item value="texto">Desde texto</Segment.Control.Item>
        </Segment.Control>
      </Segment>

      <Alert
        variant="light"
        color="info"
        mt="md"
        icon={<Icon name="info" />}
        title="Las fotos son entrada, nunca anclas"
      >
        Subir una foto no salta ningún paso: <strong>añade uno</strong>, el de extracción. Las
        anclas las genera el sistema en la misma sesión, la misma luz y la misma resolución, y se
        cobran a paquete.
      </Alert>

      {origen === "fotos" ? (
        <Box mt="md">
          <Dropzone
            kind="image"
            multiple
            label="Fotos de referencia"
            description="Mínimo 4, recomendado de 6 a 10. Gratis."
          />
          <SimpleGrid cols={Cols({ base: 3, tablet: 6 })} spacing="sm" mt="md">
            {FOTOS.map((foto) => (
              <Card key={foto.nombre} withBorder r="sm" padding="none" overflow="hidden">
                <Placeholder ratio={1} />
                <Box p="xxs">
                  <Text fz="caption" c="text.muted" truncate>
                    {foto.nombre}
                  </Text>
                </Box>
              </Card>
            ))}
          </SimpleGrid>

          <Rotulo mt="md">Lo que hace falta</Rotulo>
          <Box display="flex" direction="column" gap="xxs">
            {[
              { texto: "Al menos 4 fotos", ok: true, detalle: "6 subidas" },
              { texto: "Una frontal de cara", ok: true, detalle: "foto 1" },
              { texto: "Una de cuerpo entero", ok: true, detalle: "foto 2" },
              { texto: "Recomendado: entre 6 y 10", ok: true, detalle: "6 subidas" },
            ].map((linea) => (
              <Flex key={linea.texto} align="center" gap="sm">
                <Box c={linea.ok ? "success.500" : "text.disabled"} display="flex">
                  <Icon name={linea.ok ? "success" : "circle"} size={14} />
                </Box>
                <Text fz="body3">{linea.texto}</Text>
                <Text fz="caption" c="text.muted">
                  {linea.detalle}
                </Text>
              </Flex>
            ))}
          </Box>
        </Box>
      ) : (
        <Box mt="md" display="flex" direction="column" gap="sm">
          <TextInput label="Nombre" defaultValue="Cleo Marchand" />
          <TextInput label="Edad declarada" defaultValue="32" />
          <Textarea
            label="Descripción física en prosa"
            description="Es el mínimo para que un avatar sea generable desde texto. De aquí sale el resto, marcado como generado."
            rows={4}
          />
        </Box>
      )}
    </Box>
  );
}

/* ── Paso 2 · el techo declarado ──────────────────────────────────────────── */

function PasoTecho({
  techo,
  onTecho,
}: {
  techo: string;
  onTecho: (valor: string) => void;
}): ReactElement {
  const estrecho = techo === "A" || techo === "B";
  return (
    <Box>
      <Segment value={techo} onChange={onTecho} fullWidth>
        <Segment.Control aria-label="Techo declarado del avatar">
          {TECHOS.map((nivel) => (
            <Segment.Control.Item key={nivel.valor} value={nivel.valor}>
              {nivel.valor}
            </Segment.Control.Item>
          ))}
        </Segment.Control>
      </Segment>
      <Text fz="body3" c="text.secondary" mt="xs">
        {TECHOS.find((nivel) => nivel.valor === techo)?.texto}
      </Text>

      <SimpleGrid cols={Cols({ base: 1, tablet: 2 })} spacing="md" mt="md">
        <Card withBorder r="md" padding="none">
          <Box p="md">
            <Rotulo>Qué cambia en la extracción</Rotulo>
            <Text fz="body3" c="text.secondary">
              El esquema es uno solo, de <strong>17 paths</strong>, y el techo{" "}
              <strong>resta</strong>. Nunca añade.
            </Text>
            <Box display="flex" direction="column" gap="xxs" mt="sm">
              {ESQUEMA.filter((campo) => campo.intimo === true).map((campo) => (
                <Flex key={campo.path} align="center" justify="space-between" gap="sm">
                  <Text
                    fz="caption"
                    ff="mono"
                    c={estrecho ? "text.disabled" : "text.muted"}
                    truncate
                    style={estrecho ? { textDecoration: "line-through" } : undefined}
                  >
                    {campo.path}
                  </Text>
                  <Badge size="xs" variant="outline" color={estrecho ? "gray" : "accent"}>
                    {estrecho ? "fuera" : "dentro"}
                  </Badge>
                </Flex>
              ))}
            </Box>
            <Text fz="caption" c="text.muted" mt="sm">
              {estrecho ? "13" : "17"} paths con techo {techo}. El filtro llega también al volcado,
              no solo a la pregunta: si viviera solo en la pregunta, un extractor que responda de
              más acabaría en el canon.
            </Text>
          </Box>
        </Card>

        <Card withBorder r="md" padding="none">
          <Box p="md">
            <Rotulo>Qué cambia en el juego de anclas</Rotulo>
            <Flex align="baseline" gap="sm">
              <Text fz="h4" fw="bold">
                {estrecho ? 6 : 9}
              </Text>
              <Text fz="body3" c="text.secondary">
                anclas
              </Text>
            </Flex>
            <Text fz="body3" c="text.secondary" mt="xxs">
              {estrecho
                ? "Las seis base: rostro, manos, pies, cuerpo frontal, dorsal y perfil."
                : "Las seis base más las tres de detalle, que solo viajan en trabajos C o D."}
            </Text>
            <Badge variant="light" size="lg" mt="sm">
              {Rosets(estrecho ? TARIFA.anclasBase : TARIFA.anclasDetalle)}
            </Badge>
            <Text fz="caption" c="text.muted" mt="sm">
              Precio de paquete, no derivado: después de medirlo, el número de anclas <em>es</em> el
              precio del avatar —el canon y la extracción son el 4 %—.
            </Text>
          </Box>
        </Card>
      </SimpleGrid>
    </Box>
  );
}

/* ── Paso 3 · extracción ──────────────────────────────────────────────────── */

function PasoExtraccion(): ReactElement {
  return (
    <Box>
      <Alert
        variant="light"
        color="primary"
        icon={<Icon name="spark" />}
        title={`La extracción cuesta ${Rosets(TARIFA.extraccion)}`}
      >
        Un modelo de visión rellena los campos que puede, cada uno con su confianza. No intenta
        adivinar la edad real, ni la identidad de la persona fotografiada, ni el parecido con nadie:
        extrae rasgos visuales, no personas.
      </Alert>

      <SimpleGrid cols={Cols({ base: 1, tablet: 3 })} spacing="md" mt="md">
        {[
          { titulo: "6 fotos", nota: "las que subiste" },
          { titulo: "13 paths", nota: "los que el techo A permite preguntar" },
          { titulo: Rosets(TARIFA.extraccion), nota: "se cobra al lanzarla" },
        ].map((dato) => (
          <Card key={dato.titulo} withBorder r="md" padding="none">
            <Box p="md">
              <Text fz="h5" fw="bold">
                {dato.titulo}
              </Text>
              <Text fz="caption" c="text.muted">
                {dato.nota}
              </Text>
            </Box>
          </Card>
        ))}
      </SimpleGrid>

      <Text fz="caption" c="text.muted" mt="md">
        Te quedan {Rosets(SALDO.rosets)}. Después de la extracción:{" "}
        {Rosets(SALDO.rosets - TARIFA.extraccion)}.
      </Text>
      <Button mt="sm" rightSection={<Icon name="spark" />}>
        Extraer · {Rosets(TARIFA.extraccion)}
      </Button>
    </Box>
  );
}

/* ── Paso 4 · la revisión, que es gratis y por eso es un lienzo ───────────── */

function CampoFila({
  campo,
  marcado,
  onMarcar,
}: {
  campo: Campo;
  marcado: boolean;
  onMarcar: (valor: boolean) => void;
}): ReactElement {
  const vacio = campo.valor === undefined;
  return (
    <Box>
      <Flex align="center" justify="space-between" gap="sm" wrap="wrap">
        <Flex direction="column" miw={0}>
          <Text fz="caption" ff="mono" c="text.muted" truncate>
            {campo.path}
          </Text>
          <Text fz="body3" fw="semibold" c={vacio ? "text.muted" : "text.primary"}>
            {campo.valor ?? "vacío"}
          </Text>
        </Flex>
        {vacio ? (
          <Checkbox
            label={`Autogenerar ${campo.etiqueta.toLowerCase()}`}
            checked={marcado}
            onChange={onMarcar}
            size="sm"
          />
        ) : (
          <Group gap="xs">
            <Badge size="xs" variant="light" color={ORIGEN_TONO[campo.origen ?? "derived"]}>
              {campo.origen}
              {campo.confianza === undefined ? "" : ` · ${campo.confianza}`}
            </Badge>
            <Tooltip
              label="Editar a mano lo pasa a directed y le quita la confianza"
              trigger={
                <Button size="xs" variant="ghost">
                  Editar
                </Button>
              }
            />
          </Group>
        )}
      </Flex>
      {campo.nota === undefined ? null : (
        <Text fz="caption" c="warning.500" mt="xxs">
          {campo.nota}
        </Text>
      )}
      <Divider mt="xs" />
    </Box>
  );
}

function PasoRevision({
  techo,
  marcados,
  onMarcados,
}: {
  techo: string;
  marcados: string[];
  onMarcados: (valor: string[]) => void;
}): ReactElement {
  const set_marcados = (actualiza: (previos: string[]) => string[]): void => {
    onMarcados(actualiza(marcados));
  };
  const estrecho = techo === "A" || techo === "B";
  const campos = useMemo(
    () => ESQUEMA.filter((campo) => !(estrecho && campo.intimo === true)),
    [estrecho],
  );
  const vacios = campos.filter((campo) => campo.valor === undefined);

  return (
    <Box>
      <SimpleGrid cols={Cols({ base: 1, laptop: 3 })} spacing="md">
        <Box style={{ gridColumn: "span 2" }} miw={0}>
          <Flex align="center" justify="space-between" gap="sm" wrap="wrap" mb="sm">
            <Rotulo>Qué se extrajo, qué falta y con qué confianza</Rotulo>
            <Badge variant="light" size="sm" color="success">
              este paso es gratis
            </Badge>
          </Flex>
          <Box display="flex" direction="column" gap="xs">
            {campos.map((campo) => (
              <CampoFila
                key={campo.path}
                campo={campo}
                marcado={marcados.includes(campo.path)}
                onMarcar={(valor) => {
                  set_marcados((previos) =>
                    valor
                      ? [...previos, campo.path]
                      : previos.filter((path) => path !== campo.path),
                  );
                }}
              />
            ))}
          </Box>
        </Box>

        <GlassSurface level="subtle" r="lg" withBorder p="md">
          <Rotulo>Cómo se resolvieron los conflictos</Rotulo>
          <Box display="flex" direction="column" gap="sm">
            {[
              {
                titulo: "Dos fotos discrepan",
                texto: "Gana la de mayor resolución, la confianza baja y queda una nota.",
              },
              {
                titulo: "Editas a mano",
                texto:
                  "El campo pasa a directed y la confianza desaparece: deja de ser una observación y pasa a ser una decisión.",
              },
              {
                titulo: "Autogeneración",
                texto: "Nunca sobrescribe lo extraído ni lo manual. Solo rellena huecos.",
              },
              {
                titulo: "Confianza alta ≠ verdad",
                texto:
                  "Un anillo inventado llegó con confianza 0,95, la más alta del juego, y en la imagen no había anillo.",
              },
            ].map((regla) => (
              <Box key={regla.titulo}>
                <Text fz="body3" fw="semibold">
                  {regla.titulo}
                </Text>
                <Text fz="caption" c="text.muted">
                  {regla.texto}
                </Text>
              </Box>
            ))}
          </Box>

          <Divider my="md" />

          <Rotulo>Autogenerar los huecos</Rotulo>
          <Text fz="body3">
            {marcados.length} de {vacios.length} marcados
          </Text>
          <Text fz="caption" c="text.muted" mt="xxs">
            Son {Rosets(TARIFA.autogeneracion)} <strong>por el conjunto, no por paso</strong>. Quien
            autogenera, mira, corrige a mano y vuelve a tocar un paso está usando el producto como
            se espera: cobrar cada intento le enseñaría a no tocarlo.
          </Text>
          <Button
            fullWidth
            mt="sm"
            disabled={marcados.length === 0}
            rightSection={<Icon name="spark" />}
          >
            Autogenerar · {Rosets(TARIFA.autogeneracion)}
          </Button>
          <Text fz="caption" c="text.muted" mt="xs">
            Escribirlos a mano sigue siendo gratis, y se puede en cualquier momento.
          </Text>
        </GlassSurface>
      </SimpleGrid>
    </Box>
  );
}

/* ── Paso 5 · la base, que es gratis la primera vez ───────────────────────── */

function PasoBase(): ReactElement {
  return (
    <Box>
      <SimpleGrid cols={Cols({ base: 1, tablet: 2 })} spacing="md" maw={720}>
        {["De frente", "De espaldas"].map((vista) => (
          <Card key={vista} withBorder r="lg" padding="none" overflow="hidden">
            <Placeholder ratio={3 / 4} label={vista} />
          </Card>
        ))}
      </SimpleGrid>
      <Alert
        variant="light"
        color="success"
        mt="md"
        icon={<Icon name="success" />}
        title="Esta primera pareja es gratis"
      >
        No se le pide a nadie que pague antes de haber visto nada. Rehacerla cuesta{" "}
        {Rosets(TARIFA.rehacerBase)}, que son dos imágenes, y es una decisión tuya.
      </Alert>
      <Text fz="caption" c="text.muted" mt="sm">
        Son dos imágenes y no una con las dos figuras dentro, aunque costaría la mitad: la de menor
        resolución de un juego gobierna la identidad del juego entero, y de esta base salen las
        nueve anclas.
      </Text>
    </Box>
  );
}

/* ── Paso 6 · el juego de anclas y sus veredictos ─────────────────────────── */

const PAPELES = [
  { n: 1, papel: "rostro", minimo: 7, veredicto: "conservado" },
  { n: 2, papel: "manos", minimo: 4, veredicto: "conservado" },
  { n: 3, papel: "pies", minimo: 3, veredicto: "conservado" },
  { n: 4, papel: "cuerpo frontal", minimo: 6, veredicto: "conservado" },
  { n: 5, papel: "cuerpo dorsal", minimo: 5, veredicto: "contradicho" },
  { n: 6, papel: "cuerpo perfil", minimo: 5, veredicto: "conservado" },
  { n: 7, papel: "busto", minimo: 4, veredicto: "conservado" },
  { n: 8, papel: "trasero", minimo: 4, veredicto: "conservado" },
  { n: 9, papel: "detalle", minimo: 3, veredicto: "no_juzgado" },
];

const VEREDICTO_TONO = {
  conservado: "success",
  contradicho: "error",
  ausente: "gray",
  no_juzgado: "warning",
} as const;

function PasoAnclas({ techo }: { techo: string }): ReactElement {
  const estrecho = techo === "A" || techo === "B";
  const papeles = estrecho ? PAPELES.slice(0, 6) : PAPELES;
  const contradichos = papeles.filter((papel) => papel.veredicto === "contradicho");

  return (
    <Box>
      <Flex align="center" justify="space-between" gap="sm" wrap="wrap" mb="md">
        <Text fz="body3" c="text.secondary">
          Todas en la misma sesión, la misma habitación vacía, la misma luz y la misma resolución.
        </Text>
        <Badge variant="light" size="lg">
          {Rosets(estrecho ? TARIFA.anclasBase : TARIFA.anclasDetalle)} +{" "}
          {Rosets(TARIFA.pruebaIdentidad)} de prueba
        </Badge>
      </Flex>

      <SimpleGrid cols={Cols({ base: 2, tablet: 3, laptop: 5 })} spacing="md">
        {papeles.map((papel) => (
          <Card key={papel.n} withBorder r="md" padding="none" overflow="hidden">
            <Placeholder ratio={1} icon="anchor" />
            <Box p="xs">
              <Text fz="caption" fw="semibold" truncate>
                {papel.n} · {papel.papel}
              </Text>
              <Flex align="center" justify="space-between" gap="xxs" mt="xxs">
                <Text fz="caption" c="text.muted">
                  mín. {papel.minimo}
                </Text>
                <Badge
                  size="xs"
                  variant="light"
                  color={VEREDICTO_TONO[papel.veredicto as keyof typeof VEREDICTO_TONO]}
                >
                  {papel.veredicto}
                </Badge>
              </Flex>
            </Box>
          </Card>
        ))}
      </SimpleGrid>

      {contradichos.length > 0 ? (
        <Alert
          variant="light"
          color="error"
          mt="md"
          icon={<Icon name="error" />}
          title={`Hay ${String(contradichos.length)} contradicho: se regenera el ancla, no se baja el umbral`}
          actions={
            <Button size="xs" rightSection={<Icon name="refresh" />}>
              Regenerar el ancla 5
            </Button>
          }
        >
          La prueba de identidad no supera el listón de su encuadre. Un rasgo distinto no es falta
          de evidencia, es evidencia en contra.
        </Alert>
      ) : null}

      <Alert
        variant="light"
        color="warning"
        mt="sm"
        icon={<Icon name="warning" />}
        title="El no juzgado se cuenta aparte"
      >
        Cuando el juez decide no mirar un rasgo, la imagen <strong>no queda verificada</strong>. No
        se lee como aprobado: una negativa empujaría el control hacia el lado permisivo, en
        silencio.
      </Alert>
    </Box>
  );
}

/* ── El alta ───────────────────────────────────────────────────────────────── */

function Cuenta({
  techo,
  origen,
  autogenera,
}: {
  techo: string;
  origen: string;
  autogenera: boolean;
}): ReactElement {
  const { lineas, total } = CuentaDeAlta({ techo, origen, autogenera });

  return (
    <GlassSurface level="subtle" r="lg" withBorder p="md">
      <Rotulo>La cuenta del alta</Rotulo>
      <Box display="flex" direction="column" gap="xxs">
        {lineas.map((linea) => (
          <Flex key={linea.concepto} align="center" justify="space-between" gap="sm">
            <Text fz="caption" c="text.secondary" truncate>
              {linea.concepto}
              {linea.opcional === true ? " (opcional)" : ""}
            </Text>
            {linea.rosets === 0 ? (
              <Badge size="xs" variant="light" color="success">
                gratis
              </Badge>
            ) : (
              <Text fz="caption" fw="semibold" ws="nowrap">
                {Rosets(linea.rosets)}
              </Text>
            )}
          </Flex>
        ))}
      </Box>
      <Divider my="sm" />
      <Flex align="center" justify="space-between" gap="sm">
        <Text fz="body3" fw="semibold">
          Total
        </Text>
        <Badge variant="light" size="lg">
          {Rosets(total)}
        </Badge>
      </Flex>
      <Text fz="caption" c="text.muted" mt="xs">
        Cada línea se cobra cuando ocurre.{" "}
        <strong>La construcción del canon solo se cobra cuando la hace el sistema</strong>:
        escribirlo a mano es gratis, siempre y entero.
      </Text>
    </GlassSurface>
  );
}

function Alta(): ReactElement {
  const [paso, set_paso] = useState(3);
  const [origen, set_origen] = useState("fotos");
  const [techo, set_techo] = useState("A");
  const [marcados, set_marcados] = useState<string[]>([]);

  const pasos: StepperStep[] = [
    { label: "Origen", description: "gratis" },
    { label: "Techo", description: "gratis" },
    ...(origen === "fotos"
      ? [{ label: "Extracción", description: Rosets(TARIFA.extraccion) }]
      : []),
    { label: "Revisión", description: "gratis" },
    { label: "Base", description: "gratis" },
    { label: "Anclas", description: Rosets(techo === "A" || techo === "B" ? 110 : 160) },
  ];

  const paneles: ReactNode[] = [
    <PasoOrigen key="origen" origen={origen} onOrigen={set_origen} />,
    <PasoTecho key="techo" techo={techo} onTecho={set_techo} />,
    ...(origen === "fotos" ? [<PasoExtraccion key="extraccion" />] : []),
    <PasoRevision key="revision" techo={techo} marcados={marcados} onMarcados={set_marcados} />,
    <PasoBase key="base" />,
    <PasoAnclas key="anclas" techo={techo} />,
  ];

  return (
    <Shell active="avatares" title="Crear un avatar — Rosette">
      <AppShell.Section aria-label="Crear un avatar">
        <AppShell.Header
          sticky
          title="Crear un avatar"
          subtitle="Los pasos que cuestan van en fila; el que es gratis es un lienzo"
          actions={
            <Button size="sm" variant="ghost">
              Guardar borrador
            </Button>
          }
        />
        <AppShell.Content>
          <SimpleGrid cols={Cols({ base: 1, desktop: 4 })} spacing="md">
            <Box style={{ gridColumn: "span 3" }} miw={0}>
              <Stepper steps={pasos} active={paso} onStepClick={set_paso} allowNextStepsSelect>
                <Box mt="lg">{paneles[paso]}</Box>
              </Stepper>
              <Flex align="center" gap="sm" mt="lg" wrap="wrap">
                <Button
                  variant="ghost"
                  disabled={paso === 0}
                  onPress={() => {
                    set_paso((valor) => Math.max(0, valor - 1));
                  }}
                >
                  Atrás
                </Button>
                <Button
                  disabled={paso === pasos.length - 1}
                  onPress={() => {
                    set_paso((valor) => Math.min(pasos.length - 1, valor + 1));
                  }}
                  rightSection={<Icon name="chevron-right" />}
                >
                  Siguiente
                </Button>
              </Flex>
            </Box>
            <Cuenta techo={techo} origen={origen} autogenera={marcados.length > 0} />
          </SimpleGrid>
        </AppShell.Content>
      </AppShell.Section>
    </Shell>
  );
}

const meta: Meta = {
  title: "Patterns/Rosette/Crear un avatar",
  parameters: { layout: "fullscreen" },
};

export default meta;

type Story = StoryObj;

/**
 * **Asistente lineal para lo que cuesta, lienzo para lo que es gratis.** Era la pregunta abierta
 * de esta pantalla y el coste por paso la desequilibra.
 *
 * *Por qué no un lienzo entero.* Un lienzo invita a tocar, y aquí tocar puede ser un cargo: la
 * extracción vale 5 rosets y el juego de anclas 100 o 150. Además el orden no es decorativo —el
 * techo **resta cuatro de los diecisiete paths** del esquema, así que declararlo después de
 * extraer significa haber pagado por preguntas que no se podían hacer, o no haber preguntado las
 * que sí—. Eso es una cadena de dependencias, no un lienzo.
 *
 * *Por qué tampoco un asistente entero.* El paso de revisión es gratis y el corpus lo dice dos
 * veces: escribir el canon a mano no cuesta nada, y la autogeneración son **5 rosets por el
 * conjunto, no por paso**, precisamente para que nadie pague de más por dudar. Un paso gratis
 * partido en subpasos convierte en fricción algo que el modelo quiere que sea barato. Por eso el
 * paso 4 es un lienzo: los diecisiete campos a la vez, con su origen, su confianza y sus
 * conflictos ya resueltos a la vista.
 *
 * *Lo que se enseña y en ourdream no existe.* La resta del techo, campo por campo y con los
 * paths tachados; el conflicto entre dos fotos con la razón de por qué ganó una; y **la cuenta
 * del alta en vivo**, línea a línea, con lo gratis marcado en verde.
 *
 * *Lo que la maqueta no deja confundir.* Las fotos son entrada, nunca anclas. Subir una foto no
 * salta pasos: añade el de extracción. Y la base de dos vistas es gratis la primera vez porque
 * no se le pide a nadie que pague antes de haber visto nada.
 */
export const CrearAvatar: Story = {
  name: "Desde fotos y desde texto",
  render: () => (
    <Escena>
      <Alta />
    </Escena>
  ),
};

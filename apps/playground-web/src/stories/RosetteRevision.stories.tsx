import type { Meta, StoryObj } from "@storybook/react-vite";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactElement } from "react";

import {
  Alert,
  AppShell,
  Badge,
  Box,
  Button,
  Card,
  Divider,
  Drawer,
  EmptyState,
  Flex,
  GlassSurface,
  Group,
  Kbd,
  Progress,
  SimpleGrid,
  Text,
  Tooltip,
  VisuallyHidden,
} from "@stellaria/nebula-web";

import {
  AVATAR_ACTIVO,
  Cols,
  Escena,
  Icon,
  Placeholder,
  Rosets,
  Rotulo,
  Shell,
  TARIFA,
} from "../fixtures/rosette.js";

/* ── El lote ──────────────────────────────────────────────────────────────────
 * Cuarenta candidatas, que es el número del gate de F7. Se generan con un patrón
 * fijo y no con azar: una maqueta que cambia en cada carga no se puede comparar
 * consigo misma ni pasar dos veces el mismo gate.                              */

const TOTAL = 40;
const OBJETIVO_SEGUNDOS = 15 * 60;

interface Candidata {
  id: number;
  encuadre: string;
  conservados: number;
  liston: number;
  contradichos: number;
  ausentes: number;
  noJuzgado: number;
  anclas: number[];
  control: "pasa" | "rechaza";
}

const ENCUADRES = [
  { nombre: "cuerpo entero frontal", anclas: [1, 4, 2, 3], liston: 6 },
  { nombre: "plano de cara", anclas: [1], liston: 7 },
  { nombre: "perfil", anclas: [1, 6, 4], liston: 5 },
  { nombre: "plano de manos", anclas: [2], liston: 4 },
  { nombre: "cuerpo entero dorsal", anclas: [5, 3], liston: 5 },
];

const LOTE: Candidata[] = Array.from({ length: TOTAL }, (_, index) => {
  const encuadre = ENCUADRES[index % ENCUADRES.length] as (typeof ENCUADRES)[number];
  const holgura = (index * 7) % 5;
  const contradichos = index % 9 === 4 ? 1 : 0;
  return {
    id: index + 1,
    encuadre: encuadre.nombre,
    liston: encuadre.liston,
    conservados: encuadre.liston + holgura - (index % 11 === 3 ? 2 : 0),
    contradichos,
    ausentes: (index * 3) % 4,
    noJuzgado: index % 13 === 6 ? 1 : 0,
    anclas: encuadre.anclas,
    control: contradichos > 0 || index % 11 === 3 ? "rechaza" : "pasa",
  };
});

const ANCLAS = [
  "rostro",
  "manos",
  "pies",
  "cuerpo frontal",
  "cuerpo dorsal",
  "cuerpo perfil",
  "busto",
  "trasero",
  "detalle",
];

/* ── El mapa de teclado ───────────────────────────────────────────────────────
 * El gate dice «sin ratón», así que el mapa no vive en un modal de ayuda: vive
 * en la subbarra, a la vista, todo el rato.                                    */

const ATAJOS: { teclas: string[]; que: string }[] = [
  { teclas: ["A"], que: "aprobar" },
  { teclas: ["D"], que: "descartar" },
  { teclas: ["R"], que: "regenerar" },
  { teclas: ["C"], que: "comparar" },
  { teclas: ["←", "→"], que: "mover" },
  { teclas: ["1", "9"], que: "ancla" },
  { teclas: ["U"], que: "deshacer" },
  { teclas: ["Esc"], que: "cancelar" },
];

function MapaDeTeclado(): ReactElement {
  return (
    <Flex align="center" gap="md" wrap="wrap">
      <Flex align="center" gap="xxs" c="text.muted">
        <Icon name="keyboard" size={14} />
        <Text fz="caption" tt="uppercase" ls="wide" fw="semibold">
          Teclado
        </Text>
      </Flex>
      {ATAJOS.map((atajo) => (
        <Flex key={atajo.que} align="center" gap="xxs">
          {atajo.teclas.map((tecla, i) => (
            <Flex key={tecla} align="center" gap="xxs">
              {i > 0 ? (
                <Text fz="caption" c="text.disabled">
                  –
                </Text>
              ) : null}
              <Kbd size="xs">{tecla}</Kbd>
            </Flex>
          ))}
          <Text fz="caption" c="text.muted">
            {atajo.que}
          </Text>
        </Flex>
      ))}
    </Flex>
  );
}

/* ── Cronómetro ───────────────────────────────────────────────────────────────
 * Arranca en la primera decisión, no al abrir: lo que el gate mide es el tiempo
 * de revisar, no el de mirar la pantalla. Mientras no se toque nada marca 0:00,
 * que además deja la maqueta determinista.                                     */

function Reloj(segundos: number): string {
  const minutos = Math.floor(segundos / 60);
  const resto = segundos % 60;
  return `${String(minutos)}:${String(resto).padStart(2, "0")}`;
}

type Decision = "aprobada" | "descartada";

/* ── La estación de revisión ─────────────────────────────────────────────────*/

function Estacion(): ReactElement {
  const [indice, set_indice] = useState(0);
  const [decisiones, set_decisiones] = useState<Record<number, Decision>>({});
  const [intentos, set_intentos] = useState<Record<number, number>>({});
  const [historial, set_historial] = useState<number[]>([]);
  const [comparando, set_comparando] = useState(false);
  const [ancla_activa, set_ancla_activa] = useState(1);
  const [confirmando, set_confirmando] = useState(false);
  const [descartadas_abiertas, set_descartadas_abiertas] = useState(false);
  const [segundos, set_segundos] = useState(0);
  const [corriendo, set_corriendo] = useState(false);
  const region = useRef<HTMLDivElement>(null);

  const actual = LOTE[indice] as Candidata;
  const intento = intentos[actual.id] ?? 1;
  const revisadas = Object.keys(decisiones).length;
  const descartadas = Object.entries(decisiones).filter(([, valor]) => valor === "descartada");

  useEffect(() => {
    if (!corriendo) return;
    const id = setInterval(() => {
      set_segundos((valor) => valor + 1);
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, [corriendo]);

  const Avanzar = useCallback(() => {
    set_indice((valor) => Math.min(valor + 1, TOTAL - 1));
    set_comparando(false);
    set_confirmando(false);
  }, []);

  const Decidir = useCallback(
    (decision: Decision) => {
      set_corriendo(true);
      set_decisiones((previas) => ({ ...previas, [actual.id]: decision }));
      set_historial((previo) => [...previo, actual.id]);
      Avanzar();
    },
    [actual.id, Avanzar],
  );

  const Deshacer = useCallback(() => {
    set_historial((previo) => {
      const ultimo = previo.at(-1);
      if (ultimo === undefined) return previo;
      set_decisiones((previas) => {
        const copia = { ...previas };
        delete copia[ultimo];
        return copia;
      });
      set_indice(ultimo - 1);
      return previo.slice(0, -1);
    });
  }, []);

  const Regenerar = useCallback(() => {
    if (intento >= 3) return;
    set_corriendo(true);
    set_intentos((previos) => ({ ...previos, [actual.id]: intento + 1 }));
    set_confirmando(false);
  }, [actual.id, intento]);

  useEffect(() => {
    const Escuchar = (event: KeyboardEvent): void => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const tecla = event.key.toLowerCase();

      if (tecla === "escape") {
        set_confirmando(false);
        set_comparando(false);
        return;
      }
      if (confirmando) {
        if (tecla === "enter") {
          event.preventDefault();
          Regenerar();
        }
        return;
      }

      if (tecla === "a") Decidir("aprobada");
      else if (tecla === "d") Decidir("descartada");
      else if (tecla === "r") set_confirmando(true);
      else if (tecla === "c") set_comparando((valor) => !valor);
      else if (tecla === "u") Deshacer();
      else if (tecla === "arrowright") Avanzar();
      else if (tecla === "arrowleft") {
        set_indice((valor) => Math.max(valor - 1, 0));
      } else if (/^[1-9]$/.test(tecla)) {
        set_ancla_activa(Number(tecla));
        set_comparando(true);
      } else return;

      event.preventDefault();
    };

    document.addEventListener("keydown", Escuchar);
    return () => {
      document.removeEventListener("keydown", Escuchar);
    };
  }, [Avanzar, Decidir, Deshacer, Regenerar, confirmando]);

  const proyeccion = useMemo(() => {
    if (revisadas === 0 || segundos === 0) return null;
    return Math.round((segundos / revisadas) * TOTAL);
  }, [revisadas, segundos]);

  const pasa = actual.conservados >= actual.liston && actual.contradichos === 0;

  return (
    <Box ref={region} tabIndex={-1} display="flex" direction="column" gap="md">
      <VisuallyHidden>
        <p aria-live="polite">
          Candidata {actual.id} de {TOTAL}. {revisadas} revisadas.
        </p>
      </VisuallyHidden>

      <SimpleGrid cols={Cols({ base: 1, laptop: 3 })} spacing="md">
        <Box style={{ gridColumn: "span 2" }} miw={0}>
          <Box
            display="grid"
            gap="sm"
            style={{ gridTemplateColumns: comparando ? "1fr 1fr" : "1fr" }}
          >
            <Card withBorder r="lg" p="none" overflow="hidden">
              <Placeholder
                alto={420}
                label={`Candidata ${String(actual.id)} · ${actual.encuadre}`}
              />
              <Box p="sm">
                <Flex align="center" justify="space-between" gap="sm" wrap="wrap">
                  <Text fz="body3" fw="semibold">
                    Candidata {actual.id} de {TOTAL}
                  </Text>
                  <Group gap="xs">
                    <Badge size="xs" variant="light" color={pasa ? "success" : "warning"}>
                      {pasa ? "el control pasa" : "el control rechaza"}
                    </Badge>
                    <Badge size="xs" variant="outline">
                      intento {intento} de 3
                    </Badge>
                  </Group>
                </Flex>
              </Box>
            </Card>

            {comparando ? (
              <Card withBorder r="lg" p="none" overflow="hidden">
                <Placeholder
                  alto={420}
                  icon="anchor"
                  label={`Ancla ${String(ancla_activa)} · ${ANCLAS[ancla_activa - 1] ?? ""}`}
                />
                <Box p="sm">
                  <Flex align="center" justify="space-between" gap="sm" wrap="wrap">
                    <Text fz="body3" fw="semibold">
                      Ancla {ancla_activa}
                    </Text>
                    <Text fz="caption" c="text.muted">
                      <Kbd size="xs">1</Kbd>–<Kbd size="xs">9</Kbd> para cambiar
                    </Text>
                  </Flex>
                </Box>
              </Card>
            ) : null}
          </Box>

          <Flex align="center" gap="sm" mt="md" wrap="wrap">
            <Button
              size="sm"
              onPress={() => {
                Decidir("aprobada");
              }}
              rightSection={<Kbd size="xs">A</Kbd>}
            >
              Aprobar
            </Button>
            <Button
              size="sm"
              variant="glass"
              onPress={() => {
                Decidir("descartada");
              }}
              rightSection={<Kbd size="xs">D</Kbd>}
            >
              Descartar
            </Button>
            <Button
              size="sm"
              variant="ghost"
              disabled={intento >= 3}
              onPress={() => {
                set_confirmando(true);
              }}
              rightSection={<Kbd size="xs">R</Kbd>}
            >
              Regenerar
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onPress={() => {
                set_comparando((valor) => !valor);
              }}
              rightSection={<Kbd size="xs">C</Kbd>}
            >
              {comparando ? "Cerrar" : "Comparar"}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              disabled={historial.length === 0}
              onPress={Deshacer}
              rightSection={<Kbd size="xs">U</Kbd>}
            >
              Deshacer
            </Button>
          </Flex>

          {confirmando ? (
            <Alert
              variant="light"
              color="primary"
              mt="sm"
              live="status"
              icon={<Icon name="refresh" />}
              title={`Regenerar · ${Rosets(TARIFA.imagen)} · intento ${String(intento + 1)} de 3`}
              actions={
                <Group gap="xs">
                  <Button size="xs" onPress={Regenerar} rightSection={<Kbd size="xs">Enter</Kbd>}>
                    Confirmar
                  </Button>
                  <Button
                    size="xs"
                    variant="ghost"
                    onPress={() => {
                      set_confirmando(false);
                    }}
                    rightSection={<Kbd size="xs">Esc</Kbd>}
                  >
                    Cancelar
                  </Button>
                </Group>
              }
            >
              El reintento lo pagas tú y no se puede anunciar de antemano: se reserva el techo y se
              cobra lo que de verdad se genere.
            </Alert>
          ) : null}

          {intento >= 3 ? (
            <Alert
              variant="light"
              color="warning"
              mt="sm"
              icon={<Icon name="info" />}
              title="Sin intentos: elige tú"
            >
              Las tres se guardan, incluidas las que el control rechazó. Está medido que el titular
              eligió seis veces una imagen que el control había rechazado, y el proveedor no expone
              semilla: una imagen tirada no se recupera.
            </Alert>
          ) : null}

          <Rotulo mt="md">El lote</Rotulo>
          <Flex gap="xxs" wrap="wrap">
            {LOTE.map((candidata, i) => {
              const decision = decisiones[candidata.id];
              const tono =
                decision === "aprobada"
                  ? "success.500"
                  : decision === "descartada"
                    ? "text.disabled"
                    : "border.default";
              return (
                <Tooltip
                  key={candidata.id}
                  label={`${String(candidata.id)} · ${candidata.encuadre}`}
                  trigger={
                    <Box
                      component="button"
                      type="button"
                      aria-label={`Ir a la candidata ${String(candidata.id)}`}
                      aria-current={i === indice}
                      w={18}
                      h={18}
                      r="xs"
                      bg={tono}
                      bdc={i === indice ? "border.focus" : "border.default"}
                      style={{ border: "2px solid", cursor: "pointer" }}
                      onClick={() => {
                        set_indice(i);
                      }}
                    />
                  }
                />
              );
            })}
          </Flex>
        </Box>

        <Box display="flex" direction="column" gap="md" miw={0}>
          <GlassSurface level="subtle" r="lg" withBorder p="md">
            <Flex align="center" justify="space-between" gap="sm" wrap="wrap">
              <Rotulo>Veredicto</Rotulo>
              <Badge variant="light" size="sm" color={pasa ? "success" : "warning"}>
                listón {actual.liston}
              </Badge>
            </Flex>
            <Box display="flex" direction="column" gap="xxs">
              {[
                { label: "conservados", valor: actual.conservados, tono: "success" },
                { label: "contradichos", valor: actual.contradichos, tono: "error" },
                { label: "ausentes", valor: actual.ausentes, tono: "gray" },
                { label: "no juzgado", valor: actual.noJuzgado, tono: "warning" },
              ].map((linea) => (
                <Flex key={linea.label} align="center" justify="space-between" gap="sm">
                  <Text fz="body3" c="text.secondary">
                    {linea.label}
                  </Text>
                  <Badge size="xs" variant="light" color={linea.tono as "success"}>
                    {linea.valor}
                  </Badge>
                </Flex>
              ))}
            </Box>
            <Text fz="caption" c="text.muted" mt="sm">
              {actual.contradichos > 0
                ? "Un contradicho tumba la imagen aunque el recuento sobre: un rasgo distinto no es falta de evidencia, es evidencia en contra."
                : "El listón se calcula sumando el mínimo de cada ancla que cubre una región visible de este encuadre."}
            </Text>
            {actual.noJuzgado > 0 ? (
              <Text fz="caption" c="warning.500" mt="xxs">
                Una negativa del juez se cuenta aparte y no se lee como aprobado: bajaría el listón
                en silencio.
              </Text>
            ) : null}
          </GlassSurface>

          <GlassSurface level="subtle" r="lg" withBorder p="md">
            <Rotulo>Anclas de este encuadre</Rotulo>
            <SimpleGrid cols={Cols({ base: 3 })} spacing="xs">
              {ANCLAS.slice(0, 6).map((papel, i) => {
                const cubre = actual.anclas.includes(i + 1);
                return (
                  <Box
                    key={papel}
                    component="button"
                    type="button"
                    aria-label={`Comparar con el ancla ${String(i + 1)}, ${papel}`}
                    aria-pressed={comparando && ancla_activa === i + 1}
                    p="none"
                    r="sm"
                    style={{ border: "none", background: "none", cursor: "pointer" }}
                    onClick={() => {
                      set_ancla_activa(i + 1);
                      set_comparando(true);
                    }}
                  >
                    <Card
                      withBorder
                      r="sm"
                      p="none"
                      overflow="hidden"
                      variant={cubre ? "light" : "outline"}
                    >
                      <Placeholder ratio={1} icon="anchor" tone={cubre ? "base" : "muted"} />
                      <Box p="xxs">
                        <Text fz="caption" c={cubre ? "text.primary" : "text.muted"} truncate>
                          {i + 1} · {papel}
                        </Text>
                        <Text fz="caption" c="text.muted" truncate>
                          {cubre ? "en el listón" : "no cubre"}
                        </Text>
                      </Box>
                    </Card>
                  </Box>
                );
              })}
            </SimpleGrid>
            <Text fz="caption" c="text.muted" mt="xs">
              Las marcadas <strong>«no cubre»</strong> no enseñan ninguna región visible en este
              encuadre, así que no entran en el listón. Las tres de detalle solo viajan en trabajos
              de escalón C o D.
            </Text>
          </GlassSurface>

          <GlassSurface level="subtle" r="lg" withBorder p="md">
            <Flex align="center" justify="space-between" gap="sm" wrap="wrap">
              <Rotulo>Descartadas</Rotulo>
              <Badge variant="light" size="sm">
                {descartadas.length}
              </Badge>
            </Flex>
            <Text fz="caption" c="text.muted">
              Descartar no borra. <Kbd size="xs">U</Kbd> devuelve la última, y el resto se recupera
              desde aquí.
            </Text>
            <Button
              size="sm"
              variant="ghost"
              fullWidth
              mt="xs"
              onPress={() => {
                set_descartadas_abiertas(true);
              }}
            >
              Ver descartadas
            </Button>
          </GlassSurface>
        </Box>
      </SimpleGrid>

      <Drawer
        opened={descartadas_abiertas}
        onClose={() => {
          set_descartadas_abiertas(false);
        }}
        side="end"
        size={360}
        title="Descartadas"
      >
        {descartadas.length === 0 ? (
          <EmptyState
            title="Todavía no has descartado nada"
            description="Lo que descartes aparece aquí y se puede devolver al lote."
            icon={<Icon name="trash" size={24} />}
          />
        ) : (
          <Box display="flex" direction="column" gap="sm">
            {descartadas.map(([id]) => (
              <Flex key={id} align="center" justify="space-between" gap="sm">
                <Text fz="body3">Candidata {id}</Text>
                <Button
                  size="xs"
                  variant="ghost"
                  onPress={() => {
                    set_decisiones((previas) => {
                      const copia = { ...previas };
                      delete copia[Number(id)];
                      return copia;
                    });
                  }}
                >
                  Recuperar
                </Button>
              </Flex>
            ))}
          </Box>
        )}
      </Drawer>

      <VisuallyHidden>
        <p>
          Progreso: {revisadas} de {TOTAL} en {Reloj(segundos)}.
        </p>
      </VisuallyHidden>

      <Box>
        <Divider mb="sm" />
        <Flex align="center" justify="space-between" gap="md" wrap="wrap">
          <Flex align="center" gap="md" wrap="wrap">
            <Text fz="body3" fw="semibold">
              {revisadas} de {TOTAL} revisadas
            </Text>
            <Text fz="body3" c="text.muted">
              {Reloj(segundos)}
            </Text>
            <Badge
              variant="light"
              size="sm"
              color={proyeccion === null || proyeccion <= OBJETIVO_SEGUNDOS ? "success" : "error"}
            >
              {proyeccion === null
                ? "objetivo 15:00 para las 40"
                : `proyección ${Reloj(proyeccion)} · objetivo 15:00`}
            </Badge>
          </Flex>
          <Text fz="caption" c="text.muted">
            El cronómetro arranca en la primera decisión
          </Text>
        </Flex>
        <Progress
          value={(revisadas / TOTAL) * 100}
          size="xs"
          mt="xs"
          label="Candidatas revisadas"
        />
      </Box>
    </Box>
  );
}

function Playground(): ReactElement {
  return (
    <Shell active="avatares" title="Revisión — Rosette">
      <AppShell.Section aria-label="Playground de revisión">
        <AppShell.Header
          sticky
          title="Revisión"
          subtitle={`${AVATAR_ACTIVO.nombre} · ${String(TOTAL)} candidatas · sin ratón`}
          actions={
            <Badge variant="light" size="sm">
              6 h → 1,5 h por avatar
            </Badge>
          }
        />
        <AppShell.Subbar sticky>
          <MapaDeTeclado />
        </AppShell.Subbar>
        <AppShell.Content>
          <Estacion />
        </AppShell.Content>
      </AppShell.Section>
    </Shell>
  );
}

const meta: Meta = {
  title: "Patterns/Rosette/Revisión",
  parameters: { layout: "fullscreen" },
};

export default meta;

type Story = StoryObj;

/**
 * **La pantalla que decide si el sistema sirve.** El gate de F7 es un número —aprobar o
 * descartar 40 imágenes en menos de 15 minutos, sin ratón— así que esta historia funciona de
 * verdad: se puede cronometrar contra ella.
 *
 * *El mapa de teclado no está en un modal de ayuda.* Vive en la subbarra, pegajoso, a la vista
 * todo el rato: `A` aprueba, `D` descarta, `R` regenera, `C` compara, `1`–`9` eligen ancla, `U`
 * deshace, `Esc` cancela. Un atajo que hay que ir a buscar no se usa, y el gate se pierde por
 * ahí.
 *
 * *La comparación está en la misma pantalla.* `C` parte el lienzo en candidata y ancla; los
 * números saltan de ancla sin navegar. Las anclas que no cubren ninguna región visible de este
 * encuadre salen atenuadas, porque no entran en el listón —y un umbral que cobra preguntas que
 * nadie va a hacer no es estricto, está roto—.
 *
 * *El descarte es recuperable.* `U` devuelve la última decisión y el cajón lateral devuelve
 * cualquiera. Descartar no borra.
 *
 * *Regenerar dice lo que cuesta antes de gastarlo,* con el tope de tres. Al llegar a tres la
 * pantalla deja de ofrecer botón y dice lo que el corpus decidió: eligen ustedes aunque el
 * control haya rechazado las tres.
 *
 * *El cronómetro arranca en la primera decisión,* no al abrir la pantalla: lo que el gate mide
 * es el tiempo de revisar. En cuanto hay una decisión, la proyección a 40 aparece al lado del
 * objetivo, en verde o en rojo. **El número que decide el producto se enseña mientras se
 * produce**, no en un informe posterior.
 *
 * *Qué hace aquí un usuario que en ourdream le cuesta más.* En ourdream la rejilla no compara
 * contra nada, no dice por qué una imagen está mal, y aprobar exige el ratón. Aquí el veredicto
 * viene desglosado —conservados, contradichos, ausentes y **no juzgado**, que se cuenta aparte
 * para que una negativa del juez no baje el listón en silencio— y la mano no sale del teclado.
 */
export const Revision: Story = {
  name: "40 en 15 minutos, sin ratón",
  render: () => (
    <Escena>
      <Playground />
    </Escena>
  ),
};

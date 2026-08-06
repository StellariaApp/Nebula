import { useRef, useState, type ReactElement, type ReactNode } from "react";

import { useBreakpointDown } from "@stellaria/nebula-hooks";
import { CreateIcons, type IconComponentProps } from "@stellaria/nebula-icons";
import { AllIconsPack } from "@stellaria/nebula-icons/packs";
import {
  ActionIcon,
  AppShell,
  AspectRatio,
  Badge,
  Box,
  Divider,
  Flex,
  GradientText,
  Indicator,
  Menu,
  StarField,
  Text,
  UnstyledButton,
  VisuallyHidden,
  type MenuItemData,
  type StatusMap,
} from "@stellaria/nebula-web";

import { ProductStage } from "./themes.js";

/* ── Iconografía ──────────────────────────────────────────────────────────────
 * El pack común no trae los glifos del dominio —ancla, canon, roset, escalón—,
 * así que se dibujan aquí. Todo lo demás sale de `AllIconsPack`.                */

const Stroke = (path: ReactNode) => {
  function Glyph({ size = 16, ...rest }: IconComponentProps): ReactElement {
    return (
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        {...rest}
      >
        {path}
      </svg>
    );
  }
  return Glyph;
};

export const { Icon } = CreateIcons({
  ...AllIconsPack,
  spark: Stroke(<path d="M12 3v6m0 6v6m-9-9h6m6 0h6M6 6l3 3m6 6 3 3m0-12-3 3m-6 6-3 3" />),
  anchor: Stroke(
    <>
      <circle cx="12" cy="5" r="2.5" />
      <path d="M12 7.5V21M5 13a7 7 0 0 0 14 0M8 10H4m16 0h-4" />
    </>,
  ),
  canon: Stroke(
    <>
      <path d="M4 5a2 2 0 0 1 2-2h12v18H6a2 2 0 0 1-2-2z" />
      <path d="M8 7h6M8 11h6" />
    </>,
  ),
  roset: Stroke(
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5a4.5 4.5 0 0 1 0 9 4.5 4.5 0 0 1 0-9Z" />
    </>,
  ),
  wardrobe: Stroke(<path d="M12 3v4m0 0-6 8h12l-6-8Zm-6 8v6h12v-6" />),
  pin: Stroke(
    <>
      <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>,
  ),
  scissors: Stroke(
    <>
      <circle cx="6" cy="6" r="2.5" />
      <circle cx="6" cy="18" r="2.5" />
      <path d="M8 7.5 20 18M8 16.5 20 6" />
    </>,
  ),
  grid: Stroke(<path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />),
  compass: Stroke(
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m15 9-2 5-5 2 2-5z" />
    </>,
  ),
  feed: Stroke(
    <>
      <rect x="3" y="4" width="18" height="7" rx="2" />
      <rect x="3" y="14" width="18" height="6" rx="2" />
    </>,
  ),
  keyboard: Stroke(
    <>
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M8 14h8" />
    </>,
  ),
  studio: Stroke(
    <>
      <path d="M3 20V9l9-5 9 5v11" />
      <path d="M9 20v-6h6v6" />
    </>,
  ),
});

export type IconName = Parameters<typeof Icon>[0]["name"];

/* ── Formato ─────────────────────────────────────────────────────────────────
 * El corpus escribe los miles con punto —11.900, 45.000, 1.099— y aquí se
 * respeta sin depender del locale del navegador que ejecute el gate.          */

export function Miles(value: number): string {
  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function Rosets(value: number): string {
  return `${Miles(value)} rosets`;
}

/* ── El estudio y su plan ─────────────────────────────────────────────────────
 * Decisión 24: tres planes. Decisión 23: la concurrencia va por plan.
 * Glosario: el estudio es el inquilino y los avatares cuelgan de él.           */

export interface Plan {
  nombre: string;
  precio: string;
  rosetsMes: number;
  avatares: number;
  trabajos: number;
}

export const PLANES: Plan[] = [
  { nombre: "Starter", precio: "$25", rosetsMes: 950, avatares: 1, trabajos: 1 },
  { nombre: "Pro", precio: "$299", rosetsMes: 11900, avatares: 6, trabajos: 6 },
  { nombre: "Studio", precio: "$1.099", rosetsMes: 45000, avatares: 12, trabajos: 12 },
];

export const PLAN = PLANES[1] as Plan;

export const SALDO = {
  rosets: 4210,
  gastadoCiclo: 7690,
  limiteCiclo: 14000,
  retenido: 60,
  umbralRecarga: 500,
  importeRecarga: "$50",
  trabajosEnCurso: 3,
};

export const ESTUDIOS = [
  { id: "casa-rosette", nombre: "Casa Rosette", papel: "Propietario" },
  { id: "lumen", nombre: "Estudio Lumen", papel: "Operador" },
];

/* ── Tarifa ───────────────────────────────────────────────────────────────────
 * §10.1, con la enmienda v4 del 02/08. Se declara una vez y todas las pantallas
 * calculan de aquí: un precio escrito dos veces acaba siendo dos precios.      */

export const TARIFA = {
  imagen: 10,
  video: 35,
  voz: 1,
  chat: 1,
  extraccion: 5,
  autogeneracion: 5,
  canon: 1,
  pruebaIdentidad: 10,
  anclasBase: 100,
  anclasDetalle: 150,
  iconoAsset: 10,
  rehacerBase: 20,
  promptCustom: 2,
};

/* ── Avatares ─────────────────────────────────────────────────────────────────
 * Lo que el modelo ya sabe de cada uno y que la ficha puede enseñar sin abrirlo:
 * versión de canon vigente, anclas, techo declarado, activos y cola.           */

export type EstadoAvatar = "borrador" | "completado" | "anclado" | "producible" | "archivado";

export const ESTADO_AVATAR: StatusMap<EstadoAvatar> = {
  borrador: { label: "Borrador", color: "gray", variant: "light", dot: true },
  completado: { label: "Completado", color: "info", variant: "light", dot: true },
  anclado: { label: "Anclado", color: "accent", variant: "light", dot: true },
  producible: { label: "Producible", color: "success", variant: "light", dot: true },
  archivado: { label: "Archivado", color: "gray", variant: "outline", dot: true },
};

export const VISIBILIDAD: StatusMap<"publico" | "privado"> = {
  publico: { label: "Público", color: "accent", variant: "light", dot: true },
  privado: { label: "Privado", color: "gray", variant: "outline", dot: true },
};

/* ── La cuenta del alta ───────────────────────────────────────────────────────
 * Decisión del titular, 06/08/2026: **la construcción del canon solo se cobra
 * cuando la hace el sistema.** Escribirlo a mano es gratis, siempre y entero.
 *
 * Eso cuadra por fin las dos cifras de §10.1 que nunca sumaban: desde texto a
 * mano son 150 + 10 = **160**, y desde fotos 150 + 10 + 5 + 1 = **166**, que es
 * exactamente lo que dice el documento. Antes había que aceptar un 161 que no
 * aparece en ningún sitio.                                                      */

export interface LineaDeAlta {
  concepto: string;
  rosets: number;
  opcional?: boolean | undefined;
}

export function CuentaDeAlta(opciones: {
  techo: string;
  origen: string;
  autogenera: boolean;
}): { lineas: LineaDeAlta[]; total: number } {
  const { techo, origen, autogenera } = opciones;
  const estrecho = techo === "A" || techo === "B";
  const desde_fotos = origen === "fotos";
  const lo_construye_el_sistema = desde_fotos || autogenera;

  const lineas: LineaDeAlta[] = [
    { concepto: desde_fotos ? "Subida de fotos" : "Alta desde texto", rosets: 0 },
    ...(desde_fotos ? [{ concepto: "Extracción", rosets: TARIFA.extraccion }] : []),
    { concepto: "Revisión y edición a mano", rosets: 0 },
    { concepto: "Autogenerar huecos", rosets: TARIFA.autogeneracion, opcional: !autogenera },
    { concepto: "Construcción del canon", rosets: lo_construye_el_sistema ? TARIFA.canon : 0 },
    { concepto: "Base de 2 vistas", rosets: 0 },
    {
      concepto: `Juego de ${estrecho ? "6" : "9"} anclas`,
      rosets: estrecho ? TARIFA.anclasBase : TARIFA.anclasDetalle,
    },
    { concepto: "Prueba de identidad", rosets: TARIFA.pruebaIdentidad },
  ];

  const total = lineas
    .filter((linea) => linea.opcional !== true)
    .reduce((suma, linea) => suma + linea.rosets, 0);

  return { lineas, total };
}

export interface AvatarFicha {
  id: string;
  nombre: string;
  estado: EstadoAvatar;
  canon: number;
  anclas: [number, number];
  techo: "A" | "B" | "C" | "D";
  activos: number;
  cola: number;
  origen: "fotos" | "texto" | "mixto";
  /** Decisión del titular, 06/08/2026: el avatar es público o privado. */
  publico: boolean;
  /** Y si es público, el estudio decide aparte si además se puede clonar. */
  clonable: boolean;
  /** De sus activos, cuántos ha marcado el estudio como públicos. */
  activosPublicos: number;
}

export const AVATARES: AvatarFicha[] = [
  {
    id: "rose",
    nombre: "Rose Aldana",
    estado: "producible",
    canon: 7,
    anclas: [9, 9],
    techo: "D",
    activos: 155,
    cola: 3,
    origen: "mixto",
    publico: true,
    clonable: true,
    activosPublicos: 24,
  },
  {
    id: "vera",
    nombre: "Vera Solís",
    estado: "producible",
    canon: 3,
    anclas: [6, 6],
    techo: "A",
    activos: 41,
    cola: 0,
    origen: "fotos",
    publico: true,
    clonable: false,
    activosPublicos: 9,
  },
  {
    id: "nadia",
    nombre: "Nadia Ortiz",
    estado: "anclado",
    canon: 2,
    anclas: [8, 9],
    techo: "C",
    activos: 0,
    cola: 1,
    origen: "fotos",
    publico: false,
    clonable: false,
    activosPublicos: 0,
  },
  {
    id: "ada",
    nombre: "Ada Winter",
    estado: "completado",
    canon: 1,
    anclas: [0, 6],
    techo: "B",
    activos: 0,
    cola: 0,
    origen: "texto",
    publico: false,
    clonable: false,
    activosPublicos: 0,
  },
  {
    id: "cleo",
    nombre: "Cleo Marchand",
    estado: "borrador",
    canon: 1,
    anclas: [0, 6],
    techo: "A",
    activos: 0,
    cola: 0,
    origen: "texto",
    publico: false,
    clonable: false,
    activosPublicos: 0,
  },
  {
    id: "iris",
    nombre: "Iris Bardem",
    estado: "archivado",
    canon: 4,
    anclas: [6, 6],
    techo: "A",
    activos: 88,
    cola: 0,
    origen: "fotos",
    publico: false,
    clonable: false,
    activosPublicos: 0,
  },
];

export const AVATAR_ACTIVO = AVATARES[0] as AvatarFicha;

/* ── Marcador de posición ─────────────────────────────────────────────────────
 * La maqueta nunca reproduce contenido de la referencia: cada imagen es esta
 * caja, que además dice qué iría dentro.                                       */

export function Placeholder(props: {
  ratio?: number | undefined;
  alto?: number | undefined;
  label?: ReactNode | undefined;
  icon?: IconName | undefined;
  tone?: "base" | "muted" | undefined;
  children?: ReactNode | undefined;
}): ReactElement {
  const { ratio = 3 / 4, alto, label, icon = "image", tone = "base", children } = props;

  const cuerpo = (
    <Box bg={tone === "muted" ? "surface.base" : "surface.sunken"} overflow="hidden" h="100%">
      <Flex direction="column" align="center" justify="center" gap="xs" h="100%">
        <Box c="text.disabled" display="flex">
          <Icon name={icon} size={22} />
        </Box>
        {label === undefined ? null : (
          <Text fz="caption" c="text.muted" ta="center" px="sm">
            {label}
          </Text>
        )}
        {children}
      </Flex>
    </Box>
  );

  if (alto !== undefined) return <Box h={alto}>{cuerpo}</Box>;
  return <AspectRatio ratio={ratio}>{cuerpo}</AspectRatio>;
}

/* ── Columnas ─────────────────────────────────────────────────────────────────
 * HALLAZGO DE CATÁLOGO. `SimpleGrid` publica una var por punto de ruptura y las
 * vars CSS **se heredan**, así que una rejilla anidada que no declare `laptop`
 * toma el `laptop` de su abuela. `fallbackVar` no protege: solo cae cuando la
 * var está SIN DEFINIR, y por herencia está definida.
 *
 * Hasta que se corrija en la librería, aquí ninguna rejilla declara un punto de
 * ruptura a medias: `Cols` rellena los cinco a partir de los que se den.       */

export function Cols(spec: {
  base: number;
  phone?: number | undefined;
  tablet?: number | undefined;
  laptop?: number | undefined;
  desktop?: number | undefined;
  wide?: number | undefined;
}): { base: number; phone: number; tablet: number; laptop: number; desktop: number; wide: number } {
  const phone = spec.phone ?? spec.base;
  const tablet = spec.tablet ?? phone;
  const laptop = spec.laptop ?? tablet;
  const desktop = spec.desktop ?? laptop;
  return { base: spec.base, phone, tablet, laptop, desktop, wide: spec.wide ?? desktop };
}

/* ── Rótulo de sección ────────────────────────────────────────────────────── */

export function Rotulo(props: { children: ReactNode; mt?: "md" | "lg" | undefined }): ReactElement {
  const { children, mt } = props;
  return (
    <Text
      component="h3"
      fz="caption"
      fw="semibold"
      tt="uppercase"
      ls="wide"
      c="text.muted"
      mt={mt}
      mb="xs"
    >
      {children}
    </Text>
  );
}

/* ── El carril ────────────────────────────────────────────────────────────────
 * Bajo tablet el propio Sidebar SE CONVIERTE en la barra inferior fija: la
 * cabecera queda anclada a la izquierda, el pie a la derecha, y el cuerpo es el
 * carrusel horizontal de en medio. Por eso el conmutador de estudio vive en la
 * cabecera —lo que nunca cambia de sitio— y el saldo en el pie.                */

/* El carril, decidido por el titular el 06/08/2026 y afinado el mismo día.
 * Dos grupos y cinco entradas, y los grupos dicen de qué va el producto:
 * **Rosette se consume, el estudio produce**.
 *
 *   Rosette   Explorar (/) · Feed
 *   Studio    Avatares · Saldo y gasto · Usuarios
 *
 * **La raíz es Explorar, no un panel del estudio.** Se retiró Home: en un
 * producto que también se consume, la puerta es el catálogo. Lo que Home
 * cargaba —«lo que te espera»— se muda al sitio donde se actúa sobre ello, que
 * es `Avatares`, con su cuenta en el propio carril para que se vea también
 * desde el lado público.
 *
 * Lo que no es entrada de carril cuelga de la sección a la que pertenece, y por
 * eso `activa` admite una sección aunque la pantalla sea una subruta: el alta,
 * el taller y la revisión iluminan `Avatares`. */

export type SeccionCarril = "explorar" | "feed" | "avatares" | "saldo" | "usuarios";

/** Candidatas sin revisar en todo el estudio. Es lo único de Home que no podía
 *  perderse, así que viaja en el carril y se ve desde cualquier pantalla. */
export const SIN_REVISAR = 14;

const ESTUDIO_ACCIONES: MenuItemData[] = [
  { key: "casa-rosette", label: "Casa Rosette", description: "Propietario · plan Pro" },
  { key: "lumen", label: "Estudio Lumen", description: "Operador · plan Starter" },
  { key: "ajustes", label: "Ajustes del estudio", description: "techo, banco de acciones y auditoría" },
  { key: "polaris", label: "Ir a Polaris", description: "El tablero de todos los productos" },
];

function ConmutadorDeEstudio(): ReactElement {
  return (
    <Menu
      items={ESTUDIO_ACCIONES}
      aria-label="Cambiar de estudio"
      trigger={
        <UnstyledButton
          w="100%"
          miw={0}
          aria-label={`Estudio activo: ${ESTUDIOS[0]?.nombre ?? ""}. Cambiar de estudio`}
        >
          <Flex align="center" gap="sm" miw={0} w="100%">
            <Box c="primary.600" display="flex">
              <Icon name="studio" size={24} />
            </Box>
            <AppShell.Label flex>
              <Flex direction="column" miw={0} align="flex-start">
                <Text fz="body3" fw="bold" lh="tight" truncate>
                  <GradientText>{ESTUDIOS[0]?.nombre}</GradientText>
                </Text>
                <Text fz="caption" c="text.muted" lh="tight" truncate>
                  Estudio · plan {PLAN.nombre}
                </Text>
              </Flex>
            </AppShell.Label>
            <AppShell.Label>
              <Box c="text.muted" display="flex">
                <Icon name="chevron-down" size={14} />
              </Box>
            </AppShell.Label>
          </Flex>
        </UnstyledButton>
      }
    />
  );
}

interface Enlace {
  key: SeccionCarril;
  label: string;
  icon: IconName;
  cuenta?: number | undefined;
}

const GRUPOS: { title: string; links: Enlace[] }[] = [
  {
    title: "Rosette",
    links: [
      { key: "explorar", label: "Explorar", icon: "compass" },
      { key: "feed", label: "Feed", icon: "feed" },
    ],
  },
  {
    title: "Studio",
    links: [
      { key: "avatares", label: "Avatares", icon: "users", cuenta: SIN_REVISAR },
      { key: "saldo", label: "Saldo y gasto", icon: "roset" },
      { key: "usuarios", label: "Usuarios", icon: "user" },
    ],
  },
];

/* HALLAZGO DE CATÁLOGO, y este es de a11y.
 *
 * Con el carril encogido **y por debajo de `laptop`** —que es donde vive la
 * barra inferior del móvil— `AppShell` pone `display: none` al **cuerpo entero**
 * del `NavLink`, no solo al rótulo. Como `leftSection` va `aria-hidden`, el
 * `<a>` se queda **sin nombre accesible**: `link-name`, serio, en cada enlace
 * del carril. Y no se arregla desde fuera: `NavLink` descarta las props que no
 * conoce, así que un `aria-label` no llega.
 *
 * El único hueco que sobrevive es `rightSection`, que no está pensado para esto.
 * Se usa para colgar un `VisuallyHidden` **solo cuando toca encoger**, así que
 * no se duplica el nombre al expandir. La corrección de verdad va en la
 * librería y necesita ADR: aquí solo queda anotada. */

export function Nombre(texto: string, compacto: boolean): ReactNode {
  return compacto ? <VisuallyHidden>{texto}</VisuallyHidden> : undefined;
}

/* La cuenta de pendientes va en el `leftSection` como `Indicator`, que es
 * decorativo —`NavLink` lo marca `aria-hidden`—, y **también dentro del nombre
 * accesible**: un punto rojo que un lector de pantalla no puede leer no es una
 * notificación, es un adorno. Por eso el nombre dice «Avatares, 14 sin
 * revisar» en las dos anchuras. */

function EnlaceDeCarril(props: { link: Enlace; active: boolean; compacto: boolean }): ReactElement {
  const { link, active, compacto } = props;
  const nombre =
    link.cuenta === undefined
      ? link.label
      : `${link.label}, ${String(link.cuenta)} sin revisar`;

  return (
    <AppShell.Link
      href={`#${link.key}`}
      active={active}
      label={<AppShell.Label>{link.label}</AppShell.Label>}
      rightSection={
        compacto ? (
          <VisuallyHidden>{nombre}</VisuallyHidden>
        ) : link.cuenta === undefined ? undefined : (
          <Badge size="xs" variant="light" color="accent">
            {link.cuenta}
          </Badge>
        )
      }
      leftSection={
        link.cuenta === undefined ? (
          <Icon name={link.icon} />
        ) : (
          <Indicator count={link.cuenta} size="sm" color="accent" offset={4}>
            <Icon name={link.icon} />
          </Indicator>
        )
      }
    />
  );
}

export function Carril(props: {
  active: SeccionCarril | "ninguna";
  collapsed?: boolean | undefined;
}): ReactElement {
  const { active, collapsed = false } = props;
  const estrecho = useBreakpointDown("laptop");
  const compacto = collapsed || estrecho;

  return (
    <AppShell.Sidebar.Body>
      {GRUPOS.map((grupo) => (
        <AppShell.Links key={grupo.title} title={grupo.title}>
          {grupo.links.map((link) => (
            <EnlaceDeCarril
              key={link.key}
              link={link}
              active={active === link.key}
              compacto={compacto}
            />
          ))}
        </AppShell.Links>
      ))}
    </AppShell.Sidebar.Body>
  );
}

export function PieDeCarril(): ReactElement {
  return (
    <AppShell.Sidebar.Footer>
      <Box c="primary.600" display="flex">
        <Icon name="roset" size={20} />
      </Box>
      <AppShell.Label flex>
        <Flex direction="column" miw={0}>
          <Text fz="caption" fw="semibold" truncate>
            {Rosets(SALDO.rosets)}
          </Text>
          <Text fz="caption" c="text.muted" truncate>
            {SALDO.trabajosEnCurso} de {PLAN.trabajos} trabajos
          </Text>
        </Flex>
      </AppShell.Label>
      <ActionIcon variant="ghost" size="sm" aria-label="Perfil y sesión">
        <Icon name="user" />
      </ActionIcon>
    </AppShell.Sidebar.Footer>
  );
}

/* ── El armazón ─────────────────────────────────────────────────────────────── */

export function Shell(props: {
  active: SeccionCarril | "ninguna";
  title: string;
  children: ReactNode;
}): ReactElement {
  const { active, title, children } = props;
  const scroller = useRef<HTMLElement | null>(null);
  const [mini, set_mini] = useState(false);

  return (
    <AppShell
      mainRef={scroller}
      scrollShadowOffset={116}
      sidebarCollapsed={mini}
      backdrop={<StarField fixed parallax aurora density="sm" scroller={scroller} />}
      sidebar={
        <AppShell.Sidebar aria-label="Navegación principal" collapsed={mini} onCollapse={set_mini}>
          <AppShell.Sidebar.Header>
            <ConmutadorDeEstudio />
          </AppShell.Sidebar.Header>
          <Carril active={active} collapsed={mini} />
          <PieDeCarril />
        </AppShell.Sidebar>
      }
    >
      <VisuallyHidden>
        <h1>{title}</h1>
      </VisuallyHidden>
      {children}
    </AppShell>
  );
}

/* ── Escenario ────────────────────────────────────────────────────────────── */

export function Escena(props: { children: ReactNode }): ReactElement {
  return (
    <ProductStage name="rosette" global="dark">
      {props.children}
    </ProductStage>
  );
}

/* ── Aviso de gasto ───────────────────────────────────────────────────────────
 * Decisión 10: el usuario ve lo que va a gastar ANTES de confirmar. No es una
 * preferencia de diseño, es la decisión, así que vive en un solo sitio.        */

export function AvisoDeGasto(props: {
  coste: number;
  detalle: ReactNode;
  saldo?: number | undefined;
}): ReactElement {
  const { coste, detalle, saldo = SALDO.rosets } = props;
  return (
    <Box>
      <Divider my="sm" />
      <Flex align="center" justify="space-between" gap="sm" wrap="wrap">
        <Flex direction="column" miw={0}>
          <Text fz="caption" c="text.muted">
            Coste de este trabajo
          </Text>
          <Text fz="caption" c="text.muted">
            {detalle}
          </Text>
        </Flex>
        <Badge variant="light" size="lg">
          {Rosets(coste)}
        </Badge>
      </Flex>
      <Text fz="caption" c="text.muted" mt="xxs">
        Te quedan {Rosets(saldo)}. Después de este trabajo: {Rosets(saldo - coste)}.
      </Text>
    </Box>
  );
}

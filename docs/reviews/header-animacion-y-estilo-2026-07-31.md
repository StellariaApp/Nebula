# Animación y estilo del header — qué falta para Stellaria y Rosette

> 2026-07-31. Complemento de [ADR-062](../adr/ADR-062-header-de-pantalla-en-web.md), levantado sobre
> `Rosettee/src/components/site-header.tsx` y `Rosettee/src/app/globals.css` L2276-2425, y sobre
> `Stellaria-Frontend/src/ui/native/.../Layout/Header`.
>
> Era la medición previa a decidir si ADR-062 se enmendaba. **Se enmendó el mismo día**: el estado
> flotante entra como prop de `Header`. Ver §5 para lo entregado y §3 para la corrección que salió
> al implementarlo.

## 0. Lo primero: son dos componentes, no uno

|           | **Header de pantalla** (ADR-062, entregado)              | **Site header de Rosettee**                     |
| --------- | -------------------------------------------------------- | ----------------------------------------------- |
| Qué es    | Cabecera _dentro_ de una app: vuelta + título + acciones | Barra de navegación de una landing              |
| Jerarquía | Es el `h1` de la pantalla                                | No hay `h1`; hay marca y enlaces                |
| Contenido | `title`, `subtitle`, `leftSection`, `rightSection`       | logo, nav con sección activa, píldora de estado |
| Posición  | Contenido del slot `header` de `AppShell`                | `position: fixed` flotante sobre el documento   |
| Estado    | Ninguno                                                  | Dos: reposo y `is-scrolled`                     |

Meterlos en un solo componente daría un contrato con dos mitades excluyentes — exactamente el error
que `04-migration-map.md` L51 mandó deshacer en el `Header` de Stellaria. **Lo que sí comparten es
la capa de abajo**, y de eso va este documento.

## 1. Descomposición del header de Rosettee sobre el catálogo actual

| Pieza de Rosettee                             | Cubierto hoy por                                                                                             | Estado                                                      |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------- |
| Marca / logo a la izquierda                   | `Header.leftSection` (o `AppShell.header`)                                                                   | ✅                                                          |
| Píldora de estado a la derecha                | `Header.rightSection` + `Badge`/`Indicator`                                                                  | ✅                                                          |
| Enlace de vuelta con flecha                   | `Header withBack`                                                                                            | ✅                                                          |
| `.site-header__nav-divider`                   | `Divider orientation="vertical"`                                                                             | ✅                                                          |
| Paleta rosa (`#f43f5e` → `#fb7185`)           | tema `rosette` en `playground-web/src/fixtures/themes.tsx` L27 — `palettes.rose` + `effects.gradients.brand` | ⚠️ existe, con matiz — ver §1.1                             |
| Cristal al hacer scroll                       | `GlassSurface` + `effects.glass`                                                                             | ✅ el componente **nombra "top bars"** como su sitio propio |
| Indicador deslizante de sección activa        | `useSegmentIndicator`                                                                                        | ✅ ver §2                                                   |
| Detección de `scrollY > 24`                   | —                                                                                                            | ❌ ver §4                                                   |
| Sección activa por posición de scroll         | —                                                                                                            | ❌ ver §4                                                   |
| Geometría flotante (pastilla al hacer scroll) | —                                                                                                            | ❌ ver §3                                                   |

**Siete de diez ya están**, y la identidad de Rosette **ya es un tema de Nebula**, no un fork.

### 1.1 El matiz del color, medido

El tema `rosette` no reproduce los hex de Rosettee al pie de la letra, y conviene saberlo antes de
comparar capturas:

|                    | Rosettee                         | `rosette` en Nebula                                                   |
| ------------------ | -------------------------------- | --------------------------------------------------------------------- |
| Rosa principal     | `#f43f5e` (rose-500 de Tailwind) | `palettes.rose[500]` = **`#ec3674`**                                  |
| Rosa claro         | `#fb7185`                        | `palettes.rose[400]` = **`#fd6c93`**                                  |
| Gradiente de marca | `#f43f5e → #fb7185`              | **exacto**: la fixture pinea los dos hex en `effects.gradients.brand` |

Las paletas de Nebula son **generadas** (`pnpm gen:palette`), no las de Tailwind: mismo tono
percibido, coordenadas distintas. El gradiente sí es idéntico porque está escrito a mano en la
fixture.

Consecuencia práctica: si Rosette quiere sus hex exactos, la vía es una semilla propia
(`pnpm gen:palette from "#f43f5e" --name rose-rosette`), no editar `palettes.ts`, que es archivo
generado.

## 2. El indicador deslizante ya está escrito, y es mejor

`useSegmentIndicator` (`components/Segment/use-segment-indicator.ts`) hace exactamente lo que hace
Rosettee a mano, punto por punto:

|                | Rosettee (`site-header.tsx`)                                       | `useSegmentIndicator`                                                |
| -------------- | ------------------------------------------------------------------ | -------------------------------------------------------------------- |
| Medida         | `offsetLeft` / `offsetWidth` en `useLayoutEffect`                  | `getBoundingClientRect` relativo al contenedor                       |
| Animación      | `transition: transform .48s cubic-bezier(.22,1,.36,1), width .38s` | `useSpring` con `theme.motion.spring.default`                        |
| Re-medida      | `window.addEventListener("resize")`                                | **`ResizeObserver`** sobre el contenedor                             |
| Reduced-motion | no lo contempla                                                    | `useReducedMotion()` **y** `theme.motion.tier` → `jump()` sin animar |
| Gesto          | no                                                                 | pan con rubber-banding y flick                                       |

Es estrictamente más capaz, y su curva sale del tema en vez de estar horneada. **El nav de Rosettee
es un `Segment`/`Tabs` con estética propia**, no un componente nuevo.

Lo único que le falta: `Segment` gobierna su índice activo por selección del usuario, y aquí el
índice lo dicta el scroll. Eso es un `activeIndex` controlado desde fuera — que `Segment` ya acepta.

## 3. El conflicto real: la geometría flotante

Es el único punto donde Rosettee choca con una regla escrita de Nebula. `.site-header` transiciona
**cinco propiedades de layout**:

```css
transition:
  top 0.35s,
  width 0.35s,
  height 0.35s,
  padding 0.35s,
  border-radius 0.35s,
  background 0.35s,
  box-shadow 0.35s;
```

`docs/03` §2 y el checklist de la plantilla dicen: **solo `transform` y `opacity`**; color y sombra
por CSS con tokens.

Traducción propiedad a propiedad:

| Rosettee                                 | Equivalente sin reflow                                                       | Fidelidad                |
| ---------------------------------------- | ---------------------------------------------------------------------------- | ------------------------ |
| `top: 0 → 12px`                          | `translateY(12px)`                                                           | **exacta**               |
| `background`, `box-shadow`, `border`     | transición de color por tokens — ya permitida                                | **exacta**               |
| `backdrop-filter` aparece                | `opacity` de la capa de cristal                                              | **exacta**               |
| `border-radius: 0 → 18px`                | se fija de golpe **bajo** la capa que entra por opacidad: nadie lo ve saltar | **exacta en percepción** |
| `height: auto → 64px`                    | innecesario: la fila puede tener `min-height` fijo siempre                   | **exacta**               |
| `width: 100% → min(100% - 24px, 1180px)` | **no tiene equivalente en `transform`**                                      | ⚠️                       |

Queda una sola propiedad problemática, y tiene salida: **animarla sobre un elemento fuera de flujo**.
Al estar fuera de flujo, cambiar su geometría **no reflowea el documento**: no hay texto que
recomponer ni hermanos que recolocar; se recompone su propio subárbol y nada más.

> **Nota tras implementarlo (misma fecha).** Esta sección proponía meter el cristal en una capa
> `position: absolute` detrás del contenido. Al construirlo se vio que sobra: **el header flotante
> ya es `position: fixed`**, o sea que la raíz entera está fuera del flujo. No hace falta una capa
> aparte — el argumento vale igual y con una caja menos. Es la decisión 12 de la enmienda a ADR-062.

O sea: la pastilla flotante **se puede hacer respetando el presupuesto**. La condición que lo hace
legítimo es que el elemento esté fuera del flujo, no que el cristal sea una capa.

Aviso del propio `GlassSurface`: _«no se anida: dos capas de `backdrop-filter` encadenadas cuestan un
repintado por scroll»_. Un header de cristal sobre una página con cristal es exactamente ese caso.

## 4. Lo que no existe en ningún sitio: dos hooks

Ambos son de `@stellaria/nebula-hooks`, ninguno toca el DOM de un componente y ninguno trae
dependencias:

1. **`useScrolled(threshold)`** — booleano de «se ha bajado más de N píxeles», con listener
   `{ passive: true }` y throttle por `requestAnimationFrame`. Es lo que Rosettee escribe en
   `site-header.tsx` L38-68. **~25 líneas.**
2. **`useScrollSpy(ids, offset)`** — devuelve el id de la sección visible según un marcador
   (`scrollY + innerHeight * 0.34` en Rosettee). Alimenta el `activeIndex` de `Segment`. **~30
   líneas.** El equivalente moderno con `IntersectionObserver` es más barato y no depende de un
   marcador mágico.

Los dos son genéricos, útiles fuera de un header, y ninguno obliga a tocar `Header`.

## 5. Resolución (2026-07-31)

La pregunta era si el estado flotante entraba en `Header` como prop o quedaba como composición del
consumidor. **El propietario eligió prop.** Ejecutado el mismo día:

| #   | Qué                                                 | Estado                                                                           |
| --- | --------------------------------------------------- | -------------------------------------------------------------------------------- |
| 1   | `useScrolled` en `@stellaria/nebula-hooks`          | ✅ entregado · 6 tests · `enabled: false` no suscribe                            |
| 2   | Estado flotante de `Header` como prop               | ✅ entregado · enmienda 1 de ADR-062 (sustituye a la decisión 6) · 9 tests       |
| 3   | Nav con sección activa (`Segment` + `useScrollSpy`) | ⏸️ **no entra**: no es de `Header`, y `useScrollSpy` se escribirá cuando se pida |

**API resultante**: `floating`, `scrolled` (controlado), `scrollThreshold` (24), `floatingWidth`
(1180) y `floatingGap` (12). Todo apagado por defecto: sin `floating`, `Header` es exactamente el
contenido de slot de la decisión 2 y no paga ni un listener de scroll.

**Coste medido**: **32,01 kB** contra la banda de 34 kB — el estado flotante costó **0,6 kB**. El
material sale de `vars.glass.default`, `vars.radius.lg`, `vars.shadow.lg` y `vars.zIndex.sticky`; la
geometría variable viaja por CSS vars locales.

**Gates**: 29/29 tareas · **1065** tests web · **34** en hooks · size 0 excedidas · axe **82 suites /
556 tests, 0 violaciones**.

Lo que **no** hizo falta y sigue sin hacer falta: color de marca (el tema `rosette` ya está), el
cristal (`GlassSurface`), el indicador deslizante (`useSegmentIndicator`) ni un componente nuevo de
navbar.

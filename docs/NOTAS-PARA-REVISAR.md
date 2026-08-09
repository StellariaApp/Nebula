# Notas para revisar

Estado del trabajo en curso mientras el propietario está ausente. Lo actualiza el job de
continuación cada tanda. **Lo de arriba es lo que necesita tu decisión; lo de abajo es el diario.**

---

## 1. Decisiones que necesitan tu decisión

### D-1 · Los cuatro de lista corta conservan `radius` con una deuda abierta

`Avatar`, `Badge`, `Modal` y `Popover` se quedaron fuera de ADR-119 por decisión tuya: su `radius`
no es duplicación, es una lista corta deliberada (`"sm" | "md" | "full"` y similares).

**El problema**: los cuatro extienden `StyleProps`, así que hoy se puede escribir `<Badge r="xxl">` y
gana. La lista corta no restringe nada.

Cerrarlo exige una de dos, y las dos son cambio de API:

- Capar `r` en esos cuatro (`Omit<StyleProps, "r">`), que es lo contrario de lo que decidiste para
  los otros once.
- Una regla de lint que prohíba `r` en esos cuatro componentes.

**Recomendación**: la regla de lint. Deja el principio intacto —el primitivo manda— y cierra el
agujero donde hay un motivo de diseño para cerrarlo.

### D-2 · Tres componentes que parecían duplicación y no lo son

Al inspeccionar a qué elemento apunta cada `radius` aparecieron tres que **no** son duplicación, y
por eso no se migraron. Conviene que lo confirmes, porque rompe la simetría de ADR-119:

| componente     | a qué apunta su `radius`                                     |
| -------------- | ------------------------------------------------------------ |
| `Image`        | una var compartida por el `<span>` raíz y por `styles.background`, que usa otro componente |
| `ImageGallery` | el radio de **cada baldosa**, no el del contenedor            |
| `Skeleton`     | el radio de **cada línea**, y se cruza con `circle`           |

En los tres, `r` redondearía la raíz y dejaría el elemento interior cuadrado. Migrarlos no es un
renombre: es cambiar qué se redondea.

### D-3 · El fondo del sitio ya no se ve a través del cristal

Con el velo cerrado en 0.78–0.90 (ADR-118), `Section glass` pasó de dejar ver el `StarField` a
difuminarlo. La portada alterna `glass` sección sí, sección no, y esa alternancia se diseñó cuando
la banda era del 2 %. **Puede que ahora sobre.** Es criterio visual, no técnico: míralo en la
portada y dime si se queda, se reduce o se quita.

---

## 2. Lo que está cerrado y commiteado

| commit    | qué                                                                      |
| --------- | ------------------------------------------------------------------------ |
| `7e658da` | ADR-118 — el cristal recupera su filo y el velo se vuelve opaco           |
| `7334fbf` | `Hero` leía el color del texto del objeto del tema y no del contrato      |
| `6b9acab` | `pnpm dev` levanta la cadena entera en watch                              |
| `54d96d4` | Conmutador de tema flotante y el skip link deja de estar en español       |

---

## 3. Lo que queda, en orden

1. **ADR-119 — terminar y commitear.** Los once componentes de duplicación ya no tienen `radius`;
   quedan los gates completos y el commit. Los ~190 sitios de llamada de stories, demos y sitio ya
   están migrados a `r`.
2. **Bloqueante de la cabecera en móvil.** Por debajo de 768 px `Nav.Links` y `Nav.Actions` se
   ocultan por su `collapse` por defecto, y la portada no monta `Burger` ni `Nav.Sidebar`: se pierden
   los cuatro enlaces **y el CTA**, y la única navegación queda al final de ~2.400 px de scroll. La
   demo del playground ya lo resuelve (`Landing.stories.tsx`), hay que copiar ese montaje.
3. **Bloqueante de lector de pantalla en `ProductSwitch`.** `Stat` con `diff`+`trend` y sin
   `diffLabel` mete un `VisuallyHidden` con «al alza»/«a la baja» en español, y ese demo se pinta en
   la portada en inglés. Hay el mismo patrón latente en `Charts/TrendIndicator`.
4. **`Segment` en el selector de producto de `ProductSwitch`** — lo pediste y quedó sin hacer. Ojo:
   si `SegmentContent` monta los seis paneles a la vez son seis `NebulaProvider`; probablemente haya
   que usar solo `SegmentControl`.
5. **Portada, hallazgos de la auditoría todavía sin tocar**: las cinco secciones son `size="xl"` y
   los cinco títulos miden 24 px, así que no hay jerarquía; `spacing` está muerto en las tres
   `SimpleGrid` porque `gap` gana; los cuatro `Stat` van sin `diff`/`trend` mientras el snippet de al
   lado los anuncia; `Footer.Brand` recibe el tagline como children en vez de por `description`; hay
   copy fuera del diccionario en el TSX.
6. **DS2.3 — las guías bajo `/docs`.** La de instalación tiene que enseñar juntas las tres piezas del
   anti-flash (ADR-117), más las dos obligaciones del consumidor: carga de fuente (ADR-031) y nada de
   `transform`/`filter`/`contain` en un ancestro (ADR-030).
7. **Traducir a inglés los ~70 contratos con JSDoc** (ADR-114), por lotes.

---

## 4. Cosas que descubrí y conviene que sepas

- **`pnpm dev` y los gates son mutuamente excluyentes.** El watch reescribe `dist` sin parar y
  `size-limit`, `tsc` y el build de una pasada leen ese mismo `dist`. Con dev vivo salen fallos
  fantasma: `TS5033` al escribir los `.d.ts.map`, `Could not resolve .../packages/web/undefined` en
  size-limit, y presupuestos apuntando a archivos que aparentan no existir. Va anotado en el commit
  `6b9acab`; falta llevarlo a la guía de contribución.
- **`r` con un número no escribe `style.borderRadius`.** Emite la custom property `--nb-r` y una
  clase que la lee. Cualquier test que assertara `style.borderRadius` con `radius={n}` hay que
  reescribirlo, no es un renombre.
- **`Paper` tenía un defecto**: con `radius` numérico el recipe caía a la clase `"md"` —no a su
  defecto `"lg"`— y luego la pisaba el estilo inline. Emitía una clase muerta. Desaparece con
  ADR-119.
- **No hay `.github/workflows`.** Los ocho gates existen y pasan, pero **nadie los corre salvo a
  mano**. Es el hueco más grande de cara a W5.

---

## 5. Tuyo y sin tocar

Estos archivos llevan cambios tuyos en curso y los he dejado fuera de mis commits:

- `packages/web/src/components/Footer/Footer.tsx` — `glass = true` por defecto. **Es un cambio de
  defecto de API pública: si se queda, quiere ADR.**
- `packages/web/src/components/Hero/Hero.css.ts` — `gap: sm → md` en el header.
- `packages/web/src/components/Button/Button.css.ts` — los tres `fontSize` de tamaño.

`Nav.tsx` y `apps/docs/src/app/[lang]/page.tsx` sí entraron en mis commits porque tenía que tocarlos;
llevan dentro tu `glass.strong`, el `momentum`, el `GlassSurface` y el `r="inherit"`.

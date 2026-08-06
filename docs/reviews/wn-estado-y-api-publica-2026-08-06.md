# WN · Estado de la fase y revisión de la API pública antes de W5

Revisión pedida como último paso antes de publicar. Tres partes: **dónde está WN de verdad**, **qué
se rompió sin que nadie lo viera**, y **qué le falta a la API pública** para que un consumidor pueda
construir con Nebula lo que hoy construye a mano en `fonicredito-app`.

Todos los números están medidos sobre el repo el 2026-08-06, no estimados.

---

## 0 · Un gate llevaba roto desde ADR-102 — corregido en esta revisión

`packages/themes/src/schema.ts:127` seguía exigiendo `border` dentro de `glassSurfaceRecipe`.
ADR-102 se lo quitó al contrato (`GlassSurfaceRecipe` en `packages/tokens/src/theme/theme.ts:84`) y a
los cuatro temas, pero no al esquema de Zod que los valida.

Consecuencia medida, no supuesta:

```
light       -> THROWS: ThemeValidationError → at effects.glass.surface.band.border
dark        -> THROWS  (idem, 5 niveles)
sober-light -> THROWS
playful     -> THROWS
```

**`LoadTheme` rechazaba los cuatro temas oficiales.** Con él, el Theme Creator, cualquier tema en
JSON de un consumidor y `check:contrast --theme x.json`. Además dejaba en rojo
`@stellaria/nebula-themes#typecheck` (`schema.test-d.ts:11`) y 5 tests de 27 del paquete.

Por qué nadie lo vio: el commit de ADR-102 tocó tokens y temas pero no el esquema, y el gate se
ejecutó con `| tail`, que devuelve el código de salida de `tail`, no el de `turbo`.

Corregido quitando `border` del esquema. Tras el arreglo: `pnpm turbo typecheck test` → **18/18
tareas, 1188 tests en verde**.

> Nota de método: `pnpm turbo ... | tail -N` **enmascara el fallo**. Conviene `set -o pipefail` o
> mirar el código de salida explícitamente en la checklist de gates.

---

## 1 · Estado real de los cinco tramos

| Tramo                    | Estado | Medido                                                                                                                |
| ------------------------ | ------ | --------------------------------------------------------------------------------------------------------------------- |
| **N0** nombres en hojas  | ✅     | ADR-094, commit `7d03b27`. Lint partido por archivo.                                                                    |
| **N1** vars en su hoja   | ✅\*   | 75 `.vars.css.ts`. Queda **1** `createVar()` en un `.css.ts`: `Scroll`.                                                  |
| **N2** compound          | ✅\*   | 9/9 en un solo idioma (`Object.assign` en `index.ts`). 6 con `components/`. Barrido hecho: faltan convertir Hero y Section. |
| **N3** props de ranura   | 🟡     | **8 de 158** (`Alert`, `Blockquote`, `EditorImage`, `EmptyModule`, `EmptyState`, `Feature`, `Header`, `Stat`).           |
| **N4** `hoverActive`     | ✅     | Cerrado, regla corregida y más estrecha que la del prompt.                                                              |
| **N5** cuaderno          | 🟡     | H1–H8 abiertos.                                                                                                         |

### Los tres cabos sueltos de N1 y N2

- **`Scroll.css.ts:18-21`** declara `block_start`, `block_end`, `inline_start`, `inline_end` con
  `createVar()`. No están exportadas, así que ningún consumidor las alcanza y no son API pública. La
  letra de N1 dice "todo componente con vars locales expone `<Nombre>.vars.css.ts`"; el espíritu
  —que otro módulo pueda tomar la var sin arrastrar la hoja— no aplica a una var privada. **Decidir
  si se mueven o si la regla se escribe con la excepción**, porque hoy `Scroll` lee como incumplimiento.
- **`Card/index.ts:10` y `Segment/index.ts:6,7,9`** no llevan `/* @__PURE__ */`. Los otros siete
  compounds sí. Sin la anotación, el `Object.assign` no se elimina aunque el compound no se use.
- **`Omit<StyleProps, "color" | "header">`** en `AppShell.types.ts:13` y `:48`: `"header"` no es
  clave de `StyleProps`, así que esa parte del `Omit` no hace nada. `Omit` acepta claves inexistentes
  sin quejarse, por eso pasó el typecheck.

---

## 2 · `Box.tsx` — el cambio sin commitear

```diff
-  const { component, className, ...style_and_rest } = props;
-  const { className: sprinkle_class, style, rest } = ExtractStyleProps(style_and_rest);
+  const { component, className, ...rest_props } = props;
+  const { className: classes, style, rest } = ExtractStyleProps(rest_props);
```

Cambio de nombres, sin efecto en el bundle. Dos lecturas distintas:

- **`style_and_rest` → `rest_props`**: mejor. El nombre viejo describía el contenido en el momento de
  la desestructuración; el nuevo describe su papel, y es el que se lee igual en los otros 157.
- **`sprinkle_class` → `classes`**: **peor, y merece volver atrás**. La variable contiene
  exactamente una cosa —la clase que emitió `sprinkles`— y en la línea siguiente se compone con
  `className`. `classes` junto a `className` obliga a mirar tres líneas arriba para saber cuál es
  cuál; `sprinkle_class` lo decía solo. Con ADR-019 §2 (sin comentarios) el nombre carga toda la
  explicación, y aquí se pierde. `sprinkle_class` o `sprinkles_class`.

Ninguno de los dos toca comportamiento. El resto de `Box` está bien: `className` del consumidor va
último en `cx`, así que suma en vez de borrar, y `style` solo se pasa si existe.

---

## 3 · `style-props.ts` — la revisión de fondo

Hoy `StyleProps` expone **109 props**: 94 de sprinkles (50 propiedades + 44 atajos), 10 de dimensión
y 5 sin unidad.

### 3.1 · Redundancia: 40 alias largos que nadie debería escribir

`StyleProps = Omit<Sprinkles, ColorProp> & …`, y `Sprinkles` incluye **las propiedades y sus atajos**.
Por eso `<Box paddingInlineStart="md" />` y `<Box ps="md" />` son las dos válidas, igual que
`background`/`bg`, `color`/`c`, `borderColor`/`bdc`, `boxShadow`/`shadow`, `zIndex`/`z`,
`fontWeight`/`fw`…

Recuento exacto de largos con atajo **1:1**:

| Familia                       | Largos | Atajo                                        |
| ----------------------------- | -----: | -------------------------------------------- |
| padding                       |      9 | `p px py pt pb pl pr ps pe`                  |
| margin                        |      9 | `m mx my mt mb ml mr ms me`                  |
| `columnGap` `rowGap`          |      2 | `gapx gapy`                                  |
| flex + texto responsive       |      7 | `direction wrap align justify self ta fz`    |
| color / fondo / borde         |      3 | `c bg bdc`                                   |
| tipografía sin responsive     |      6 | `ff fw lh ls tt td` (+ `ws`)                 |
| `borderRadius`                |      1 | `r`                                          |
| `boxShadow` `zIndex`          |      2 | `shadow z`                                   |
| **Total**                     | **40** |                                              |

Y no toda la duplicación es simétrica. **Las cuatro esquinas** (`borderTopLeftRadius`…) no tienen
atajo 1:1: `rt`/`rb`/`rl`/`rr` van por pares. Si se quitan los largos, **se pierde poder redondear una
sola esquina**. Hay que darles atajo propio (`rtl` `rtr` `rbl` `rbr`) o dejar los cuatro largos.

Sin atajo, y por tanto intocables: `display`, `gap`, `position`, `overflow`, `overflowX`, `overflowY`.

**Lo que la redundancia cuesta hoy, medido:**

- **104 de 158 componentes escriben `Omit<StyleProps, "color">`.** Es la línea más repetida del
  catálogo, y existe solo porque el alias largo `color` choca con la prop de variante `color`
  (`ActionIcon color="gray"`). Quitando el alias, la línea desaparece de los 104.
- `background` choca dos veces con una ranura real de `ReactNode`: `MainProps.background`
  (`Main.types.ts:11`) y `AppShellRailProps`. Los dos tienen que omitirla a mano.
- El `.d.ts` publicado carga 40 nombres que no queremos que nadie escriba.

**Recomendación**: `StyleProps` deja de derivarse de `Sprinkles` por `Omit` y se construye desde una
lista explícita de props públicas. Las propiedades largas siguen definidas dentro de `Box.css.ts`
—los atajos las necesitan para mapear—, pero no salen al tipo público. Es *breaking*, así que **tiene
que entrar antes de v1** y pide ADR.

### 3.2 · Valores arbitrarios: hoy no es que no compile, es que **revienta**

Ni los colores admiten `#hex`/`rgb()`, ni el espaciado admite números o `px`. Y no falla suave: en
`ExtractStyleProps` (`style-props.ts:114`) la decisión de mandar a sprinkles se toma **por clave**,
nunca por valor. Con `bg="#3F37C9"`:

1. `ResolveOpacity` devuelve `undefined` (no hay `.`),
2. `SPRINKLE_KEYS.has("bg")` → `true`, va a `sprinkle_props`,
3. `sprinkles()` hace `sprinkle.values["#3F37C9"].defaultClass` →
   `SprinklesError` en desarrollo, **`TypeError` en producción**.

El tipo lo impide hoy, así que no hay incidente. Pero es un `as` o un consumidor en JS de distancia,
y es lo que cualquiera va a intentar el primer día.

**Recomendación** — escotilla en `ExtractStyleProps`: si el valor **no está** en la tabla de la
propiedad, no va a sprinkles, va a `style` en línea. El camino de token sigue siendo CSS estático y
coste cero; solo el valor arbitrario paga inline. Es lo mismo que ya se hace con `ResolveOpacity`,
generalizado.

| Familia            | Hoy                | Propuesto                                                       |
| ------------------ | ------------------ | --------------------------------------------------------------- |
| `c` `bg` `bdc`     | solo claves        | + `#hex`, `rgb()`, `hsl()`, `oklch()`, `var(--x)`, `color-mix()` |
| `p*` `m*` `gap*`   | solo claves        | + `number` → `px`, + string CSS (`"1.5rem"`, `"clamp(…)"`)       |
| `r*`               | solo claves        | + `number` → `px`, + string                                      |
| `fz` `lh` `ls`     | solo claves        | + `number`, + string                                             |
| `shadow` `z`       | solo claves        | + string / number                                                |

El tipo ya tiene precedente en la casa: `ShadowValue = ShadowToken | (string & Record<never, never>)`
en `packages/tokens/src/types/effects.ts:9`. Ese patrón conserva el autocompletado de los tokens y
admite lo demás.

**Nota**: las tablas de valores (`LAYOUT_SPACE`, `PALETTE_COLORS`, `vars.radius`…) viven dentro de
`Box.css.ts`, y `style-props.ts` ya lo importa. Si se quiere que la escotilla no arrastre la hoja,
las tablas deberían salir a un módulo propio — el mismo argumento de ADR-096.

### 3.3 · La opacidad solo cubre los roles — y es deliberado

`ResolveOpacity` resuelve contra `ROLE_TONES = ROLE_COLORS`, así que `bg="surface.raised.50"`
funciona y `bg="primary.500.50"` no.

**Corrección sobre la primera versión de este informe**: lo di por descuido y no lo es.
`utils/style-props.md` lo deja escrito: exportar `ROLE_COLORS` impide al bundler eliminarlo tras
evaluar los sprinkles —~330 B brotli en 174 de los 192 módulos medidos— y cubrir los 77 peldaños de
escala multiplicaría esa cifra por tres. La decisión está tomada y pagada; no se toca sin medir de
nuevo.

### 3.4 · Props que faltan — y una que hoy no pinta nada

**El borde es el hueco grande.** Existe `bdc`, y **`bdc` a solas no dibuja nada**: sin `border-width`
ni `border-style` el navegador no pinta. Un consumidor que escribe `<Box bdc="border.default" />`
no ve borde y no tiene con qué arreglarlo salvo `style`. Los 158 componentes lo esconden porque el
grosor lo pone su propia hoja.

| Falta                                      | Por qué                                                              |
| ------------------------------------------ | -------------------------------------------------------------------- |
| `bw` `btw` `bbw` `blw` `brw`               | sin grosor, `bdc` es inerte                                          |
| `bd` (atajo `"1px solid"`)                 | el 90 % de los casos en una prop                                     |
| `borderStyle`                              | `dashed` para dropzones y separadores                                |
| `btc` `bbc` `blc` `brc`                    | borde por lado — `fonicredito` los usa a diario                      |
| `inset`                                    | hoy hay `top/right/bottom/left` sueltos                              |
| `aspectRatio`                              | media y avatares; hoy se resuelve con `style`                        |
| `alignContent` `justifyItems` `justifySelf` | `display: grid` está expuesto sin sus props de alineación            |
| `cursor` `pointerEvents` `visibility`      | estado de interacción, hoy solo por CSS                              |
| `objectFit`                                | imágenes                                                             |
| `order`                                    | reordenar sin tocar el DOM                                           |
| `fs` (`fontStyle`)                         | cursiva                                                              |

Redundancias reales más allá de los alias: ninguna. `flex` frente a `grow`/`shrink`/`basis` se
solapan pero las dos formas son útiles y así está en todas las librerías del ecosistema.

---

## 4 · Props de ranura: el patrón está, pero **el tipo lo deja a medias**

Es el hallazgo que más pesa para la calidad percibida de la librería.

ADR-098 fijó que un nodo DOM se tipa con `ComponentPropsWithoutRef<"tag">`. Aplicado a `Header`:

```ts
titleProps?: ComponentPropsWithoutRef<"h1"> | undefined;   // Nebula, hoy
```

Y en `fonicredito-app/src/services/shared/components/Header/types.ts:23`:

```ts
titleProps?: TextProps        // el consumidor real
```

La diferencia no es de estilo, es de **qué puede hacer el consumidor**:

```tsx
// fonicredito — tokens, tema, coherencia
<Header titleProps={{ fw: "bold", fz: "h4", c: "gray.700", ta: "center" }} />

// Nebula — CSS crudo, fuera del tema, fuera del contraste
<Header titleProps={{ style: { fontWeight: 700, fontSize: 22, color: "#4b5563" } }} />
```

El principio que ordena WN dice que un consumidor tiene que poder ajustar cualquier componente **sin
forkearlo**. Con `ComponentPropsWithoutRef<"h1">` no forkea, pero **se sale del sistema**: el valor
que escribe no pasa por tokens, no cambia con el tema y no lo ve `check:contrast`. La ranura existe y
está vacía de poder.

La causa está un nivel más abajo: `Header.tsx:105` pinta `<Heading>` y `:114` pinta `<p>`, DOM crudo.
`Text` y `Box` ya existen y ya aceptan las 109 style props.

**Recomendación** — enmendar ADR-098 con una regla de una línea:

> El `<nodo>Props` se tipa con **el componente de Nebula que pinta el nodo**, no con la etiqueta DOM.
> Nodo de texto → `TextProps`. Envoltorio → `BoxProps`. Componente de Nebula → su propio `Props`
> (ya se hace: `backProps: ActionIconProps`).

Y para que sea honesto, el componente tiene que pintar de verdad a través de `Text`/`Box`. Hay que
**medir el coste en bytes antes de barrer**: `Header` sube de DOM crudo a dos componentes, y hay 192
entradas de presupuesto. `Box` y `Text` ya están en el bundle de casi cualquier consumidor, así que
lo previsible es que sume poco, pero eso se mide, no se supone.

### 4.1 · Vocabulario de las ranuras

No coinciden, y conviene elegir uno antes de congelar:

| `fonicredito`  | Nebula `Header`         |
| -------------- | ----------------------- |
| `wrapperProps` | `rowProps`              |
| `headProps`    | `headingProps`          |
| `titleProps`   | `titleProps` ✅         |
| —              | `leadProps` `trailProps` |
| —              | `bodyProps`             |

Los de Nebula son más descriptivos; los del prompt son los que el propietario tiene en la mano. **Es
decisión suya**, pero tiene que ser una sola y aplicarse a los 158.

### 4.2 · `error` / `errorProps`: 34 lo declaran, **0 lo exponen**

34 componentes tienen `error?:`. **Ninguno** tiene `errorProps`. `TextInput.tsx:31` decide
`errorDisplay = "tooltip"` por dentro y el consumidor no alcanza el nodo. `FieldError` existe como
componente, pero no viaja como ranura.

En `fonicredito` el par `error?: string` + `errorProps?: ErrorProps` está en todo lo que puede vivir
en un formulario, y el envoltorio `<Error>` resuelve hasta el desplazamiento vertical
(`Header/index.tsx:49`). **Recomendación**: `errorProps?: FieldErrorProps` en los 34, y `error`
aceptando `ReactNode` además de `string`.

---

## 5 · El patrón collector — qué vale la pena traerse y qué no

En `fonicredito`, `VariablesCollectorX(props)` es **un solo sitio declarativo** que dice qué props
gobiernan el estilo, y alimenta `styles.x(variables)`. `View/collector.ts` lista sus 40 props de un
vistazo; el `index.tsx` queda en 30 líneas.

En Nebula el trabajo equivalente está repartido: `ExtractStyleProps` (genérico), `assignInlineVars`
(**92 componentes**) y desestructuración a mano en cada `.tsx`.

**Recomendación: no antes de v1.** El collector es interno —no sale al barrel, no entra en el
`.d.ts`, no se congela al publicar—, así que no gana nada por entrar ahora y arriesga 92 componentes
en la semana previa a v1. Lo que sí vale la pena traerse ya es su **consecuencia**, que sí es
pública: que las props del padre lleguen al hijo con el tipo del hijo, que es el §4 de arriba.

---

## 6 · Deuda de documentación

- **73 de 158 componentes sin `.md`** (H8 del cuaderno). Con ADR-019 §2 prohibiendo comentarios, el
  `.md` es el único sitio donde puede vivir un porqué. Para una librería que se publica, casi la
  mitad del catálogo sin una línea de prosa se nota.
- **20 `.types.ts` llevan JSDoc** (`AppShell.types.ts`, por ejemplo) contra la letra de ADR-019 §2.
  Aquí **recomiendo enmendar el ADR, no borrar los comentarios**: el JSDoc sobre un miembro de un
  tipo público no explica código, viaja al `.d.ts` y sale en el autocompletado del consumidor. Es
  documentación publicada, y es exactamente lo que separa una librería premium de una correcta. La
  regla quedaría: prohibido el comentario que explica implementación; permitido —y deseable— el
  JSDoc sobre API pública.

---

## 7 · Orden recomendado hasta W5

1. ~~Esquema de Zod~~ — hecho en esta revisión.
2. `Card` y `Segment` reciben `/* @__PURE__ */`; se limpia el `Omit` muerto de `AppShell`; se decide
   `Scroll`. Barato, cierra N1 y N2.
3. **ADR + poda de los 40 alias largos**, con atajo nuevo para las cuatro esquinas. Es *breaking*:
   antes de v1 o nunca. Elimina de paso 104 líneas de `Omit<StyleProps, "color">`.
4. **ADR + valores arbitrarios y familia de borde.** Solo añade; se puede hacer después de v1, pero
   el borde es un hueco que se va a notar el primer día.
5. **Enmienda a ADR-098** y segunda tanda de N3 con el tipo correcto, midiendo bytes por tanda.
6. `errorProps` en los 34.
7. Hero y Section a compound (informe de N2), ya con el vocabulario de ranuras decidido.

---

## 8 · Iconos: el problema no es el SVG crudo, es que el mismo glifo se dibuja distinto

**34 de 158 componentes** llevan `<svg>` en línea. El instinto de mandarlos al sistema de `Icon` es
correcto en el síntoma y equivocado en el remedio; el defecto real es otro.

### 8.1 · La paloma existe en tres geometrías

| Componente          | `d`                     |
| ------------------- | ----------------------- |
| `ButtonCopy:38`     | `M5 12l5 5L20 7`        |
| `Checkbox:90`       | `M5 12l5 5L20 6`        |
| `Chip:29`           | `M20 6 9 17l-5-5`       |
| `Stepper:35`        | `M20 6 9 17l-5-5`       |

`ButtonCopy` y `Checkbox` **difieren en una unidad** (`L20 7` contra `L20 6`). Eso no es una decisión
de diseño, es deriva de copiar y pegar. Y `Chip`/`Stepper` usan un tercer trazo distinto. La paloma
de "copiado" no es la misma que la de "marcado" ni que la de "paso completado", en la misma librería.

Lo mismo con `chevron-right`, escrito de dos formas para la misma forma: `m9 18 6-6-6-6`
(`AppShell/components/Sidebar:55`, `Calendar/CalendarHeader:43`) y `M9 18l6-6-6-6`
(`Carousel:40`, `Lightbox:46`).

Y el grosor: `strokeWidth={2}` ×33, `{3}` ×4, y dos casos sueltos de `{1.6}` y `{1.5}`.

### 8.2 · Por qué el registry **no** resuelve esto

`Icon` es un **registro en tiempo de ejecución**:

```
Icon name="check" → ResolveIcon("check") → REGISTRY.get(…) → RenderIcon(undefined) → null
```

`RegisterIcons` lo puebla **el consumidor** (`registry.ts:5`), y los packs importan de `lucide-react`,
que es **peer opcional** de `@stellaria/nebula-icons`. Dos consecuencias que descartan la idea para el
cromado interno:

1. Un `Checkbox` en un consumidor que no instaló `lucide-react` o no llamó a `RegisterIcons`
   **se pintaría sin su paloma**, en silencio: `RenderIcon` devuelve `null` cuando el nombre no
   resuelve (`render.tsx:11`). El componente dejaría de bastarse a sí mismo.
2. Un `Map` con clave string es **opaco al bundler**. No puede cargar "solo el que necesitas": carga
   el pack que se registró entero. El SVG en línea de hoy ya es, literalmente, carga por icono.

La distinción que ordena esto:

- **Icono de cromado** —la paloma del `Checkbox`, el chevrón del `Select`, la X de `ButtonClose`—: es
  identidad visual del componente. Tiene que pintarse con cero configuración y cero peer deps.
- **Icono de contenido** —lo que el consumidor mete en un `Button`, un `NavLink`, un `EmptyState`—:
  ya viaja como `ReactNode` y el registry es exactamente su sitio.

### 8.3 · Recomendación: un módulo interno de glifos

Un `packages/web/src/glyphs/` **no exportado en el barrel**: un módulo por glifo, un solo envoltorio
`<svg>` con los atributos compartidos (`viewBox`, `fill`, `stroke`, `strokeWidth`, `linecap`), y un
solo sitio donde cambiar el grosor cuando cambie la identidad. Cero dependencias, cero configuración,
y sigue siendo carga por glifo porque son exports ESM planos.

El patrón **ya existe en la casa, sin compartir**: `RichTextEditor/icons.tsx` define un `Stroke(path)`
que hace justo esto, y `DatePicker/calendar-icon.tsx` va por el mismo camino. Solo hay que subirlo un
nivel y pasar los 34 por él.

El registry se queda como está, para lo que es.

---

## 9 · Circularidad: es el medio de N3, no un fin

**Medido**: de 158 componentes, **27 importan `Box`** y **4 importan `Text`**. En nodos crudos:
242 `<span>`, 186 `<div>`, 89 `<p>`, 26 `<button>`, 17 `<li>`, 10 `<ul>`.

Convertirlos todos **no es obviamente mejor**, y conviene decirlo antes de abrir la tanda:

- `Box` ejecuta `ExtractStyleProps` en cada render: un recorrido sobre **todas** las props del nodo
  para repartirlas entre sprinkles, `style` y `rest`. Multiplicado por ~540 nodos es coste de
  ejecución que hoy no se paga.
- Para un `<div>` estructural con una clase fija y ninguna style prop, `<div className={styles.row}>`
  es más barato y exactamente igual de correcto. `Box` no aporta nada ahí.
- Hay 192 entradas de presupuesto de tamaño, y el gate no es una sugerencia.

Dónde sí es obligatorio, y es el vínculo con §4: **un nodo que expone `<nodo>Props` tiene que estar
pintado por el componente cuyo tipo declara**. `titleProps: TextProps` es mentira si el título es un
`<h1>` crudo. Ahí la circularidad no es elegancia, es lo único que hace verdadera la ranura.

**Recomendación**: no barrer. El nodo pasa a `Box`/`Text` **en la misma tanda en la que recibe su
prop de ranura**, y se mide el bloque. Así la conversión llega acotada, justificada nodo a nodo y con
el coste medido en el sitio donde se decide.

---

## 10 · Hallazgos de la implementación (2026-08-06, tarde)

Al implementar la optimización de `ExtractStyleProps` salieron dos gates más que llevaban rotos.

### 10.1 · El presupuesto de tamaño no podía correr desde N2

`.size-limit.js` apuntaba a rutas que N2 movió (`67780ed`):

| Entrada      | Apuntaba a                       | Debía apuntar a                             |
| ------------ | -------------------------------- | ------------------------------------------- |
| `GridCol`    | `dist/components/Grid/Col.js`    | `dist/components/Grid/components/Col.js`    |
| `Form`       | `dist/components/Form/Form.js`   | `dist/components/Form/index.js`             |
| `Table`      | `dist/components/Table/Table.js` | `dist/components/Table/index.js`            |

Las dos últimas por la misma causa: N2 movió el `Object.assign` del `.tsx` al `index.ts`, así que el
módulo raíz ya solo exporta `FormRoot`/`TableRoot`. Con una ruta inexistente, `size-limit` no marca
esa entrada: **aborta la corrida entera** con un error de esbuild.

**Consecuencia**: ninguna medición de tamaño se ha podido verificar desde N2. En particular, la frase
de ADR-098 —"Ninguna de las 183 entradas de `.size-limit.js` se rompió con la tanda entera"— se
escribió cuando el gate no arrancaba. Conviene remedirla.

Corregidas las tres, el gate corre y revela **dos presupuestos rebasados de antes**: `AppShell`
(+427 B, deriva acumulada desde N2) y `Form` (+721 B, por medir ahora el compound entero).

### 10.2 · Un gate que se lee mal no es un gate

Los tres fallos de esta revisión —el esquema de Zod, las rutas del presupuesto, y el typecheck del
playground— llevaban semanas sin verse por la misma razón de fondo: `pnpm turbo … | tail -N`
devuelve el código de salida de `tail`. **Añadir `set -o pipefail` a la checklist de gates**, o
comprobar el código de salida explícitamente.

### 10.3 · La optimización, medida sobre el artefacto publicado

A/B en el **mismo proceso** contra la implementación original transcrita literal, con el bundle de
producción de sprinkles. Salida **idéntica** en las cuatro formas.

| Forma del nodo               | Original  |  Nueva   | Mejora |
| ---------------------------- | --------: | -------: | -----: |
| estructural (0 style props)  |  1.392 ns |   118 ns |  11,8x |
| típico (3 style props)       | 11.040 ns | 2.254 ns |   4,9x |
| cargado (8 style props)      | 23.024 ns | 3.815 ns |   6,0x |
| con valor en línea (`w`,`h`) |  8.038 ns | 2.722 ns |   3,0x |

Las cifras absolutas de esta máquina son ruidosas —la misma forma varió un 40 % entre corridas—, por
eso lo que vale es el cociente, tomado con las dos implementaciones alternándose en el mismo proceso.

**Lección de método**: la primera medición se hizo contra un prototipo en línea y daba 8x en el caso
típico. Al medir el artefacto ya construido, la mejora había desaparecido casi entera. La causa era
un `JSON.stringify` por prop que entró al endurecer la clave de caché: **1.315 ns contra 775 ns** por
nodo de tres props, el 40 % del coste de construir la clave. Se sustituyó por un prefijo de longitud,
que da la misma inyectividad sin el coste. Un prototipo no vale como medición del artefacto.

**El coste en bytes**: entre 13 y 177 B brotli por módulo. Sacó de su tope a **17 presupuestos** que
estaban a menos de 180 B —el cuaderno de N5 ya avisaba en H1 de que había diez a menos de 90 B—.
Topes subidos según el criterio del propietario.

El trato está tomado a sabiendas: es el mismo orden de magnitud que los ~330 B/módulo que ya se pagan
por el mecanismo de opacidad, y es lo que hace asequible la circularidad de §9 —a 118 ns por nodo
estructural, el argumento de coste contra convertir a `Box` deja de sostenerse.

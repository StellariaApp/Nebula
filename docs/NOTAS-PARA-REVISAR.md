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

### D-4 · 120 cadenas de interfaz en español — remedidas, y el diagnóstico cambia

Van cuatro veces que se cuela español en el sitio público: el skip link decía «Saltar al contenido»,
el `Burger` «Abrir menú», el `Nav.Sidebar` «Cerrar la navegación», y `Stat` metía «al alza» en el
lector de pantalla. Cada vez lo tapé pasando la etiqueta a mano.

**Remedido con el método bueno** —palabras funcionales, no tildes, que es el que corrigió el recuento
del JSDoc—: son **120 cadenas en 51 componentes**, no 95 en 47.

Pero el número no es lo que decide. Lo que decide es **si el consumidor tiene salida**, y ahí el
diagnóstico que yo mismo escribí antes estaba mal encuadrado:

| | |
| --- | --- |
| Tienen prop de etiqueta —`labels`, `*Label`, `linkText`— | **119** |
| **Sin ninguna salida** | **1** |

Esa una es **`GridList.tsx:70`, un `aria-label="Modo de vista"` escrito a pelo**. No hay prop que lo
tape: un consumidor angloparlante no puede arreglarlo de ninguna manera. Las otras 119 son una
molestia —hay que pasar la prop— pero están documentadas y son suyas.

Aparte, y es otra conversación, hay **cuatro mensajes de `Error()` en español** que solo ve un
desarrollador: `Form`, `Hero`, `Section` y `Segment` («`X.*` debe usarse dentro de `<X>`»), más el
«Tema desconocido» de `NebulaProvider`.

ADR-114 decidió que la superficie pública se escribe en inglés, pero se aplicó al JSDoc, no a esto.

- **Traducir las 120 y la de `GridList`.** Coherente con ADR-114. Rompe a quien hoy dependa del
  defecto en español, que ahora mismo es solo el playground.
- **Traducir solo lo que no tiene salida** —`GridList` y los cinco `Error()`— y dejar los 119
  defectos. Mínimo cambio de comportamiento; el sitio ya demuestra que pasar la etiqueta funciona.
- **Un diccionario de la librería con `locale`.** Es un sistema de i18n dentro del catálogo; alcance
  muy superior y probablemente fuera de v1.

**Recomendación**: la primera, antes de W5, porque después de publicar cada cadena es una rotura para
alguien. Pero si te preocupa el alcance, **la segunda cierra el único fallo real con seis cambios** y
se puede hacer hoy mismo.

No he tocado nada de esto: traducir un defecto cambia el comportamiento de la librería, y eso es tuyo.

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
| `d2fbd19` | ADR-119 — el radio lo manda la style prop: 11 componentes, 189 llamadas   |
| `26146e8` | Portada: cabecera móvil, jerarquía de bandas, Stats, copy al diccionario  |
| `168a0e2` | ProductSwitch a `Segment` y sin español en el lector de pantalla          |
| `87720aa` | La escala de la portada llega a `/components`, `/docs`, `/theme` y demás   |
| `391a169` | DS2.3 — las cinco guías de /docs, con las obligaciones del consumidor     |
| `8fe16eb` | Primer lote de contratos JSDoc al inglés: 57 bloques en 8 componentes     |
| `a338f8c` | Segundo lote: 74 bloques en 6 componentes (controles, overlays, AppShell) |
| `85a4b25` | Tercer lote: 62 bloques en los 4 subpath con más contrato                 |
| `63b96e4` | Cuarto lote: 44 bloques en formulario, feedback y navegación              |
| `2f262d9` | Quinto lote: 42 bloques, entre ellos las 6 ranuras que comparten 27 campos|
| `bb2aa8f` | Sexto lote: 45 bloques en los cinco componentes de colección              |
| `b03b4f5` | Séptimo lote: 63 bloques en 13 componentes                                |
| `95bf23c` | **ADR-114 cerrado**: los 500 contratos JSDoc están en inglés              |

---

## 3. Lo que queda, en orden

> **PRIORIDAD, dicha por el propietario**: iterar sobre el **diseño de la portada** hasta que esté a
> nivel de publicación. Solo después se pasa a las demás vistas, **reutilizando lo que salga de la
> portada** —su escala, su ritmo, sus patrones— en vez de inventar de cero en cada una.
> Lo de accesibilidad no espera: un bloqueante de a11y se arregla en cuanto se toca esa zona.

**No queda trabajo que no dependa de una decisión tuya.** Todo lo que estaba en la lista está
cerrado y commiteado.

Lo único pendiente es **D-4**, y está arriba esperando tu criterio: traducir las cadenas por defecto
en español de 47 componentes. No lo empiezo sin tu decisión porque cambia el comportamiento de la
librería, no solo su documentación.

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
- **Los recuentos por tildes están todos mal, y ya van dos.** El JSDoc en español era 7 veces más de
  lo estimado; D-4 era un 26 % más (120 y no 95). Si vuelve a aparecer un recuento de español en este
  repo, remídelo por palabras funcionales antes de creértelo.
- **El JSDoc en español era 7 veces más de lo estimado.** Las notas decían «~70 contratos»; ese
  número salía de buscar **tildes**, así que se dejaba fuera todo el español sin acentuar («El
  elemento que pinta», «Solo se pinta con `icon`»). Medido con detección por palabras funcionales:
  **500 bloques en 102 archivos**. La lección es más general que el JSDoc: cualquier recuento de
  español hecho por acentos en este repo está mal, incluido el de D-4 —esas 95 cadenas también se
  midieron por tildes y por palabras clave, así que el número real es probablemente mayor—.

---

## 5. Tuyo y sin tocar

Estos archivos llevan cambios tuyos en curso y los he dejado fuera de mis commits:

- `packages/web/src/components/Footer/Footer.tsx` — `glass = true` por defecto. **Es un cambio de
  defecto de API pública: si se queda, quiere ADR.**
- `packages/web/src/components/Hero/Hero.css.ts` — `gap: sm → md` en el header.
- `packages/web/src/components/Button/Button.css.ts` — los tres `fontSize` de tamaño.

`Nav.tsx` y `apps/docs/src/app/[lang]/page.tsx` sí entraron en mis commits porque tenía que tocarlos;
llevan dentro tu `glass.strong`, el `momentum`, el `GlassSurface` y el `r="inherit"`.

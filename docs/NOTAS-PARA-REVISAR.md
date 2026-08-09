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

### D-4 · 95 cadenas por defecto en español, en 47 componentes

Van tres veces que aparece el mismo fallo en el sitio público: el skip link decía «Saltar al
contenido», el `Burger` «Abrir menú», el `Nav.Sidebar` «Cerrar la navegación», y `Stat` mete «al
alza» en el lector de pantalla. Cada vez lo he tapado pasando la etiqueta explícita, pero el
problema no es del sitio.

Medido: **95 cadenas visibles o de lector de pantalla escritas en español como valor por defecto, en
47 archivos** de `packages/web`. Entre ellas `PasswordInput` («Mostrar contraseña»), `NProgress`
(«Cargando la página»), `Toast` («Cerrar notificación»), `Spoiler`, `AppShell`, `InputPhone`,
`YearPicker`.

Un consumidor angloparlante que no pase la prop se lleva español en su producto, y en la mitad de
los casos es texto que **solo oye un lector de pantalla**, así que no lo ve nadie en QA.

ADR-114 ya decidió que la superficie pública se escribe en inglés, pero se aplicó al JSDoc, no a los
valores por defecto.

- **Traducir los 95 defectos a inglés.** Coherente con ADR-114. Rompe visualmente a cualquier
  consumidor hispanohablante que hoy dependa del defecto — que ahora mismo es solo el playground.
- **Dejarlos y exigir que se pasen siempre.** Obliga a un lint que detecte props de etiqueta sin
  pasar, y no hay forma razonable de escribirlo.
- **Un diccionario de la librería con `locale`.** Es un sistema de i18n dentro del catálogo; alcance
  muy superior y probablemente fuera de v1.

**Recomendación**: traducir los 95 ahora, antes de W5, porque después de publicar cada cadena es una
rotura para alguien. Es mecánico y lo cubren los tests que ya asertan por rol y no por texto —hay que
comprobarlo—.

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

---

## 3. Lo que queda, en orden

> **PRIORIDAD, dicha por el propietario**: iterar sobre el **diseño de la portada** hasta que esté a
> nivel de publicación. Solo después se pasa a las demás vistas, **reutilizando lo que salga de la
> portada** —su escala, su ritmo, sus patrones— en vez de inventar de cero en cada una.
> Lo de accesibilidad no espera: un bloqueante de a11y se arregla en cuanto se toca esa zona.

1. **Traducir a inglés los contratos con JSDoc** (ADR-114), por lotes. **Van 324 de 500**; quedan
   174 en 68 archivos. A ~45 bloques por tanda son unas cuatro tandas más. Es lo único que queda que no dependa de una decisión tuya, y avanza solo.
2. **Bloqueado por D-4**: traducir las 95 cadenas por defecto en español. No lo empiezo sin tu
   decisión, porque cambia el comportamiento de 47 componentes.

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

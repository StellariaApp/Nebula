# Notas para revisar

Estado del trabajo en curso. **Lo de arriba es lo que necesita tu decisión; lo de abajo es el
diario.**

---

## 1. Lo que necesita tu decisión

De las cuatro que había abiertas, **tres las cerraste el 2026-08-09** (D-1 regla de lint, D-3 la
banda se queda, D-4 traducir las 120). Queda una, y es la única que sigue sin respuesta.

### D-2 · Cinco componentes que parecían duplicación y no lo son

Al inspeccionar a qué elemento apunta cada `radius` aparecieron cinco que **no** son duplicación, y
por eso no se migraron en ADR-119. Conviene que lo confirmes:

| componente     | a qué apunta su `radius`                                                                   |
| -------------- | ------------------------------------------------------------------------------------------ |
| `Image`        | una var compartida por el `<span>` raíz y por `styles.background`, que usa otro componente |
| `ImageGallery` | el radio de **cada baldosa**, no el del contenedor                                         |
| `Skeleton`     | el radio de **cada línea**, y se cruza con `circle`                                        |
| `EditorImage`  | `styles.trigger`, no la raíz                                                               |
| `Progress`     | la var del track                                                                           |

En los cinco, `r` redondearía la raíz y dejaría el elemento interior cuadrado. Migrarlos no es un
renombre: es cambiar qué se redondea.

**Ya está escrito en ADR-119** como cuarto caso —«el radio apunta a un elemento interior»—, que es lo
que de verdad son; antes estaban fuera del ADR sin que el ADR dijera por qué. Lo que falta es tu
visto bueno a que se queden así, no el texto.

### El único gate que no corre en CI

No es una decisión que bloquee nada hoy, pero conviene que sepas que existe. `gates.yml` corre ocho
de los nueve; **el visual se queda fuera** porque su baseline es por plataforma y hoy solo hay
`win32`: en un runner Linux no habría contra qué comparar, y regenerarlo daría falsos positivos por
encima del umbral del 0,1 %.

Cerrarlo pide fijar el «entorno único» que ADR-037 §3 nombra sin elegir: un contenedor con fuentes
fijadas, que pasaría a sustituir al baseline de win32 —no a convivir con él—. Es trabajo aparte y no
lo he empezado. Está escrito en el propio workflow, en docs/03 §4.1 y en la enmienda de ADR-112.

---

## 2. Lo que está cerrado y commiteado

| commit    | qué                                                                        |
| --------- | -------------------------------------------------------------------------- |
| `7e658da` | ADR-118 — el cristal recupera su filo y el velo se vuelve opaco            |
| `7334fbf` | `Hero` leía el color del texto del objeto del tema y no del contrato       |
| `6b9acab` | `pnpm dev` levanta la cadena entera en watch                               |
| `54d96d4` | Conmutador de tema flotante y el skip link deja de estar en español        |
| `d2fbd19` | ADR-119 — el radio lo manda la style prop: 12 componentes, 201 llamadas    |
| `26146e8` | Portada: cabecera móvil, jerarquía de bandas, Stats, copy al diccionario   |
| `168a0e2` | ProductSwitch a `Segment` y sin español en el lector de pantalla           |
| `87720aa` | La escala de la portada llega a `/components`, `/docs`, `/theme` y demás   |
| `391a169` | DS2.3 — las cinco guías de /docs, con las obligaciones del consumidor      |
| `8fe16eb` | Primer lote de contratos JSDoc al inglés: 57 bloques en 8 componentes      |
| `a338f8c` | Segundo lote: 74 bloques en 6 componentes (controles, overlays, AppShell)  |
| `85a4b25` | Tercer lote: 62 bloques en los 4 subpath con más contrato                  |
| `63b96e4` | Cuarto lote: 44 bloques en formulario, feedback y navegación               |
| `2f262d9` | Quinto lote: 42 bloques, entre ellos las 6 ranuras que comparten 27 campos |
| `bb2aa8f` | Sexto lote: 45 bloques en los cinco componentes de colección               |
| `b03b4f5` | Séptimo lote: 63 bloques en 13 componentes                                 |
| `95bf23c` | **ADR-114 cerrado**: los 500 contratos JSDoc están en inglés               |
| `6cce1ab` | **ADR-120 cerrado (D-4)**: 191 cadenas de interfaz al inglés               |
| `4af60a5` | **D-1**: la lista corta de radios se cierra con lint, no con tipos         |

---

## 3. Lo que queda, en orden

> **PRIORIDAD, dicha por el propietario**: iterar sobre el **diseño de la portada** hasta que esté a
> nivel de publicación. Solo después se pasa a las demás vistas, **reutilizando lo que salga de la
> portada** —su escala, su ritmo, sus patrones— en vez de inventar de cero en cada una.
> Lo de accesibilidad no espera: un bloqueante de a11y se arregla en cuanto se toca esa zona.

1. **D-2**, arriba. Es una nota en un ADR, no código.
2. **El gate visual en CI**, si decides que merece el contenedor. Hoy se corre a mano.
3. Menudencias anotadas y sin tocar:
   - `apps/playground-web/__snapshots__/visual/__diff__/` probablemente debería estar en
     `.gitignore`: son las imágenes de diferencia de la última pasada fallida, no baseline.
   - `pnpm format:check` no entró en el CI. Es un gate razonable, pero hoy fallaría por archivos que
     tienes en curso, así que no lo he metido sin preguntarte.

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
- **El caché de turbo no veía `eslint.config.js`.** No había `globalDependencies`, así que una regla
  de lint nueva salía **FULL TURBO sin lintear nada**. Lo vi al ampliar la regla de D-1: 17 tareas
  «en verde», cero ejecutadas. Arreglado añadiendo `eslint.config.js` y `tsconfig.base.json` a
  `globalDependencies`, y verificado que ahora invalida. Es el mismo fallo de clase que el de los
  `inputs` de `check:docs`: **un gate que no puede fallar no es un gate**, y los dos se veían igual
  desde fuera —verde.
- **El censo de ADR-119 se hizo buscando variantes de `recipe`**, y siete componentes aplican su lista
  corta de radios con `styleVariants` o reenviándola a otro componente. La regla de lint cubría 4 de 11. Ampliada y verificada con una sonda: las once disparan.
- **Los recuentos de español están todos mal, y ya van tres.** El JSDoc era 7 veces lo estimado (500
  bloques, no ~70); D-4 era un 26 % más (120, no 95); y al ejecutarla aparecieron **73 cadenas más**
  que ninguna heurística vio, porque son de una palabra («Guardar», «Negrita») o no llevan ninguna
  palabra funcional («Saturación y brillo»). Total real: **191**.

  La regla que sale de las tres: **buscar español por tildes o por palabras funcionales encuentra
  frases largas y acentuadas, y se deja fuera justo las etiquetas de interfaz**, que son cortas y
  planas. Lo único que dio el número bueno fue leer las 530 candidatas a mano. Si vuelve a hacer
  falta, no te fíes del primer recuento.

---

## 5. Tuyo y sin tocar

Estos archivos llevan cambios tuyos en curso y los he dejado fuera de mis commits:

- `packages/web/src/components/Footer/Footer.tsx` — `glass = true` por defecto. **Es un cambio de
  defecto de API pública: si se queda, quiere ADR.**
- `packages/web/src/components/Hero/Hero.css.ts` — `gap: sm → md` en el header.
- `packages/web/src/components/Button/Button.css.ts` — los tres `fontSize` de tamaño.

`Nav.tsx` y `apps/docs/src/app/[lang]/page.tsx` sí entraron en mis commits porque tenía que tocarlos;
llevan dentro tu `glass.strong`, el `momentum`, el `GlassSurface` y el `r="inherit"`.

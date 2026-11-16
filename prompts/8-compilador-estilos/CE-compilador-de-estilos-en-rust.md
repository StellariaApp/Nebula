# CE — Un compilador de estilos en Rust que sustituya a Vanilla Extract

> **Proyecto aparte.** Vive en su propio repositorio, no en el de Nebula. Nebula es su primer
> cliente y su corpus de prueba, pero este encargo **no toca Nebula**: la migración es una fase
> posterior, con su ADR en Nebula, y solo cuando el compilador pase sus propios gates.
>
> Copia el bloque de abajo entero en una sesión nueva, abierta en un directorio vacío.

---

## El encargo

Vas a diseñar y construir un compilador de estilos «zero-runtime» con hojas escritas en TypeScript
—el modelo de Vanilla Extract (VE)— cuyo núcleo está en Rust. Existe por una razón concreta: una
librería de componentes real, **Nebula** (`/Users/skr13/Documents/Github/Nebula`, 158 componentes,
227 hojas `*.css.ts`, publicada en npm y consumida por once productos), lleva meses pagando defectos
de VE y de su cadena de herramientas con rodeos, gates y ADR. El objetivo no es «VE pero más
rápido». Es **que esos defectos no puedan ocurrir**.

Lee esto antes de escribir una línea: **el tiempo de build no es el dolor**. El `vite build` de
Nebula con VE tarda 1,29 s para 952 módulos. Si optimizas eso, habrás construido lo que nadie
pidió. Rust se justifica aquí por otras tres cosas: un único binario que da la misma salida en
cualquier bundler o sin ninguno, un emisor de CSS con garantías verificadas sobre lo emitido, y el
coste de transformar hojas en test (Vitest gasta ~31 s acumulados de `transform` en 177 archivos).
Mide antes de afirmar cualquiera de las tres.

### El corpus

El repo de Nebula está en esta máquina y es de **solo lectura** para ti. Úsalo como fuente de
requisitos y como batería de pruebas:

- `packages/web/src/**/*.css.ts` y `packages/themes/src/web/*.css.ts` — las 227 hojas.
- `packages/web/dist` — lo que VE emite hoy; tu referencia para comparar.
- `docs/adr/` — ADR-016, 032, 094, 096, 103, 107, 119, 142, 150, 163, 164, 166, 168, 169, 175, 208
  cuentan cada rodeo y por qué existe. `packages/web/src/theme/layers.md` explica las capas.
- `tools/check-layers.mjs` y `tools/check-glass.mjs` — gates que existen solo porque el compilador
  no garantiza lo que vigilan.

No copies código de VE: lee su API pública y su comportamiento, no su implementación. La licencia
del proyecto nuevo la decide el propietario (pregunta 1).

---

## Los defectos que hay que hacer imposibles

Cada uno tiene síntoma real en Nebula y un criterio de aceptación. Son los requisitos del proyecto;
si uno no se puede cumplir, se dice y se justifica, no se omite.

| #   | Defecto en VE                                                                                                                                                                                                                                                             | Lo que debe garantizar el compilador                                                                                                                                                                  |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| D1  | **El orden de `@layer` lo decide el primer uso**, y el JS emitido importa la hoja propia antes que la de capas. El orden real depende de cómo trocee el bundler: en Storybook/rolldown `util` quedó como la capa más débil y estuvo meses roto sin que nadie lo viera.    | El orden de capas se declara una vez y **cada hoja emitida lo lleva como preámbulo** (la sentencia `@layer a, b, c;` es idempotente). Ningún consumidor tiene que importar una hoja «antes que nada». |
| D2  | **La capa es por regla y manual.** Nebula escribe `"@layer"` 873 veces a mano, y aun así su `dist` lleva **485 reglas fuera de capa en 71 hojas** (el `base` entero del recipe de `Button`, por ejemplo), que ganan a las style props. Su gate no lo ve.                  | Capa por defecto por archivo o por recipe. **Modo estricto que falla el build** si una sola regla emitida queda fuera de capa, verificado sobre el CSS de salida, no sobre el texto fuente.           |
| D3  | **Las utilidades atómicas son un mapa en runtime**: 1.571 clases, 138 kB de CSS y **138,5 kB de JS** (10,4 kB brotli) que paga todo módulo que monte `Box`. `sprinkles()` lanza con valores fuera de tabla.                                                               | Nombre de clase atómica **derivable por función** de (propiedad, valor, condición), sin tabla; o extracción estática de usos. Un valor fuera de escala cae a una vía definida, nunca lanza.           |
| D4  | **Los nombres de las custom properties llevan un hash de la ruta del archivo.** Mover el archivo los cambia todos. Obligó a mudar el contrato de paquete (ADR-168) y a mantener un segundo CSS de tokens paralelo (ADR-208).                                              | Nombres de var **deterministas y configurables** (prefijo estable, sin ruta), idénticos entre máquinas y sistemas, y un **manifiesto JSON del contrato** legible sin ejecutar el compilador.          |
| D5  | **`createTheme` solo existe en build.** Los temas por tenant o editados en vivo se generan con un `CompileTheme` hecho a mano que abusa de `assignInlineVars` para sacar nombres.                                                                                         | Un **emisor de temas en runtime oficial**, isomorfo (servidor y cliente), sin dependencias, de pocos cientos de bytes, con base + diferencias por tema.                                               |
| D6  | **Hace falta plugin de bundler y no todos lo tienen.** Turbopack ignora el plugin de Next; con webpack el loader reprocesa `*.css.js` ya compilados y revienta. En modo librería Vite no reinyecta los imports de CSS y hace falta `vite-plugin-lib-inject-css`.          | Un **CLI autónomo** (`.css.ts` → `.css` + `.js` + `.d.ts`) como vía de primera clase. Los plugins son azúcar encima. **Nunca** se toca un artefacto ya compilado que venga de `node_modules`.         |
| D7  | **El artefacto y `tsc` se pisan**: hay que acordarse de `emitDeclarationOnly`, y un `tsc --watch` regenera tipos y nunca el JS.                                                                                                                                           | El compilador emite él mismo los `.d.ts` de las hojas, o documenta una convivencia con `tsc` que no admite doble emisión.                                                                             |
| D8  | **`sideEffects` hay que acertarlo a mano** (`*.css.js`, no `*.css`); un componente se publicó sin su regla por eso.                                                                                                                                                       | El compilador genera o valida el manifiesto de efectos del paquete.                                                                                                                                   |
| D9  | **Un archivo CSS por módulo** con `preserveModules`: 145 hojas, 67 `<link>` bloqueantes en Next y 29 puntos de PageSpeed perdidos hasta activar `inlineCss`.                                                                                                              | Salida **por módulo y, además, agregada** por entry o subpath, a elección.                                                                                                                            |
| D10 | **Prefijos**: escribir `backdropFilter` y `WebkitBackdropFilter` en la misma regla dejaba solo el alias y mataba el blur en Chromium. El build ya prefija solo.                                                                                                           | El compilador gestiona los prefijos según una lista de navegadores objetivo y **da error** ante un prefijo manual que colisione.                                                                      |
| D11 | **Identificadores**: `debug` en producción (`Button_button_size_xs__zk5jiu3`) pesa; `short` rompe la depuración.                                                                                                                                                          | Modo corto con **mapa de depuración** (clase → archivo y export), y hash estable.                                                                                                                     |
| D12 | **Las custom properties no son claves normales**: hay que meterlas bajo `vars`.                                                                                                                                                                                           | `"--x": valor` vale como cualquier otra declaración.                                                                                                                                                  |
| D13 | **Los valores dinámicos arrastran runtime y cliente.** `assignInlineVars` aparece en 96 archivos; resolver variantes contra el tema en JS dejó 129 de 158 componentes en el cliente hasta que Nebula metió una matriz de 392 vars en el contrato para sacarlos (ADR-150). | Helper de vars en línea **sin dependencias y apto para Server Components**. Variantes dependientes del tema resolubles en estático.                                                                   |

---

## La decisión que condiciona todo: quién evalúa las hojas

Las hojas de Nebula **son programas, no datos**: 88 usan plantillas con interpolación, 64 usan
spread, 14 generan clases con `.map` u `Object.entries`, 12 declaran funciones, 4 tienen bucles;
importan de otras hojas (334 imports), de TS plano y del `dist` de otros paquetes. Un compilador
que solo entienda objetos literales no sirve.

Hay tres arquitecturas y tienes que **medir antes de elegir**. Es la fase 0 y termina en un ADR.

1. **Núcleo Rust + evaluación en el Node anfitrión.** Rust (vía `napi-rs`) hace el grafo de
   módulos, la eliminación de tipos (`oxc`), el hash, la emisión y el minificado
   (`lightningcss`); las hojas se ejecutan en Node contra un runtime mínimo que registra las
   llamadas. Es lo más compatible. El CLI necesita Node.
2. **Binario único con motor JS embebido** (QuickJS vía `rquickjs`, o `boa`). No necesita Node,
   pero hay que resolver módulos de `node_modules` y la semántica ESM a mano.
3. **Evaluación parcial estática** de un subconjunto, con caída a (1) cuando la hoja se sale. Es
   lo más rápido y lo más frágil.

Mi apuesta es **(1) con el contrato de registro diseñado para que (2) sea un cambio de anfitrión y
no de arquitectura**, pero es una hipótesis: el spike la confirma o la tumba. El criterio de salida
de la fase 0 es compilar las 227 hojas de Nebula con cada candidata viable y comparar corrección,
tiempo en frío, tiempo incremental y tamaño del binario.

---

## Superficie de API

Hay dos APIs y no son lo mismo. No las confundas.

**API de compatibilidad** — lo mínimo para que Nebula migre cambiando solo el especificador del
import (`@vanilla-extract/*` → el paquete nuevo, o por alias). Es exactamente lo que Nebula usa, con
su frecuencia, para que sepas dónde está el riesgo:

| API                                    | Llamadas | Notas                                                                                                                 |
| -------------------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------- |
| `style`                                | 787      | Nunca en la forma de composición `style([a, {…}])`                                                                    |
| `createVar`                            | 315      | Incluida la forma que emite `@property`                                                                               |
| `globalStyle`                          | 107      | Selectores que interpolan clases generadas, con `:has()` y `:not()`                                                   |
| `assignInlineVars`                     | 98       | Dos formas: mapa de vars y `(contrato, valores)`                                                                      |
| `fallbackVar`                          | 75       | Cadenas por breakpoint                                                                                                |
| `styleVariants`                        | 67       |                                                                                                                       |
| `recipe`                               | 36       | `base`, `variants`, `defaultVariants`, variantes booleanas; `compoundVariants` una sola vez. Tipo `RecipeVariants<T>` |
| `keyframes`                            | 21       |                                                                                                                       |
| `globalLayer`                          | 7        | Capas con nombre estable y `parent`                                                                                   |
| `defineProperties` / `createSprinkles` | 2 / 1    | 6 condiciones, 52 propiedades, 44 shorthands, `"@layer"`, y `sprinkles.properties` en runtime                         |
| `createThemeContract` / `createTheme`  | 1 / 2    | Contrato de 636 custom properties                                                                                     |

Dentro de las reglas: `"@layer"`, `"@media"`, `"@supports"`, `"@container"`, `"@starting-style"`
anidados en cualquier orden; `selectors` con `&` en cualquier posición; pseudos de primer nivel;
`vars`; `!important`; números con unidad implícita.

**No hace falta** (cero usos en Nebula): `createGlobalTheme`, `createGlobalVar`, `assignVars`,
`setElementVars`, `layer()` con hash, `createContainer`, `fontFace`, `globalFontFace`,
`globalKeyframes`, `createViewTransition`, `css-utils`. Déjalos fuera de la primera versión.

**API propia** — donde el proyecto gana. La de compatibilidad arrastra los defectos de diseño de VE
(capa por regla, sprinkles como tabla). Diseña encima una API nativa que los corrija —capa
declarada por archivo, utilidades atómicas sin tabla, contrato con nombres estables— y haz que la
de compatibilidad sea **una capa fina sobre la nativa**, no al revés. Esa API nativa es una
propuesta tuya y va a checkpoint con el propietario antes de implementarse.

---

## Salidas e integraciones

- Por cada hoja: el CSS, un `.js` con las clases exportadas y las funciones de recipe (más el
  import del CSS, o no, según el modo), y su `.d.ts`. Compatible con `preserveModules`.
- Los exports que **no** son estilos (tablas, constantes) tienen que seguir llegando al `.js`: seis
  hojas de Nebula los tienen.
- Integraciones, por orden: **CLI** (con `--watch`) → **Vite 8 / rolldown** (modo librería, dev con
  HMR) → **Vitest**. Un loader para Turbopack o webpack es opcional y va al final.
- ESM únicamente. Navegadores con `@layer` como suelo. Sin CommonJS.

---

## Fases y gates

Ninguna fase se abre sin la anterior en verde. Cada una acaba con un documento de cierre en `docs/`
que diga qué se midió y qué no se pudo comprobar.

| Fase                     | Entrega                                                                                                                                                 | Gate                                                                                                                                                                  |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **0 · Spike**            | Las arquitecturas candidatas compilando las 227 hojas (aunque sea con salida tosca). ADR de arquitectura.                                               | Tabla medida de corrección, tiempos y tamaño. **Checkpoint con el propietario.**                                                                                      |
| **1 · Núcleo**           | `style`, `styleVariants`, `globalStyle`, `keyframes`, `createVar`, `fallbackVar`, capas, at-rules anidados, identificadores, prefijos, minificado. CLI. | El CSS emitido para las hojas que solo usan esto es **semánticamente igual** al de VE salvo nombres (compara tras normalizar identificadores). D1, D2, D10, D11, D12. |
| **2 · Recipes y átomos** | `recipe` y su runtime; utilidades atómicas sin tabla; API nativa.                                                                                       | D3 medido: bytes de JS y CSS de `Box` antes y después. Los tipos de `RecipeVariants` casan.                                                                           |
| **3 · Temas**            | Contrato con nombres estables, manifiesto JSON, `createTheme`, emisor en runtime, helper de vars en línea.                                              | D4, D5, D13. El contrato de 636 vars de Nebula se emite con nombres que no cambian al mover el archivo.                                                               |
| **4 · Integraciones**    | Plugins de Vite y Vitest, salida agregada, `.d.ts`, manifiesto de efectos.                                                                              | D6, D7, D8, D9.                                                                                                                                                       |
| **5 · Prueba en Nebula** | En una **copia o rama desechable** de Nebula, alias de `@vanilla-extract/*` al paquete nuevo. Informe de migración.                                     | Los 1.608 tests de `packages/web` pasan; `tools/check-layers.mjs` y un contador de reglas sin capa sobre el `dist` dan cero; el gate visual de Storybook no difiere.  |

La fase 5 **no se mezcla en Nebula**. Entrega un informe con lo que cambia, lo que mejora en
números y lo que el propietario tendría que decidir. Cambiar el motor de estilos de Nebula es un
cambio de dependencias y allí exige ADR.

---

## Cómo trabajar

- **Pruebas primero en lo que es contrato**: instantáneas de CSS por caso, pruebas de propiedad
  sobre el serializador de selectores y at-rules, y la batería de Nebula como prueba de integración.
  Cada defecto D1–D13 tiene al menos una prueba que **falla con el comportamiento de VE** y pasa
  con el tuyo.
- **Determinismo como gate**: la misma entrada da la misma salida byte a byte en macOS, Linux y
  Windows, con independencia de la ruta absoluta y del orden de evaluación. Pruébalo en CI con una
  matriz.
- **Errores que se puedan leer**: archivo, línea y export de la hoja, no una traza del evaluador.
- **Mide y publica los números**: un `bench/` con las 227 hojas de Nebula (en frío, incremental,
  memoria) y los mismos números para VE como referencia. Sin número, no se afirma «más rápido».
- **Verifica las versiones** de `oxc`, `lightningcss`, `napi-rs` y del motor JS que elijas contra
  su documentación actual antes de fijarlas; no te fíes de lo que recuerdes de su API.
- Decisiones de arquitectura en `docs/adr/`. Documentación de usuario en inglés.
- No publiques en npm ni en crates.io, ni hagas público el repositorio, sin confirmación expresa.

---

## Preguntas de arranque

Haz primero un reconocimiento del corpus y luego plantéalas **juntas**, cada una con tu
recomendación. No preguntes nada que puedas averiguar leyendo.

1. **Nombre, scope de npm y licencia.** ¿Bajo `@stellaria/`? ¿MIT, como Nebula?
2. **Alcance de la compatibilidad.** ¿Solo lo que usa Nebula (recomendado para la v0) o paridad
   completa con VE para que lo adopten terceros?
3. **¿El CLI puede depender de Node?** Decide entre las arquitecturas 1 y 2 más que cualquier
   medición.
4. **Plataformas del binario** que hay que publicar desde el primer día (macOS arm64, Linux x64 y
   Windows x64 son las tres que usa hoy el equipo y el CI de Nebula).

---

## Lo que este encargo no es

- No es una reescritura de Nebula ni de sus hojas.
- No es un sistema de temas nuevo: `NebulaTheme`, su validación y sus gates de contraste no dependen
  del motor de estilos.
- No es un compilador de style props desde JSX. Es una mejora posible después, no un requisito.
- No cubre React Native: el paquete `native` de Nebula nunca importa CSS.

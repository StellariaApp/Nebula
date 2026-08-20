# C1 — Las landings de producto pasan a Nebula al 100%

> Para una sesión limpia por producto. Modelo recomendado: **Opus 5**.
>
> **Esto NO es la migración de C3.** `docs/04` §5 planifica fonicredito y tfv como codemod y
> migración total de la app entera. Esto es sólo **la landing**: la superficie más pequeña que
> demuestra que un producto se retiñe entero sin tocar Nebula. Si la landing no sale limpia, la app
> tampoco va a salir.

> **Revisado el 2026-08-19, después de ejecutarlo entero sobre Rosette.** Lo que sigue son hechos
> medidos, no previsiones: el encargo se hizo de verdad y el veredicto está en
> `Rosettee/docs/reviews/adopcion-rosette-2026-08-19.md`. Cuatro cosas cambiaron y una de ellas
> invalida un párrafo entero de la versión del 18. Están todas en la sección **«Lo que la primera
> ejecución dejó aprendido»**, al final. Léela ANTES de la Fase 0.
>
> **Revisado el 2026-08-18.** La versión anterior de este encargo era del 17 y quedó desfasada en
> cuatro puntos que costaban horas cada uno: citaba `ColorSchemeScript`, importaba `vars` del paquete
> equivocado, decía que el esquema se deduce del nombre del tema, y mandaba escribir el tema
> copiando un fichero de 627 valores. Todo eso cambió. Si encuentras una instrucción que contradice
> al código, gana el código y se anota.

---

## Lo que ya está comprobado (no lo vuelvas a averiguar)

Medido sobre el repo el 2026-08-18:

| Hecho                                                          | Valor                                                   |
| -------------------------------------------------------------- | -------------------------------------------------------- |
| Variables del contrato CSS                                      | **627**                                                   |
| Un tema inyectado en línea (`assignInlineVars`)                 | **≈40 kB** de atributo `style` · 4,5 kB brotli            |
| Un tema materializado como clase                                | un nombre de clase                                        |
| Los dieciséis temas del catálogo, compilados juntos             | 285,7 kB en crudo · **10,6 kB brotli**                    |
| Componentes cuya raíz es de servidor                            | **59 de 154**                                             |
| Ficheros de componente que llaman `useTheme()`                  | 61                                                        |
| Componentes con el breakpoint en px crudo                       | 3 — `Charts`, `Form`, `TransferList`                      |
| Temas listos para usar sin escribir ninguno                     | **16**, cada uno con subpath propio                       |

---

```
Actúa como ingeniero de migración en C:\Users\Skr13\Documents\GitHub\Nebula y en el repositorio de
<PRODUCTO>. El objetivo es que la landing de <PRODUCTO> se construya al 100% con Nebula y con su
propio tema, sin un solo estilo de producto que dependa de conocer Nebula por dentro.

LEE ANTES: CLAUDE.md, docs/02-theming.md (§2 el contrato, §4 las tres vías de materializar),
docs/04-migration-map.md §5, y .claude/skills/project-guardrails. De los ADR, estos seis y en este
orden: ADR-166 (los dos ejes), ADR-167 (ThemeScript), ADR-168 (dónde vive el contrato CSS), ADR-169
y ADR-175 (la base compartida y su reparto), ADR-150 (la matriz de variantes).

REGLA QUE NO SE ROMPE
No modificas Nebula para que <PRODUCTO> encaje. Si algo no se puede expresar con el tema, NO lo
arregles con un override en el producto ni con un parche en la librería: anótalo como hallazgo con
el nombre del token que falta, y sigue. El valor de este encargo está justamente en la lista de lo
que no se pudo hacer sin tocar el núcleo. Un override de CSS en el producto es un fracaso
silencioso: funciona hoy y se rompe en la siguiente versión.

DE DÓNDE SE IMPORTA CADA COSA — comprueba esto antes de escribir una línea
Cambió el 2026-08-17 con ADR-168 y es el error más caro de esta migración, porque el import viejo
compila hasta que no compila.

  @stellaria/nebula-themes         LoadTheme · BuildProduct · Themes · ThemeScheme · THEME_NAMES
                                   THEMES_SEEDS · type ThemeSeed · Dark · Light · BRAND_STOPS
  @stellaria/nebula-themes/web     vars · ThemeToVars · CompileTheme · CompileThemes
                                   ThemeScriptMap · DEFAULT_THEME · ResolveVariant · VariantRefs
  @stellaria/nebula-themes/<tema>       ese tema, los dos esquemas
  @stellaria/nebula-themes/<tema>/web   sus clases y su CSS ya compilado
  @stellaria/nebula-themes/all/web      los dieciséis: CLASSES · CSS · BASE · SLICES
  @stellaria/nebula-web            los componentes, NebulaProvider y ThemeScript

`vars` y `ThemeToVars` YA NO salen de @stellaria/nebula-web. Si un ejemplo viejo dice lo contrario,
está desfasado.

FASE 0 — ¿HACE FALTA UN TEMA PROPIO?
Pregunta primero, porque la respuesta ahorra la fase entera. El paquete trae DIECISÉIS temas
terminados, cada uno en dark y light y con su subpath. Si la marca de <PRODUCTO> cae cerca de uno
—hay azul, cian, verde, lima, teal, ámbar, oro, naranja, marrón, rojo, rosa, magenta, violeta,
amarillo y un neutro frío—, adoptarlo es una línea:

  import { CLASSES } from "@stellaria/nebula-themes/<tema>/web";

Deja escrito por qué sí o por qué no. «La marca es #XXXXXX y el más cercano del catálogo está a N de
distancia» es una respuesta; «queríamos el nuestro» no lo es.

FASE 1 — EL TEMA ANTES QUE LA PÁGINA
No empieces por los componentes. Un tema a medias hace que juzgues mal cada pieza.

Un NebulaTheme es un objeto COMPLETO: LoadTheme no acepta parciales ni tiene defaults. Pero YA NO se
escribe a mano. `BuildProduct` es API pública y construye el tema entero desde una semilla de diez
campos, que es exactamente como se construyen los dieciséis del catálogo:

  import { BuildProduct, type ThemeSeed } from "@stellaria/nebula-themes";
  import { palettes } from "@stellaria/nebula-tokens";

  const semilla = {
    name: "<producto>",
    primary: palettes.<x>,      // o tu escala propia de gen:palette
    accent:  palettes.<y>,
    from:    "#...",            // primera parada del degradado de marca
    to:      "#...",            // última
    tint:    "#...",            // el tinte del lienzo
    wash:    0.05,              // cuánto tiñe
    lift:    -6,                // cuánto lo sube o lo baja
    inkFloor: 2,                // opcional · el suelo de contraste de la tinta
    angle:   100,               // opcional · inclinación del degradado
    motion:  "standard",        // opcional · "minimal" apaga el movimiento
    glass:   true,              // opcional · false apaga cristal, blur y ruido
  } satisfies ThemeSeed;

  export const producto_dark  = BuildProduct(semilla, "dark");
  export const producto_light = BuildProduct(semilla, "light");

  FRICCIÓN CONOCIDA, no la investigues: `ThemeSeed.name` está tipado como `SeedName`, la unión
  cerrada de los dieciséis nombres del catálogo, así que un nombre de producto no compila sin un
  cast. Usa `name: "<producto>" as SeedName` y ANÓTALO COMO HALLAZGO Nº1: el tipo debería abrirse a
  `string` para que un consumidor pueda usar `BuildProduct` sin trampa. Es el primer candidato a ADR
  que sale de este encargo.

1. Saca las paletas del color de marca, no las escribas a mano:
     pnpm gen:palette from "#<hex de marca>" --name <producto> --json
   Da la escala 50-950 en OKLCH. Repite por cada semilla que el producto necesite.

2. Valida con el MISMO motor que el gate de CI:
     pnpm check:contrast -- --theme <ruta>.json
   Son 186 pares por tema. Las deudas declaradas de ADR-161 salen como DEUDA y no cuentan como
   fallo; cualquier otra cosa en rojo es tuya.

   DECIDE Y DÉJALO ESCRITO: Nebula sólo certifica AA para `nebula` (ADR-172 §3). Los quince temas de
   producto del catálogo fallan entre 7 y 16 pares —todos texto claro sobre el degradado de marca— y
   se aceptó a sabiendas. Si <PRODUCTO> quiere AA, exige 0 FAIL aquí y ajusta `inkFloor` hasta
   conseguirlo. Si no lo quiere, dilo explícitamente en el veredicto en vez de dejarlo en silencio.

3. Materialízalo como CLASE, no como vars en línea. Hay TRES vías y no son intercambiables
   (docs/02 §4). Elige a conciencia:

   a) EN BUILD, con `createTheme` — la de una landing con un tema fijo. Cuesta un nombre de clase.

        // <producto>/src/theme.css.ts
        import { createTheme } from "@vanilla-extract/css";
        import { vars, ThemeToVars } from "@stellaria/nebula-themes/web";
        import { producto_dark } from "./tema.js";

        export const producto_dark_class = createTheme(vars, ThemeToVars(producto_dark));

      Exige vanilla-extract en el build del producto. Si no lo tiene, ese es el primer hallazgo del
      encargo y hay que decirlo ANTES de seguir, porque cambia el coste de todo lo demás.

   b) EN CALIENTE, con `CompileTheme(theme)` — la de un tema que llega de un backend, uno por
      inquilino, o uno que se está editando en vivo. Devuelve `{ theme, className, css }` y no
      inyecta nada: tú decides dónde va el `<style>`, con qué nonce y en qué orden de capa.

   c) `assignInlineVars` — sólo para un árbol pequeño. En la raíz son 40 kB de atributo `style` en
      el HTML, y además BORRA la clase que el script acababa de pintar.

   SI EL PRODUCTO LLEVA VARIOS TEMAS, usa `CompileThemes(conjunto)`, no `CompileTheme` en bucle: la
   segunda emite una regla `:root` por tema y gana la última, así que todos acaban pintando el
   degradado del que cierra la lista. `CompileThemes` devuelve además `base` y `slices` (ADR-175),
   con lo que puedes incrustar en el HTML sólo el tema activo y servir el resto aparte. Regla dura:
   el CSS de un conjunto NO se mezcla con el de otro, porque cada uno calcula su base sobre lo que
   contiene.

   SI SIRVES EL RESTO POR UNA RUTA, firma la URL con el contenido. Marcarla `immutable` con URL fija
   deja la hoja clavada y tocar un tema no se ve nunca, ni en desarrollo. Mira
   `apps/web/src/lib/theme-rest.server.ts`: es exactamente ese patrón, resuelto.

4. Regístralo UNA vez y deriva de ahí el mapa del script, para que las dos listas no discrepen:

     const PRODUCTO = {
       "<producto>": {
         dark:  { theme: producto_dark,  className: producto_dark_class },
         light: { theme: producto_light, className: producto_light_class },
       },
     };

     <ThemeScript defaultTheme="<producto>" defaultScheme="dark"
                  themesClasses={ThemeScriptMap(PRODUCTO)} />
     <NebulaProvider themes={PRODUCTO} defaultTheme={{ theme: "<producto>", scheme: "dark" }}
                     applyTheme="root">

   Registrar es lo que hace que el tema sobreviva al refresco.

CHECKPOINT 1 — para y enseña el tema validado antes de tocar una sola página.

FASE 2 — LA RAÍZ
NebulaProvider en el layout raíz con applyTheme="root", y ThemeScript en el <head>.

LOS DOS EJES SON INDEPENDIENTES (ADR-166). Esto es lo que más cambió y lo que más código viejo
rompe:

  - `meta.name` es la IDENTIDAD y `meta.scheme` es el ESQUEMA. Son cosas distintas.
  - El esquema NO se deduce del nombre. Si leíste que «la clave que contenga dark se toma como
    oscura», eso era verdad hasta ADR-166 y hoy es falso. Llama a tus temas como quieras.
  - `setTheme("light")` cambia sólo el esquema y CONSERVA la identidad — es lo que un conmutador
    claro/oscuro necesita, y la landing no tiene que saber cómo se llaman sus propios temas.
    `setTheme({ theme, scheme })` cambia los dos.
  - En el DOM salen separados: `data-theme="<producto>" data-scheme="dark"`.
  - Cada eje se guarda en su clave, renombrables una a una con `storageKeys` (ADR-167). Una
    identidad que nadie reconoce cae a la oficial SIN llevarse el esquema por delante.

Y sobre el primer pintado:

  - Lo que pinta antes del primer frame es el ThemeScript, no el provider. Por eso el paso 3 no es
    opcional: sin clase registrada, la landing se ve con el tema por defecto hasta que hidrata.
  - El provider ADOPTA lo que el script pintó en un layout effect, o sea antes del pintado y no
    después de hidratar (ADR-169). Nacer ya en el tema pintado provocaba discrepancia de hidratación
    y por eso no se hace así.
  - Pásale el tema MATERIALIZADO, no el objeto pelado. Con `{ theme, className }` el provider no
    inyecta nada.
  - Necesitas el provider igual: 61 ficheros de componente leen `useTheme()`, y la data no-CSS del
    contrato —variantMap, spring, motion.tier, effects.glass.enabled, palettes— sólo vive en el
    objeto.

COOKIE O SCRIPT: LA REGLA ES EL MODO DE RENDER, NO EL NÚMERO DE TEMAS
Deshaz primero la confusión habitual: TENER VARIOS TEMAS NO PIDE COOKIE. El ThemeScript acepta un
mapa de N temas, todos precompilados como clase, y elige antes del primer pintado sin sacar ninguna
ruta de estático. Dieciséis temas por script es un caso resuelto, no un apaño.

Lo único que compra la cookie es que EL SERVIDOR SEPA el tema. Importa si el HTML varía por tema más
allá del CSS —otro árbol, otra imagen, analítica— y no importa si el tema es sólo CSS, porque los
bytes «correctos» del HTML no los ve nadie: el script ya pintó.

  - Landing ESTÁTICA (prerenderizada): NO leas la cookie. Tocar `cookies()` en el layout raíz saca
    la ruta ENTERA de prerenderizado, aunque leas una letra: el coste no es proporcional al trabajo,
    es binario. Hay dos precedentes medidos en este repo, `apps/web/src/lib/lang.ts` y ADR-175.
  - App YA DINÁMICA (autenticada, render por petición): lee la cookie. Esa ruta ya se renderiza por
    petición, así que no pagas nada nuevo y el HTML sale correcto.

Si dudas, mira si la ruta está en el prerender-manifest. Eso responde sin opinar.

Un límite real del camino del script: vive en localStorage, así que el servidor no puede saber el
tema aunque quiera.

FASE 3 — LA PÁGINA, COMPONENTE A COMPONENTE
Reconstruye la landing con el catálogo. No traduzcas el marcado actual: eso produce Nebula pintada
por encima de la estructura vieja. Empieza por la composición (Section, Hero, Nav, Footer) y baja.

Por cada pieza, tres preguntas y las tres se responden por escrito:
  1. ¿Existe el componente canónico? Si no, ¿es una composición de otros o es un hueco del catálogo?
  2. ¿Se consigue el aspecto de marca SÓLO con el tema y las props? Si necesitaste className, di
     exactamente qué propiedad no era alcanzable.
  3. ¿Quedó de servidor? Un componente de cliente arrastra al cliente todo lo que renderiza.

PARA LO DE MARCA QUE NO ES UN COMPONENTE —un logotipo en SVG, un fondo, un canvas— el tema publica
sus degradados como vars desde ADR-170:

    vars.gradient.brand.edge   // primera parada
    vars.gradient.brand.tip    // última
    vars.gradient.brand.image  // el linear-gradient entero

NO reconstruyas el eje con `primary.500 → accent.500`. Se hizo en la landing de Nebula y salía mal en
quince de los dieciséis temas: los degradados usan peldaños que no son el 500, y en uno el eje salía
literalmente invertido. Con las vars el SVG se retiñe solo, sin `useTheme()` y sin volverlo cliente.

SI UN CONTENEDOR TIENE QUE SER DE SERVIDOR y algo dentro necesita cliente, el patrón es una cáscara
de cliente que recibe children: lo que un componente de servidor pasa como children a uno de cliente
SIGUE SIENDO DE SERVIDOR. Está resuelto dos veces en el repo, `Hero/components/Surface.tsx` y
`Section/components/Surface.tsx`, y es lo que sacó del cliente a los dos dueños del elemento que
marca el LCP.

LO QUE YA SE SABE QUE NO ES ALCANZABLE POR TEMA — no lo investigues, verifica si te afecta:
  - Los puntos de ruptura. Ya NO están en `NebulaTheme`: ADR-174 los sacó del contrato porque una
    `@media` no puede leer una custom property, así que la promesa no se podía cumplir. Salen del
    token estático de @stellaria/nebula-tokens y son estructura de la librería. Además Charts, Form
    y TransferList llevan el px crudo y ni siquiera pasan por el helper.
  - Los delays de escalonado del Loader (0/140/280 ms y 0/110/220/330 ms) son literales.
  - El negro del letterbox del Player y la máscara del StarField son literales.

FASE 4 — EL VEREDICTO
Entrega docs/reviews/adopcion-<producto>-<fecha>.md con:
  - Qué porcentaje de la landing es Nebula sin override, contado en componentes y no a ojo.
  - La lista de overrides que quedaron, cada uno con el token que habría hecho falta.
  - El peso: HTML de la landing antes y después, y cuánto de eso es el tema. Mide el HTML en brotli
    a calidad 5, que es lo que mide el gate de rutas de este repo, no a la calidad por defecto: la
    diferencia entre las dos es de kilobytes y te hará sacar la conclusión contraria.
  - Cuántos componentes quedaron de servidor y cuáles no, con el motivo.
  - Los huecos del catálogo, si los hubo.
  - Si el producto NO pudo usar vanilla-extract, el coste que eso impuso.

No abras un ADR por tu cuenta. Los hallazgos que pidan cambiar Nebula se agrupan y los decide el
propietario.
```

---

## Los gates que corre CI, para que no te sorprendan

`pnpm turbo build typecheck lint test size check:slots check:contrast check:docs check:budget`

Los dos últimos no están en la lista de comandos de `CLAUDE.md` y son los que más veces se olvidan:
`check:docs` falla si tocaste una prop pública y no corriste `pnpm gen:docs`, y `check:budget` mide
el peso por ruta contra `apps/web/route-budget.json`. Súbelos cuando un cambio legítimo los rompa —
eso no es un checkpoint— pero deja escrito en el commit qué lo movió.

## El gate de C3 y en qué estado está

`docs/04` §5.3 fija cuatro criterios de «librería lista para migrar»:

| Criterio                                                          | Estado                                                                    |
| ------------------------------------------------------------------ | --------------------------------------------------------------------------- |
| 1. Canónicos implementados con contract testing                    | **cumplido** — 158 contratos, WN cerrada                                   |
| 2. Temas de la app creados y validados AA **en el Theme Creator**  | **bloqueado por la letra, no por el fondo** — `apps/theme-creator` sigue siendo `package.json` + `README.md` |
| 3. Playgrounds con todos los componentes                           | cumplido en web                                                            |
| 4. Bundle budgets en verde                                         | cumplido                                                                   |

El criterio 2 pide el Theme Creator, que no existe. Pero lo que el criterio quiere es **su salida**:
un `NebulaTheme` validado contra AA. Eso se consigue hoy sin GUI y con menos trabajo que cuando se
escribió el criterio: `BuildProduct` construye el tema entero desde diez campos, `gen:palette from`
saca las escalas y `check:contrast --theme` valida con el mismo motor que usaría el Creator
(`docs/02` §5.3).

Si prefieres respetar el gate a la letra, el encargo que falta es construir el Theme Creator
(`prompts/3-theme-creator/`) antes que éste. Es una decisión tuya, no un impedimento técnico.

---

## Lo que la primera ejecución dejó aprendido

Rosette pasó por este encargo entero el 2026-08-19. Esto es lo que se supo al hacerlo, y que la
versión anterior del prompt no podía decir.

### Cinco correcciones al propio encargo

**1 · vanilla-extract SÍ funciona bajo Turbopack, y la Fase 1 vía (a) está disponible.** El encargo
lo daba por un coste probable y la primera lectura fue que era imposible. Falso: el plugin lo
soporta, pero detrás de dos opciones que **no fallan al compilar**, que es lo que lo hace caro de
descubrir.

```ts
createVanillaExtractPlugin({
  unstable_turbopack: {
    mode: "auto",                     // sin esto arranca en "off" — la via de webpack — y bajo
                                      // Turbopack queda INERTE: el .css.ts se empaqueta como TS,
                                      // style() corre en runtime y revienta AL SERVIR con
                                      // «Styles were unable to be assigned to a file».
    glob: ["./src/**/*.css.ts"],      // el de fabrica se mete en node_modules e intenta RECOMPILAR
                                      // los .css.js ya compilados de Nebula; el build muere en
                                      // field.css.js con «Invalid exports», porque esos modulos
                                      // exportan funciones y el serializador solo escribe datos.
  },
});
```

El soporte está marcado experimental aguas arriba: clava la versión del plugin, no la dejes en rango.

**2 · pnpm 11 puede instalar una versión vieja sin avisar.** `pnpm add @stellaria/nebula-web` puede
traer la anterior aunque `latest` apunte a la nueva: el gate de `minimumReleaseAge` retiene lo
recién publicado. No hay error, sólo la pista `+ pkg 0.1.0 (1.0.0 is available)` entre el ruido.
Instala con la versión pineada.

**3 · `@stellaria/nebula-themes/web` sólo carga desde un bundler.** Reexporta un módulo que importa
un `.vanilla.css`; en Node puro suelta `ERR_UNKNOWN_FILE_EXTENSION`. Para validar o medir un tema
desde un script suelto hace falta un `registerHooks` de `node:module` que devuelva un módulo vacío
para todo lo que acabe en `.css`.

**4 · `component={Link}` NO cruza la frontera RSC.** `Button` lleva `"use client"`, y pasarle una
referencia a componente desde un componente de servidor revienta en tiempo de render con
«Functions cannot be passed directly to Client Components». **Compila y falla en producción.** Usa
`component="a"` y asume que pierdes el prefetch de `next/link`.

**5 · Para probar una versión de Nebula que aún no está en npm, empaqueta.** `pnpm pack` en cada
paquete y `overrides` apuntando a los `.tgz`. Enlazar el repo vecino con `link:` **no sirve**:
`tsc` sigue el symlink y `pnpm typecheck` pasa, pero `next build` cae con una veintena de
`Module not found` que señalan tus ficheros y no el enlace —Turbopack no resuelve paquetes
enlazados fuera de la raíz del proyecto—. Y si lanzas ese `pnpm install` desde Git Bash, los
symlinks salen con ruta MSYS (`/c/Users/…`) que Windows no sigue, con el mismo error.

Dos avisos sobre `minimumReleaseAge`, porque muerde dos veces:

- **Pinear la versión no basta.** El gate valida el **lockfile**, no lo que pides. Hay que listar
  cada paquete y versión en `minimumReleaseAgeExclude` de `pnpm-workspace.yaml`.
- **Mientras convivan dos versiones, lista las dos.** Si dejas sólo la nueva y el lockfile todavía
  dice la vieja, *cualquier* orden de pnpm muere en la comprobación de políticas antes de llegar al
  script — `pnpm start` incluido.

### Lo que el catálogo ganó desde entonces, y que ya puedes usar

- **`reveal`** en `Box`, `Card`, `Paper`, `GradientBorder`, `Alert`, `EmptyState`, `Stat`, `Feature`
  y `Table.Row`. `true` toma la entrada del catálogo; un objeto la afina, e `index` escalona una
  lista. **No está en los de formulario a propósito**: un campo que aparece animado estorba a quien
  va a rellenarlo. Para cualquier otro componente, `<Reveal component={X}>` lo renderiza sin
  envolverlo — que es la única vía cuando un envoltorio rompe el marcado, como en una fila de tabla.
- **`gradientBorder`** en `Card`, que reemplaza el patrón `<GradientBorder><Card/></GradientBorder>`
  y además hereda el radio de la tarjeta en vez de cuadrarlo a mano.
- **`momentum` en `Main`**, que es opcional y cambia cómo se siente la página entera. La rueda ya
  no mueve el scroll directamente: alimenta un resto que se consume con amortiguación exponencial,
  así que un golpe fuerte sigue corriendo y uno suave avanza igual sin quedarse clavado. Al llegar
  al borde frena del todo, estira hasta 280 px y **no vuelve a moverse hasta que la rueda para**:
  cada evento que llega mientras está bloqueado renueva el plazo en vez de saltárselo.
  **La trampa**: escribe la posición unas sesenta veces por segundo, así que no pongas
  `scroll-behavior: smooth` sobre el mismo elemento — se pelean y el resultado es un scroll que
  tirita sin que nada en la consola lo diga.
- **La entrada es CSS, no JavaScript.** `Reveal` no monta ningún componente de motion: el muelle del
  tema se muestrea a `linear()`. Sirve el estado oculto desde el servidor y sólo lo declara bajo
  `(scripting: enabled) and (prefers-reduced-motion: no-preference)`, así que sin scripts el
  contenido está.

### Lo que el encargo cuesta, medido

La landing de Rosette con Nebula pesa **115 kB brotli más** que la escrita a mano: +72 de JS, +25 de
CSS, +17 de HTML. A una página pequeña un sistema de diseño le cobra su coste fijo entero. **Dilo en
el veredicto y no lo maquilles**: lo que se compra a cambio no aparece en esa tabla, y la decisión
de si compensa es del propietario, no del que migra.

**Y no esperes que las optimizaciones del catálogo te lo bajen.** La misma landing medida con la
versión que sacó dieciséis componentes de `motion` pesa **139 B más**, no menos: el JS baja 2.547 B
y el reveal los devuelve en marcado y hoja. Lo que se ahorra en el catálogo se ahorra en las páginas
que usaban esos componentes, y una landing usa media docena. La cifra de arriba sigue en pie.

Dos renglones concretos que conviene esperar:

- El marcado triplica de tamaño. La causa es el sistema de clases atómicas: un `Box` con `display`,
  `direction`, `gap` y `align` emite cuatro clases con nombre hasheado largo, repetidas en cada
  celda de cada rejilla.
- `ThemeScript` y `NebulaProvider` arrastran los dos temas oficiales de Nebula por un import de CSS
  —efecto secundario, no se sacude en el árbol—: 6,2 kB brotli que el producto no usa, en todas sus
  rutas.

### El error que ninguna herramienta caza

`tsc` limpio, `next build` verde, HTTP 200, cero errores de consola y las secciones en el HTML
inicial **no significan que se vea bien**. En Rosette el hero salía cortado por la izquierda en
escritorio —la ranura lateral de `Hero` es `flex-shrink: 0; max-width: max-content`, así que una
imagen ancha empuja el cuerpo fuera del viewport— y era **invisible en móvil**, donde apila.

**Abre la página y mírala, en los dos esquemas.** Es un paso del encargo, no un extra.

### El CSS del producto sin migrar te pisará a Nebula

Si el producto trae una hoja global sin `@layer` que toque `*`, `html`, `body`, `a` o
`button, input`, se comerá a Nebula en silencio: **el CSS sin capa gana SIEMPRE al CSS en capa**, sin
importar especificidad ni orden. Baja esa hoja a layouts de las rutas que aún no migran, y deja en
la raíz sólo un reset mínimo dentro de una capa declarada **antes** que las de Nebula. Nebula no trae
reset global — su capa `nebula.reset` sólo normaliza clases de componente.

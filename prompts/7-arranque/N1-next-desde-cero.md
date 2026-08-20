# N1 — Un proyecto Next con Nebula, desde cero

> Para una sesión limpia. Modelo recomendado: **Opus 5**.
>
> **Esto NO es una migración.** C1 (`prompts/6-consumidores/`) toma un producto que ya existe y lo
> retiñe. Esto arranca uno vacío: `create-next-app`, el tema, la raíz, y **una primera pantalla que
> funcione de verdad** — no un «hola mundo» con un botón. Sirve para cualquier producto; donde diga
> `<PRODUCTO>` pon el tuyo.
>
> **Escrito el 2026-08-19**, después de ejecutar C1 entero sobre Rosette. Cada dato de aquí está
> medido sobre ese encargo, no previsto. Si encuentras una instrucción que contradice al código,
> gana el código y se anota.

---

## Lo que ya está comprobado (no lo vuelvas a averiguar)

| Hecho | Valor |
| --- | --- |
| Consumir Nebula desde fuera del monorepo | npm, `@stellaria/nebula-web@1.0.0` y hermanos |
| ¿Hace falta vanilla-extract para consumirlo? | **No.** `dist` trae 136 `.vanilla.css` ya compilados |
| ¿Y `styles.css`? | 103 bytes: sólo el orden de capas. Impórtalo igual |
| ¿Trae reset global? | **No.** `nebula.reset` sólo normaliza clases de componente |
| Temas listos sin escribir ninguno | **16**, cada uno con subpath propio |
| Escribir un tema propio | `BuildProduct` desde una semilla de diez campos |
| Variables del contrato CSS | 627 |
| Un tema compilado | ~50 kB crudos · **~6,4 kB brotli** |
| Peso base que el catálogo impone | ~66 kB brotli de provider + su CSS |

---

```
Actúa como ingeniero de arranque. Vas a levantar <PRODUCTO> desde cero: un proyecto Next con Nebula,
su propio tema y una primera pantalla real. Al terminar, alguien tiene que poder clonar, instalar y
ver algo que funciona.

LEE ANTES: CLAUDE.md, docs/02-theming.md (§2 el contrato, §4 las tres vías de materializar),
docs/03-a11y-motion-performance.md §2, y prompts/6-consumidores/C1-landings-a-nebula.md — en
concreto su sección final «Lo que la primera ejecución dejó aprendido», que es donde están los
errores caros ya cometidos.

REGLA QUE NO SE ROMPE
No modificas Nebula para que <PRODUCTO> encaje. Si algo no se puede expresar con el tema o con las
props, NO lo arregles con un override de CSS: anótalo como hallazgo con el nombre del token que
falta, y sigue. Un override funciona hoy y se rompe en la siguiente versión.


FASE 0 — EL PROYECTO

  pnpm create next-app@latest <producto> --ts --app --no-tailwind --no-src-dir=false

  Sin Tailwind: dos sistemas de utilidades compitiendo por las mismas propiedades es exactamente el
  problema que Nebula viene a quitar.

  pnpm add @stellaria/nebula-web@1.0.0 @stellaria/nebula-themes@1.0.0 \
           @stellaria/nebula-tokens@1.0.0 @vanilla-extract/dynamic
  pnpm add @fontsource-variable/geist @fontsource-variable/geist-mono

  LAS VERSIONES VAN PINNEADAS, y no es manía: el gate de `minimumReleaseAge` de pnpm 11 retiene lo
  publicado hace poco e instala la anterior SIN AVISAR. La única pista es
  `+ pkg 0.1.0 (1.0.0 is available)` entre el ruido de la instalación, y el síntoma es que faltan
  subpaths — o sea que parece un fallo del paquete.

  `@vanilla-extract/dynamic` es un peer en tiempo de ejecución de `nebula-themes`, no un plugin de
  build. Geist es la tipografía del contrato: sin las fuentes, `font.family.sans` cae al fallback.

  DE DÓNDE SE IMPORTA CADA COSA — compruébalo antes de escribir una línea:

    @stellaria/nebula-themes         LoadTheme · BuildProduct · Themes · THEME_NAMES · FlipScale
                                     THEMES_SEEDS · type ThemeSeed · type SeedName
    @stellaria/nebula-themes/web     vars · CompileTheme · CompileThemes · ThemeScriptMap
    @stellaria/nebula-themes/<tema>       ese tema, los dos esquemas
    @stellaria/nebula-themes/<tema>/web   sus clases y su CSS ya compilado
    @stellaria/nebula-web            los componentes, NebulaProvider y ThemeScript
    @stellaria/nebula-tokens         palettes · breakpoints · animation · los tipos del tema

  `vars` NO sale de `nebula-web`. Y `nebula-themes/web` sólo carga desde un bundler: en Node puro
  revienta por un `.vanilla.css`, así que un script de validación necesita un `registerHooks` que
  devuelva un módulo vacío para todo lo que acabe en `.css`.


FASE 1 — EL TEMA, ANTES QUE LA PANTALLA

  No empieces por los componentes. Un tema a medias hace que juzgues mal cada pieza.

  PRIMERO PREGUNTA SI HACE FALTA. El paquete trae DIECISÉIS temas terminados. Si la marca cae cerca
  de uno, adoptarlo es una línea y cero mantenimiento:

    import { CLASSES, CSS } from "@stellaria/nebula-themes/<tema>/web";

  Deja escrito por qué sí o por qué no. «La marca es #XXXXXX y el más cercano está a N de distancia»
  es una respuesta; «queríamos el nuestro» no lo es.

  SI HACE FALTA UNO PROPIO, se construye desde una semilla, no a mano:

    const SEED = {
      name: "<producto>" as SeedName,   // el cast es obligatorio: SeedName es la union cerrada de
                                        // los dieciseis. En ejecucion funciona — meta.name es string.
      primary: palettes.<x>,            // o tu escala de `pnpm gen:palette from "#hex"`
      accent:  palettes.<y>,
      from:    palettes.<x>["500"],     // primera parada del degradado de marca
      to:      palettes.<y>["400"],     // ultima
      tint:    palettes.<x>["900"],     // el tinte del lienzo
      wash:    0.009,
      lift:    -12,
      inkFloor: 2,
      angle:   100,
    } satisfies ThemeSeed;

    export const dark  = BuildProduct(SEED, "dark");
    export const light = BuildProduct({ ...SEED, lift: 0 }, "light");

  DOS SEMILLAS, UNA POR ESQUEMA, Y NO ES UN CAPRICHO. En claro el `lift` cambia de signo: los tonos
  SUBEN. El lienzo claro de Nebula ya arranca en `#ffffff`, `#fbfbfb`, `#f8f8f8`, así que subirlo
  doce puntos lo satura contra el blanco — `overlay`, `base`, `raised`, `hover` y `active` colapsan
  los cinco en `#ffffff`, de ocho papeles quedan tres tonos, y un `Card` sobre una `Section`
  desaparece salvo por el borde. Con `lift: 0` sobreviven cinco. No falla, sólo se queda plano.

  DOS COSAS QUE `BuildProduct` NO HACE, y que tendrás que sobrescribir encima:

    - Sólo retiñe `gradients.brand`. `accent` y `surface` se quedan con el violeta y el índigo de la
      base, así que en un producto que no sea morado, se ve.
    - No expone tipografía. Si la marca tiene una propia, se escribe sobre el objeto que devuelve.

  VALIDA con el mismo motor que el gate de CI: `LoadTheme(theme)` para el esquema, y
  `pnpm check:contrast -- --theme <ruta>.json` para el contraste — 186 pares por tema. Nebula sólo
  certifica AA para `nebula`; si <PRODUCTO> quiere AA, exige 0 FAIL y ajusta `inkFloor`. Si no lo
  quiere, DILO EXPLÍCITAMENTE en el veredicto en vez de dejarlo en silencio.

  MATERIALÍZALO COMO CLASE, y regístralo una sola vez para que las listas no discrepen:

    const COMPILED = CompileThemes({ <producto>: { dark, light } });
    export const CLASSES = COMPILED.classes;      // esto va tal cual a ThemeScript
    export const CSS = COMPILED.css;
    export const THEMES = {
      <producto>: {
        dark:  { theme: dark,  className: CLASSES.<producto>.dark },
        light: { theme: light, className: CLASSES.<producto>.light },
      },
    };

  `CompileThemes` y no `CompileTheme`: la segunda emite una regla `:root` por tema, así que con dos
  esquemas gana el último y los dos acaban pintando el mismo degradado.

CHECKPOINT 1 — para y enseña el tema validado antes de tocar una pantalla.


FASE 2 — LA RAÍZ

  El layout raíz, en este orden:

    import "@fontsource-variable/geist";
    import "@fontsource-variable/geist-mono";
    import "./base.css";                       // TU reset, en su capa
    import "@stellaria/nebula-web/styles.css";  // el orden de capas de Nebula

    <html lang={locale} suppressHydrationWarning>
      <head>
        <ThemeScript defaultTheme={NOMBRE} defaultScheme="dark"
                     themesClasses={CLASSES} themesCSS={CSS} />
      </head>
      <body className={body}>
        <NebulaProvider applyTheme="root" themes={THEMES}
                        defaultTheme={{ theme: NOMBRE, scheme: "dark" }}>
          {children}
        </NebulaProvider>
      </body>
    </html>

  `suppressHydrationWarning` porque el script escribe `class`, `data-theme` y `data-scheme` en el
  `<html>` antes de que React hidrate: sin eso React se queja de la discrepancia que buscabas.

  EL SCRIPT ES QUIEN PINTA, no el provider. Y `themesCSS` va en la misma llamada a propósito: el
  `<style>` lo emite el propio script pegado a sí mismo, porque separarlos es una carrera y la clase
  puede llegar antes que la regla.

  EL RESET ES TUYO. Nebula no trae uno global. `base.css` con lo mínimo —`box-sizing`, el margen del
  `body`— y DENTRO DE UNA CAPA declarada antes que las de Nebula:

    @layer legacy;
    @layer legacy { *, *::before, *::after { box-sizing: border-box } body { margin: 0 } }

  El CSS sin capa gana SIEMPRE al CSS en capa, da igual la especificidad y da igual el orden. Un
  `a { color: inherit }` suelto se come el color de cualquier enlace de Nebula sin que nada avise.

  EL LIENZO DEL DOCUMENTO puede ir en un `.css.ts` leyendo `vars` — y entonces se retiñe con el
  tema — pero eso exige configurar vanilla-extract, y bajo Turbopack son DOS opciones que no fallan
  al compilar:

    createVanillaExtractPlugin({
      unstable_turbopack: { mode: "auto", glob: ["./src/**/*.css.ts"] },
    })

    - sin `mode: "auto"` el plugin arranca en la vía de webpack y queda INERTE: el `.css.ts` se
      empaqueta como TypeScript, `style()` corre en runtime y revienta AL SERVIR.
    - sin acotar el `glob`, se mete en `node_modules` e intenta recompilar los `.css.js` YA
      compilados de Nebula, y el build muere con «Invalid exports».

  Si no quieres esa configuración, un `style` en línea sobre el `<body>` con `vars.color.surface.base`
  hace lo mismo sin compilar nada. Decide y déjalo escrito.

  COOKIE O SCRIPT: la regla es el modo de render, no el número de temas. Tener varios temas NO pide
  cookie — el script acepta un mapa de N, todos precompilados, y elige antes del primer pintado. Lo
  único que compra la cookie es que el SERVIDOR sepa el tema, y eso sólo importa si el HTML varía
  por tema más allá del CSS. En una ruta estática, tocar `cookies()` la saca ENTERA de
  prerenderizado, y el coste no es proporcional: es binario.

CHECKPOINT 2 — para y enseña el HTML que sirve `next start`, no el que compila.


FASE 3 — LA PRIMERA PANTALLA

  Una pantalla real. Elige la que el producto necesita primero y constrúyela entera: un panel con
  datos, un formulario que valide, una lista con estado vacío. No un catálogo de componentes.

  EMPIEZA POR LA COMPOSICIÓN y baja: `Main` da el armazón —barra, pie, fondo y enlace de salto, con
  el `<main>` como landmark—, después `Nav`, `Section` o `Hero`, y sólo entonces el contenido.

  DE SERVIDOR POR DEFECTO. Un componente de cliente arrastra al cliente todo lo que renderiza, así
  que `"use client"` se escribe cuando hay estado, un evento del navegador o una API que sólo existe
  allí — y no antes. Cuando un contenedor tiene que ser de servidor y algo dentro necesita cliente,
  el patrón es una cáscara de cliente que recibe `children`: lo que un componente de servidor pasa
  como children a uno de cliente SIGUE SIENDO DE SERVIDOR.

  Por cada pieza, tres preguntas y las tres se responden por escrito:
    1. ¿Existe el componente canónico? Si no, ¿es composición de otros o es un hueco del catálogo?
    2. ¿Se consigue el aspecto SÓLO con el tema y las props? Si necesitaste `className`, di
       exactamente qué propiedad no era alcanzable.
    3. ¿Quedó de servidor? Si no, ¿por qué exactamente?

  PARA LO DE MARCA QUE NO ES UN COMPONENTE —un logotipo, un fondo, un canvas— el tema publica sus
  degradados como vars:

      vars.gradient.brand.edge · .tip · .image

  NO reconstruyas el eje con `primary.500 → accent.500`: los degradados usan peldaños que no son el
  500, y en uno de los dieciséis temas el eje sale literalmente invertido. Con las vars, un SVG en
  línea se retiñe solo, sin `useTheme()` y sin volverse cliente.

  LAS ENTRADAS, si las quieres: `reveal` está en `Box`, `Card`, `Paper`, `GradientBorder`, `Alert`,
  `EmptyState`, `Stat`, `Feature` y `Table.Row`. `index` escalona una lista. Para cualquier otro
  componente, `<Reveal component={X}>` lo renderiza sin envolverlo. No lo pongas en campos de
  formulario: un campo que aparece animado estorba a quien va a rellenarlo.

  LO QUE YA SE SABE QUE NO ES ALCANZABLE POR TEMA — no lo investigues, verifica si te afecta:
    - Los puntos de ruptura. Salen del token estático de `@stellaria/nebula-tokens` (ADR-174),
      porque una `@media` no puede leer una custom property.
    - `Button` no expone `target` ni `rel`: un CTA externo no puede abrir en pestaña nueva.
    - `leftSection` existe en `TextInput` pero no en `NativeSelect` ni en `NumberInput`.
    - `Card` no acepta `component`: una región nombrada necesita un `Box` alrededor.
    - La ranura lateral de `Hero` es `flex-shrink: 0; max-width: max-content`, así que un hijo ancho
      empuja el cuerpo fuera del viewport. Acota el hijo.

CHECKPOINT 3 — LEVANTA LA APLICACIÓN Y MÍRALA, en los dos esquemas y en móvil.

  Esto es un paso, no un extra. `tsc` limpio, `next build` verde, HTTP 200, cero errores de consola
  y el contenido en el HTML inicial NO significan que se vea bien. En la primera ejecución de C1 el
  hero salía cortado por la izquierda en escritorio y era invisible en móvil, donde apila.


FASE 4 — EL VEREDICTO

  Entrega `docs/reviews/arranque-<producto>-<fecha>.md` con:
    - Qué porcentaje de la pantalla es Nebula sin override, contado en componentes y no a ojo.
    - Los overrides que quedaron, cada uno con el token que habría hecho falta.
    - El peso: HTML, JS y CSS de la ruta, en brotli a calidad 5 —no a la calidad por defecto, que la
      diferencia son kilobytes y te hará sacar la conclusión contraria— y cuánto de eso es el tema.
    - Cuántos componentes quedaron de servidor y cuáles no, con el motivo.
    - Los huecos del catálogo, si los hubo.
    - Si AA aplica o no, dicho explícitamente.

  Espera un coste fijo alto: el catálogo cobra su provider, su CSS de componente y `react-aria`
  aunque la pantalla sea pequeña. Da el número sin maquillarlo. La decisión de si compensa es del
  propietario, no tuya.

No abras un ADR por tu cuenta. Los hallazgos que pidan cambiar Nebula se agrupan y los decide el
propietario.
```

---

## Los gates que corre CI, si acabas tocando Nebula

`pnpm turbo build typecheck lint test size check:slots check:contrast check:docs check:budget`

Los dos últimos son los que más se olvidan: `check:docs` falla si tocaste una prop pública y no
corriste `pnpm gen:docs`, y `check:budget` mide el peso por ruta. Súbelos cuando un cambio legítimo
los rompa, pero deja escrito en el commit qué lo movió.

## Qué NO cubre este encargo

- **La migración de un producto que ya existe.** Eso es C1.
- **Autenticación, datos, despliegue.** Aquí sólo se levanta la casa.
- **La segunda pantalla.** Si la primera salió limpia, la segunda es repetición; si no salió limpia,
  la segunda no arregla nada.

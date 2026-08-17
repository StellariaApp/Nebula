# C1 — Las landings de producto pasan a Nebula al 100%

> Para una sesión limpia por producto. Modelo recomendado: **Opus 5**.
>
> **Esto NO es la migración de C3.** `docs/04` §5 planifica fonicredito y tfv como codemod y
> migración total de la app entera. Esto es sólo **la landing**: la superficie más pequeña que
> demuestra que un producto se retiñe entero sin tocar Nebula. Si la landing no sale limpia, la app
> tampoco va a salir.

---

## Lo que ya está comprobado (no lo vuelvas a averiguar)

Medido sobre el repo el 2026-08-17. Estos números son el punto de partida del encargo:

| Hecho                                                              | Valor                                                          |
| ------------------------------------------------------------------ | -------------------------------------------------------------- |
| Variables del contrato CSS                                          | **627**                                                         |
| Peso de un tema propio inyectado en línea (`assignInlineVars`)      | **≈40 KB** de atributo `style`                                  |
| Peso de un tema materializado como clase (`createTheme`)            | un nombre de clase                                              |
| Matriz de variantes resuelta una vez por tema (ADR-150)             | 49 combinaciones × 8 valores                                    |
| Componentes que leen `useTheme`                                     | **61 de 158**                                                   |
| Componentes de servidor                                             | **38 de 158**                                                   |
| Secciones de `NebulaTheme` que **no** llegan al CSS                 | `breakpoints`                                                   |
| Componentes con breakpoint en px crudo                              | 4 (`Charts`, `Form`, `TransferList` ×2)                         |

---

```
Actúa como ingeniero de migración en C:\Users\Skr13\Documents\GitHub\Nebula y en el repositorio de
<PRODUCTO>. El objetivo es que la landing de <PRODUCTO> se construya al 100% con Nebula y con su
propio tema, sin un solo estilo de producto que dependa de conocer Nebula por dentro.

LEE ANTES: CLAUDE.md, docs/02-theming.md (§2 el contrato, §4 el runtime), docs/04-migration-map.md
§5 (la decisión C3 y su gate), ADR-150 (la matriz de variantes), ADR-155 (el script de arranque
acepta temas propios), ADR-121 (setTheme acepta un tema entero), y .claude/skills/project-guardrails.

REGLA QUE NO SE ROMPE
No modificas Nebula para que <PRODUCTO> encaje. Si algo no se puede expresar con el tema, NO lo
arregles con un override en el producto ni con un parche en la librería: anótalo como hallazgo con
el nombre del token que falta, y sigue. El valor de este encargo está justamente en la lista de lo
que no se pudo hacer sin tocar el núcleo. Un override de CSS en el producto es un fracaso
silencioso: funciona hoy y se rompe en la siguiente versión.

FASE 1 — EL TEMA ANTES QUE LA PÁGINA
No empieces por los componentes. Un tema a medias hace que juzgues mal cada pieza.

El tema de producto es un NebulaTheme COMPLETO. LoadTheme no acepta parciales ni tiene defaults:
o está entero o no valida. No existe helper para derivar un tema de otro, así que se parte de una
copia de packages/themes/src/themes/nebula-dark.ts (o light) y se editan los valores.

1. Saca las paletas del color de marca, no las escribas a mano:
     pnpm gen:palette from "#<hex de marca>" --name <producto> --json
   Da la escala 50-950 en OKLCH. Repite por cada semilla que el producto necesite.

2. Escribe el tema como JSON y valídalo con el MISMO motor que el gate de CI:
     pnpm check:contrast -- --theme <ruta>.json
   Tiene que salir 0 FAIL. Las deudas declaradas de ADR-161 saldrán como DEUDA y no cuentan como
   fallo; cualquier otra cosa en rojo es tuya y se arregla antes de seguir.

   OJO: el gate por defecto recorre tres temas (el de humo, light y dark). Con --theme recorre sólo
   el tuyo. Son 186 pares por tema.

3. Materialízalo como CLASE, no como vars en línea. Esto no es una optimización, es la diferencia
   entre 40 KB de atributo style en el HTML y un nombre de clase:

     // <producto>/src/theme.css.ts
     import { createTheme } from "@vanilla-extract/css";
     import { vars, ThemeToVars } from "@stellaria/nebula-web";
     import { LoadTheme } from "@stellaria/nebula-themes";
     import theme_json from "./tema.json";

     export const producto_class = createTheme(vars, ThemeToVars(LoadTheme(theme_json)));

   `vars`, `ThemeToVars` y `themeClass` son API pública de @stellaria/nebula-web. Esto exige que el
   producto tenga vanilla-extract en su build. Si no lo tiene, ese es el primer hallazgo del
   encargo y hay que decirlo antes de seguir, porque cambia el coste de todo lo demás.

4. Regístralo en el script de arranque para que sobreviva al refresco sin parpadeo (ADR-155):

     <ColorSchemeScript themes={{ "<producto>-dark": producto_class }} defaultTheme="<producto>-dark" />

   El nombre importa: el script deduce el scheme buscando "dark" en la clave. Nómbralo como los
   oficiales o `color-scheme` saldrá al revés.

CHECKPOINT 1 — para y enseña el tema validado antes de tocar una sola página.

FASE 2 — LA RAÍZ
NebulaProvider en el layout raíz, con applyTheme="root" y el ColorSchemeScript en el <head>.

Sabe esto antes de cablearlo, porque es la arista real del diseño actual:

- Con applyTheme="root" el provider aplica el tema en un useEffect, o sea DESPUÉS de hidratar. Lo
  que pinta antes del primer frame es el ColorSchemeScript. Por eso el paso 3 de la fase 1 no es
  opcional: sin la clase registrada, la landing se ve con el tema por defecto hasta que hidrata.

- El provider NO sabe que tu tema ya existe como clase. Si le pasas el objeto NebulaTheme como
  defaultTheme, va a inyectar las 627 vars igualmente. Hoy no hay forma de decirle «la CSS ya está
  puesta, tú sólo lleva el objeto». Mídelo en tu caso: si el HTML de la landing crece ~40 KB, es
  esto. Anótalo como hallazgo con ese número medido, no estimado.

- Necesitas el provider de todas formas: 61 de los 158 componentes leen useTheme, y la data no-CSS
  del contrato (variantMap, spring, motion.tier, effects.glass.enabled, gradients, palettes) sólo
  vive en el objeto. No es opcional ni se puede sustituir por la clase.

- Un tema propio NO se persiste por nombre: setTheme guarda su meta.scheme y al recargar cae al
  tema oficial de ese scheme. Si la landing tiene selector de tema, el selector lo guarda el
  producto, no Nebula.

FASE 3 — LA PÁGINA, COMPONENTE A COMPONENTE
Reconstruye la landing con el catálogo. No traduzcas el marcado actual: eso produce Nebula pintada
por encima de la estructura vieja. Empieza por la composición (Section, Hero, Nav, Footer) y baja.

Por cada pieza, tres preguntas y las tres se responden por escrito:
  1. ¿Existe el componente canónico? Si no, ¿es una composición de otros o es un hueco del catálogo?
  2. ¿Se consigue el aspecto de marca SÓLO con el tema y las props? Si necesitaste className, di
     exactamente qué propiedad no era alcanzable.
  3. ¿Quedó de servidor? Un componente de cliente arrastra al cliente todo lo que renderiza.

LO QUE YA SE SABE QUE NO ES ALCANZABLE POR TEMA — no lo investigues, verifica si te afecta:
  - breakpoints: están en el contrato NebulaTheme y los leen los hooks de JS, pero NO llegan al CSS.
    Las media queries de los componentes salen del token estático de @stellaria/nebula-tokens. Un
    producto no puede mover los puntos de corte del layout desde su tema. Además Charts, Form y
    TransferList llevan el px crudo y ni siquiera pasan por el helper.
  - Los delays de escalonado del Loader (0/140/280 ms y 0/110/220/330 ms) son literales.
  - El negro del letterbox del Player y la máscara del StarField son literales.

FASE 4 — EL VEREDICTO
Entrega docs/reviews/adopcion-<producto>-<fecha>.md con:
  - Qué porcentaje de la landing es Nebula sin override, contado en componentes y no a ojo.
  - La lista de overrides que quedaron, cada uno con el token que habría hecho falta.
  - El peso: HTML de la landing antes y después, y cuánto de eso es el tema.
  - Los huecos del catálogo, si los hubo.
  - Si el producto NO pudo usar vanilla-extract, el coste que eso impuso.

No abras un ADR por tu cuenta. Los hallazgos que pidan cambiar Nebula se agrupan y los decide el
propietario.
```

---

## El gate de C3 y en qué estado está

`docs/04` §5.3 fija cuatro criterios de «librería lista para migrar». Antes de lanzar este encargo,
sabe dónde estás:

| Criterio                                            | Estado                                                                                                                                 |
| --------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| 1. Canónicos implementados con contract testing      | **cumplido** — 158 componentes, WN cerrada                                                                                              |
| 2. Temas de la app creados y validados AA **en el Theme Creator** | **bloqueado por la letra, no por el fondo** — `apps/theme-creator` es un stub con `package.json` y `README.md` y nada más |
| 3. Playgrounds con todos los componentes             | cumplido en web                                                                                                                         |
| 4. Bundle budgets en verde                           | cumplido                                                                                                                                |

El criterio 2 pide el Theme Creator, que no existe. Pero lo que el criterio quiere es **su salida**:
un `NebulaTheme` validado contra AA. Eso se consigue hoy sin GUI, y es lo que la fase 1 de arriba
encarga: `gen:palette from` para las escalas y `check:contrast --theme` para la validación — el
mismo motor que usaría el Creator, según `docs/02` §5.3.

Si prefieres respetar el gate a la letra, el encargo que falta es construir el Theme Creator
(`prompts/3-theme-creator/`) antes que éste. Es una decisión tuya, no un impedimento técnico.

# ADR-115 — La demo vive una sola vez

- **Estado**: aceptada · 2026-08-08 · **DS2**
- **Cambia API pública**: no. Nace `@stellaria/nebula-demos`, privado y **nunca publicado**.
- Implementa el **principio 3** de la fase DS y desbloquea DS2.2 (landing) y DS3 (las 158 fichas).

## Contexto

El playground tiene **96 archivos de stories** y el sitio público necesita enseñar ejemplos de los
mismos 158 componentes. Sin un sitio común, cada ejemplo se escribe dos veces y diverge a la primera
semana: la story sigue el cambio de API porque la rompe el typecheck, y el ejemplo del sitio no.

Y hay una razón más fuerte que el duplicado: **el sitio tiene que enseñar el código que ejecuta**.
Si el bloque de código es una copia escrita a mano, puede mentir. Si es el mismo archivo importado
dos veces —como componente y como texto— no puede.

`apps/` no vale: **una app no puede depender de otra app**, lo prohíbe el grafo de una sola dirección
de `docs/01` §8, y las dos apps necesitan las mismas demos.

## Decisión

**`packages/demos` es un escalón nuevo del grafo, justo después de `web`.**

```
tokens → hooks/themes/icons → web/native → demos → apps
```

Depende de `web`, `tokens`, `themes` e `icons`, y de nada más. Es `private: true` y no se publica
nunca: existe para que dos apps del monorepo compartan archivos, no para un consumidor.

### El contrato de un archivo de demo

Un archivo, una demo, `export default` de un componente **sin props**. Cinco reglas:

1. **Se lee como código de consumidor.** Importa de `"@stellaria/nebula-web"`, nunca por ruta
   interna. Lo que se ve es lo que alguien copia y pega.
2. **Cero fixtures de test, cero assertions, cero utilidades del playground.** Nada de `ThemeMatrix`,
   `MATRIX_A11Y` ni `play()`.
3. **Autónoma.** Sus datos de ejemplo van dentro del archivo.
4. **Se ve bien en los cuatro temas y en claro y oscuro.** Si una demo solo funciona en dark, la
   demo está mal, no el tema.
5. **Sin estado global ni efectos de arranque.** Una demo se monta y se desmonta muchas veces en la
   misma página del sitio.

### El código que se enseña es el que se ejecuta

El sitio importa el mismo `.tsx` dos veces: como componente y como texto crudo. **No hay una segunda
copia que pueda mentir.**

### El paquete se consume como fuente, no como `dist`

Es la única desviación deliberada del checklist de la skill `monorepo-workspace`, y tiene tres
motivos:

- **El sitio necesita el `.tsx`**, no el `.js` compilado: lo lee como texto para enseñarlo.
- **Los dos consumidores son bundlers dentro del monorepo** —Vite en el playground, Turbopack en el
  sitio—, nunca Node directo. El motivo por el que el resto del monorepo compila a `dist` con
  especificador ESM explícito no aplica aquí.
- **Es privado**, así que un `dist` no le da nada a nadie.

Conserva `typecheck` y `lint`; lo que no tiene es `build`. El precedente está en `tools/`, que ya son
paquetes privados consumidos desde fuente.

### Y por eso sus imports van SIN extensión

El monorepo exige el especificador ESM explícito (`./x.js`) porque su `dist` se ejecuta en Node sin
bundler. Aquí no hay `dist`, y **Turbopack no resuelve `./x.js` a `./x.tsx`** (ADR-107 §6): el sitio
rompía con «module not found» en un import que Vite sí aceptaba.

Los imports relativos de este paquete y los subpaths con los que se consume van **sin extensión**, que
es lo que entienden los dos bundlers. `tsconfig.base` ya usa `moduleResolution: "bundler"`, así que
`tsc` lo acepta sin tocar nada. El mapa de `exports` sí la lleva —`"./*": "./src/*.tsx"`— porque
TypeScript necesita que el destino apunte a un archivo real.

### Los metadatos van aparte y son lo único que se traduce

Cada carpeta de componente lleva un `demos.ts` con el registro de sus demos: `id`, el componente y su
`title`/`description`. **El `.tsx` no se duplica por idioma NUNCA**; el sitio traduce por clave desde
su diccionario y cae al texto del registro si no hay traducción.

Los textos visibles dentro de la demo se quedan en inglés, que es lo que
[ADR-114](ADR-114-el-jsdoc-publico-se-escribe-en-ingles.md) decide para toda la superficie pública.

## Lo que NO es una demo, y por eso el barrido rinde menos de lo que parece

Una story y una demo no son lo mismo. De las stories de una familia, solo una parte enseña un uso:

| Bucket                | Ejemplo                                                        | Destino          |
| --------------------- | -------------------------------------------------------------- | ---------------- |
| **Demo**              | `Variants`, `Sizes`, `WithSections`, `Composition`             | `packages/demos` |
| **Gate**              | `KeyboardActivation`, `DisabledIsNotFocusable`, `KeyboardFlow` | se queda         |
| **Matriz de tema**    | `AllThemes`, `Dark`, `Light`                                   | se queda         |
| **Parámetro de gate** | `ReducedMotion`                                                | se queda         |
| **Trivial**           | `Default` (solo `args`)                                        | se queda         |

Las tres últimas categorías son **la razón de ser del playground**: alimentan axe, el gate de teclado,
el de reduced-motion y el baseline visual de [ADR-037](ADR-037-gate-de-regresion-visual.md). Sacarlas
de ahí sería vaciar los gates para llenar el sitio.

## Alternativas descartadas

**Que el sitio importe las stories.** Arrastraría `@storybook/react-vite` y `storybook/test` al grafo
del sitio, y con ellos los fixtures y las assertions. El bloque de código enseñaría `render: (args)
=> …`, que no es código que nadie pueda pegar en su proyecto.

**Escribir los ejemplos del sitio a mano.** Es lo que hace la mayoría, y es exactamente el fallo que
este ADR evita: dos fuentes para lo mismo, y solo una la protege el typecheck.

**Editor en vivo (Sandpack) en v1.** Pesa más que todo el resto del sitio junto. El contrato de un
archivo de demo no cambia si se añade después.

## Consecuencias

- **Un escalón nuevo en el grafo de `docs/01` §8**, que hay que reflejar ahí.
- El playground pierde el ejemplo y **conserva el gate**: las stories importan la demo y mantienen su
  `play()`.
- Las demos nuevas **nacen ya en `packages/demos`**; las 96 stories se vacían de forma incremental,
  no de golpe.
- **El paquete no entra en ningún presupuesto de `size-limit`**: no se publica y no llega a ningún
  consumidor.

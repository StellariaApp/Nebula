# Prompts DS1 — Fundación del sitio

> 3 prompts secuenciales. **DS1.1 es bloqueante**: hasta que no diga en qué bundler compila Vanilla
> Extract, no se escribe ni una página. No requiere ninguna fase cerrada.

---

## Prompt DS1.1 — Spike de riesgo: Nebula dentro de Next 16

```text
Actúa como ingeniero de plataforma en C:\Users\Skr13\Documents\GitHub\Nebula.

Fase DS — la web pública. Este es el spike bloqueante: decide si el sitio se construye sobre
Next 16 o si hay que ir al plan B. NO escribas documentación ni contenido en este prompt.

LEE ANTES
  1. CLAUDE.md — guardrails y política de trabajo con el propietario.
  2. prompts/1.5-docs-site/README.md — la fase entera y por qué este spike existe.
  3. docs/01-architecture.md §monorepo y §8 (política de deps) + la tabla de stack verificado.
  4. docs/adr/ADR-038 (qué componentes son cliente por construcción) y ADR-030 (portales).
  5. packages/web/package.json — exports, subpaths y sideEffects.
  6. docs/adr/ADR-012 — la contingencia TS 7 / 5.9. El sitio es una app, no librería.

EL SPIKE SEPARA DOS PREGUNTAS. No las mezcles: la primera es irrenunciable y la segunda no.

  P1 · ¿Se sirve el CSS DEL PAQUETE en Next 16?
      packages/web compila sus .css.ts con Vite en tiempo de build, así que su dist emite CSS
      plano. Un consumidor no debería necesitar el plugin de Vanilla Extract solo para usar la
      librería. VERIFÍCALO: si es cierto, el README de W5.1 tiene que dejar de pedir el plugin
      como requisito universal; si es falso, di exactamente qué lo obliga.
      Esto NO es opcional: es la promesa que W5.2 verifica en un proyecto virgen.

  P2 · ¿Puede el SITIO escribir sus propias hojas .css.ts?
      Es deseable, no imprescindible. Si el plugin no funciona con el bundler por defecto de
      Next 16, la salida no es pelearse con la config: es que el sitio se pinte SOLO con las
      props de estilo de Nebula (ADR-103, 128 props responsive). Eso es mejor dogfooding y
      además demuestra en producción que el catálogo se basta. Deja dicho cuál de los dos
      caminos queda, y si es el segundo, qué se pierde.

MONTA EL SPIKE EN apps/docs (mínimo, desechable si hace falta)
  - Next 16.2 App Router + React 19.2, registrado en pnpm-workspace y turbo (build/typecheck/lint).
  - Una ruta SERVER COMPONENT que importe componentes server-safe del paquete (Text, Title,
    Paper, Divider) SIN "use client" propio, y una isla cliente con Button + Modal.
    Si algo que docs/03 §3 declara server-safe obliga a "use client", eso es un HALLAZGO: anótalo,
    porque es un defecto de la librería, no del sitio.
  - NebulaProvider + ColorSchemeScript con los 4 temas oficiales y conmutador es/oscuro:
    comprueba que NO hay flash en la primera pintura con JS desactivado en el head.
  - Un subpath (@stellaria/nebula-web/charts) importado desde una isla, para probar el exports map.
  - Un MDX renderizado con el pipeline que elijas. Evalúa y RECOMIENDA uno: @next/mdx,
    next-mdx-remote o fumadocs-mdx. Criterios: frontmatter tipado, componentes MDX propios,
    compatible con RSC, y que el contenido siga siendo MDX plano portable al plan B.
  - Mide: tiempo de dev en frío, tiempo de build y peso de la primera carga de una página.

CRITERIOS DE MUERTE, explícitos
  Si P1 falla en todos los caminos disponibles, DETENTE y reporta: es un problema de la librería
  que bloquea W5, no del sitio, y se arregla antes de seguir.
  Si P1 pasa y P2 falla, el sitio va adelante sin hojas propias. No es motivo de plan B.
  Solo si P1 pasa pero Next resulta inviable por otra razón medida, propón el plan B (Vite +
  React Router 7) con lo que costaría, y PREGUNTA al propietario antes de cambiar de rumbo.

RESTRICCIONES
  Ninguna dependencia nueva sin ADR (skill architecture-decisions). El grafo de deps de docs/01 §8
  no se toca: apps consumen paquetes, jamás al revés. Convenciones ADR-019 desde el primer archivo.

ACEPTACIÓN
  pnpm turbo build typecheck lint en verde con apps/docs dentro. Una página en servidor con
  componentes reales, los 4 temas conmutables sin flash y un MDX renderizado.

REPORTE
  Respuesta a P1 y a P2 con la evidencia medida, el pipeline MDX recomendado con su porqué, los
  hallazgos de RSC que sean defectos de la librería, y el borrador del ADR del stack del sitio.
```

---

## Prompt DS1.2 — Chasis, rutas y modelo de contenido bilingüe

```text
Actúa como ingeniero de UI en C:\Users\Skr13\Documents\GitHub\Nebula.

Fase DS, prompt 2. DS1.1 cerrado: el stack está decidido y hay evidencia de que Nebula corre en
servidor. Ahora se fija la FORMA del sitio, que es lo que después no se puede cambiar barato.

LEE ANTES
  1. prompts/1.5-docs-site/README.md — los cinco principios. El 2 y el 4 mandan aquí.
  2. El ADR del stack que salió de DS1.1.
  3. docs/00-inventory.md — la matriz de alcance: de ahí sale la taxonomía del catálogo.
  4. docs/02-theming.md §2 — el contrato NebulaTheme, que es la columna vertebral de las guías.

EL SITIO ES BILINGÜE DESDE EL PRIMER ARCHIVO. No hay "y luego lo traducimos".

1 · RUTAS
   /[lang]/... con lang ∈ {es, en}. Raíz redirige por Accept-Language con es por defecto.
   Toda ruta existe en los dos idiomas SIEMPRE, aunque el contenido caiga al idioma de origen.
   Reserva desde hoy, aunque estén vacías: /[lang]/theme (Theme Creator, pista TC),
   /[lang]/changelog, /[lang]/native. Meterlas después es una mudanza de URLs.

2 · MODELO DE CONTENIDO — tres capas que no se mezclan
   a. MDX de prosa      content/<lang>/**  — lo escribe una persona
   b. JSON generado     los tres generadores de DS1.3 — nadie lo edita a mano, jamás
   c. Diccionario       i18n/<lang>/*.json — la prosa de lo generado (descripciones de props,
                        rótulos de tabla, textos de chrome), sembrado desde el JSDoc en español
   El MDX debe seguir siendo portable: sin imports de framework en el contenido. Lo que necesite
   React va como componente MDX registrado por nombre.

3 · EL REGISTRO DEL CATÁLOGO — generado, no escrito
   Un JSON con los 158 componentes derivado del código y de docs/00-inventory.md: nombre, familia,
   subpath, si es compound y sus partes, si es cliente o server-safe, presupuesto de size-limit y
   si tiene .md interno. De ahí salen el índice, el buscador, el menú lateral y el gate de cobertura.
   Si un componente existe en el código y no en el registro, el gate FALLA. Es el mismo criterio del
   censo de WR1: ninguna fila sin rastro.

4 · CAÍDA DE IDIOMA VISIBLE
   Si la página en inglés no existe, se sirve la española con una marca visible de "sin traducir" y
   enlace a contribuir. Nunca un 404, nunca una página en blanco. La cobertura se mide por página.

5 · CHROME MÍNIMO, TODO CON NEBULA
   AppShell en montaje de carril (el patrón de Dashboard.stories.tsx ya validado), buscador,
   conmutador de idioma, conmutador de tema entre los 4 oficiales y de esquema claro/oscuro.
   Dark-first: el tema por defecto es dark (ADR-020). Cero CSS de terceros.

6 · BUSCADOR
   Evalúa y RECOMIENDA: índice local generado en build (Pagefind indexa el HTML construido y
   sobrevive a un cambio de framework) frente a servicio externo. Coste, privacidad y peso.
   Dependencia nueva ⇒ ADR.

RESTRICCIONES
  Nada de contenido de catálogo todavía. Aquí se monta la forma, no las páginas.

ACEPTACIÓN
  Las rutas de los dos idiomas resuelven; el registro se genera y cuadra con los 158 del código;
  el chrome funciona con los 4 temas; gates del monorepo en verde.

REPORTE
  El árbol de rutas final, el esquema del registro, el buscador recomendado con su ADR y qué
  decisiones de forma quedan cerradas a partir de aquí.
```

---

## Prompt DS1.3 — Los tres generadores

```text
Actúa como ingeniero de herramientas en C:\Users\Skr13\Documents\GitHub\Nebula.

Fase DS, prompt 3. Es el corazón de la fase: lo que estos generadores produzcan es lo que NO habrá
que escribir 158 veces, ni volver a tocar cada vez que WN cambie una API.

LEE ANTES
  1. docs/adr/ADR-103 — el registro de style props es la fuente del tipo público.
  2. docs/adr/ADR-105 — el JSDoc de API pública es documentación que se publica.
  3. docs/adr/ADR-098 y ADR-106 — props de ranura y su gate.
  4. tools/check-slots.mjs — cómo parsea hoy el monorepo, y tools/README.md.
  5. packages/web/src/utils/style-registry.ts y src/components/AppShell/AppShell.types.ts,
     que es el caso vivo más complejo (ranuras, compound, dos montajes).

GENERADOR 1 · REFERENCIA DE API, desde el .d.ts PUBLICADO
   La fuente es packages/web/dist/**/*.d.ts, no el fuente. Razón: es exactamente lo que el
   consumidor recibe; si el build cambia la superficie pública, la doc cambia con ella.
   Usa la API del compilador de TypeScript con el typescript@5.9.3 que la raíz YA tiene para el
   typed-linting (ADR-012). Cero dependencias nuevas.
   Por cada componente emite: props propias con tipo renderizado legible, requerida u opcional,
   valor por defecto y el JSDoc; y aparte los GRUPOS HEREDADOS.
   Las 128 style props NO se listan en cada tabla: se resuelven como un enlace a su página. Una
   tabla de 150 filas donde 128 son iguales en los 158 componentes no es documentación.
   Las ranuras (*Props) van en su propia sección: son el mecanismo de personalización sin fork y
   merecen destacarse, con el JSDoc que dice sobre qué nodo caen y cuándo no aplican.
   TRAMPA CONOCIDA: hoy no hay ninguna anotación @default. El valor por defecto vive en la
   desestructuración del .tsx (size = "md"). Extráelo de ahí y, donde no se pueda determinar sin
   ambigüedad, emite un hueco declarado — nunca lo inventes. Si los huecos son muchos, propón
   @default en el JSDoc, que ADR-105 ya permite, y di cuántos archivos costaría.

GENERADOR 2 · LA PÁGINA DE STYLE PROPS, desde style-registry.ts
   Las 128 props con qué propiedades CSS tocan, qué escala de token aceptan, si admiten valor
   abierto y si son responsive. Más lo que el registro no dice y el consumidor necesita: los dos
   carriles (clase atómica frente a variable en línea), el encadenado de fallback entre breakpoints
   y el coste compartido de 5,6 kB brotli que se paga UNA vez. Todo eso está razonado en ADR-103;
   la página lo cuenta para quien lo va a usar, no para quien lo mantiene.
   Menciona explícitamente que rtl/rtr/rbl/rbr son esquinas y no dirección de texto: el propio ADR
   pide que se diga en voz alta.

GENERADOR 3 · METADATOS POR COMPONENTE
   Tres columnas que ningún competidor tiene y que aquí salen gratis porque el repo ya las mide:
     - PRESUPUESTO: kB brotli reales de size-limit para ese módulo.
     - FRONTERA RSC: server-safe o cliente, derivado del "use client" real del código.
     - TEMA: qué claves del NebulaTheme pintan el componente — de ahí sale "cambia esto en tu tema
       y cambia en todo el catálogo", que es el argumento central del proyecto.

CONTRATO COMÚN DE LOS TRES
  - Salida JSON versionada, en un solo directorio, con un `pnpm gen:docs` que los corre todos.
  - Deterministas: dos ejecuciones sin cambios producen archivos idénticos byte a byte.
  - En CI corren y comparan: si el JSON generado difiere del comprometido, el gate falla.
  - Cero prosa en inglés dentro del generador: la prosa vive en el diccionario de DS1.2.

ACEPTACIÓN
  Los 158 componentes tienen su JSON; AppShell, Button, DataGrid y Charts revisados a mano uno por
  uno contra su .types.ts real; `pnpm gen:docs` idempotente; gates del monorepo en verde.

REPORTE
  Cobertura conseguida, la lista de huecos declarados (defaults no determinables, componentes sin
  JSDoc), y la recomendación sobre @default con su coste en archivos.
```

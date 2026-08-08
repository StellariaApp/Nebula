# DS — La web pública de Nebula

> El sitio de documentación del proyecto: `mantine.dev` / `ui.shadcn.com` como vara de medir.
> Pista **paralela**, arranca ya y no bloquea a nadie. Su parte de contenido de catálogo espera a
> que WN cierre; todo lo demás —infraestructura, generadores, guías, landing— se construye antes.

## Por qué está en 1.5 y no en la etapa web

Porque **el sitio no es de la etapa web**. Es la superficie pública de todo el proyecto: hoy
documenta los 158 componentes web, después la superficie native (N1–N5), después los cinco paquetes
premium (W6/N5) y el Theme Creator (TC). Colgarlo de la etapa 2 lo ataría al calendario de una sola
plataforma y obligaría a remontarlo cuando llegue la otra.

Y no depende de W5: para documentar la librería no hace falta que esté en npm. Lo único que espera a
la publicación es el `npm install` literal de los ejemplos de instalación, que hasta entonces se
muestra con la versión que se va a publicar y un aviso.

## Lo que ya hay, medido sobre el repo (2026-08-07)

| Activo                               | Estado                 | Sirve para el sitio                                                                    |
| ------------------------------------ | ---------------------- | -------------------------------------------------------------------------------------- |
| 158 componentes en 7 subpaths        | catálogo completo      | el índice y las 158 páginas                                                            |
| 96 archivos de stories               | Storybook 10.5         | **no directamente** — traen fixtures de test y `play()`; ver principio 3               |
| 88 `<Nombre>.md`                     | notas de mantenimiento | el _porqué_, no la doc de consumo — ADR-105 lo dice explícitamente                     |
| 71 `.types.ts` con JSDoc             | ADR-105 en marcha      | **la fuente de la tabla de props**                                                     |
| `utils/style-registry.ts`, 128 props | ADR-103                | la página de style props, generada entera                                              |
| `size-limit` por módulo              | docs/03 §3             | el presupuesto real en kB brotli de cada página de componente                          |
| `apps/theme-creator`                 | **carpeta vacía**      | el sitio será el **primer Next del monorepo**, aunque docs/01 §42 ya declare Next 16.2 |

Lo que **no** existe: ninguna línea de documentación de consumo. Ni una guía de instalación, ni una
página de tema, ni un ejemplo pensado para alguien de fuera. Todo lo escrito hasta hoy está dirigido
a quien mantiene la librería.

## Las cuatro decisiones del checkpoint (2026-08-07)

| Decisión       | Elegido                            | Consecuencia que ordena la fase                                                                                                                                                                                                                                                                                                                                                         |
| -------------- | ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Idioma**     | **inglés primero**, i18n montada   | **Enmendada por [ADR-110](../../docs/adr/ADR-110-el-idioma-se-resuelve-por-cookie-y-el-origen-es-el-ingles.md)** (2026-08-08). Era «bilingüe es + en desde el día 1» con el idioma en la ruta. Ahora el idioma sale de una **cookie**, la URL no lo lleva, y el sitio se escribe entero en inglés; la maquinaria de i18n queda montada para que añadir un idioma sea añadirlo a `LANGS` |
| **Stack**      | **Next 16.2** App Router + MDX     | el sitio es además la prueba viva de la integración que W5.2 promete; obliga a un spike de VE previo                                                                                                                                                                                                                                                                                    |
| **Demos**      | archivos compartidos               | nace `packages/demos`; el playground y el sitio importan **el mismo** `.tsx`                                                                                                                                                                                                                                                                                                            |
| **Despliegue** | **público desde el primer deploy** | el sitio nace con dominio, robots, sitemap y OG; y con un aviso de estado de API que no se puede omitir                                                                                                                                                                                                                                                                                 |

## Los cinco principios

1. **El sitio se construye con Nebula.** Como Mantine con Mantine. Cada página es una prueba de
   producción del catálogo, y el mayor test de RSC que va a tener la librería.
2. **Lo que se puede derivar no se escribe.** Props, ranuras, presupuesto, subpath, frontera RSC y
   claves de tema salen de generadores. Lo que se escribe a mano es lo único que una máquina no sabe:
   qué resuelve el componente, cuándo no usarlo y qué demo lo enseña.
3. **Una demo vive una sola vez.** `packages/demos` es un paquete privado que depende de `web` y del
   que tiran las dos apps. No es app→app —el grafo de docs/01 §8 lo prohíbe— sino un escalón nuevo
   después de `web`. Las 96 stories se van vaciando hacia él de forma incremental; lo nuevo nace ya ahí.
4. **El contenido no depende del framework.** MDX plano más JSON generado. Si el spike de Next falla,
   el plan B cuesta el chasis, nunca el contenido.
5. **Publicar en construcción obliga a decirlo.** API en normalización hasta W5: badge permanente,
   changelog visible desde el primer día y cero promesas de estabilidad.

## Las cuatro sub-fases

| Código | Archivo                          | Entregable                                                              | Requiere     |
| ------ | -------------------------------- | ----------------------------------------------------------------------- | ------------ |
| DS1    | [DS1-prompts.md](DS1-prompts.md) | Spike de riesgo · chasis + modelo de contenido i18n · los 3 generadores | nada         |
| DS2    | [DS2-prompts.md](DS2-prompts.md) | Landing e identidad · las guías bilingües · `packages/demos`            | DS1          |
| DS3    | [DS3-prompts.md](DS3-prompts.md) | Plantilla de página + piloto · barrido de las 158 por familias          | DS2 + **WN** |
| DS4    | [DS4-prompts.md](DS4-prompts.md) | Gates del sitio · despliegue público · `docs/ds-closure.md`             | DS3          |

**DS1 y DS2 se pueden empezar hoy.** DS3 espera a WN porque WN todavía rompe API (ADR-103 fue
_breaking_) y escribir 158 páginas contra una API en movimiento es trabajo que se tira. El barrido de
demos sí se adelanta: una demo rota por un cambio de API se arregla igual que la story que hoy la
tiene, y en `packages/demos` se arregla una vez en vez de dos.

## Riesgos, con su plan B escrito antes de necesitarlo

| Riesgo                                            | Plan B                                                                                                                                                                                                                                                  |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Vanilla Extract sobre Next 16**                 | El spike separa dos preguntas: (a) que el CSS **del paquete** se sirva —irrenunciable, es la promesa de W5— y (b) que el sitio escriba hojas **propias** —opcional: si no compila, el sitio se pinta solo con style props, que es aún mejor dogfooding— |
| El spike falla entero                             | Vite + React Router 7 con el mismo contenido y los mismos generadores. Coste: el chasis                                                                                                                                                                 |
| 158 páginas × 2 idiomas es mucho contenido        | La parte generada es idéntica en los dos; solo se traduce la prosa. El gate mide cobertura y la marca en la página, no bloquea publicar                                                                                                                 |
| El JSDoc está en español y viaja al `.d.ts`       | Pregunta abierta #1 — no se puede traducir el autocompletado del consumidor                                                                                                                                                                             |
| Publicar docs de una librería sin licencia decida | El pie del sitio no declara licencia hasta que el supuesto #11 se cierre en W5. No se implica MIT ni por omisión ni por plantilla                                                                                                                       |

## Preguntas abiertas — se responden dentro de la fase, no antes

1. **¿En qué idioma se escribe el JSDoc público?** El `.d.ts` se publica y **no se puede traducir**:
   el sitio puede tener dos idiomas, el autocompletado del consumidor no. Hoy los 71 archivos están
   en español. _Recomendación_: JSDoc en inglés y el español al diccionario del sitio, si la librería
   apunta a una audiencia internacional; si los consumidores reales son fonicredito y tfv, se queda
   como está. Es reversible en cualquier momento —el JSDoc no es _breaking_—, pero cuanto más tarde,
   más archivos. Enmendaría ADR-105.
2. **Dominio y hosting.** `nebula.stellaria.dev`, dominio propio, u otro. Vercel es el camino corto
   con Next; Cloudflare Pages exige salida estática. Decide también dónde vive el repo del deploy.
3. **Analítica.** Ninguna, o una sin cookies (Plausible/Umami). Afecta al aviso legal del pie.
4. **Versionado de la documentación.** _Recomendación_: solo `latest` + changelog en v1, con las
   rutas ya bajo `/[lang]/` para que meter `/v2/` después sea un redirect y no una mudanza.
5. **¿El Theme Creator se empotra en el sitio?** Es de la pista TC y todavía no existe. El sitio debe
   dejarle la ruta reservada y el conmutador de tema en vivo preparado para recibirlo.

## ADRs que esta fase tiene que escribir

Numeración desde el siguiente libre (hoy el último es ADR-106; WN puede consumir alguno antes).

- **El sitio de documentación es una app Next 16 construida con Nebula** — dependencias nuevas
  (`next`, pipeline MDX, buscador), criterio de fallback y qué queda fuera de v1 (editor en vivo).
- **La demo vive una sola vez** — `packages/demos`, su lugar en el grafo de deps y el contrato de un
  archivo de demo.
- **La referencia de API se genera del `.d.ts` publicado** — extractor propio con el `typescript@5.9.3`
  que la raíz ya tiene para el typed-linting (ADR-012), cero dependencias nuevas.
- Si el propietario acepta la pregunta #1: **enmienda a ADR-105** sobre el idioma del JSDoc público.

## Docs que hay que actualizar en el mismo PR

- `docs/05-roadmap.md` — la pista DS con sus gates.
- `prompts/README.md` — índice, estructura y la regla de orden.
- `docs/01-architecture.md` — el árbol del monorepo gana `apps/docs` y `packages/demos`, y la tabla
  de stack gana el Next del sitio.
- `docs/03-a11y-motion-performance.md` §4 — los gates propios del sitio.

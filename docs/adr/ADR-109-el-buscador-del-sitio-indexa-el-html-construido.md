# ADR-109 — El buscador del sitio indexa el HTML construido, y no depende del framework

- **Estado**: **borrador** · 2026-08-07 (salida de DS1.2; pendiente de decisión del propietario)
- **Depende de**: [ADR-107](ADR-107-el-sitio-es-una-app-next-que-no-compila-vanilla-extract.md)

## Contexto

DS1.2 monta el chasis bilingüe del sitio. El buscador es una de las cuatro piezas del cromado y la
única que exige dependencia nueva. El principio 4 de la fase manda: **el contenido no depende del
framework**; si el chasis cambia, el plan B cuesta el chasis y nunca el contenido.

Un buscador puede romper ese principio de dos maneras: atándose al pipeline del framework —un índice
que solo sabe construir Next— o atándose a un servicio externo, que además publica el contenido en un
tercero y mete una petición de red en cada tecleo.

## Decisión

**Índice local generado en build a partir del HTML ya construido, con Pagefind 1.5.2.**

1. Pagefind corre **después** de `next build`, sobre la salida estática. No conoce React, ni MDX, ni
   el árbol de rutas: lee HTML. Si mañana el sitio se rehace con Vite, el mismo comando sigue
   valiendo — es exactamente lo que el principio 4 pide.

   > **Pendiente desde [ADR-122](ADR-122-el-segmento-lang-desaparece-del-router.md)** (2026-08-09):
   > las 7 rutas del sitio pasaron a dinámicas, así que `next build` ya no deja HTML que indexar.
   > Este punto hay que resolverlo **antes** de implementar el buscador —indexar desde
   > `content/*.mdx` o prerenderizar una instantánea solo para el índice—. Hoy no rompe nada porque
   > Pagefind no está instalado ni cableado.

2. **El índice se parte por idioma solo.** Pagefind detecta `<html lang>`, que el layout raíz ya
   emite correctamente, y sirve el índice del idioma activo. Buscar en español no trae resultados
   en inglés.
3. **Se excluye del índice lo generado que no es prosa**: las tablas del registro del catálogo se
   marcan con `data-pagefind-ignore` salvo el nombre del componente. Indexar 158 filas de presupuesto
   y frontera RSC produce ruido, no resultados.
4. **Es dependencia de build, no de runtime del servidor**: `devDependency` de `apps/web`. Lo que
   llega al navegador es el runtime de Pagefind (~10 kB brotli) más los fragmentos del índice, y
   **solo cuando el usuario abre el buscador** — carga diferida, nunca en la primera pintura.

## Alternativas

- **Algolia DocSearch**: es el estándar de facto en documentación y es gratis para proyectos abiertos.
  **Rechazada por ahora**: el contenido se publica en un tercero, mete red en cada tecleo, obliga a
  hablar de cookies y terceros en el aviso legal del pie —que la pregunta abierta 3 de la fase aún no
  ha decidido— y su crawler exige que el sitio ya esté desplegado y accesible, cosa que en DS1.2 no
  ocurre. Es reversible: si un día el corpus crece mucho, se cambia sin tocar contenido.
- **Índice propio en JSON generado desde el MDX**: cero dependencias, pero indexa **la fuente**, no lo
  que el lector ve; se pierde todo lo generado (props, ranuras, metadatos) que es justo lo que alguien
  va a buscar. Y hay que escribir tokenización, ranking y resaltado, que es el trabajo que Pagefind ya
  hace.
- **Sin buscador en v1**: 158 componentes en dos idiomas no se navegan por menú. El buscador no es un
  extra en un sitio de catálogo.

## Consecuencias

- **Dependencia nueva**: `pagefind` como `devDependency` de `apps/web`. El `build` del paquete pasa a
  ser `next build && pagefind --site .next/...`, y el gate del sitio comprueba que el índice existe y
  no está vacío.
- **El buscador no funciona en `next dev`** sin correr el índice antes. Es el precio de indexar la
  salida: en desarrollo el campo queda inerte. Se documenta en el README de `apps/web`.
- **Hoy el campo de búsqueda está montado pero no busca.** DS1.2 deja el hueco del cromado con su
  `aria-label` y su sitio en la cabecera; el cableado entra cuando este ADR se acepte. Está declarado
  como tal y no se presenta como funcionalidad entregada.
- La exclusión del punto 3 hay que revisarla en DS3, cuando las páginas de componente tengan prosa
  propia: lo que se excluye es la tabla generada, no la página.

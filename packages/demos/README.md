# @stellaria/nebula-demos

Las demos del catálogo. **Privado y nunca publicado**: existe para que el playground y el sitio
público compartan el mismo archivo en vez de escribir el ejemplo dos veces
([ADR-115](../../docs/adr/ADR-115-la-demo-vive-una-sola-vez.md)).

## El contrato

Un archivo, una demo, `export default` de un componente **sin props**.

1. **Se lee como código de consumidor.** Importa de `"@stellaria/nebula-web"`, nunca por ruta interna.
2. **Cero fixtures de test, cero assertions.** Nada de `ThemeMatrix`, `MATRIX_A11Y` ni `play()`.
3. **Autónoma.** Los datos de ejemplo van dentro del archivo.
4. **Se ve bien en los cuatro temas**, en claro y en oscuro.
5. **Sin estado global ni efectos de arranque**: el sitio la monta y desmonta muchas veces.

Los textos visibles van en inglés, como toda la superficie pública (ADR-114).

## Por qué se consume como fuente y no como `dist`

El sitio importa el mismo `.tsx` **dos veces**: como componente y como texto crudo. Así el bloque de
código que enseña es literalmente el que ejecuta, y no puede mentir. Un `dist` compilado rompería eso.

Los dos consumidores son bundlers dentro del monorepo —Vite y Turbopack—, nunca Node directo, que es
el motivo por el que el resto del monorepo sí compila. Y al ser privado, un `dist` no le sirve a nadie.

Por eso este paquete tiene `typecheck` y `lint` pero **no tiene `build`**.

## Estructura

```
src/
  <Componente>/
    <Demo>.tsx      la demo, export default, sin props
    demos.ts        el registro: id, componente, title y description
  index.ts          agrega todos los registros
```

El `.tsx` **no se duplica por idioma nunca**. Lo traducible es el registro, y el sitio lo resuelve por
clave (`demo.<componente>.<id>.title`) cayendo al texto de aquí si no hay traducción.

## Lo que NO va aquí

Las stories que existen para alimentar un gate: teclado, axe, reduced-motion, matriz de temas y el
baseline visual de ADR-037. Esas se quedan en el playground, que es su sitio.

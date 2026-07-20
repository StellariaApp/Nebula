# Tokens base

## palettes.ts es un archivo GENERADO

No editarlo a mano. Se regenera con:

```bash
pnpm gen:palette regen
```

El generador vive en `tools/palette-gen` y produce las 16 paletas 50–950 en OKLCH (ADR-009) a partir de las semillas de `tools/palette-gen/src/seeds.ts`. Las semillas orientan hue y carácter; la curva de luminancia la define el generador, que es lo que mantiene la consistencia entre paletas (mismo paso ⇒ misma luminancia).

La identidad de Nebula son `indigo` `#3F37C9` y `violet` `#9D4EDD` (ADR-020): son las semillas de `primary` y `accent` en los temas oficiales, y el eje del gradiente de marca.

## Qué es cromático y qué no

Este paquete solo contiene los tokens **no cromáticos** (tipografía, motion, effects, layout) más las paletas generadas. Los valores de color que dependen del tema —roles de superficie, texto, borde y los gradientes— viven en `@stellaria/nebula-themes`.

`spacing` se expresa como `unit × scale` para que la densidad sea temable: con `unit: 4` reproduce exactamente la escala absoluta heredada de Stellaria; `sober` usa 3 (compacta) y `playful` 5 (comfortable).

Las sombras son duales: `{ web: string, native: elevation map }` en un único token, para no duplicar la definición por plataforma.

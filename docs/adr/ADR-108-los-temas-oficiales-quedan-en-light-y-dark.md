# ADR-108 — Los temas oficiales quedan en `light` y `dark`

- **Estado**: aceptada · 2026-08-07 (decisión del propietario)
- **Sustituye**: la tabla de temas oficiales de `docs/02-theming.md` §2 y el punto 3 de los supuestos
  de `docs/05-roadmap.md`. Enmienda la lista de `ADR-080`.

## Contexto

`sober-light` y `playful` nacieron en F0 como **presets demostrativos**: existían para probar que un
tema puede cambiar radius, densidad, motion, glass y hasta el significado de una variante sin que
ningún componente se bifurque. Nunca fueron temas de producto.

Cumplieron su papel —F0 y W1 los usaron como test antifork— pero se quedaron como catálogo oficial:
salían en el conmutador del playground, en `OfficialThemeName`, en las láminas `AllThemes` y en el
gate de contraste, con una identidad (banca sobria, cian/lima festivo) que no es la de ningún
producto real ni la de los que vienen.

## Decisión

1. **`officialThemes` queda en `light` y `dark`.** `OfficialThemeName` pasa a `"light" | "dark"`.
   Se borran `packages/themes/src/themes/sober-light.ts` y `playful.ts` y sus exports con nombre
   `soberLight` y `playful`.
2. **`themeClass` de web pierde las dos clases de Vanilla Extract correspondientes.** El contrato
   `NebulaTheme` **no cambia**: sigue teniendo `motion.tier`, `effects.glass.enabled`, `variantMap`,
   `spacing.unit` y todo lo demás. Lo que se retira son dos instancias, no capacidades.
3. **Los temas nuevos se diseñarán más adelante**, sobre el mismo contrato y sin que esto los
   condicione.
4. **Se acepta un hueco de test declarado**: ningún tema ejercita ya el remapeo de `variantMap`
   —`filled` → `gradient.brand` era cosa de `playful`—. `ResolveVariant` sigue leyendo el mapa y los
   componentes siguen resolviendo contra él, pero **ningún gate detecta una regresión ahí** hasta que
   exista un tema que lo use. Es la opción que el propietario eligió frente a mantener un fixture.

## Lo que sí se conservó, y por qué

Once tests de componente usaban los dos temas retirados como **vehículo** para probar caminos de
degradación que siguen en el código: `glass.enabled: false`, `motion.tier: "minimal"`, un gradiente de
tres stops y un `noiseOpacity` distinto. Borrar el tema habría borrado la cobertura del camino, que es
otra cosa que borrar el tema.

Esos tests pasan ahora un **objeto de tema ad-hoc** a `NebulaProvider defaultTheme`, que ya aceptaba
`OfficialThemeName | NebulaTheme`. Viven en `packages/web/src/__tests__/theme-tweaks.ts`
(`GlassOff`, `MotionAt`, `NoiseAt`, `BrandGradient`), no se exportan desde el barrel y no tienen
`meta.name`: no son temas ni semilla de los futuros.

El único caso que **sí** se dejó caer es el del punto 4: el remapeo de `variantMap`.

## Alternativas

- **Mantener un fixture de test que remapee `variantMap`**: conservaba la cobertura del contrato por
  el precio de un archivo. **Rechazada por el propietario** en el checkpoint; se recupera cuando
  existan los temas nuevos.
- **Dejar los dos temas y solo esconderlos del conmutador**: cero trabajo, pero mantiene en la API
  pública y en el gate de contraste dos temas que nadie va a usar, y obliga a mantenerlos vivos en
  cada cambio de tokens.

## Consecuencias

- **Cambio de API pública** en `@stellaria/nebula-themes` y `@stellaria/nebula-web`: desaparecen dos
  exports con nombre y `OfficialThemeName` se estrecha. Los paquetes siguen `private: true`, así que
  no hay consumidor externo que migrar.
- **`pnpm check:contrast` mide ahora 2 temas en vez de 4**, y `tools/render-measure` toma
  `dark,light` por defecto.
- **El playground pierde dos entradas de la toolbar** y las stories `Playful` de `Group` y `Paper`
  pasan a `Light`. Las láminas `AllThemes` comparan dos temas.
- **La prueba antifork se debilita mientras no haya temas nuevos.** `light` y `dark` comparten
  estructura, densidad y efectos: un componente que leyera fuera del tema podría pasar inadvertido
  ahora y no antes. Es el coste real de esta decisión y se cierra al añadir el primer tema con
  identidad propia.
- Los documentos históricos —ADRs, cierres de fase y reviews— se barrieron también, por decisión
  explícita del propietario. Donde el razonamiento dependía de uno de los dos temas, se reescribió en
  términos del mecanismo (`glass.enabled`, `motion.tier`, «un tema que remapee `filled`»); donde eran
  filas de una tabla de medición, se retiraron.

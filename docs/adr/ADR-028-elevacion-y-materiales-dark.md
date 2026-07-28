# ADR-028 — Elevación calibrada por esquema y materiales de superficie

- **Estado**: aceptada · 2026-07-27 (decisión del propietario en el checkpoint de convergencia visual)
- **Enmienda**: ADR-020 (semilla de la paleta `dark`) y `docs/06-visual-language.md` §6 (calibración
  del glass).
- **Contexto**: `docs/06-visual-language.md` §5 define una escalera de elevación de cinco niveles y
  exige que, en dark, cada nivel se distinga _mediante oclusión + rim/borde_. §9 registró como deuda de
  apertura de W2.V que «los temas dark reutilizan sombras negras de light, por lo que varios niveles
  casi no se distinguen», y la review del 2026-07-21 lo listó como P1. El paso 4 de su secuencia
  recomendada —_calibrar sombras por theme_— nunca se ejecutó: W2 cerró con los cuatro temas
  importando el mismo `shadows` de tokens.

  La auditoría de convergencia contra `docs/stellaria-ui/` encontró además que:

  - `shadows.xxs`, `.xs` y `.sm` tenían **el mismo valor web** (`0 1px 2px rgba(9,9,11,.05)`): tres
    peldaños colapsados de siete;
  - sobre `surface.base` dark (`#0b0b0b`) una sombra negra al 4–24 % es literalmente invisible;
  - las superficies dark distaban ~2 % de luminosidad entre sí, de modo que sin sombra ni rim la
    escalera quedaba plana;
  - la semilla `dark: #1c1c1c` es neutra pura mientras el texto proviene de `gray` (semilla `#868e96`,
    fría): superficie neutra bajo texto frío;
  - el glass consumía `blur.sm/md` (4 y 8 px), por debajo del umbral en que el efecto se percibe.

## Decisión

1. **Los siete peldaños de `shadows` son distintos entre sí** en web y en el mapa native. `xxs` es la
   corrección mínima; a partir de `xs` cada nivel combina una sombra de contacto y una de difusión.
2. **La sombra se calibra por esquema.** `packages/themes/src/themes/shadows.ts` (módulo interno, no
   exportado por el índice del paquete) define `darkShadows`: oclusión más opaca —de 0,40 a 0,72 sobre
   negro— más un **rim** `inset 0 1px 0` blanco de baja opacidad. `nebula-dark` lo consume en su
   sección `effects.shadows`, que ya era dato por tema. **No se amplía `NebulaTheme`.**
   La mitad `native` del token lleva solo la oclusión: React Native no admite sombras `inset`, y allí el
   rim se resuelve con borde.
3. **La escalera de superficies de `nebula-dark` se ensancha**: `overlay` sube de `dark.400` a
   `dark.500`, de modo que popover y modal se separan del canvas y de la card sin recurrir a glow.
4. **La semilla de la paleta `dark` pasa de `#1c1c1c` a `#161821`** (OKLCH L 0,211 · C 0,018 · H 275).
   El tono 275 es el mismo eje cromático que la semilla `indigo` `#3F37C9` de ADR-020: el canvas deja de
   ser un neutro ajeno y pasa a derivar de la identidad. La escala resultante converge con el negro
   azulado de `docs/stellaria-ui/02-design-tokens.md` (`#06080f` ≈ `#07080D`, `#0f1119` ≈ `#10121A`,
   `#171922` ≈ `#151823`). **Esto enmienda ADR-020**: la identidad de Nebula pasa a incluir el tinte del
   canvas, no solo el eje de acento.
5. **El glass sube de peldaño.** Las recetas apuntan ahora a `blur.md` (subtle), `blur.xl` (default) y
   `blur.xxl` (strong), con `saturate(130–140%)`. La escala `blur` **no cambia**: sigue sirviendo a
   cualquier otro uso. **Esto enmienda `docs/06` §6**, que fijaba el glass en `sm/md`; el resto de la
   regla —un solo efecto dominante por región, glass nunca anidado, degradación con
   `effects.glass.enabled=false`— se mantiene intacto.

## Alternativas

- **Subir la escala `blur` completa**: rechazada. `blur` alimenta también la style prop y usos ajenos al
  glass; recalibrarla entera para un solo consumidor es más invasivo que remapear las recetas.
- **Compensar la elevación dark con glow**: rechazada explícitamente por `docs/06` §5 y §6 — el glow
  identifica una acción o selección, no es elevación estructural.
- **Exportar `darkShadows` desde `@stellaria/nebula-tokens`**: rechazada. Sería API pública nueva para
  un dato que ya es por tema; el módulo interno de `themes` cubre el caso sin ampliar superficie.
- **Mantener la semilla neutra y solo separar los peldaños**: viable, y era la alternativa presentada.
  Descartada por el propietario: resuelve la elevación pero deja la incoherencia de texto frío sobre
  superficie neutra y renuncia a la firma de la casa.

## Consecuencias

- Cambian valores de tokens y de la paleta `dark`; ninguna firma pública se modifica.
- `pnpm check:contrast` sigue en verde (28 pares × 5 temas): la nueva paleta es más oscura que la
  anterior en los peldaños bajos, así que el contraste de texto mejora.
- `ADR-020` queda enmendado en su alcance: la semilla `dark` es ahora parte de la identidad y cambiarla
  vuelve a requerir ADR.
- `docs/06` §6 queda enmendado en la calibración del glass, no en su presupuesto.
- Las capturas dark anteriores a esta fecha dejan de ser referencia.
- **Corrección tras la revisión visual (2026-07-28)**: la primera calibración escalaba la oclusión y
  dejaba el rim casi plano (`sm` y `md` compartían 0,06). La lámina renderizada demostró que la oclusión
  no produce escalera —negro sobre casi-negro no tiene recorrido— y que el cue real es el rim. Sus
  opacidades pasan a ser estrictamente crecientes (0,04 → 0,20). La escalera de `docs/06` §5 declara
  cinco niveles sobre cuatro roles de superficie, así que en dark se perciben **tres escalones de
  superficie** más la progresión del rim; los pares que colapsan (1–2 y 3–4) no conviven adyacentes en
  una interfaz real y no se compensan ampliando el contrato.
- `packages/tokens/src/tokens/palettes.ts` se regeneró con `pnpm gen:palette regen`; solo cambió la
  escala `dark`.

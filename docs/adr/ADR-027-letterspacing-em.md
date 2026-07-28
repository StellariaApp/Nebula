# ADR-027 — `letterSpacing` como múltiplo del tamaño de fuente (em)

- **Estado**: aceptada · 2026-07-27 (decisión del propietario en el checkpoint de convergencia visual)
- **Contexto**: `font.letterSpacing` es `Record<LetterSpacingName, number>` y la proyección web
  (`packages/web/src/theme/theme-vars.ts`) lo emitía como **px**. Con los valores vigentes
  (`tight: -0.16`), un `h1` de 48 px recibía −0,16 px de tracking: −0,003 em, ópticamente
  indistinguible de cero. `docs/06-visual-language.md` §2 reserva `letterSpacing.tight` a `h1–h3`
  precisamente para tensar titulares, de modo que el token existía pero su intención no llegaba al
  render. `docs/stellaria-ui/03-typography-layout.md` fija el tracking de display entre −0,045 y
  −0,055 em, siempre proporcional.

  El tracking es proporcional por naturaleza: un valor absoluto que tensa un titular de 48 px destroza
  un `caption` de 12 px. Una escala de tres peldaños compartida por toda la tipografía solo puede ser
  correcta si se expresa como múltiplo del tamaño de fuente.

## Decisión

1. Los valores de `font.letterSpacing` pasan a interpretarse como **múltiplos del tamaño de fuente
   (em)**, no como píxeles. La forma de `NebulaTheme` no cambia: el tipo sigue siendo `number`.
2. Recalibración del baseline: `tight: -0.03` · `normal: 0` · `wide: 0.08`.
   - `tight` da −1,44 px en `h1` (48) y −0,96 px en `h3` (32): tensión perceptible sin cerrar los
     contrafuertes. Es deliberadamente más contenido que el −0,055 em de la guía Stellaria, calibrado
     para titulares de página y no para un hero de landing.
   - `wide` sirve al patrón _eyebrow_ (mono + uppercase + tracking amplio), hoy expresable por
     composición con las style props `ff`, `tt` y `ls`.
3. **Web**: `ThemeToVars` emite `em`. La proyección de `font.size` sigue en px, así que el `em` del
   tracking se resuelve contra el tamaño del propio elemento, que es el comportamiento buscado.
4. **Native (deuda de N1)**: React Native solo admite `letterSpacing` en px. La capa native deberá
   derivar `px = valor × fontSize` al componer sus estilos tipográficos. Queda registrado aquí porque
   es una consecuencia directa de esta decisión, no un descubrimiento posterior.

## Alternativas

- **Dejarlo en px**: rechazada. Mantiene un token que no produce efecto y deja `docs/06` §2 como
  intención no implementada.
- **Recalibrar los valores px** (p. ej. `tight: -0.5`): rechazada. No existe un valor absoluto correcto
  para 48 px y 12 px a la vez; solo desplaza el problema.
- **Ampliar el contrato con tracking por tamaño tipográfico**: rechazada por ahora. Multiplica once
  claves nuevas para resolver un caso que el `em` cubre, y ADR-024 pospuso ampliar `NebulaTheme` hasta
  demostrar que las claves actuales no bastan.

## Consecuencias

- Cambia el significado de un token compartido Web/Native; no cambia ninguna firma pública.
- Los titulares `h1–h3` cambian de métrica: las capturas previas dejan de ser referencia para tipografía.
- La conversión `px = valor × fontSize` es obligatoria en N1 y debe cubrirse con el lint de paridad W/N.
- La style prop `ls` de `Box` hereda la nueva semántica automáticamente.

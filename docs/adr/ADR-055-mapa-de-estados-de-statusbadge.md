# ADR-055 — El mapa de estados de `StatusBadge` no entra en `NebulaTheme`

- **Estado**: **aceptada** · 2026-07-30 (checkpoint de apertura de W3.3) · **pendiente de ejecución**
  (bloque C de W3.3)
- **Enmienda**: `docs/00-inventory.md` §1.18, fila `StatusBadge`.
- **Relacionado**: ADR-038 (subconjuntos de `variant`), ADR-053 (dónde vive el dato de dominio).

## Contexto

`docs/00-inventory.md` §1.18 describe `StatusBadge` como «Badge + mapa semántico de estados
**configurable por theme**». Leído literalmente, eso significa una clave nueva en el contrato
`NebulaTheme`, junto a `variantMap` y `effects`.

La pregunta se planteó en el checkpoint de apertura de W3.3 porque el precio no es el mismo en las dos
lecturas y el doc es cerrado.

## Decisión

1. **El mapa no entra en `NebulaTheme`.** Los estados de `StatusBadge` son **semántica de negocio**
   —«pendiente», «conciliado», «en ruta», «devuelto»—, no identidad visual. Un tema describe cómo se ve
   un producto; no sabe qué estados tiene el dominio de ese producto. Meterlo en el contrato obligaría a
   los cuatro temas oficiales, al `themeSchema` y a **todo tema de tenant** a declarar estados de un
   dominio que no es suyo, y arrastraría el gate de contraste y la paridad W/N detrás.

2. **La configuración viaja por prop y por provider**:

   ```tsx
   <StatusMapProvider map={{ pending: { label: "Pendiente", color: "warning" } }}>
   <StatusBadge status="pending" />          // lee el provider
   <StatusBadge status="pending" map={OTRO} />  // lo sobrescribe en el punto de uso
   ```

   Es el mismo reparto que ADR-053 aplicó a los prefijos telefónicos: la librería transporta el dato
   tipado, el producto lo define. El provider existe para que un producto lo fije una vez; sin él,
   `StatusBadge` sigue siendo usable con `map` suelto.

3. **El color de cada estado sale del vocabulario del tema**, no de un hex: el valor del mapa apunta a
   `ColorExtended` y la receta la resuelve `ResolveVariant` (ADR-038). Así, un tema **sí** cambia cómo
   se ve «pendiente» —porque cambia `warning`— sin necesidad de conocer que «pendiente» existe. Esa es
   la parte de «configurable por theme» que sí se cumple, y por la vía correcta.

4. **`docs/00-inventory.md` §1.18 se enmienda** para que la fila diga «mapa semántico inyectado por
   provider, con colores del vocabulario del tema».

## Alternativas

- **Clave nueva en `NebulaTheme`**, literal a la redacción de §1.18. Rechazada por el propietario en el
  checkpoint: campo obligatorio nuevo en un contrato cerrado, cuatro temas oficiales, schema JSON, gate
  de contraste y paridad native, todo para expresar un dato que cambia por producto y no por tema.
- **Solo prop `map`, sin provider.** Es lo más pequeño de mantener, pero cada uso repite el mapa
  completo o el producto se escribe su propio wrapper — que es exactamente el componente que
  `StatusBadge` viene a evitar.
- **Estados fijos en la librería** (`success | pending | error | …`). Rechazada de plano: es la
  definición de acoplar el core a un dominio, y la regla de frontera de §1.18 lo prohíbe.

## Consecuencias

- **Coste de contrato cero.** `NebulaTheme` no cambia, de modo que ningún tema oficial ni de tenant se
  toca y el gate de contraste no gana pares.
- **`StatusMapProvider` vive en `packages/web`**, no en hooks: es configuración de presentación de un
  componente concreto, no un hook de plataforma como `usePermission`.
- **Paridad W/N**: al no tocar el contrato compartido, native implementa el mismo par
  provider + prop cuando llegue su turno, sin coordinación de tokens.
- **Sin provider, `StatusBadge` exige `map`.** No hay mapa por defecto: inventarse uno sería adivinar el
  dominio, y un estado desconocido debe fallar de forma visible en desarrollo, no pintarse en gris.

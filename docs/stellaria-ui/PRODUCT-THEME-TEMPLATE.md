# Plantilla de tema de producto

Copiar este archivo para cada producto. Sustituir los campos entre corchetes.

## Identidad

- Producto: `[nombre]`
- Descriptor: `[descriptor breve]`
- Endoso: `A Stellaria product`
- Audiencia: `[audiencia principal]`
- Resultado: `[resultado principal]`
- Personalidad: `[adjetivo 1]`, `[adjetivo 2]`, `[adjetivo 3]`

## Tesis

> `[Producto] ayuda a [audiencia] a [resultado] mediante [mecanismo].`

## Tema

| Token                 | Valor    |
| --------------------- | -------- |
| `brand.primary`       | `[hex]`  |
| `brand.bright`        | `[hex]`  |
| `brand.onPrimary`     | `[hex]`  |
| `brand.gradientAngle` | `[deg]`  |
| `brand.glowOpacity`   | `[0.00]` |

## Derivados

- `brand.soft`: `[rgba/color-mix]`
- `brand.border`: `[rgba/color-mix]`
- `brand.glow`: `[rgba/color-mix]`
- `brand.gradient`: `[css]`
- `brand.focus`: `[valor o token compartido]`

## Modos

- [ ] Dark.
- [ ] Light.
- [ ] Ambos.

Justificación si solo existe uno: `[texto]`

## Motivo distintivo

- Nombre: `[orbit | pulse | flow | otro]`
- Qué comunica: `[texto]`
- Dónde aparece: `[máximo tres contextos]`
- Dónde no aparece: `[contextos]`
- Reduced motion: `[fallback]`

## Iconografía e imágenes

- Estilo de iconos: `[outline/filled/duotone]`
- Tratamiento de preview: `[texto]`
- Dirección fotográfica/ilustración: `[texto]`
- Activos requeridos: `[logo, mark, OG, favicon, etc.]`

## Voz

- Frases preferidas: `[lista]`
- Frases prohibidas: `[lista]`
- Nivel técnico: `[bajo/medio/alto]`
- Idiomas: `[lista]`
- Consideraciones de riesgo: `[texto]`

## Componentes que deben probarse

- [ ] Button.
- [ ] Input y Select.
- [ ] SegmentedControl.
- [ ] Card neutral y featured.
- [ ] Header.
- [ ] Notice/Alert.
- [ ] Modal.
- [ ] Data visualization.
- [ ] Focus y estados semánticos.

## Contraste

| Combinación              | Ratio     | Resultado         |
| ------------------------ | --------- | ----------------- |
| Primary / onPrimary      | `[ratio]` | `[AA/Fail]`       |
| Bright / canvas          | `[ratio]` | `[AA/Decorativo]` |
| Text secondary / surface | `[ratio]` | `[AA/Fail]`       |
| Focus / canvas           | `[ratio]` | `[AA/Fail]`       |

## Diferencias permitidas

`[Qué cambia frente a Stellaria]`

## Invariantes

`[Qué debe permanecer idéntico al sistema]`

## Aprobación

- Responsable de producto: `[nombre]`
- Responsable de diseño: `[nombre]`
- Responsable técnico: `[nombre]`
- Versión del tema: `[semver]`
- Fecha: `[YYYY-MM-DD]`

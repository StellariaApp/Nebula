# ADR-132 — Los temas de v1 y el suelo de la tinta

- **Estado**: **aceptada** · 2026-08-11 — decisión del propietario en el checkpoint T0 de W5.0
- **Enmienda**: [ADR-083](ADR-083-la-tinta-del-relleno-la-decide-la-luminancia.md),
  [ADR-085](ADR-085-cada-escala-lleva-su-propia-tinta.md) y
  [ADR-089](ADR-089-la-tinta-de-un-degradado-la-decide-su-peor-extremo.md), que dejaban la elección
  de tinta enteramente en manos de la librería.
- **Añade**: `ink.floor` al contrato `NebulaTheme`.
- **Repara**: `GradientToken.ink`, que ADR-089 aceptó y que ni el schema Zod ni el gate de contraste
  llegaron a implementar.

## Contexto

W5.0 empieza por los temas porque **el nombre de un tema es contrato**: añadir uno después de v1 es
menor, quitarlo o renombrarlo es breaking. Al medir el estado para presentarlo aparecieron tres
defectos, los tres alrededor del mismo campo.

### El campo que el contrato declaraba y nadie implementó

ADR-089 añadió `ink?: "light" | "dark"` a `GradientToken` para que el autor de un tema pudiera
imponer la tinta de su degradado. El campo entró en `@stellaria/nebula-tokens` y el runtime web lo
consume en `theme-vars.ts`. **No entró en el schema Zod de `@stellaria/nebula-themes`**, que es un
`strictObject`, de modo que `LoadTheme` —API pública que W5 publica— rechazaba con
`Unrecognized key: "ink"` cualquier tema que usara el campo documentado. Ningún test lo detectó
porque los temas oficiales no lo declaran.

**Tampoco entró en `tools/contrast-check`**, que seguía eligiendo la tinta con la política
anterior a ADR-089: el mejor ink para el **primer** stop. Medido sobre los ocho temas de producto de
`packages/demos`, el gate aprobaba `polaris` y `nova` con tinta oscura a 7,08 y 6,85 mientras el
runtime pintaba blanca —porque el tema la declaraba— a 2,76 y 2,78. **El gate bendecía un fallo AA
real**, que es el peor estado posible para un gate.

### La tinta la decide la librería, y el propietario quiere que la decida el producto

Con los dos defectos corregidos, la medición de los 16 temas de producto daba 16 de 16 fallando el
texto de `variant="gradient"`. La causa inmediata era un `ink: "light"` **cableado para los ocho** en
`BuildProduct`, que forzaba blanca sobre degradados que no la aguantan.

Quitarlo devolvía la política de ADR-089 —manda el peor extremo— y dejaba `polaris` y `nova` limpios.
Pero destapaba el problema de fondo, que el propietario nombró: la librería estaba decidiendo por el
producto. Medido sobre los 18 temas, la política de ADR-085 pone en blanco el **73 %** de las
superficies de relleno y baja a oscura el 27 % restante, sin que el tema pueda opinar.

## Decisión

### 1. v1 publica dos temas: `light` y `dark`

`@stellaria/nebula-themes` publica lo que ya publica. Los ocho productos de `packages/demos`
—`rosette`, `stellaria`, `polaris`, `lagrange`, `aurora`, `nova`, `eclipse`, `cosmos`— **siguen
siendo demostración, no contrato**: viven en un paquete no publicable y ninguno ha pasado el gate AA.

Promover un producto a tema oficial después de v1 es una minor, así que no hay prisa; publicarlo hoy
sería congelar dieciséis nombres y dieciséis paletas que nadie ha auditado.

`eclipse` y `cosmos` entran en el panel del sitio, del que faltaban sin motivo: ya existían, ya
salían en las stories de `Landing`, y solo `SHOWN` los excluía.

### 2. `ink.floor`: la clara manda, y el tema dice hasta dónde

El contrato gana una sección:

```ts
ink: { floor: number }
```

La política pasa a ser **la tinta clara gana siempre, salvo que su contraste caiga por debajo del
suelo**; y si cae, gana la que más contraste, como hasta ahora. En una sola expresión:

```
clara  si  Contraste(clara, relleno) ≥ floor  o  Contraste(clara, relleno) ≥ Contraste(oscura, relleno)
oscura en otro caso
```

El suelo se lee en la misma unidad que el gate —ratio de contraste—, así que no hay que traducir
nada para razonar sobre él, y sus extremos son los dos comportamientos que se quieren nombrar:

| `floor` | Qué significa                                                            |
| ------- | ------------------------------------------------------------------------ |
| `0`     | Tinta clara siempre, incluso sobre amarillo. Lo decide el producto        |
| `2`     | **El de los temas oficiales**: clara en todo menos `warning`             |
| `4.5`   | Equivale a la política anterior a este ADR                               |

En un degradado el suelo se mide en **su peor extremo**, que es lo que ADR-089 fijó, y
`GradientToken.ink` sigue por encima de todo: un degradado que declara su tinta la lleva.

### 3. Por qué `2` y no `0` en los oficiales

Medido sobre los 18 temas (2 oficiales + 16 de producto), 270 superficies de relleno:

| `floor` | Oficiales    | Superficies en blanco |
| ------- | ------------ | --------------------- |
| `0`     | **4/30 FAIL** | 270/270 (100 %)      |
| `2`     | 0/30 FAIL    | 234/270 (87 %)        |
| `3`     | 0/30 FAIL    | 206/270 (76 %)        |
| `4.5`   | 0/30 FAIL    | 198/270 (73 %)        |

Con `0`, los cuatro fallos de los oficiales son todos el mismo: **blanco sobre el amarillo de
`warning`, a 1,86 — y 1,61 en su hover**. Eso no es una preferencia estética discutible: no se lee, y
`check:contrast` es gate bloqueante en `.github/workflows/gates.yml`, así que dejaría CI en rojo
permanente sobre lo que v1 publica.

`2` es el valor que **maximiza el blanco sin romper nada**: sube del 73 % al 87 % de superficies en
tinta clara y deja `warning` como la única excepción de los dos temas oficiales, en `filled` y
`glow`. El degradado de marca va en blanca. Un producto que quiera blanco también sobre el amarillo
escribe `floor: 0` y lo tiene, que es exactamente la potestad que este ADR le devuelve.

### 4. El gate replica la política del runtime, y eso es lo que lo hace un gate

`tools/contrast-check` pasa a resolver la tinta con `theme.ink.floor` y con `GradientToken.ink`,
exactamente como `packages/web/src/theme/ink.ts`. Las dos réplicas quedan anotadas como tales en el
código. **Un gate que mide algo distinto de lo que el runtime pinta no mide nada**, y en este caso
llevaba desde ADR-089 haciéndolo.

## Consecuencias

- `NebulaTheme` gana una sección obligatoria. Es un cambio de contrato, y por eso se hace **antes** de
  v1: después, añadir una sección obligatoria sería una versión mayor.
- Un tema escrito a mano contra el contrato anterior no valida hasta que declare `ink`. No hay
  ninguno fuera del repo: los paquetes siguen `private: true`.
- `text.onPrimary`, `text.onGradient` y `vars.color.ink.<escala>` cambian de valor en cualquier tema
  cuyo suelo no sea `4.5`. En los oficiales el único cambio es que ya no cambia nada: con `2`,
  `warning` sigue en oscura y el resto en clara, que es donde ya estaban.
- Native hereda el contrato cuando abra N1: `ink.floor` viaja en el JSON del tema como todo lo demás.
- Los seis productos que siguen fallando el texto de su degradado —`rosette`, `stellaria`,
  `lagrange`, `aurora`, `eclipse`, `cosmos`, todos entre 4,32 y 4,34 contra un mínimo de 4,5— quedan
  anotados en `docs/NOTAS-PARA-REVISAR.md`. No bloquean v1 porque no se publican, pero se ven en el
  sitio.

## Alternativas descartadas

- **Blanca siempre, sin excepciones.** Es lo que se pidió literalmente. Se descarta al medir que deja
  el botón `warning` del tema por defecto a 1,86 y obliga a sacar esos pares del gate, que es
  desactivar el gate 2 de `docs/03` §4 para no ver lo que dice.
- **Blanca salvo en las familias claras** (`yellow`, `gold`, `lime`, `teal`, `cyan`). Da el mismo
  resultado que `floor: 2` sin campo nuevo, pero la decisión se queda dentro de la librería, que es
  justo lo que el propietario pidió cambiar. Una lista de familias tampoco sobrevive a que un tenant
  traiga su propia paleta.
- **`ink` declarable por escala, como en el degradado.** Siete declaraciones por tema para expresar
  una preferencia que es una sola. El suelo dice lo mismo con un número.

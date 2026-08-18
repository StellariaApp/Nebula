# ADR-172 — Los temas se llaman por su color, y el repertorio cubre la rueda

- **Estado**: **aceptada** · 2026-08-17 — decidida por el propietario
- **Cambia API pública**: sí, y **rompe**. Siete temas cambian de nombre y con ellos sus subpaths.
- **Toca**: `packages/themes`, `docs/02` §3.

## Contexto

Los diez temas del paquete tenían dos problemas, y los dos se ven midiendo.

**Tres eran nombres de producto.** `rosette` es Casa Rosette, `stellaria` es el código semilla y el
scope de npm, y `polaris` es el constructor de sitios. Un tema del catálogo que se llama como un
producto concreto invierte el argumento de Nebula: los temas existen para que los productos no
tengan que forkar, no para nombrarse por ellos.

**Y el nombre no decía el color.** Un punto de Lagrange no tiene color; `cosmos` es genérico; una
nova es blanca-azul y ese tema era turquesa.

Además el repertorio estaba mal repartido. Medidos los tonos en OKLCH de los diez primarios:

```
  6°  25°  49° 52°  80°                      180°   220° 252° 276°       345°
  └────── 5 de 10 en 80 grados ──────┘       └─ un hueco de 100 grados ─┘
```

Cinco de diez apiñados en el arco cálido, y **un hueco de 100°** donde viven todos los verdes. De las
19 paletas del contrato, siete no lideraban ningún tema.

## Decisión

### 1. El nombre dice el color, en registro estelar

| Tono | Paleta | Antes | Ahora | Por qué |
| ---- | ------ | ----- | ----- | ------- |
| 6°   | rose   | `rosette` | **`roseta`** | La Nebulosa Roseta es rosa-roja; la grafía castellana la separa del producto |
| 25°  | red    | `eclipse` | **`antares`** | Supergigante roja: «rival de Marte» |
| 49°  | brown  | `cosmos`  | **`titan`** | La luna de Saturno, bruma naranja-parda |
| 52°  | orange | `lagrange`| **`arcturus`** | Gigante naranja |
| 180° | teal   | `nova`    | **`helix`** | La Nebulosa de la Hélice es turquesa |
| 220° | cyan   | `polaris` | **`vega`** | Azul-blanca |
| 252° | blue   | `stellaria`| **`rigel`** | Supergigante azul |

`nebula`, `aurora` y `sun` se quedan: ya decían su color.

### 2. Cuatro temas nuevos, sin paletas nuevas

Las siete paletas libres cubrían exactamente los dos huecos, así que **no hizo falta generar
ninguna**:

| Tono | Paleta | Tema | Qué aporta |
| ---- | ------ | ---- | ---------- |
| 128° | lime   | **`halley`** | Llena el hueco de 100°. Los cometas brillan verdes |
| 306° | violet | **`vela`** | El resto de supernova de Vela, magenta-violeta |
| 251° | slate  | **`eclipse`** | El nombre liberado, y ahora sí dice lo que es: el momento apagado |
| 69°  | sand   | **`corona`** | La corona solar: pálida, cálida, difusa |

### 3. `eclipse` es la prueba de que el tema manda

Es el único que **apaga los materiales y baja el motion**. `motion.tier` y `effects.glass.enabled`
son interruptores de tema desde `docs/02` §2 y ningún tema del paquete los usaba, así que la
afirmación no tenía quien la demostrara.

Para eso `ThemeSeed` gana `motion` y `glass`. Sin declararlos manda la base, así que los otros trece
no cambian.

### 4. El contraste sigue siendo asunto de `nebula`

Medido: los trece de producto fallan entre 7 y 16 pares, **todos por lo mismo** — texto blanco sobre
el degradado de marca. `WorstInk` elige el menos malo de los dos y no el que pasa, así que cuando
ninguno llega al suelo se queda el claro.

**Se deja así a sabiendas**, como ya decidió [ADR-168](ADR-168-el-contrato-css-se-muda-con-los-temas.md)
§5: los temas de producto son variantes a gusto del consumidor y `nebula` es el único que Nebula
certifica. Quien lleve uno a producción lo valida con `pnpm check:contrast --theme <suyo>.json`.

## Alternativas

**Generar paletas nuevas.** Se evaluó y no hizo falta: las siete libres —`sand`, `yellow`, `lime`,
`green`, `slate`, `violet`, `grape`— caían justo en los huecos.

**Mantener los nombres y añadir sólo los cuatro.** Cero rotura. Se descarta porque tres nombres de
producto en el catálogo son deuda que sólo encarece: cada consumidor nuevo los ve y los copia.

**Traducir los nombres al inglés** (`rosette` en vez de `roseta`). Se descarta a propósito: es
justamente la grafía lo que separa el tema del producto.

## Consecuencias

- **Rompe**: siete nombres y sus subpaths `/<tema>` y `/<tema>/web`. Quien tenga uno guardado en
  `localStorage` cae al de por defecto — la guarda de ADR-166 ya lo cubre, pero pierde su elección.
- Catorce temas. El CSS de `/all/web` crece de 262 a ~360 kB en crudo; comprimido apenas se mueve.
- **`yellow` sigue sin liderar** ningún tema, a propósito: 98° está a 18° de `sun`.
- El par más justo por tono es `eclipse` (251°) y `rigel` (252°), pero el croma los separa —0,049
  contra 0,17—: uno se lee gris y el otro azul. Es la diferencia que un neutro busca.

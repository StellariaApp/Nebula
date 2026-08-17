# ADR-157 — La ref se expone donde hay razón para agarrar el nodo

- **Estado**: **aceptada** · 2026-08-16 — aprobada por el propietario, que además corrigió el eje: la
  regla no es por categoría sino por necesidad real de agarrar el nodo
- **Toca**: la superficie pública de `@stellaria/nebula-web`. **Es rompedor**, y por eso se propone
  ahora y no después de v1.
- **Motiva**: `forwardRef` es hoy el bloqueante más común para que un contenedor deje de hidratar a
  sus hijos.

## Contexto

El patrón de la cáscara —la raíz de cliente que recibe `children`, aplicado a `Hero` y `Card`— saca
del cliente **todo lo que un componente envuelve**, no solo al componente. Es lo que hizo que el JS
de la portada bajara por primera vez.

Al buscar a quién más aplicarlo, el bloqueante que aparece no es el tema ni motion: **es
`forwardRef`**. Un componente de servidor no puede recibir una ref, así que exponerla lo ata al
cliente por sí sola. De diez candidatos limpios, **seis caían solo por eso**: `Paper`,
`GlassSurface`, `GradientBackground`, `AnimatedGradient`, `MeshGradientBg` y `GradientBorder`.

Y no es un caso raro: **52 archivos del catálogo usan `forwardRef`**.

## Por qué no vale la regla «ref solo en primitivos»

Fue la primera propuesta y **se descarta con el dato delante**. Los seis bloqueados se declaran
`primitivo` en `.size-limit.js`, así que esa regla los protegería a todos y no cambiaría nada.

El motivo es que «primitivo» en este repo significa **peso y composición** —ligero, no compone—, no
semántica de ref. Son dos ejes distintos que casualmente comparten palabra.

## Decisión propuesta

**La ref se expone donde hay una razón para agarrar el nodo, no por categoría.**

Se gana la ref quien es susceptible de:

| Razón     | Ejemplos                                                     |
| --------- | ------------------------------------------------------------ |
| medirse   | `Box`, `Text` — sustrato genérico que el consumidor usa de todo |
| enfocarse | campos de formulario, controles                              |
| anclarse  | disparadores de `Popover`, `Tooltip`, `Menu`                 |

**Pierde la ref quien solo decora**: existe para envolver y teñir, y nadie tiene motivo para
agarrarlo. Quien necesite medir mete su propio `Box` dentro, que es lo que ya haría hoy.

### Alcance de esta propuesta

Se retira `forwardRef` de los cuatro decoradores puros:

`GradientBorder` · `GradientBackground` · `AnimatedGradient` · `MeshGradientBg`

**`Paper` y `GlassSurface` quedan fuera de este ADR, a decisión explícita del propietario.** Son
superficies base de muchas composiciones y es plausible que alguien las esté midiendo. Son también
las que más subárbol liberarían, así que la decisión no es obvia y merece tomarse aparte en vez de
arrastrarse en un lote.

Los otros 46 archivos con `forwardRef` **no se tocan aquí**. Este ADR fija la regla y la aplica al
grupo donde es indiscutible; el barrido del resto es trabajo posterior y se juzga uno a uno con este
criterio.

## Consecuencias

- **Es rompedor**, y a propósito ahora: `docs/release-checklist.md` fijó `0.1.0` diciendo que «en 0.x
  una corrección de contrato se arregla; en 1.x costaría un 2.0.0 a las pocas semanas». Éste es
  exactamente el caso que esa decisión anticipaba.
- **Los cuatro pasan a componentes de servidor**, y con ellos **deja de hidratar todo lo que
  envuelven** — que es el pago real, no los kB del propio componente.
- **La regla es de criterio, no de lista.** Eso la hace aplicable a componentes que aún no existen, y
  también más difícil de verificar por tooling que un patrón de nombres. Se documenta en la plantilla
  de componente para que la pregunta se haga al escribirlo.
- **Quien use `ref` en los cuatro deja de compilar**, con un error de tipos claro. Es preferible a
  que la ref quede aceptada y en silencio no apunte a nada.

## Alternativas descartadas

**«Ref solo en primitivos».** Descrita arriba: la categoría del repo no separa lo que hay que
separar.

**Conservar `forwardRef` y aceptar el coste.** Es lo que hay hoy, y significa que un decorador de
borde mantiene en el cliente todo lo que envuelve por una capacidad que nadie usa. La medición de
`Hero` y `Card` mostró que ese coste no es teórico.

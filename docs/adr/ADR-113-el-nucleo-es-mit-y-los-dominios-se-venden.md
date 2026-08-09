# ADR-113 — El núcleo es MIT y público; los dominios se venden por registry privado

- **Estado**: aceptada · 2026-08-08 (decisión del propietario al definir la web pública) · **W5 · W6**
- **Cambia API pública**: no. Cambia qué se publica, bajo qué licencia y quién puede instalarlo.
- **Cierra los supuestos [#11](../05-roadmap.md) —licencia y visibilidad del core— y [#5](../05-roadmap.md)
  —mecánica del registry privado premium—**, que el roadmap dejaba abiertos y marcaba como
  bloqueantes de W5.2 y W6.1.

## Contexto

El modelo comercial estaba decidido desde C1-Q1 (`docs/00-inventory.md` §1.18): **núcleo gratuito,
dominios vendibles**. Seis paquetes premium con ~24 componentes —`commerce`, `sales`, `payments`,
`people`, `maps`, `native-camera`— frente a un core de 158 componentes web.

Lo que faltaba era la mitad legal y operativa, y bloqueaba cosas concretas: el repositorio **no tiene
`LICENSE`**, los seis paquetes son `private: true` sin `publishConfig`, y el pie del sitio público no
puede declarar nada —el plan de DS lo dejó escrito: «no se implica MIT ni por omisión ni por
plantilla»—.

**Ninguna dependencia condiciona la elección.** Medido sobre el árbol: 13 dependencias de runtime MIT
—`dnd-kit`, `@tanstack/react-table`, `recharts`, `motion`, `tiptap`, `embla`, `react-player`,
`vanilla-extract`— y 3 Apache-2.0 —`react-aria`, `react-stately`, `@internationalized/date`—. Cero
copyleft. La decisión es de negocio, no de compatibilidad.

## Decisión

### El núcleo es MIT y se publica público

`@stellaria/nebula-tokens`, `-hooks`, `-themes`, `-icons`, `-web` y `-native` salen a npm público bajo
**MIT**.

No es una decisión ideológica, y el argumento no es «open source es bueno»:

- **La licencia permisiva es el requisito para poder vender los dominios.** Quien paga
  `@stellaria/nebula-payments` es una empresa, y una empresa no adopta una librería de UI cuyo
  contrato legal tenga que revisar su equipo jurídico. **El core gratis es el embudo**: nadie compra
  un paquete de dominio sin haber adoptado antes el núcleo.
- **El fork no es la amenaza que parece.** Mantine, shadcn y Radix son MIT y no han sido desplazados
  por un fork. El foso de Nebula no es el código: es el **contrato de tema** y la **API unificada
  web+native**, que un fork tendría que mantener en dos plataformas.
- **Hay precedente directo y vivo del modelo entero**: Tailwind (MIT + Tailwind UI), TanStack (MIT +
  Pro) y sobre todo **TipTap (MIT + Pro en registry privado)**, que además ya es dependencia de este
  repositorio y por tanto un caso que se puede estudiar desde dentro.

### Los dominios se entregan por registry privado con token por cliente

Los seis paquetes premium se publican en una **organización npm privada**. El cliente añade su token a
su `.npmrc` e instala con el gestor de paquetes de siempre:

```ini
@stellaria:registry=https://registry.npmjs.org/
//registry.npmjs.org/:_authToken=${NEBULA_TOKEN}
```

Es la forma que conserva **semver y `npm update`**, que es lo que una librería versionada necesita y
lo que ninguna de las alternativas da.

## Alternativas descartadas

**Apache-2.0 para el core.** Igual de permisiva y añade concesión expresa de patentes; es la licencia
de `react-aria`, del que ya se depende. Descartada por convención de sector: MIT es lo que usan
Mantine, shadcn, Chakra y el core de MUI, y para una librería de UI la familiaridad de la licencia
reduce fricción real en la adopción. La diferencia práctica para este proyecto es nula.

**BSL o source-available para el core.** Protege contra que un competidor aloje el producto como
servicio — un riesgo que una librería de componentes **no corre**, porque no hay servicio que alojar.
A cambio mete revisión legal en cada adopción, que es exactamente donde se pierde el embudo. El
precedente de HashiCorp en 2023 —fork OpenTofu y pérdida de comunidad— es el resultado a evitar.

**Núcleo cerrado.** Coherente solo si Nebula es un design system interno para fonicredito y tfv. Se
descarta porque el propietario mantiene la web pública, la landing y la estrategia de adopción
externa: con el core cerrado, el sitio público pierde su objeto.

**Venta del código fuente premium** (modelo Tailwind UI). Cero infraestructura de autenticación, pero
**sin ruta de actualización**: cada versión nueva es una descarga y un merge a mano. Inaceptable para
paquetes que van a versionar con semver junto al core.

**Registry propio autoalojado** (Verdaccio). Da control de altas, métricas y revocación sin coste por
asiento, y queda como la salida natural si la gestión manual en npm se hace incómoda. Se descarta
**ahora** por no montar infraestructura antes de tener el primer cliente.

## Consecuencias

- **`LICENSE` (MIT) en la raíz** y campo `license` en los seis paquetes del core.
- Los seis pasan de `private: true` a `publishConfig: { access: "public" }` **en W5**, no en este ADR:
  aquí se decide la licencia, no se publica.
- **El pie del sitio ya puede hablar**: «core MIT, paquetes de dominio con licencia comercial». Deja
  de aplicar la regla de DS de no declarar licencia.
- **`/pricing` y `/premium` dejan de estar bloqueadas.** El sitio puede presentar los seis paquetes y
  explicar cómo se compran.
- Los paquetes premium **nacen `private: true` y nunca se quitan**: su publicación va a la
  organización privada. Es la diferencia visible entre las dos familias en el propio `package.json`.
- **El titular del copyright es Stellaria.** Si el propietario prefiere su nombre legal o el de una
  sociedad, se cambia en `LICENSE` y en los seis `package.json`; no afecta a nada más.
- La gestión de altas y bajas de clientes es **manual al principio**. Automatizarla es un problema de
  W6.1 y no bloquea nada hoy.
- **`@pqina/pintura` sigue siendo peer opcional y comercial**, y eso no cambia: `EditorImage` requiere
  una licencia de terceros que el consumidor compra aparte. El README de W5 tiene que decirlo.

# ADR-163 — El provider acepta un tema ya materializado como clase

- **Estado**: **aceptada** · 2026-08-17 — aprobada por el propietario para desarrollarse
- **Cambia API pública**: sí, y **solo ensancha**. `defaultTheme` y `setTheme` ganan una tercera
  forma; las dos que hoy compilan siguen compilando y siguen haciendo lo mismo.
- **Toca**: `NebulaProviderProps`, `ThemeContextValue.setTheme`, `ColorSchemeScriptProps.themes`, `docs/02` §4.
- **Lo destapó**: la comprobación previa a [C1](../../prompts/6-consumidores/C1-landings-a-nebula.md),
  el encargo de pasar las landings de producto a Nebula.

## Contexto

[ADR-155](ADR-155-el-script-de-arranque-acepta-temas-que-no-son-los-oficiales.md) le dice al
consumidor lo que tiene que hacer, y lo dice sin ambigüedad:

> Esto obliga a que un tema de producto **exista como clase**, no como vars inyectadas. Es trabajo
> del consumidor —`createTheme` por tema— y no de este ADR.

El consumidor puede hacerlo hoy: `vars`, `ThemeToVars` y `themeClass` son API pública, así que
`createTheme(vars, ThemeToVars(LoadTheme(json)))` produce la clase en el build del producto.

**Y el provider la ignora.** `Resolve()` sólo entiende dos formas:

```ts
function Resolve(input: OfficialThemeName | NebulaTheme): ActiveTheme {
  if (typeof input === "string") return { …, className: themeClass[input], style: undefined };
  return { …, className: undefined, style: assignInlineVars(vars, ThemeToVars(input)) };
}
```

Un nombre oficial da clase. Cualquier otra cosa da vars en línea. No hay forma de decir «esta clase
ya existe y la CSS ya está puesta; tú sólo lleva el objeto».

Así que quien sigue ADR-155 al pie de la letra **paga las dos cosas**: el script pone la clase antes
del primer frame, y acto seguido el provider escribe encima las 627 propiedades del contrato. El
resultado es correcto y es un desperdicio, y además invierte la precedencia — lo inline gana sobre la
clase, así que si las dos fuentes discrepan manda la que el consumidor creía secundaria.

### Y no es sólo un desperdicio: el tema del producto se pierde al recargar

Esto se midió ejecutándolo, no leyéndolo. Montando el provider con un tema de producto como
`defaultTheme`:

| Qué hay en el storage | Con qué se monta  | Dónde acaba el provider   |
| --------------------- | ----------------- | ------------------------- |
| `"light"`             | `rosette-dark`    | **`light`** — el oficial  |
| `"rosette-dark"`      | `dark`            | **`dark`** — lo ignora    |

Las dos filas salen del mismo guardia:

```ts
const saved = store.getItem(storageKey);
if (saved !== null && IsOfficialName(saved)) set_active(Resolve(saved));
```

Sólo se restaura lo que es un nombre oficial. Y como ADR-121 persiste `meta.scheme` de un tema
custom —`"light"`, que **sí** es un nombre oficial— la restauración se dispara y tira el tema del
producto. El visitante ve `rosette` pintado por el script antes del primer frame, y al hidratar se
queda en el `light` de Nebula.

Es el peor de los dos mundos: no es que el tema custom no se persista, es que se persiste algo que
**sí se restaura y no es el suyo**. ADR-121 lo describe como caída elegante al scheme equivalente, y
para una demo lo es. Para un producto es su identidad desapareciendo un segundo después de cargar.

### Por qué el provider no puede resolverlo solo

`createTheme` de Vanilla Extract es **de build**. La librería no puede precompilar un tema que no
conoce cuando ella se compila, así que no existe la función «precompílame este tema» dentro de
`@stellaria/nebula-web`. Quien sí conoce el tema en build es el producto. La decisión, entonces, no
es construir un compilador: es **dejar de tirar el trabajo que el consumidor ya hizo**.

### Lo que cuesta hoy, medido

| Qué                                                    | Valor                     |
| ------------------------------------------------------ | ------------------------- |
| Variables del contrato CSS                             | 627                       |
| Atributo `style` de un tema inyectado, en crudo        | 40.057 bytes              |
| El mismo, brotli                                       | 4.533 bytes               |
| Componentes que necesitan el objeto vía `useTheme`     | 61 de 158                 |

**Los bytes no son el argumento** —comprimen a 4,5 kB— y conviene decirlo para no vender la decisión
por donde no es. Lo que cuesta de verdad es lo otro:

1. **El parpadeo.** Con `applyTheme="root"` las vars se aplican en un `useEffect`, o sea después de
   hidratar. Lo único que pinta antes del primer frame es `ColorSchemeScript`, y sólo reconoce
   clases. ADR-155 ya avisó de que los ejes de densidad y esquinas mueven métrica, así que además de
   verse es desplazamiento acumulado.
2. **Cambiar de tema** son 627 escrituras al DOM en vez de intercambiar un nombre de clase.
3. **El tema custom no se persiste** (ADR-121), porque no se puede reconstruir desde un nombre
   guardado. Una clase registrada sí tiene nombre, así que esta forma lo arregla de paso.

El objeto sigue haciendo falta pase lo que pase: 61 de 158 componentes leen `useTheme`, y la data
no-CSS del contrato —`variantMap`, `spring`, `motion.tier`, `effects.glass.enabled`, `gradients`,
`palettes`— sólo vive ahí. Esto no sustituye al objeto; separa **quién pinta** de **quién informa**.

## Decisión propuesta

### 1. Una tercera forma: el tema con su clase

```ts
export interface MaterializedTheme {
  theme: NebulaTheme;
  className: string;
}

defaultTheme?: OfficialThemeName | (string & {}) | NebulaTheme | MaterializedTheme;
```

`Resolve()` gana una rama: con esta forma devuelve `className` del consumidor y `style: undefined`.
No inyecta nada. El provider queda como lo que es en este caso — el portador del objeto para el lado
de JavaScript.

**`setTheme` no cambia de firma.** Era lo primero que parecía hacer falta y con el registro de §3 no
hace falta: un tema registrado se conmuta **por su nombre**, que ya es una cadena. Eso deja intacto
`ThemeContextValue` en `@stellaria/nebula-hooks`, que es tipo compartido con native — y native no
tiene clases CSS que materializar. Lo único que cambia allí es la documentación de la prop: un nombre
resuelve ahora contra los oficiales **y** los registrados.

La consecuencia práctica es la regla: **para conmutar por nombre hay que registrar**. Un
`MaterializedTheme` suelto en `defaultTheme` monta bien y no es alcanzable por `setTheme`.

### 2. Esta forma sí se persiste

Es la diferencia con ADR-121. Un objeto suelto no se puede rehidratar desde `localStorage`; un tema
materializado tiene nombre (`theme.meta.name`) **y** clase, que es exactamente lo que
`ColorSchemeScript` necesita en su mapa `themes`. Se persiste el nombre, y al recargar el script
encuentra la clase y pinta antes del primer frame.

Con una condición que el tipo no puede exigir: el nombre tiene que estar registrado en el mapa del
script. Si no lo está, el script cae al defecto y vuelve el parpadeo. Va documentado en `docs/02` §4
y no se valida en runtime — el provider no puede saber qué script montó el consumidor.

### 3. La restauración deja de mirar sólo la lista oficial

Persistir el nombre no sirve de nada si el guardia de arriba lo descarta. El provider gana el
registro que el consumidor declara una vez:

```ts
themes?: Record<string, MaterializedTheme>;
```

y `IsOfficialName` se ensancha a «¿lo conozco?» — oficial o registrado. Un nombre que no esté en
ninguna de las dos listas sigue cayendo al defecto, como hoy. `setTheme` acepta también esos
nombres, así que un conmutador de producto se escribe con cadenas y no arrastrando objetos.

Y para que el mapa del script no se escriba dos veces, se deriva del mismo registro:

```ts
<ColorSchemeScript themes={ThemeScriptMap(themes)} />
```

### 4. El scheme se declara, no se adivina — resuelto por ADR-166, y de otra forma

> Esta sección se conserva porque el problema que describe era real, pero **no se implementó como
> aquí se propone**. [ADR-166](ADR-166-la-identidad-del-tema-y-su-esquema-son-ejes-distintos.md) lo
> resuelve de raíz: al separar identidad de esquema, el mapa del script pasa a ser
> `Record<identidad, { dark: clase; light: clase }>` y el esquema **es la clave en la que se
> encontró la clase**. No hay que declararlo aparte porque ya no hay dónde adivinarlo.

`ColorSchemeScript` deduce hoy el scheme del **nombre**:

```js
var s = t.indexOf("dark") > -1 ? "dark" : "light";
```

Funciona para `light`/`dark` y para quien copie ese patrón. Un tema llamado `rosette-noche` saca
`color-scheme` al revés, y con él los scrollbars y los controles nativos del navegador. Es una
trampa silenciosa que sólo se ve en producción.

Así que la identidad de un tema materializado son cuatro cosas, no dos: **nombre, clase, scheme y el
objeto**. El mapa de `ColorSchemeScript` pasa a poder llevar `{ className, scheme }` además de la
cadena suelta, que se conserva por compatibilidad y sigue adivinando como hoy.

Esto es lo que cierra el círculo: el script sabe qué clase poner y con qué `color-scheme`; el
provider sabe qué objeto llevar; y el nombre guardado los reconcilia a los dos.

### 5. El núcleo sigue sin aprender dominio

Es la regla dura de ADR-155 y no se toca. La clase la trae el consumidor; `packages/web` no conoce
`rosette` ni `polaris` ni ninguna otra. La diferencia con hoy es que ahora hay por dónde entregarla.

## Alternativas

**Dejarlo como está.** El consumidor pone la clase y le pasa el objeto al provider, aceptando la
doble aplicación. Funciona, cuesta 4,5 kB brotli y una precedencia invertida. Se descarta porque
ADR-155 ya mandó materializar como clase: dejar que el mecanismo ignore su propia recomendación es
una incoherencia que el consumidor paga sin verla.

**Que el provider precompile.** Imposible con `createTheme`, que es de build. Materializar en runtime
es una decisión distinta y va en [ADR-164](ADR-164-compile-theme-materializa-en-caliente.md), que
produce exactamente esta misma tercera forma.

**Un registro de sólo clases en el provider** (`themes={{ rosette: claseRosette }}`, igual que el
mapa del script). Simétrico y tentador por eso. Se descarta porque al provider la clase sola no le
sirve: necesita **el objeto** para los 61 componentes que leen `useTheme`. Un mapa de clases lo
dejaría sabiendo pintar y sin nada que contar.

Lo que sí se adopta es el registro **de temas materializados** —clase y objeto juntos—, que es lo
que §3 necesita para restaurar por nombre. Y como lleva las dos mitades, el mapa del script se
**deriva** de él en vez de escribirse aparte: el consumidor declara sus temas una vez y no hay dos
listas que puedan discrepar.

## Consecuencias

- `docs/02` §4 se actualiza en el mismo PR: hoy dice que un tema de producto «se inyecta con
  `assignInlineVars`», que a partir de aquí es la vía de segunda opción y no la recomendada.
- La vía inline **no se retira**. Sigue siendo la correcta para el tema que no se conoce en build, y
  es lo que ADR-121 necesita para el preview en vivo.
- `prompts/6-consumidores/C1` deja de tener que advertir del doble coste.
- Sin dependencias nuevas y sin coste de bytes: es una rama más en una función que ya existe.

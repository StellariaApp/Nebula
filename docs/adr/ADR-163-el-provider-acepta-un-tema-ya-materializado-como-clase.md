# ADR-163 — El provider acepta un tema ya materializado como clase

- **Estado**: **propuesta** · 2026-08-17
- **Cambia API pública**: sí, y **solo ensancha**. `defaultTheme` y `setTheme` ganan una tercera
  forma; las dos que hoy compilan siguen compilando y siguen haciendo lo mismo.
- **Toca**: `NebulaProviderProps`, `ThemeContextValue.setTheme`, `docs/02` §4.
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

defaultTheme?: OfficialThemeName | NebulaTheme | MaterializedTheme;
setTheme: (next: string | NebulaTheme | MaterializedTheme) => void;
```

`Resolve()` gana una rama: con esta forma devuelve `className` del consumidor y `style: undefined`.
No inyecta nada. El provider queda como lo que es en este caso — el portador del objeto para el lado
de JavaScript.

### 2. Esta forma sí se persiste

Es la diferencia con ADR-121. Un objeto suelto no se puede rehidratar desde `localStorage`; un tema
materializado tiene nombre (`theme.meta.name`) **y** clase, que es exactamente lo que
`ColorSchemeScript` necesita en su mapa `themes`. Se persiste el nombre, y al recargar el script
encuentra la clase y pinta antes del primer frame.

Con una condición que el tipo no puede exigir: el nombre tiene que estar registrado en el mapa del
script. Si no lo está, el script cae al defecto y vuelve el parpadeo. Va documentado en `docs/02` §4
y no se valida en runtime — el provider no puede saber qué script montó el consumidor.

### 3. El núcleo sigue sin aprender dominio

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

**Un registro de temas en el provider** (`themes={{ rosette: claseRosette }}`, como el script).
Simétrico con `ColorSchemeScript` y tentador por eso. Se descarta porque duplica el mapa en dos
sitios que pueden discrepar, y porque el provider necesita **el objeto** además de la clase — el
mapa del script sólo lleva clases. La forma emparejada no admite esa discrepancia por construcción.

## Consecuencias

- `docs/02` §4 se actualiza en el mismo PR: hoy dice que un tema de producto «se inyecta con
  `assignInlineVars`», que a partir de aquí es la vía de segunda opción y no la recomendada.
- La vía inline **no se retira**. Sigue siendo la correcta para el tema que no se conoce en build, y
  es lo que ADR-121 necesita para el preview en vivo.
- `prompts/6-consumidores/C1` deja de tener que advertir del doble coste.
- Sin dependencias nuevas y sin coste de bytes: es una rama más en una función que ya existe.

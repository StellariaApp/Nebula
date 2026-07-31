# ADR-057 — `CommandPalette` propio sobre React Aria; cmdk descartado

- **Estado**: **aceptada** · 2026-07-30 (checkpoint obligatorio de W3.4.2)
- **Resuelve**: supuesto **#6** de `docs/05-roadmap.md` en su mitad de command palette («cmdk vs
  propio: provisionales; ADR definitivo en W4/W3»). La mitad de TipTap vs Lexical sigue abierta para W4.
- **Enmienda**: la fila `cmdk` de la tabla de dependencias de `docs/01-architecture.md` §8 y la fila
  `CommandPalette` de `docs/00-inventory.md` §1.11.

## Contexto

`docs/00-inventory.md` §1.11 dejaba `CommandPalette` como «cmdk o propio — ADR», y `docs/01` §8 anotó
cmdk con un coste estimado de **~6 kB**. El prompt de W3.4 obliga a preguntar antes de integrarlo.

Al verificar la dependencia antes del checkpoint, el coste anotado resulta incompleto:

```
cmdk 1.1.1
├── @radix-ui/react-dialog
├── @radix-ui/react-primitive
├── @radix-ui/react-compose-refs
└── @radix-ui/react-id
```

No son cuatro utilidades sueltas: `@radix-ui/react-dialog` es **un sistema de overlay completo**, con
su propio portal, su propio focus trap y su propia gestión de scroll. Adoptarlo significa que la
aplicación carga dos implementaciones de diálogo —la de Nebula, sobre React Aria y `motion`— y dos
implementaciones de accesibilidad para el mismo patrón.

## Decisión

1. **`CommandPalette` se construye sobre las primitivas de React Aria**: `useComboBox` +
   `useComboBoxState` para el contrato `combobox`/`listbox` con `aria-activedescendant`, `useListBox`
   y `useOption` para las filas, dentro del `Modal` de Nebula. Cero dependencias nuevas.

2. **No sobre el componente `Combobox`.** `Combobox` es un **campo de formulario**: arrastra `label`,
   `description`, `error`, `errorDisplay`, `required`, `surface` y el contrato `field`, nada de lo cual
   significa algo en una paleta, y su entrada mide 66 kB. Se usan los mismos hooks de Aria que él usa,
   un nivel por debajo.

3. **cmdk queda descartado** y su fila sale de la tabla de §8. Si en W4 apareciera una necesidad que
   justifique reabrirlo —`GlobalSearch` es el candidato—, este ADR se enmienda.

4. **El scoring es propio y puro** (`command-score.ts`): exacto > prefijo > inicio de palabra >
   contiene > subsecuencia, insensible a mayúsculas y acentos. Es una función sin estado, testeable
   sola, y es lo único que cmdk aportaba que no estuviera ya en el catálogo.

5. **Vive en el subpath `@stellaria/nebula-web/command`** (ADR-014 regla 3). Aunque sin cmdk ya no hay
   dependencia pesada que aislar, la paleta es una superficie grande que no todo consumidor monta, y
   dejarla fuera del barrel evita que engorde la entrada que se mide desde `dist/index.js`.

6. **Los items aceptan `permission`** con el contrato de ADR-056: una paleta lista acciones y una
   acción sin permiso no debe ni aparecer entre los resultados.

## Alternativas

- **cmdk**, como asumía el roadmap. Scoring y patrón de páginas anidadas ya resueltos y muy rodados, a
  cambio de 5 paquetes, dos sistemas de diálogo y dos implementaciones de a11y para el mismo patrón.
  Contradice ADR-003, que fija React Aria como la fuente única de comportamiento accesible.
- **Sobre el componente `Combobox`**, la lectura literal del prompt. Cero deps y máxima reutilización,
  pero hereda un contrato de campo entero para un control que no es un campo.
- **Sobre `useListBox` a pelo, con input propio sin `useComboBox`**: más ligero todavía, pero obliga a
  cablear a mano `aria-expanded`, `aria-controls` y `aria-activedescendant`, que es exactamente lo que
  `useComboBox` ya hace bien.

## Consecuencias

- **El supuesto #6 del roadmap queda medio cerrado**; la tabla de §8 pierde una fila en vez de ganarla,
  que es el sentido correcto para una tabla de deuda.
- **Se estrena el primer subpath export del paquete** (`./command`) y con él el patrón de build:
  `lib.entry` pasa a ser un objeto con un entry por subpath, y el aislamiento real lo da que
  `src/index.ts` **no** reexporte nada del subpath. Verificado: `dist/index.js` no menciona
  `CommandPalette`. `/datagrid` y `/charts` reutilizan la misma infraestructura.
- **Lo que no lleva**, y conviene decirlo: no hay páginas anidadas ni historial de comandos recientes.
  Son las dos cosas que cmdk regala; si se piden, se implementan sobre este mismo estado.
- **Paridad W/N**: native no tiene equivalente de cmdk de todos modos, así que una implementación
  propia sobre las primitivas de cada plataforma es el único camino que unifica la API.

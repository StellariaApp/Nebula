# ADR-054 — `Accordion` se hace genérico sobre `Multiple`

- **Estado**: **aceptada** · 2026-07-30 (checkpoint de apertura de W3.3) · **ejecutada en W3.3**
- **Enmienda**: `docs/00-inventory.md` §1.6 (fila `Accordion`).
- **Precedente**: ADR-041 (renombrado incompatible de Divider y Loader en la misma ventana).

## Contexto

`docs/00-inventory.md` §1.6 fija el `Accordion` de fonicredito como **referencia de API** y el prompt de
W3.3 lo repite: «Accordion (multiple tipado como FC)». La semilla tipa el valor contra el modo:

```ts
export type AccordionValue<Multiple extends boolean> =
  (Multiple extends true ? string[] : string | undefined) | undefined
```

La implementación entregada en W2 no lo hace: `value`, `defaultValue` y `onChange` hablan **siempre**
de `readonly string[]`, también en modo simple. El consumidor que solo quiere un panel abierto escribe
`value={["envio"]}` y recibe `["envio"]` en `onChange` — un array de un elemento que existe únicamente
porque el modo múltiple comparte la firma.

Es el modo por defecto, de modo que el ruido está en el 90 % de los usos.

## Decisión

1. **`AccordionProps` gana el parámetro `Multiple extends boolean = false`** y el valor se resuelve con
   `AccordionValue<Multiple>`: `string | undefined` en simple, `string[]` en múltiple. El default `false`
   mantiene la inferencia sin anotar nada: `<Accordion data={…} />` ya es el modo simple tipado.

2. **El estado interno sigue siendo una lista.** La conversión ocurre en los bordes: `ToList` normaliza
   la entrada y `Emit` decide si publica `next` o `next[0]`. Nada de la lógica de apertura, foco o
   teclado cambia — es un cambio de contrato, no de comportamiento.

3. **Cerrar el único panel abierto en modo simple emite `undefined`**, no `[]` ni `""`. Es el hueco que
   la firma de FC deja explícito con el `| undefined` final, y ahora hay test que lo fija.

4. **Se hace ahora.** Los paquetes siguen `private: true` y sin consumidores publicados. Es el mismo
   argumento con el que ADR-041 renombró `Divider.variant` y `Loader.variant`: «este es el momento de
   menor coste posible y no se repetirá».

## Alternativas

- **Dejarlo como está** y documentar la divergencia con la referencia. Cero churn, pero incumple el
  prompt de W3.3 y congela el array de un elemento en la API pública: con consumidores encima, el mismo
  cambio pasa a costar una migración real. Rechazada por el propietario en el checkpoint.
- **Un componente aparte** (`AccordionSingle`). Duplica superficie de API para expresar un modo, que es
  justo lo que ADR-026 retiró del catálogo al eliminar `SegmentedControl`.
- **Aceptar `string | string[]` en la entrada y emitir siempre array.** Suaviza la escritura sin tocar
  el tipo de retorno, pero deja la asimetría donde más molesta: lo que llega al `onChange`.

## Consecuencias

- **Cambio incompatible en un componente entregado en W2.** Dentro del repo afecta a su suite de tests
  —dos aserciones y un `value` controlado— y a su story, migradas en el mismo commit. Es el segundo
  cambio no aditivo del catálogo, tras ADR-041.
- **Coste de bundle cero**: el genérico se borra en compilación y la conversión son dos funciones de
  una línea.
- **Paridad W/N**: la semilla ya expone esta firma, de modo que N2 la hereda en vez de tener que
  divergir. El lint de paridad compara contratos de props y este acerca los dos lados.
- **`AccordionValue` se exporta** desde el barrel: un consumidor que guarde el valor en su propio estado
  necesita nombrar el tipo sin recalcularlo.

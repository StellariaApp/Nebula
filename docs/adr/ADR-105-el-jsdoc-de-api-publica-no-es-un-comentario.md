# ADR-105 — El JSDoc de API pública no es un comentario

- **Estado**: aceptada · 2026-08-06 · **WN**
- **Cambia API pública**: no cambia tipos ni runtime. Cambia lo que el consumidor ve al escribir.
- **Enmienda [ADR-019](ADR-019-convenciones-de-codigo.md) §2**, que sigue vigente en todo lo demás.

## Contexto

ADR-019 §2 dice **«sin comentarios en el código»**: lo que necesite explicación va a un `<Nombre>.md`
junto al módulo. La regla es buena y ha funcionado —el catálogo tiene 2 comentarios en 226 `.tsx`—.

Pero se aplicaba también al JSDoc sobre miembros de un tipo público, y ahí produce un resultado que
nadie quería: **20 `.types.ts` ya lo llevaban** (`AppShell` es el caso vivo) porque quien los escribió
vio que hacía falta, y quedaban en infracción silenciosa de una regla que nadie iba a hacer cumplir.

El barrido de ranuras lo volvió urgente: 17 componentes han ganado props públicas nuevas sin una
línea que las explique, y son props que el consumidor lee **en el autocompletado de su editor**, no
en un `.md` que no va a abrir.

## Decisión

**El JSDoc sobre un miembro de un tipo público no es un comentario de código: es documentación que se
publica.** Viaja al `.d.ts`, sale en el autocompletado y en la ficha de tipos del consumidor.

Se permite, y se recomienda, en:

- miembros de una interfaz o tipo **exportado** (props, campos de contrato);
- la firma de una **función exportada** cuando su nombre no basta.

Sigue prohibido, sin cambios:

- el comentario dentro de un cuerpo de función, que es el que ADR-019 §2 quería matar;
- el JSDoc que **repite el nombre** (`/** El título. */ title`). Si no añade nada, no se escribe.

### Qué se escribe en un JSDoc de ranura

Lo que el tipo **no** puede decir:

- **sobre qué nodo cae**, cuando el nombre no lo fija;
- **cuándo no aplica** —el caso de `errorProps` con `errorDisplay="text"`, o de una ranura que solo
  aplica si el valor es `string`—;
- **si se comparte** entre varios nodos, como `lineProps` en `Divider`.

## El `.md` sigue siendo para el porqué

No se convierte en gate. **73 de 158 componentes no tienen `.md` y la mayoría no lo necesita**: un
`.md` obligatorio produciría 73 archivos con prosa de relleno, que es peor que no tenerlos.

La regla, ahora explícita: **el `.md` es obligatorio cuando hay una decisión no deducible del
código** —un porqué de motion, un contrato de a11y, una excepción medida, una ranura con
condicionalidad—. Se comprueba en revisión, como hasta ahora; lo que cambia es que ya no compite con
el JSDoc, porque cada uno cubre una cosa distinta:

| Dónde     | Qué                                                   | Quién lo lee            |
| --------- | ----------------------------------------------------- | ----------------------- |
| **JSDoc** | qué es esta prop y cuándo no aplica                    | el consumidor, al teclear |
| **`.md`** | por qué el componente es así y qué se descartó         | quien lo mantiene       |

## Consecuencias

- Los 20 `.types.ts` que ya llevaban JSDoc dejan de estar en infracción.
- Las ranuras del barrido se documentan a medida que se añaden, no en una pasada final.
- La regla de lint no cambia: ADR-019 §2 nunca se verificó con herramienta, y seguir así es
  coherente —un `no-comments` automático no sabría distinguir los dos casos que este ADR separa.

# Permission gating (`docs/01` §6)

## Por qué el resolver se guarda como `PermissionResolver<string>`

`PermissionResolver<K>` es contravariante en `K`: un resolver que solo sabe responder a
`"orders.read" | "orders.write"` **no** es un resolver de `string`. Guardar el generic en el contexto
obligaría a `PermissionContext` a ser genérico, y un `createContext` genérico no existe en React —
habría que crear un contexto por conjunto de keys.

El reparto elegido:

- `PermissionProvider<K>` tipa el resolver **en el punto de entrada**, que es donde la app lo escribe y
  donde el error de key mal escrita tiene que salir.
- El contexto guarda la versión ensanchada, con un único cast en el provider.
- `usePermission<K>` estrecha de vuelta al leer. Es seguro porque el único productor de valores del
  contexto es el provider, y ahí la key ya quedó verificada contra `K`.

Si la app llama a `usePermission("typo")` con `K` explícito, el compilador rechaza la llamada; si la
llama sin generic, `K` cae a `string` y el resolver de la app recibe una key que no conoce. Ese es el
motivo de que el alias de un solo sitio que documenta `PermissionGate.md` sea la forma recomendada de
consumo.

## Ausencia de provider = denegación

Sin provider, `usePermission` devuelve `false` y `usePermissionResolver` devuelve `DENY`. No lanza y no
avisa: montar un árbol sin provider es un caso legítimo —una pantalla pública, un test de un
componente suelto— y lo que la regla prohíbe es **mostrar** lo gateado, no montarlo.

El gating es de UI. El backend sigue siendo la autoridad: esto es un espejo de sus reglas, no su
reemplazo.

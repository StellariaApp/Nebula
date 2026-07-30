# ADR-053 — El dataset de prefijos telefónicos vive en la librería, comprimido a dos campos

- **Estado**: **aceptada** · 2026-07-30 (checkpoint de apertura de W3.2) · **ejecutada en W3.2**
- **Enmienda**: `docs/00-inventory.md` §1.4 (filas `InputPhone` e `InputDial`).
- **Relacionado**: ADR-014 (política de dependencias), ADR-050 (contrato de valor serializable).

## Contexto

`InputDial` necesita la lista de prefijos telefónicos del mundo, y `InputPhone` lo monta dentro.
No había precedente en el monorepo: la referencia de fonicredito declara
`Dial = { id; label; value; length }` (`docs/api/fonicredito-components.md:536`) pero **trae la lista
de su API**, no del front. tfv no tiene el componente.

El propietario aportó un volcado de `country-flag-emoji-json@2.0.0` con 237 países y seis campos por
país: `name`, `code`, `emoji`, `unicode`, `dial_code`, `image`. Son 56 kB de JSON.

La pregunta real no era «¿de dónde salen los datos?» sino **cuánto de ese volcado tiene que viajar en
el bundle**. Se midió campo por campo:

| Campo     | ¿Derivable? | Cómo |
| --------- | ----------- | ---- |
| `emoji`   | **Sí**, 227/227 exactos | Indicadores regionales a partir del ISO |
| `unicode` | **Sí**      | Es el mismo emoji en notación textual |
| `image`   | **Sí**, 227/227 exactos | Plantilla del CDN + código ISO |
| `name`    | **Sí, y mejor** | `Intl.DisplayNames`, que además lo traduce; el volcado solo trae inglés |
| `code`    | No          | — |
| `dial_code` | No        | — |

## Decisión

1. **Se guardan dos campos por país**: `[código ISO 3166-1 alpha-2, prefijo]`. Los otros cuatro se
   derivan en `collections/dial-codes.ts` con `FlagEmoji`, `FlagImageUrl` y `CountryNamer`. El módulo
   mide **866 B brotli** contra un budget de 3 kB; el volcado completo habría costado ~14 kB.

2. **El nombre del país no se guarda: se resuelve con `Intl.DisplayNames`** en el locale del provider.
   No es solo una optimización de tamaño — es la única forma de que un `InputDial` en un producto en
   español no muestre «Germany». El volcado no tiene traducciones y mantenerlas sería una tabla i18n
   completa dentro de la librería.

3. **La bandera por defecto es emoji, no la imagen del CDN.** `FlagImageUrl` existe y se exporta, pero
   ningún componente la usa: un componente que pide un recurso a un CDN de terceros nada más montarse
   rompe en una app con CSP estricta, en una intranet sin salida y bajo cualquier requisito de no
   filtrar navegación a un tercero — y ninguno de los tres se detecta en desarrollo. Quien la quiera la
   pide con `renderFlag`, que es una línea.

4. **No se guarda `length`** —la longitud nacional que declara el `Dial` de fonicredito—. Es dato que
   caduca, muchos países tienen longitud variable y el volcado no lo trae. La validación de longitud es
   del consumidor, con Zod o con el esquema que use.

5. **Se descartan 10 territorios sin prefijo propio** y se normalizan los 10 prefijos NANP que el
   volcado escribe con espacio (`+1 876` → `+1876`); República Dominicana declara tres y se conserva el
   primero. Quedan **227 filas**. El detalle está en `collections/dial-codes.md`.

6. **El valor de `InputDial` es el código ISO, no el prefijo.** `+1` es Estados Unidos, Canadá y una
   docena de países más: el prefijo no identifica al país y por tanto no puede ser la clave de la
   selección. `DialByCode` traduce cuando el consumidor necesita el prefijo para componer el E.164.

## Alternativas

- **Sin dataset, `data` obligatoria.** Cuesta 0 kB y ningún dato caduca. Rechazada por el propietario:
  obliga a cada consumidor a mantener 227 filas, y ni fonicredito ni tfv las tienen en el front —las
  piden al backend—, así que el coste real se traslada a cuatro equipos en vez de resolverse una vez.
- **Dataset en subpath propio** (`@stellaria/nebula-web/dial-codes`), por ADR-014 regla 3. Rechazada
  por desproporción: esa regla existe para dependencias pesadas —charts, datagrid, editor— y aquí el
  módulo mide 866 B. Un subpath por 866 B es un import extra para el caso común y una entrada más que
  auditar en W5.
- **Guardar el volcado entero** como JSON importado. Rechazada: 56 kB por dato que se deriva, con el
  agravante de que el `name` en inglés se vería en productos en español.
- **`Intl.DisplayNames` también para el prefijo.** No existe: `Intl` no expone códigos de marcación.

## Consecuencias

- **`collections/dial-codes.data.ts` es un archivo generado** y no se edita a mano, como
  `tokens/palettes.ts`. A diferencia de aquel, no tiene todavía comando `gen:`: se generó una vez desde
  el volcado y el procedimiento queda escrito en `dial-codes.md`. Si el volcado se actualiza, se
  regenera con el mismo filtro y las mismas normalizaciones.
- **El volcado se conserva en `collections/dial-codes.source.json`**, junto al archivo que genera y a
  su documento. No cuelga de `components/InputDial/` porque el dataset no pertenece a un componente
  —`InputPhone` lo usa igual y `DialCodes()` es API pública— y no entra en ningún bundle: Vite parte
  de un único entry y sigue imports, `tsc` solo emite declaraciones, y `files: ["dist"]` no lo
  publica. Sin la fuente al lado, la regla «este archivo es generado» no sería accionable.
- **Cinco funciones nuevas en el API público** —`DialCodes`, `DialByCode`, `FlagEmoji`, `FlagImageUrl`,
  `CountryName`/`CountryNamer`— más el tipo `DialOption`. Son utilidades puras, sin React, y por tanto
  server-safe.
- **Paridad W/N**: el dataset vive en `packages/web` porque `collections/` es capa web. Cuando N2
  implemente `InputPhone` necesitará el mismo dato; el candidato natural es promoverlo a
  `@stellaria/nebula-tokens`, que tiene cero dependencias de runtime y ya aloja los contratos
  compartidos. **Queda como deuda declarada**, no resuelta aquí: moverlo ahora sería especular sobre
  una implementación native que no existe.
- **`Intl.DisplayNames` es ES2021** y está en todos los navegadores del target; las tres funciones que
  lo usan degradan al código ISO si el runtime no lo soporta, sin lanzar.

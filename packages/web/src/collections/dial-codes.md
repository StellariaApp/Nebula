# `dial-codes`

## Qué se guarda y qué se deriva

Los cuatro archivos `dial-codes.*` de esta carpeta son una unidad y se mantienen juntos:

| Archivo                  | Qué es                                                                                                                                                                                |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `dial-codes.source.json` | El volcado original, **fuente de regeneración**. No lo importa nadie: ningún build lo alcanza porque Vite parte de un único entry y sigue imports, y `files: ["dist"]` no lo publica. |
| `dial-codes.data.ts`     | **Generado**. 227 pares `[ISO, prefijo]`. No se edita a mano.                                                                                                                         |
| `dial-codes.ts`          | Las funciones que derivan lo demás y el API público.                                                                                                                                  |
| `dial-codes.md`          | Este documento.                                                                                                                                                                       |

Vive en `collections/` y no bajo `components/InputDial/` porque el dataset no es de un componente:
`InputPhone` lo usa igual y `DialCodes()` es API pública.

El origen es un volcado de `country-flag-emoji-json@2.0.0` que el propietario aportó en W3.2 con seis
campos por país —`name`, `code`, `emoji`, `unicode`, `dial_code`, `image`—; se comprobó que **cuatro de
los seis son derivables sin pérdida** y por eso no se guardan:

| Campo del volcado | Por qué no se guarda                                                                                                    |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `emoji`           | `FlagEmoji(code)` lo compone con los indicadores regionales. Se verificaron los 227: coincidencia exacta.               |
| `unicode`         | Es la representación textual del mismo emoji.                                                                           |
| `image`           | `FlagImageUrl(code)` es la plantilla del CDN. Se verificaron los 227: coincidencia exacta.                              |
| `name`            | `CountryName(code, locale)` usa `Intl.DisplayNames`, que además lo devuelve **traducido**; el volcado solo trae inglés. |

Guardar los seis campos costaba 56 kB de JSON. Guardar dos, 4,1 kB de fuente.

## Normalizaciones aplicadas

- **Se descartan 10 territorios sin prefijo propio** (Ascension, British Indian Ocean Territory,
  Christmas Island, Cocos, French Southern Territories, Heard & McDonald, Saint Barthélemy,
  Saint Martin, South Georgia y Svalbard): el volcado los trae con `dial_code` vacío.
- **Se quitan los espacios** de los diez prefijos NANP que venían como `+1 876`: un prefijo se
  concatena con el número nacional, y el espacio lo rompería.
- **República Dominicana declara tres** (`+1 809, +1 829, +1 849`); se conserva el primero. Es el
  único caso de prefijo múltiple del volcado.

## La bandera por defecto es emoji, no la imagen del CDN

`FlagImageUrl` existe y devuelve la URL de jsDelivr, pero **ningún componente la usa por defecto**:
`InputDial` pinta `FlagEmoji`. Un componente que hace una petición a un CDN de terceros nada más
montarse es una sorpresa en una app con CSP estricta, en una intranet sin salida a internet o bajo un
requisito de que ningún dato de navegación salga a un tercero — y ninguno de esos casos se detecta en
desarrollo.

Quien quiera la imagen la pide explícitamente:

```tsx
<InputDial renderFlag={(code) => <img src={FlagImageUrl(code)} alt="" width={20} />} />
```

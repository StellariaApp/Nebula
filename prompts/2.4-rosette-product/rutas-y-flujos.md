# RP · Rutas y flujos

> Revisión de la maqueta contra [04 · Modelo de datos](../../../Rosettee/docs/plan-demo/04-modelo-de-datos.md)
> y [05 · Contratos de API](../../../Rosettee/docs/plan-demo/05-contratos-de-api.md), que son los dos
> documentos que las nueve pantallas se construyeron **sin** leer. Aquí está lo que eso costó, el
> mapa de rutas simplificado, y los flujos de punta a punta.
>
> **Esto no toca ninguna story todavía.** Reestructurar rutas cambia el carril, y el carril *es* la
> barra inferior del móvil: se acuerda antes y se monta después.

---

## 1 · Lo que la maqueta tiene mal

Nueve cosas, y ninguna es de gusto: todas son fidelidad al modelo.

| # | Qué está mal | Qué dice el corpus |
| --: | --- | --- |
| 1 | La biblioteca es **global** y mezcla assets con acciones | §4.5: `sceneAsset.avatar` es una ref. **Los assets cuelgan del avatar.** Las acciones son del estudio (§4.6, `scope`) |
| 2 | Los assets son **tres tipos** | §5.5: son **cinco** — ubicación, outfit, peinado, **juguete** y **plancha de gesto**. Los dos últimos son de F4 |
| 3 | Crear un asset no valida nada | §5.5 rechaza **al crear**: un outfit sin decir qué tapa, un juguete sin decir cuánto mide, una plancha generada o sin declarar que se le quitó la identidad |
| 4 | El avatar tiene **cinco** estados | §4.2 tiene **seis**: falta `extraido`. Y `archivedFrom`: restaurar devuelve al estado del que se archivó, no a `borrador` |
| 5 | La revisión solo contempla imagen | §4.8: el medio va `generado → reproducido → aprobada`. **`POST /media/:id/played` es ruta propia**: no se aprueba un vídeo ni una voz sin que conste que alguien lo reprodujo |
| 6 | «Voz» es una pestaña del selector y no hay nada detrás | §5.7 bis: la voz necesita **ancla de voz** —`POST /voice/candidates`, `PUT /voice`— antes de poder producir una nota. Es el mismo patrón que las anclas de imagen y no está maquetado |
| 7 | El banco se enseña como catálogo de lectura | §5.7: `GET /actions` **sirve solo lo publicado**, y publicar exige `POST /observe` — que una persona mire y anote. Es un flujo de curaduría, no una tabla |
| 8 | No existe el techo del estudio, ni el equipo, ni la auditoría | §4.1 `ceiling` del estudio · §5.2 `members` · §5.2 `/audit/*`, construido en F11 |
| 9 | Los cinco códigos de error no están diseñados | §5.9: `402` `409` `422` `424` `429`. Hoy la maqueta insinúa dos y confunde saldo con concurrencia |

Y dos que no son errores pero sí huecos: **`grant`** (§4.9) no aparece por ningún lado —cambiar el
techo es una autorización con autor y fecha, no un interruptor— y **`/provider-credit/*`** no debe
aparecer nunca en la interfaz del estudio, cosa que conviene dejar escrita para que nadie lo añada
«por completitud».

---

## 2 · Contradicciones del corpus · **para el titular**

Cinco cosas que no se pueden resolver desde aquí porque el corpus se contradice o calla.

**2.1 · `GET /avatars/:id/assets` está documentada dos veces con dos significados.** En §5.5 son los
assets de escena —ubicación, outfit, peinado, juguete, plancha—; en §5.6 y §5.7 bis es *«todo lo que
ha producido, las tres modalidades en una lista»*. Son la misma ruta y dos colecciones distintas.
El renombrado del 05/08 movió `assets` a *«recursos de uso exclusivo»* y `media` a *«lo que
produce»*, así que la de §5.7 bis parece la que sobra — pero es la que el bloqueo 7 construyó.
**Propuesta:** lo producido vive en `GET /media?avatar=`, que ya existe en la misma tabla.

**2.2 · Los assets son tres o son cinco.** §7.3 dice *«tres tipos, una sola colección»*; §5.5 dice
cinco. §5.5 es posterior —juguete y plancha salieron de F4, gastando— así que gana, pero §7.3 sigue
diciendo tres y es el documento que alguien va a leer para diseñar el selector.

**2.3 · La memoria dice vectorial en dos sitios y texto en uno.** §4.10 tiene `embedding` y §4.11
pide *«índice vectorial · MongoDB Atlas Vector Search»*; §9.2 lo desmiente **midiendo**: el
proveedor no hace embeddings, `POST /v1/embeddings` contesta `404`, y la recuperación es búsqueda
de texto. Gana el hecho medido, y §4 tiene un campo que nadie va a poder rellenar.

**2.4 · La base de dos vistas tiene precio y no tiene ruta.** §10.1 la cobra —0 la primera, 20
rehacerla— y la llama *«el último paso del alta»*. En §5 no hay ningún endpoint que la produzca. O
está dentro de `POST /anchors`, o falta.

**2.5 · Lo que decidiste hoy no tiene modelo todavía.** Público/privado por avatar, visibilidad por
pieza y `clonable` no existen en §4 ni en §5. Son tres campos —dos en `avatar`, uno en `mediaAsset`—
y una ruta de publicación. Lo anoto aquí para que entre por la puerta del corpus y no por la de la
maqueta.

---

## 3 · El mapa de rutas

### Lo que hay hoy en la maqueta

```
/avatares · /avatares/nuevo · /avatares/:id · /revision · /biblioteca · /saldo · /explorar · /feed
```

Seis entradas de carril. Y como bajo `tablet` el `AppShell.Sidebar` **se convierte** en la barra
inferior, seis entradas de carril son seis destinos de móvil.

### El carril · **decidido por el titular, 06/08/2026**

```
CABECERA DEL CARRIL   conmutador de estudio
                      └ ajustes del estudio · techo, banco de acciones y auditoría

Rosette                                    ← se consume
  /                   Home                 lo que te espera y lo que hay nuevo
  /explorar           Explorar
  /feed               Feed

Studio                                     ← produce
  /avatares           Avatares
    /avatares/nuevo                        alta del avatar · stepper
    /avatares/:id                          el taller
        ├ taller · galeria · chat · identidad · assets
    /avatares/:id/revision                 modo de revisión · pantalla completa
  /saldo              Saldo y gasto
  /usuarios           Usuarios             papeles y **el tercer techo**

PIE DEL CARRIL        saldo + perfil

FUERA DEL ARMAZÓN     /alta · alta del estudio · POST /studios
```

**Los dos grupos dicen de qué va el producto: Rosette se consume, el estudio produce.** Home es la
bisagra —lo accionable arriba, lo que hay nuevo abajo— y por eso absorbe el contador de revisión que
antes justificaba una entrada propia.

**`Usuarios` resuelve un agujero que el modelo tenía y la interfaz no podía cumplir:** §5.1 regla 4
exige comprobar el escalón contra **el permiso del miembro**, y ese tercer techo no vivía en ninguna
pantalla.

### Lo que no es entrada de carril, y dónde queda

| Qué | Dónde | Por qué |
| --- | --- | --- |
| **El banco de acciones** | se **cura** en la revisión · se **administra** desde los ajustes del estudio | `POST /observe` pide que una persona mire la imagen y anote qué escalón salió. Eso ocurre **mirando la imagen**, que es la revisión. Una pantalla aparte obligaría a mirarla dos veces |
| **Techo del estudio, auditoría** | ajustes del estudio, tras el conmutador | Es donde ya vive «qué es este estudio», y es la única esquina que no se mueve entre las tres anchuras |
| **Assets** | pestaña del avatar | §4.5: `sceneAsset.avatar` es una ref |
| **Revisión** | modo, colgado del avatar | ver abajo |
| **Avatar activo** | **retirado del carril** | era mi parche para un carril sin portada. Con Home existiendo, el ancla de contexto es la cabecera del propio avatar, y en el móvil devuelve un hueco |

### Medido en la barra inferior

A **360 px** entran cuatro entradas y caen fuera **Saldo y gasto** y **Usuarios** —`x=358` y
`x=418` sobre una ventana de 360—. La barra desplaza en horizontal, así que se alcanzan con un
gesto, y **la cifra del saldo sobrevive igual** porque el pie del carril va anclado a la derecha.
Las dos que caen son las administrativas; las de trabajo diario —Home y Avatares— quedan a la
vista. Si algún día molesta, la palanca es invertir el orden de los grupos, no quitar entradas.

### Los cambios, y por qué

**A · La revisión deja de ser una sección y pasa a ser un modo, colgado del avatar.** No es
estética: la estación compara cada candidata contra **las anclas de ese avatar**, y el número del
gate —40 en 15 minutos— depende de que el marco no se mueva entre imágenes. Un `/revision` global
que mezcle avatares cambia la tira de anclas en cada salto y rompe justo la propiedad que hace
posible el número. El carril pierde una entrada y gana un contador sobre `Avatares`.

**B · `/biblioteca` se parte en dos por dueño.** Los assets cuelgan del avatar (§4.5) y ya son una
pestaña suya; el banco es del estudio (§4.6) y se queda solo en `/acciones`. Hoy la maqueta los
junta y eso obliga a inventar un dueño que el modelo no tiene.

**C · Aparece `Usuarios`, y con él el tercer techo.** El permiso de escalón del miembro existe en
§5.1 y no tenía pantalla: el modelo tenía una regla que la interfaz no podía cumplir.

**D · `Explorar` y `Feed` se quedan en el carril.** No existen en `plan-demo`, pero el carril
describe el producto y no solo el MVP: son la mitad que se consume, y Home es la bisagra entre las
dos. Siguen rotuladas como fuera de alcance dentro de la pantalla.

**E · El avatar activo se retira del carril.** Era un parche para un carril sin portada. Con Home
existiendo, el ancla de contexto es la cabecera del propio avatar — y en el móvil devuelve un hueco
que hacía falta.

---

## 4 · Los flujos, de punta a punta

Cada paso con su ruta, su coste y lo que puede fallar.

### F0 · Entrar

```
Polaris ──GET /enterprises-services/enterprise/:id?populate=serviceId──▶ redirige
                                                                          │
alta directa ──POST /studios──▶ empresa + servicio + plan gratis ─────────┘
                                          │
                                    ¿suscripción de pago?
                                    no ──▶ entra, ve el producto, PlanOf niega rosets
                                    sí ──▶ /avatares
```

Un estudio con servicio y sin plan **entra y ve el producto**. Eso es lo correcto (§5.2) y hace
falta una pantalla que lo diga sin parecer un error.

### F1 · Crear el avatar

```
POST /avatars                     borrador     gratis
  ├ fotos  POST /references       ─            gratis
  │        POST /extract          extraido     5 · 202 + jobId + ws
  └ texto  PATCH /canon           ─            gratis
GET /canon/gaps                                gratis   ← qué falta, campo a campo
POST /canon/autofill              ─            5 · opcional, por el conjunto
PATCH /canon a mano                            gratis   ← siempre, y entero
                                  completado
POST /anchors                     anclado      100 | 150
POST /anchors/validate                         10
  ├ pasa                          producible
  └ no pasa   POST /anchors/:role/regenerate   10 · archiva el juego entero
```

`POST /anchors` responde `409` si el avatar no está en `completado`. `/validate` responde **`200`
con `pasa: false`** cuando no pasa —es un hecho sobre el avatar, no un error de la petición— y
devuelve **la lista**, no un número: es lo que dice qué ancla regenerar.

### F2 · Preparar la escena

```
POST /avatars/:id/assets          gratis   ← cinco tipos, con las tres refusas de §5.5
POST /assets/:assetId/preview     10       ← bajo demanda, una candidata, 409 si ya la tiene
GET  /actions                     gratis   ← solo publicadas, filtradas por observedStep
GET  /actions/coverage            gratis   ← qué encuadres faltan
```

### F3 · Producir imagen

```
GET  /avatars/:id/assets/compatible?location=   relacionados primero, el resto después
POST /generations/quote                          gratis  ← obligatorio antes de generar
POST /generations                                cuesta  ← 202 + jobId
POST /generations/:jobId/cancel                  solo en encolado · devuelve la reserva
```

Errores, y son cinco pantallas distintas: `402` saldo · `409` el avatar no está en `producible` ·
`422` el escalón supera un techo · `424` falló el proveedor, con `errorClass` · `429` tope de
trabajos concurrentes.

### F4 · Revisar

```
GET  /media?avatar=&state=candidata
POST /media/:id/review           aprueba o descarta · una ruta, dos signos
POST /media/:id/regenerate       10 · tope de tres · elige el usuario aunque los tres fallen
```

### F5 · Vídeo y voz · **falta entero en la maqueta**

```
VOZ    POST /avatars/:id/voice/candidates    tres voces · la primera tanda incluida
       PUT  /avatars/:id/voice               elige una ─▶ ancla de voz
       POST /media/voice/quote               gratis · se llama EN CADA TECLA
       POST /avatars/:id/voice               cuesta · por carácter, dirección incluida

VÍDEO  POST /avatars/:id/video               desde una imagen APROBADA · 5, 10 o 15 s

REVISIÓN DE MEDIOS
       POST /media/:id/played                consta que alguien lo reprodujo
       POST /media/:id/review                aprobar EXIGE played · descartar no
```

Dos cosas que la interfaz tiene que respetar y hoy no puede: **el precio de la voz depende del
texto**, así que la única forma de cumplir la decisión 10 es preguntar mientras se escribe; y
**un medio no se aprueba sin reproducirlo**, que es la casilla 🔴 de F8.

### F6 · Publicar · **decidido hoy, sin modelo todavía**

```
PATCH /avatars/:id               publico, clonable
[falta]                          visibilidad por pieza
```

### F7 · Conversar

```
GET|POST /avatars/:id/conversations       un hilo por usuario y avatar
POST     /conversations/:id/turns         1 roset · respuesta en streaming
PATCH    /conversations/:id               stepMode A–D | auto
GET      /conversations/:id/memory        auditar qué recuerda
DELETE   /conversations/:id/memory/:id    olvidar algo concreto
```

El resumen diario **no tiene endpoint**: lo lanza un trabajo programado y no toca los rosets del
usuario.

### F8 · Operar

```
GET   /studios/me/balance      available · reserved · settled — son tres números, no uno
GET   /studios/me/ledger       asientos, filtrables
PATCH /studios/me/settings     techo + spendCapRosets + autoRecharge · SE VALIDAN JUNTOS
GET   /studios/me/rosets/tiers → POST /rosets/purchase → Stripe → webhook acredita
GET   /audit/chain/:id         la cadena de un activo hasta la aceptación, en una consulta
GET   /audit/errors            el reparto de errorClass, con su n
```

`PATCH /settings` **rechaza** encender la recarga sin límite de ciclo, y valida el **estado
resultante**: quitar el tope después con la recarga encendida se rechaza igual. La maqueta lo
presenta junto, que era la mitad; falta que el formulario no deje guardar el estado prohibido.

---

## 5 · Las máquinas de estado, que son lo que la interfaz pinta

| Entidad | Estados | Lo que la interfaz debe poder enseñar |
| --- | --- | --- |
| **avatar** | `borrador → extraido → completado → anclado → producible`, y `archivado` desde cualquiera | qué falta para el siguiente, y que restaurar vuelve a `archivedFrom` |
| **generationJob** | `pendiente → reservado → enviado → completado` \| `fallido` \| `devuelto` | el `errorClass` cuando falla, y si los rosets volvieron |
| **mediaAsset** | `candidata → aprobada` \| `descartada` | quién revisó y cuándo |
| **medio (vídeo/voz)** | `generado → reproducido → aprobada` \| `descartada` | que aprobar está **bloqueado** hasta reproducir |
| **anchorSet** | `generando → vigente → archivado` | que rehacer un ancla archiva el juego entero |
| **canon** | versión `n` → `n+1`, con `supersededBy` | qué versión usó cada activo |

---

## 6 · Lo que falta por maquetar

Por orden de lo que bloquea a lo que no:

1. **Vídeo y voz** — el ancla de voz, el presupuesto por tecla, y la revisión con `played`
2. **`/estudio`** — techo, equipo, autorizaciones (`grant`) y auditoría
3. **Los cinco errores** — cinco estados, y `402` de saldo ≠ `429` de concurrencia
4. **Curaduría del banco** — crear → producir una vez → `observe` → publicada; más la cobertura
5. **Assets de verdad** — cinco tipos y las tres refusas al crear
6. **Entrar sin plan** — el estudio que tiene el servicio y no ha pagado
7. **Alta del estudio** — `POST /studios`, fuera del armazón

---

## 7 · Qué cambiaría en las stories

Nada de esto está hecho. Es el presupuesto de la reestructura, por si conviene partirla:

| Story | Cambio |
| --- | --- |
| `fixtures/rosette` | estado `extraido`, cinco tipos de asset, carril de cuatro entradas |
| `El carril` | cuatro entradas · rehacer la barra inferior y volver a medir las tres anchuras |
| `Revisión` | pasa a `/avatares/:id/revision` · añade la rama de vídeo y voz con `played` |
| `Biblioteca` | se parte: `Acciones` (curaduría + cobertura) y la pestaña de assets del avatar |
| `El avatar` | pestaña `identidad` gana el ancla de voz · `galería` gana las tres modalidades |
| `Avatares del estudio` | contador de pendientes de revisión, que sustituye a la sección |
| **nuevas** | `Estudio`, `Vídeo y voz`, `Estados de error`, `Entrar sin plan` |

Cuatro stories tocadas y cuatro nuevas. Se puede hacer por partes; el orden que menos retrabajo
produce es **carril → revisión → biblioteca → el resto**, porque el carril decide la navegación de
todas las demás.

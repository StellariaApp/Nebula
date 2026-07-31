# `@stellaria/nebula-web/editor`

Subpath de contenido enriquecido. Dos componentes con dependencias muy distintas:

| Componente       | Dependencia                                              |
| ---------------- | -------------------------------------------------------- |
| `RichTextEditor` | `@tiptap/react` + `@tiptap/starter-kit` (directas, MIT)   |
| `EditorImage`    | **Pintura — peer opcional, licencia comercial**           |

## `RichTextEditor`

Funciona nada más importar. TipTap y ProseMirror son dependencias directas del paquete y quedan
aisladas aquí: quien no importe `/editor` no las descarga ([ADR-061](../../../../docs/adr/ADR-061-rich-content-tiptap-y-dependencias-de-w43.md)).

```tsx
import { RichTextEditor } from "@stellaria/nebula-web/editor";

<RichTextEditor label="Descripción" field={descriptionField} placeholder="Escribe aquí…" />;
```

## `EditorImage` — setup de Pintura

**Pintura no se instala con Nebula y no puede hacerlo.** Es un producto comercial de PQINA con
licencia por proyecto, y ADR-014 regla 5 prohíbe dependencias no-OSS en el core. Nebula publica el
wrapper —marco, superficie temada, modal, etiquetas y contrato de props—; la instancia del editor la
aporta el consumidor.

### 1. Licencia e instalación

Pintura se compra en [pqina.nl/pintura](https://pqina.nl/pintura/). La licencia da acceso a un
registro privado o a un tarball; sigue las instrucciones de PQINA para tu gestor de paquetes.

```bash
pnpm add @pqina/pintura @pqina/react-pintura
```

### 2. Pasar el editor por prop

```tsx
import { PinturaEditor } from "@pqina/react-pintura";
import { getEditorDefaults } from "@pqina/pintura";
import "@pqina/pintura/pintura.css";

import { EditorImage } from "@stellaria/nebula-web/editor";

<EditorImage
  src={photo.url}
  editor={PinturaEditor}
  editorProps={getEditorDefaults()}
  onProcess={(result) => {
    void Upload(result.dest);
  }}
/>;
```

`editorProps` se reenvía tal cual al componente de Pintura, así que toda su configuración
—`imageCropAspectRatio`, `utils`, `locale`, plugins— se pasa por ahí sin que Nebula tenga que
conocerla.

### 3. Qué pasa si falta el peer

`EditorImage` **no revienta**: el disparador se renderiza deshabilitado y debajo aparece un mensaje
explicando que falta la prop `editor`. Sustitúyelo con `fallback` si prefieres otro aviso, o con
`labels.missingPeer` si solo quieres cambiar el texto.

En tipos, `editor` es opcional a propósito: hacerlo obligatorio habría roto la compilación de todo
consumidor que solo quiere mostrar la imagen sin editarla.

## Los tipos de Pintura son estructurales, no suyos

`PinturaEditorProps` está **declarado en Nebula**, no importado de `@pqina/react-pintura`: sin la
librería instalada no hay tipos que importar, y no podemos exigir su instalación para compilar el
paquete. La consecuencia asumida y anotada en ADR-061: si Pintura cambia la forma de sus props, el
wrapper sigue compilando y el fallo aparece en runtime. El contrato que declaramos es el mínimo
—`src`, `onProcess`, `onClose`— y el resto viaja opaco por `editorProps`.

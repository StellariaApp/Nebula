# Form / FormDelete / ModalDelete

## Compound, no una prop por cada hueco

La referencia de tfv (`docs/api/tfv-components.md:440`) expone ~30 props sobre un solo componente:
`header`, `headerBefore`, `headerAfter`, `footer`, `footerBefore`, `footerAfter`, `banderole`,
`banderolePosition`, `flat`, `main`, `withoutWrapper`… La mitad son huecos de composición y la otra
mitad, layout. Nebula lo entrega como compound por decisión del propietario:

```tsx
<Form onSubmit={…}>
  <Form.Header title="Alta" description="…" />
  <Form.Banderole>Borrador</Form.Banderole>
  <Form.Content columns={2}>{/* campos */}</Form.Content>
  <Form.Footer error={…} onCancel={…} />
</Form>
```

El orden lo pone el consumidor, así que `headerBefore`/`headerAfter`/`footerBefore` desaparecen: son
hijos. Y el layout lo cubren las style props de ADR-032, así que `flat`, `main` y `withoutWrapper`
tampoco viajan.

## `isPending` bloquea el formulario entero, no solo el botón

`Form` envuelve sus hijos en un `<fieldset disabled>`. Un `<fieldset>` deshabilitado deshabilita
**todos** los controles que contiene, así que no hace falta propagar `disabled` campo por campo ni
que cada campo lo lea del contexto. Es la razón de que el fieldset exista aquí y no sea un `div`.

## Header y Footer son `div`, no `<header>`/`<footer>`

Parece contraintuitivo y es un requisito de accesibilidad. `<form>` **no** es contenido de seccionado
—la lista es `article`, `aside`, `nav`, `section`—, de modo que un `<header>` dentro de un formulario
sigue siendo el landmark `banner` de la página, y un `<footer>`, `contentinfo`. Con dos formularios en
una página se duplican los dos landmarks; el gate de axe lo detectó en la lámina de cuatro temas con
`landmark-no-duplicate-banner` y `landmark-no-duplicate-contentinfo`.

La jerarquía la aporta el `<h3>` del título, no el elemento contenedor.

## El error del footer es un `role="alert"`

`Form.Footer error={…}` pinta una región con `role="alert"`, de modo que un error de envío se anuncia
sin mover el foco. El id lo publica el contexto (`errorId`) para que un campo pueda apuntar a él con
`aria-describedby` cuando el error sea suyo.

## `FormDelete` y `ModalDelete`

`FormDelete` es `Form` con `color="error"`, un `Alert` opcional de consecuencias y el par
Eliminar/Cancelar. `ModalDelete` lo monta dentro de `Modal` y **bloquea el cierre por clic fuera y por
Escape mientras `isPending`**: cerrar el diálogo no cancela la petición ya enviada, así que dejar
cerrar da la impresión falsa de haber abortado.

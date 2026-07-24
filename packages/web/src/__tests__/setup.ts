const css = globalThis as { CSS?: { escape?: (value: string) => string } };

css.CSS ??= {};
css.CSS.escape ??= (value: string): string => value.replace(/["\\]/g, "\\$&");

const dialog = HTMLDialogElement.prototype;

if (typeof dialog.showModal !== "function") {
  dialog.showModal = function ShowModal(this: HTMLDialogElement): void {
    this.open = true;
  };
}

if (typeof dialog.show !== "function") {
  dialog.show = function Show(this: HTMLDialogElement): void {
    this.open = true;
  };
}

if (typeof dialog.close !== "function") {
  dialog.close = function Close(this: HTMLDialogElement): void {
    this.open = false;
    this.dispatchEvent(new Event("close"));
  };
}

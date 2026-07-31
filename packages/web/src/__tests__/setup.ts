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

const view = globalThis as unknown as {
  window?: Window & { matchMedia?: (query: string) => MediaQueryList };
};

if (view.window !== undefined && typeof view.window.matchMedia !== "function") {
  view.window.matchMedia = (query: string): MediaQueryList =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => undefined,
      removeListener: () => undefined,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      dispatchEvent: () => false,
    }) as MediaQueryList;
}

interface ObserverStub {
  observe: () => void;
  unobserve: () => void;
  disconnect: () => void;
  takeRecords: () => [];
}

function ObserverPolyfill(): ObserverStub {
  return {
    observe: () => undefined,
    unobserve: () => undefined,
    disconnect: () => undefined,
    takeRecords: () => [],
  };
}

const observers = globalThis as unknown as {
  IntersectionObserver?: unknown;
  ResizeObserver?: unknown;
  window?: { IntersectionObserver?: unknown; ResizeObserver?: unknown };
};

observers.IntersectionObserver ??= ObserverPolyfill;
observers.ResizeObserver ??= ObserverPolyfill;
if (observers.window !== undefined) {
  observers.window.IntersectionObserver ??= ObserverPolyfill;
  observers.window.ResizeObserver ??= ObserverPolyfill;
}

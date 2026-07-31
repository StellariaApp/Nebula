import type { ReactElement } from "react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { cleanup, render, screen } from "../../../__tests__/render.js";
import { EditorImage } from "../EditorImage.js";
import type { PinturaEditorProps } from "../EditorImage.types.js";

afterEach(cleanup);

const SRC = "/foto.jpg";

function FakePintura(props: PinturaEditorProps): ReactElement {
  return (
    <div data-testid="pintura" data-src={typeof props.src === "string" ? props.src : "blob"}>
      <button
        type="button"
        onClick={() => {
          props.onProcess?.({ dest: new Blob(["x"]) });
        }}
      >
        Procesar
      </button>
    </div>
  );
}

describe("EditorImage — sin el peer", () => {
  it("no revienta y explica que falta el editor", () => {
    render(<EditorImage src={SRC} alt="Fachada" />);
    expect(screen.getByAltText("Fachada")).toBeDefined();
    expect(screen.getByText(/peer-dependency opcional/)).toBeDefined();
  });

  it("deshabilita el disparador", () => {
    render(<EditorImage src={SRC} />);
    expect(screen.getByRole("button", { name: "Editar la imagen" }).hasAttribute("disabled")).toBe(
      true,
    );
  });

  it("acepta un fallback propio", () => {
    render(<EditorImage src={SRC} fallback={<p>Contrata Pintura</p>} />);
    expect(screen.getByText("Contrata Pintura")).toBeDefined();
    expect(screen.queryByText(/peer-dependency opcional/)).toBeNull();
  });

  it("acepta un mensaje propio sin cambiar el fallback", () => {
    render(<EditorImage src={SRC} labels={{ missingPeer: "Falta el editor" }} />);
    expect(screen.getByText("Falta el editor")).toBeDefined();
  });
});

describe("EditorImage — con el peer", () => {
  it("habilita el disparador y no muestra el aviso", () => {
    render(<EditorImage src={SRC} editor={FakePintura} />);
    expect(screen.getByRole("button", { name: "Editar la imagen" }).hasAttribute("disabled")).toBe(
      false,
    );
    expect(screen.queryByText(/peer-dependency opcional/)).toBeNull();
  });

  it("abre el editor en un diálogo", async () => {
    const user = userEvent.setup();
    render(<EditorImage src={SRC} editor={FakePintura} />);
    await user.click(screen.getByRole("button", { name: "Editar la imagen" }));
    expect(screen.getByRole("dialog", { name: "Editor de imagen" })).toBeDefined();
    expect(screen.getByTestId("pintura").getAttribute("data-src")).toBe(SRC);
  });

  it("reenvía onProcess y cierra", async () => {
    const user = userEvent.setup();
    const on_process = vi.fn();
    render(<EditorImage src={SRC} editor={FakePintura} onProcess={on_process} />);
    await user.click(screen.getByRole("button", { name: "Editar la imagen" }));
    await user.click(screen.getByRole("button", { name: "Procesar" }));
    expect(on_process).toHaveBeenCalledTimes(1);
  });

  it("pasa editorProps opacos al editor del consumidor", async () => {
    const user = userEvent.setup();
    const Spy = vi.fn(FakePintura);
    render(<EditorImage src={SRC} editor={Spy} editorProps={{ imageCropAspectRatio: 1 }} />);
    await user.click(screen.getByRole("button", { name: "Editar la imagen" }));
    expect(Spy.mock.calls[0]?.[0]).toMatchObject({ imageCropAspectRatio: 1, src: SRC });
  });

  it("respeta el modo controlado", () => {
    render(<EditorImage src={SRC} editor={FakePintura} opened onOpenChange={vi.fn()} />);
    expect(screen.getByTestId("pintura")).toBeDefined();
  });
});

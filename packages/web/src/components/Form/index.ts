import {
  FormBanderole,
  FormContent,
  FormFooter,
  FormHeader,
  FormRoot,
} from "./Form.js";

export const Form = /* @__PURE__ */ Object.assign(FormRoot, {
  Header: FormHeader,
  Banderole: FormBanderole,
  Content: FormContent,
  Footer: FormFooter,
});

export { FormBanderole, FormContent, FormFooter, FormHeader };
export { FormDelete } from "./FormDelete.js";
export { ModalDelete } from "./ModalDelete.js";
export type {
  BanderoleSide,
  FormBanderoleProps,
  FormContentProps,
  FormFooterProps,
  FormHeaderProps,
  FormProps,
} from "./Form.types.js";
export type { DeleteAlert, FormDeleteProps, ModalDeleteProps } from "./FormDelete.types.js";

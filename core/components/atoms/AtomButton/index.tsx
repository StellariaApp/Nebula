import { ex } from "excss";
import { AtomButtonProps } from "./types";
import { StylesButton } from "./styles";

const AtomButton = (props: AtomButtonProps) => {
  const { className, css } = props;
  return (
    <button
      {...props}
      className={ex.join(css, className, StylesButton(props))}
    />
  );
};

export default AtomButton;

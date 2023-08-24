import { ex, css } from "excss";
import { AtomButtonProps } from "./types";
import { StylesButton } from "./styles";

const AtomButton = (props: AtomButtonProps) => {
  const { className, css } = props;

  const styles = ex.join(StylesButton(props), className, css);

  return <button {...props} className={styles} />;
};

export default AtomButton;

import { ex } from "excss";
import { AtomTextProps, SelectorAsText } from "./types";
import { StylesButton } from "./styles";

const SelectorAsText: SelectorAsText = {
  span: (props) => <span {...props} />,
  p: (props) => <p {...props} />,
  a: (props) => <a {...props} />,
  h1: (props) => <h1 {...props} />,
  h2: (props) => <h2 {...props} />,
  h3: (props) => <h3 {...props} />,
  h4: (props) => <h4 {...props} />,
  h5: (props) => <h5 {...props} />,
  h6: (props) => <h6 {...props} />,
};

const AtomText = (props: AtomTextProps) => {
  const { className, css, as } = props;
  const Component = SelectorAsText[as ?? "span"];
  const styles = ex.join(StylesButton(props), className, css);

  return <Component {...props} className={styles} />;
};

export default AtomText;

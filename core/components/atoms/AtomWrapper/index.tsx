import { ex } from "excss";
import { AtomWrapperProps, SelectorAsWrapper } from "./types";
import { StylesWrapper } from "./styles";

const SelectorAsWrapper: SelectorAsWrapper = {
  div: (props) => <div {...props} />,
  article: (props) => <article {...props} />,
  section: (props) => <section {...props} />,
  main: (props) => <main {...props} />,
  footer: (props) => <footer {...props} />,
  nav: (props) => <nav {...props} />,
};

const AtomWrapper = (props: AtomWrapperProps) => {
  const { className, css, as } = props;
  const Component = SelectorAsWrapper[as ?? "div"];
  const styles = ex.join(StylesWrapper, className, css);

  return <Component {...props} className={styles} />;
};

export default AtomWrapper;

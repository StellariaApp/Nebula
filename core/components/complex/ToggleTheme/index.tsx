"use client";
import AtomButton from "../../atoms/AtomButton";
import theme from "../../theme";

const ToggleTheme = () => {
  const [_theme] = theme.use();
  return (
    <AtomButton
      onClick={() => {
        theme.toggle();
      }}
    >
      Toggle Theme : {_theme}
    </AtomButton>
  );
};

export default ToggleTheme;

import { css } from "excss";
import AtomButton from "../../../core/components/atoms/AtomButton";
import AtomWrapper from "../../../core/components/atoms/AtomWrapper";
import ToggleTheme from "../../../core/components/complex/ToggleTheme";

type Props = {};

const PageComponents = (props: Props) => {
  return (
    <AtomWrapper
      as="main"
      css={css`
        gap: 1rem;
        padding: 1rem;
        flex-direction: column;
        height: max-content;
      `}
    >
      <AtomWrapper
        css={css`
          gap: 1rem;
        `}
      >
        <AtomButton astype="flat" astheme="primary">
          Flat Primary
        </AtomButton>
        <AtomButton astype="flat" astheme="secondary">
          Flat Secondary
        </AtomButton>
        <AtomButton astype="flat" astheme="tertiary">
          Flat Tertiary
        </AtomButton>
        <AtomButton astype="flat" astheme="accent-primary">
          Flat Accent Primary
        </AtomButton>
        <AtomButton astype="flat" astheme="accent-secondary">
          Flat Accent Secondary
        </AtomButton>
        <AtomButton astype="flat" astheme="accent-tertiary">
          Flat Accent Tertiary
        </AtomButton>
      </AtomWrapper>
      <AtomWrapper
        css={css`
          flex-direction: row;
          gap: 1rem;
        `}
      >
        <AtomButton astype="outlined" astheme="primary">
          Outlined Primary
        </AtomButton>
        <AtomButton astype="outlined" astheme="secondary">
          Outlined Secondary
        </AtomButton>
        <AtomButton astype="outlined" astheme="tertiary">
          Outlined Tertiary
        </AtomButton>
        <AtomButton astype="outlined" astheme="accent-primary">
          Outlined Accent Primary
        </AtomButton>
        <AtomButton astype="outlined" astheme="accent-secondary">
          Outlined Accent Secondary
        </AtomButton>
        <AtomButton astype="outlined" astheme="accent-tertiary">
          Outlined Accent Tertiary
        </AtomButton>
      </AtomWrapper>
      <AtomWrapper
        css={css`
          flex-direction: row;
          gap: 1rem;
        `}
      >
        <AtomButton astype="gradient" astheme="primary">
          Gradient Primary
        </AtomButton>
        <AtomButton astype="gradient" astheme="secondary">
          Gradient Secondary
        </AtomButton>
        <AtomButton astype="gradient" astheme="tertiary">
          Gradient Tertiary
        </AtomButton>
        <AtomButton astype="gradient" astheme="accent-primary">
          Gradient Accent Primary
        </AtomButton>
        <AtomButton astype="gradient" astheme="accent-secondary">
          Gradient Accent Secondary
        </AtomButton>
        <AtomButton astype="gradient" astheme="accent-tertiary">
          Gradient Accent Tertiary
        </AtomButton>
      </AtomWrapper>
      <ToggleTheme />
    </AtomWrapper>
  );
};

export default PageComponents;

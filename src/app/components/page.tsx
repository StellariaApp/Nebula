import { css } from "excss";
import AtomButton from "../../../core/components/atoms/AtomButton";
import AtomWrapper from "../../../core/components/atoms/AtomWrapper";
import ToggleTheme from "../../../core/components/complex/ToggleTheme";
import AtomText from "../../../core/components/atoms/AtomText";

type Props = {};

const cssr = css`
  gap: 1rem;
  width: 100%;
  flex-wrap: wrap;
`;

const cssc = css`
  flex-direction: column;
  gap: 1rem;
  width: max-content;
  flex-wrap: wrap;
`;

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
      <AtomWrapper css={cssr}>
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
      <AtomWrapper css={cssr}>
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
      <AtomWrapper css={cssr}>
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
      <AtomWrapper css={cssr}>
        <AtomWrapper css={cssc}>
          <AtomText astype="flat" as="span">
            This is a Text span
          </AtomText>
          <AtomText astype="flat" as="p">
            This is a Text paragraph
          </AtomText>
          <AtomText astype="flat" as="a">
            This is a Text anchor
          </AtomText>
          <AtomText astheme="primary" astype="flat" as="h6">
            This is a Text h6
          </AtomText>
          <AtomText astheme="secondary" astype="flat" as="h5">
            This is a Text h5
          </AtomText>
          <AtomText astheme="tertiary" astype="flat" as="h4">
            This is a Text h4
          </AtomText>
          <AtomText astheme="accent-primary" astype="flat" as="h3">
            This is a Text h3
          </AtomText>
          <AtomText astheme="accent-secondary" astype="flat" as="h2">
            This is a Text h2
          </AtomText>
          <AtomText astheme="accent-tertiary" astype="flat" as="h1">
            This is a Text h1
          </AtomText>
        </AtomWrapper>
        <AtomWrapper css={cssc}>
          <AtomText astype="outlined" as="span">
            This is a Text span
          </AtomText>
          <AtomText astype="outlined" as="p">
            This is a Text paragraph
          </AtomText>
          <AtomText astype="outlined" as="a">
            This is a Text anchor
          </AtomText>
          <AtomText astype="outlined" astheme="primary" as="h6">
            This is a Text h6
          </AtomText>
          <AtomText astype="outlined" astheme="secondary" as="h5">
            This is a Text h5
          </AtomText>
          <AtomText astype="outlined" astheme="tertiary" as="h4">
            This is a Text h4
          </AtomText>
          <AtomText astype="outlined" astheme="accent-primary" as="h3">
            This is a Text h3
          </AtomText>
          <AtomText astype="outlined" astheme="accent-secondary" as="h2">
            This is a Text h2
          </AtomText>
          <AtomText astype="outlined" astheme="accent-tertiary" as="h1">
            This is a Text h1
          </AtomText>
        </AtomWrapper>
        <AtomWrapper css={cssc}>
          <AtomText astype="gradient" as="span">
            This is a Text span
          </AtomText>
          <AtomText astype="gradient" as="p">
            This is a Text paragraph
          </AtomText>
          <AtomText astype="gradient" as="a">
            This is a Text anchor
          </AtomText>
          <AtomText astype="gradient" astheme="primary" as="h6">
            This is a Text h6
          </AtomText>
          <AtomText astype="gradient" astheme="secondary" as="h5">
            This is a Text h5
          </AtomText>
          <AtomText astype="gradient" astheme="tertiary" as="h4">
            This is a Text h4
          </AtomText>
          <AtomText astype="gradient" astheme="accent-primary" as="h3">
            This is a Text h3
          </AtomText>
          <AtomText astype="gradient" astheme="accent-secondary" as="h2">
            This is a Text h2
          </AtomText>
          <AtomText astype="gradient" astheme="accent-tertiary" as="h1">
            This is a Text h1
          </AtomText>
        </AtomWrapper>
      </AtomWrapper>
      <ToggleTheme />
    </AtomWrapper>
  );
};

export default PageComponents;

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Box, Card, Cutout, Hero, GradientText } from "@stellaria/nebula-web";

import { MATRIX_A11Y, ThemeMatrix } from "../fixtures/themes.js";

const meta: Meta<typeof Cutout> = {
  title: "Media/Cutout",
  component: Cutout,
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof Cutout>;

function Svg(width: number, height: number, body: string): string {
  return `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='${String(width)}' height='${String(height)}'>${body}</svg>`,
  )}`;
}

const BACKGROUND = Svg(
  740,
  560,
  "<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='#3f37c9'/><stop offset='1' stop-color='#9d4edd'/></linearGradient></defs><rect width='740' height='560' fill='url(#g)'/>",
);
const FIGURE = Svg(
  400,
  520,
  "<ellipse cx='200' cy='150' rx='90' ry='110' fill='#f5d0c5'/><rect x='60' y='250' width='280' height='270' rx='60' fill='#1f1b4d'/>",
);

export const Default: Story = {
  render: () => (
    <Box maw={520} style={{ aspectRatio: "4 / 3" }}>
      <Cutout
        background={<img alt="" src={BACKGROUND} />}
        figure={FIGURE}
        figureSize={0.55}
        figurePosition={{ right: 24, bottom: 0 }}
        r="xl"
      />
    </Box>
  ),
};

export const Rotated: Story = {
  render: () => (
    <Box maw={520} style={{ aspectRatio: "4 / 3" }}>
      <Cutout
        background={<img alt="" src={BACKGROUND} />}
        figure={FIGURE}
        figureSize={0.6}
        figurePosition={{ right: -40, bottom: -20, translate: { y: "4%" }, rotate: { z: "-8deg" } }}
        r="xl"
      />
    </Box>
  ),
};

/** El hero de `docs/07` §5.3: la tarjeta de cristal con haz lleva dentro el recorte. */
export const Composition: Story = {
  render: () => (
    <Hero
      id="home"
      size="lg"
      contentWidth={560}
      title={
        <>
          Tu avatar,
          <br />
          <GradientText>listo para producir</GradientText>
        </>
      }
      description="Descríbelo en dos frases y tenlo en tu canal esta tarde."
      right={
        <Card variant="glass" gradientBorder={{ beam: true }} r="xl" p="none" maw={420} w="100%">
          <Box style={{ aspectRatio: "4 / 5" }}>
            <Cutout
              background={<img alt="" src={BACKGROUND} />}
              figure={FIGURE}
              figureSize={0.7}
              figurePosition={{ right: 0, bottom: 0 }}
              r="xl"
            />
          </Box>
        </Card>
      }
    />
  ),
};

export const AllThemes: Story = {
  parameters: MATRIX_A11Y,
  render: () => (
    <ThemeMatrix>
      <Box style={{ aspectRatio: "4 / 3" }}>
        <Cutout
          background={<img alt="" src={BACKGROUND} />}
          figure={FIGURE}
          figureSize={0.55}
          r="lg"
        />
      </Box>
    </ThemeMatrix>
  ),
};

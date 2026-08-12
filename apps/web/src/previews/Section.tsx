import { Section, Skeleton } from "@stellaria/nebula-web";
import type { Preview } from "./types";

const preview: Preview = {
  base: (
    <Section title="Movements" description="What moved this month." w={420}>
      <Skeleton h={40} />
    </Section>
  ),
};

export default preview;

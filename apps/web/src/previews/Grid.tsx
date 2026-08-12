import { Grid, Skeleton } from "@stellaria/nebula-web";
import type { Preview } from "./types";

const preview: Preview = {
  base: (
    <Grid w={320} gutter="sm">
      <Grid.Col span={6}>
        <Skeleton h={40} />
      </Grid.Col>
      <Grid.Col span={6}>
        <Skeleton h={40} />
      </Grid.Col>
    </Grid>
  ),
};

export default preview;

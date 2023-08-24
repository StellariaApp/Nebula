import "../css/variables.css";
import "../css/theme.css";
import "../css/globals.css";
import "../css/fonts.css";

import type { Metadata } from "next";
import theme from "../../core/components/theme";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

type Props = {
  children: React.ReactNode;
};

const LayoutRoot = (props: Props) => {
  const { children } = props;
  return (
    <html suppressHydrationWarning lang="en" className={theme.classes}>
      <body>
        {children}
        <theme.setup />
      </body>
    </html>
  );
};

export default LayoutRoot;

import "styled-components";
import type { PortfolioTheme } from "@/styles/portfolio-theme";

declare module "styled-components" {
  export interface DefaultTheme extends PortfolioTheme {}
}

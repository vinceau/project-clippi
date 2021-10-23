declare module "@emotion/styled" {
  import type { CreateStyled } from "@emotion/styled/types/index";

  export interface Theme {
    primary: string;
    secondary: string;
    foreground: string;
    foreground2: string;
    foreground3: string;
    background: string;
    background2: string;
    background3: string;
  }

  export * from "@emotion/styled/types/index";
  const customStyled: CreateStyled<Theme>;
  export default customStyled;
}

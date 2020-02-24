import { createGlobalStyle } from "styled-components";

import { Theme } from "./theme";

export const GlobalStyle = createGlobalStyle<{
    theme: Theme,
}>`
  body {
    color: ${({ theme }) => theme.foreground };
  }

  #app {
    .ui.accordion .title:not(.ui),
    .ui.form .field>label,
    .ui.checkbox input:focus~label,
    .ui.checkbox label,
    .ui.checkbox input:focus:checked~.box,
    .ui.checkbox input:focus:checked~label
    {
        color: ${({theme}) => theme.foreground} !important;
    }
  }
`;

import { createGlobalStyle } from "styled-components";

import { transparentize } from "polished";

import { Theme, ThemeMode } from "./theme";

export const GlobalStyle = createGlobalStyle<{
    theme: Theme,
}>`
  body {
    color: ${({ theme }) => theme.foreground };
  }

  #app .${ThemeMode.DARK} {
    .ui.accordion .title:not(.ui),
    .ui.form .field>label,
    .ui.checkbox input:focus~label,
    .ui.checkbox label,
    .ui.checkbox input:focus:checked~.box,
    .ui.checkbox input:focus:checked~label
    {
        color: ${({theme}) => theme.foreground} !important;
    }

    .ui.form input,
    .ui.selection.dropdown {
        background: ${({theme}) => theme.background};
        color: ${({theme}) => theme.foreground};
    }

    .ui.button {
        background: ${({theme}) => transparentize(0.2, theme.foreground2)} none;
        color: ${({theme}) => theme.background2};
    }

    .ui.checkbox input~.box:before,
    .ui.checkbox input~label:before {
        background: ${({theme}) => theme.foreground3};
    }
    .ui.checkbox .box:after,
    .ui.checkbox label:after {
        color: ${({theme}) => theme.foreground} !important;
    }

  }
`;
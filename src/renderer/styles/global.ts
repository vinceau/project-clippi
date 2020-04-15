import { createGlobalStyle } from "styled-components";

import { lighten } from "polished";

import { Theme, ThemeMode } from "./theme";

export const GlobalStyle = createGlobalStyle<{
    theme: Theme,
}>`
  body {
    color: ${({ theme }) => theme.foreground };
  }

  .ui.modal.${ThemeMode.DARK},
  #app .${ThemeMode.DARK} {
    font-weight: 100;

    .ui.transparent.input input,
    .ui.divider,
    .ui.header {
      color: ${({ theme }) => theme.foreground };
    }

    .ui.accordion .title:not(.ui),
    .ui.form .field>label,
    .ui.checkbox input:focus~label,
    .ui.checkbox label,
    .ui.checkbox input:focus:checked~.box,
    .ui.checkbox input:focus:checked~label
    {
      color: ${({theme}) => theme.foreground} !important;
    }

    .ui.card {
      border: solid 1px ${({theme}) => theme.background3} !important;
      box-shadow: none;
      background: ${({theme}) => lighten(0.05, theme.background)};
      .meta,
      .header {
        color: ${({theme}) => theme.foreground};
      }
      .extra {
        border-color: ${({theme}) => theme.background3} !important;
      }
    }

    .ui.placeholder.segment,
    .ui.table thead th,
    .ui.table {
      background: ${({theme}) => lighten(0.05, theme.background)};
      color: ${({theme}) => theme.foreground};
    }

    input,
    .ui.form input,
    .ui.form textarea,
    .ui.selection.dropdown {
        background: ${({theme}) => theme.foreground};
        color: ${({theme}) => theme.background};
        &::placeholder {
          color: ${({theme}) => theme.foreground2};
        }
    }

    .ui.dropdown .menu {
      background: ${({theme}) => theme.foreground};
      .item {
        color: ${({theme}) => theme.background};
        border-top: none;
        &:hover {
          background-color: ${ p => p.theme.foreground2 };
          color: ${ p => p.theme.foreground };
        }
      }
    }

    .ui.label,
    .ui.button {
        background: ${({theme}) => lighten(0.05, theme.foreground2)} none;
        color: ${({theme}) => theme.foreground};
        font-weight: 500;
        &:hover {
          background: ${({theme}) => lighten(0.1, theme.foreground2)} none;
        }
    }

    .ui.checkbox input~.box:before,
    .ui.checkbox input~label:before {
      border-color: ${({theme}) => theme.background};
      background: ${({theme}) => theme.foreground3};
    }
    .ui.checkbox .box:after,
    .ui.checkbox label:after {
        color: ${({theme}) => theme.foreground} !important;
    }

  }

  .ui.modal.${ThemeMode.DARK} {
    background: ${({theme}) => theme.background};

    & > .header {
      background: ${({theme}) => theme.background};
      border-bottom-color: ${({theme}) => theme.background3};
      color: ${({theme}) => theme.foreground};
    }

    & > .close {
      color: ${({theme}) => theme.foreground};
    }

    & > .content {
      background: ${({theme}) => theme.background};
      color: ${({theme}) => theme.foreground};
    }

    & > .actions {
      border-top-color: ${({theme}) => theme.background3};
      background: ${({theme}) => theme.background2};
      color: ${({theme}) => theme.foreground};
    }
  }
`;

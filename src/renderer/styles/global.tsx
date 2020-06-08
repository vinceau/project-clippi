import React from "react";
import { withTheme } from "emotion-theming";
import { css, Global, SerializedStyles } from "@emotion/core";
import { darken, lighten } from "polished";

import { Theme, ThemeMode } from "./theme";

const buttonStyles = (theme: Theme): SerializedStyles => css`
  background: ${lighten(0.05, theme.foreground2)} none;
  color: ${theme.foreground};
  font-weight: 500;
  &:hover {
    background: ${lighten(0.1, theme.foreground2)} none;
  }
`;

export const modalTheme = (theme: Theme): SerializedStyles => css`
  background: ${theme.background};

  & > .header {
    background: ${theme.background};
    border-bottom-color: ${theme.background3};
    color: ${theme.foreground};
  }

  & > .close {
    color: ${theme.foreground};
  }

  & > .content {
    background: ${theme.background};
    color: ${theme.foreground};
  }

  & > .actions {
    border-top-color: ${theme.background3};
    background: ${theme.background2};
    color: ${theme.foreground};

    .ui.button {
      ${buttonStyles(theme)}
    }
  }
`;

const makeGlobalStyles = (theme: Theme) => css`
  body {
    color: ${theme.foreground};
  }

  .ui.modal.${ThemeMode.DARK}, #app .${ThemeMode.DARK} {
    font-weight: 100;

    .ui.transparent.input input,
    .ui.divider,
    .ui.header {
      color: ${theme.foreground};
    }

    .ui.accordion .title:not(.ui),
    .ui.form .field > label,
    .ui.checkbox input:focus ~ label,
    .ui.checkbox label,
    .ui.checkbox input:focus:checked ~ .box,
    .ui.checkbox input:focus:checked ~ label {
      color: ${theme.foreground} !important;
    }

    .ui.card {
      border: solid 1px ${theme.background3} !important;
      box-shadow: none;
      background: ${lighten(0.05, theme.background)};

      .meta > a:not(.ui) {
        color: ${darken(0.1, theme.foreground)};
        &:hover {
          opacity: 0.8;
        }
      }

      .meta,
      .header {
        color: ${theme.foreground};
      }
      .extra {
        border-color: ${theme.background3} !important;
      }
    }

    .ui.placeholder.segment,
    .ui.table thead th,
    .ui.table {
      background: ${lighten(0.05, theme.background)};
      color: ${theme.foreground};
    }

    input,
    .ui.form input,
    .ui.form textarea,
    .ui.selection.dropdown {
      background: ${theme.foreground};
      color: ${theme.background};
      &::placeholder {
        color: ${theme.foreground2};
      }
    }

    .ui.dropdown .menu {
      background: ${theme.foreground};
      .item {
        color: ${theme.background};
        border-top: none;
        &:hover {
          background-color: ${theme.foreground2};
          color: ${theme.foreground};
        }
      }
    }

    .ui.label,
    .ui.button {
      ${buttonStyles(theme)}
    }

    .ui.checkbox input ~ .box:before,
    .ui.checkbox input ~ label:before {
      border-color: ${theme.background};
      background: ${theme.foreground3};
    }
    .ui.checkbox .box:after,
    .ui.checkbox label:after {
      color: ${theme.foreground} !important;
    }
  }
  .ui.modal.${ThemeMode.DARK} {
    ${modalTheme(theme)}
  }
`;

export const GlobalStyle = withTheme(({ theme }) => <Global styles={makeGlobalStyles(theme)} />);

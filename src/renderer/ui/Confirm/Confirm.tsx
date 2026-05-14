/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import React from "react";
import type { ConfirmProps } from "semantic-ui-react";
import { Confirm as SemanticConfirm } from "semantic-ui-react";

import { useTheme } from "@/styles";
import { modalTheme, ThemeMode } from "@/styles";

export const Confirm: React.FC<ConfirmProps> = (props) => {
  const theme = useTheme();
  return (
    <SemanticConfirm
      css={css`
        &&& {
          ${theme.themeName === ThemeMode.DARK && modalTheme(theme.theme)}
          .actions {
            display: flex;
            justify-content: space-between;
            & > button {
              margin: 0 !important;
            }
          }
        }
      `}
      {...props}
    />
  );
};

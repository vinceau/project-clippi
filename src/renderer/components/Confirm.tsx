/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import React from "react";
import { useTheme } from "@/styles";

import { Confirm as SemanticConfirm, ConfirmProps } from "semantic-ui-react";
import { ThemeMode, modalTheme } from "@/styles";

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

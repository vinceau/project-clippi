/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import React from "react";
import type { ConfirmProps } from "semantic-ui-react";
import { Confirm as SemanticConfirm } from "semantic-ui-react";

import { useTheme } from "@/styles";

export function Confirm(props: ConfirmProps) {
  const theme = useTheme();
  return (
    <SemanticConfirm
      className={theme.themeName}
      css={css`
        &&& {
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
}

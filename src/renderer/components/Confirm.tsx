/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import styled from "@emotion/styled";
import { Confirm as SemanticConfirm } from "semantic-ui-react";
import { Theme, ThemeMode, modalTheme } from "@/styles";

export const Confirm = styled(SemanticConfirm)<{
  themeName: string;
  theme: Theme;
}>`
  &&& {
    ${({ theme, themeName }) => themeName === ThemeMode.DARK && modalTheme(theme)}
    .actions {
      display: flex;
      justify-content: space-between;
      & > button {
        margin: 0 !important;
      }
    }
  }
`;

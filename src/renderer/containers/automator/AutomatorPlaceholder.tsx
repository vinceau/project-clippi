import styled from "@emotion/styled";
import { darken, lighten } from "polished";
import React from "react";
import { Icon } from "semantic-ui-react";

import { ThemeMode, useTheme } from "@/styles";

const Outer = styled.div<{
  themeName: string;
}>`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${(p) => {
    const adjust = p.themeName === ThemeMode.DARK ? lighten : darken;
    return adjust(0.05, p.theme.background);
  }};
  border-radius: 0.5rem;
`;

const Notice = styled.div`
  margin: 20px 0;
  text-align: center;
`;

export const AutomatorPlaceholder: React.FC = () => {
  const theme = useTheme();
  return (
    <Outer themeName={theme.themeName}>
      <Icon size="huge" name="flag" />
      <Notice>
        <h2>No events added</h2>
        <p>Add an event to get started</p>
      </Notice>
    </Outer>
  );
};

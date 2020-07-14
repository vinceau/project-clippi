import React from "react";

import { ThemeMode, useTheme } from "@/styles";
import styled from "@emotion/styled";

import { Icon } from "semantic-ui-react";
import { lighten, darken } from "polished";

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
      <Icon size="huge" name="flag outline" />
      <Notice>
        <h2>No events added</h2>
        <p>Add an event to get started</p>
      </Notice>
    </Outer>
  );
};

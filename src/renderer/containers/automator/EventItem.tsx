/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import React from "react";
import { NamedEventConfig } from "@/store/models/automator";
import { Icon } from "semantic-ui-react";
import styled from "@emotion/styled";
import { transparentize, lighten, darken } from "polished";
import { ThemeMode, useTheme } from "@/styles";

export interface EventItemProps {
  event: NamedEventConfig;
  selected?: boolean;
  onClick?: () => void;
}

const Outer = styled.div<{
  themeName: string;
  selected?: boolean;
  onClick?: () => void;
}>`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 10px;
  border-bottom: solid 1px ${(p) => transparentize(0.8, p.theme.foreground)};
  ${(p) => {
    const adjust = p.themeName === ThemeMode.DARK ? lighten : darken;
    return `
    opacity: ${p.selected ? 1 : 0.8};
    background-color: ${adjust(p.selected ? 0.2 : 0.05, p.theme.background)};
    ${
      p.onClick &&
      !p.selected &&
      `
    &:hover {
      cursor: pointer;
      background-color: ${adjust(0.1, p.theme.background)};
    }
    `
    }
    `;
  }}
`;

export const EventItem: React.FC<EventItemProps> = ({ event, onClick, selected }) => {
  const theme = useTheme();
  return (
    <Outer themeName={theme.themeName} onClick={onClick} selected={selected}>
      <div
        css={css`
          margin-right: 1rem;
        `}
      >
        <Icon name="flag outline" />
      </div>
      <div>{event.name}</div>
    </Outer>
  );
};

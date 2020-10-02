/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import React from "react";
import { NamedEventConfig } from "@/store/models/automator";
import { Icon } from "semantic-ui-react";
import styled from "@emotion/styled";
import { transparentize, lighten, darken } from "polished";
import { ThemeMode, useTheme } from "@/styles";
import { generateEventName } from "@/lib/events";

export interface EventItemProps {
  event: NamedEventConfig;
  disabled?: boolean;
  selected?: boolean;
  onClick?: () => void;
}

const Outer = styled.div<{
  disabled?: boolean;
  themeName: string;
  selected?: boolean;
  onClick?: () => void;
}>`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 1.5rem 2rem;
  border-radius: 0.5rem;
  margin: 1.5rem 2rem;
  margin-left: 1rem;
  ${(p) => {
    const adjust = p.themeName === ThemeMode.DARK ? lighten : darken;
    return `
    opacity: ${p.disabled ? "0.4" : "1"};
    background-color: ${p.selected ? adjust(0.2, p.theme.background) : "transparent"};
    border: solid 0.1rem ${transparentize(0.8, p.theme.foreground)};
    ${p.selected ? `border-color: transparent;` : ""}
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

export const EventItem: React.FC<EventItemProps> = ({ event, onClick, selected, disabled }) => {
  const theme = useTheme();
  const eventName = generateEventName(event);
  return (
    <Outer disabled={disabled} themeName={theme.themeName} onClick={onClick} selected={selected}>
      <div
        css={css`
          margin-right: 1rem;
        `}
      >
        <Icon name={disabled ? "window close" : "flag"} />
      </div>
      <div
        css={
          disabled &&
          css`
            text-decoration: line-through;
          `
        }
      >
        {eventName}
      </div>
    </Outer>
  );
};

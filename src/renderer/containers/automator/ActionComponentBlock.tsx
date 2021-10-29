/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import styled from "@emotion/styled";
import React from "react";

const Outer = styled.div<{
  hideBorder?: boolean;
}>`
  margin: 2rem;
  padding-bottom: 2rem;
  ${({ theme, hideBorder }) => (hideBorder ? "" : `border-bottom: solid 0.3rem ${theme.foreground3}`)};
`;

const Inner = styled.div`
  margin: 0 2rem;
  display: flex;
  flex-direction: column;
`;

export interface ActionComponentBlockProps {
  hideBorder?: boolean;
  icon: JSX.Element;
  header: JSX.Element;
  children?: JSX.Element;
}

export const ActionComponentBlock = React.forwardRef<HTMLDivElement, ActionComponentBlockProps>((props, ref) => {
  const { hideBorder, icon, header, children } = props;
  return (
    <Outer hideBorder={hideBorder}>
      <Inner ref={ref}>
        <div
          css={css`
            display: flex;
            flex-direction: row;
            align-items: center;
            ${!hideBorder && `padding-bottom: 1rem;`}
          `}
        >
          <div
            css={css`
              margin-right: 1rem;
            `}
          >
            {icon}
          </div>
          <div>{header}</div>
        </div>
        {children && (
          <div
            css={css`
              width: 100%;
              line-height: 3rem;
            `}
          >
            {children}
          </div>
        )}
      </Inner>
    </Outer>
  );
});

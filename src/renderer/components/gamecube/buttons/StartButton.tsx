import React from "react";

import styled from "@emotion/styled";

export const StartButton: React.FC<{
  pressed?: boolean;
  color?: string;
  onClick?: () => void;
}> = (props) => {
  const { pressed, onClick } = props;
  const buttonColor = props.color || "#8F8F8F";
  const textColor = "white";
  const Outer = styled.div`
        width: 3.5em;
        height: 3.5em;
        border-radius: 50%;
        background-color: ${pressed ? buttonColor : "transparent"}
        border: solid 0.2em ${buttonColor};
        display: flex;
        justify-content: center;
        align-items: center;
        ${
          onClick &&
          `
            cursor: pointer;
            &:hover {
                ${
                  pressed
                    ? "opacity: 0.85"
                    : `
                background-color: ${buttonColor};
                span {
                    color: ${textColor};
                }
                `
                }
            }
        `
        }
        span {
            text-transform: uppercase;
            font-size: 0.8em;
            color: ${pressed ? textColor : buttonColor}
        }
    `;
  return (
    <Outer onClick={onClick}>
      <span>Start</span>
    </Outer>
  );
};

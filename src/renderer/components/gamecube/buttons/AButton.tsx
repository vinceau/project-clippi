import React from "react";

import styled from "styled-components";

export const AButton: React.FC<{
  pressed?: boolean;
  color?: string;
  onClick?: () => void;
}> = (props) => {
  const { pressed, onClick } = props;
  const buttonColor = props.color || "#00674F";
  const textColor = "white";
  const Outer = styled.div`
        width: 9em;
        height: 9em;
        border-radius: 50%;
        background-color: ${pressed ? buttonColor : "transparent"}
        border: solid 0.5em ${buttonColor};
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
                    ? "opacity: 0.85;"
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
            font-size: 4.8em;
            color: ${pressed ? textColor : buttonColor}
        }
    `;
  return (
    <Outer onClick={onClick}>
      <span>A</span>
    </Outer>
  );
};

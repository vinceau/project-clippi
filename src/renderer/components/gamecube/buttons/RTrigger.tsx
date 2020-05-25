import React from "react";

import styled from "@emotion/styled";

export const RTrigger: React.FC<{
  pressed?: boolean;
  color?: string;
  onClick?: () => void;
}> = (props) => {
  const { onClick, pressed } = props;
  const buttonColor = props.color || "#8F8F8F";
  const textColor = "white";
  const Outer = styled.div`
    width: 15em;
    ${onClick &&
    `
        cursor: pointer;
        &:hover {
            ${
              pressed
                ? "opacity: 0.85;"
                : `
                #path-1 {
                    fill: ${buttonColor}
                }
                text {
                    fill: ${textColor};
                }
                `
            }
        }
    `}
    text {
      fill: ${pressed ? textColor : buttonColor};
    }
    svg {
      overflow: visible;
    }
    #path-1 {
      stroke: ${buttonColor};
      fill: ${pressed ? buttonColor : "transparent"};
    }
  `;
  return (
    <Outer onClick={onClick}>
      <svg width="100%" viewBox="0 0 235 141" version="1.1" overflow="visible">
        <g>
          <path
            id="path-1"
            strokeWidth="8"
            transform="translate(117.920733, 70.343725) scale(-1, 1) translate(-117.920733, -70.343725)"
            d="M234.941486,37.9102532 C140.587902,69.5466833 51.1762154,107.627989 0.8999803,140.68745 C12.1209681,60.8935071 71.693988,0 143.5,0 C178.19432,0 210.03284,14.215631 234.941486,37.9102532 Z"
          />
          <text alignmentBaseline="middle" textAnchor="middle" x="50%" y="33%" fontSize="52">
            R
          </text>
        </g>
      </svg>
    </Outer>
  );
};

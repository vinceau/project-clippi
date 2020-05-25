import React from "react";

import styled from "@emotion/styled";

export const XButton: React.FC<{
  pressed?: boolean;
  color?: string;
  onClick?: () => void;
}> = (props) => {
  const { onClick, pressed } = props;
  const buttonColor = props.color || "#8F8F8F";
  const textColor = "white";
  const Outer = styled.div`
    width: 6em;
    ${onClick &&
    `
        cursor: pointer;
        &:hover {
            ${
              pressed
                ? "opacity: 0.85;"
                : `
                #ButtonIcon-GCN-X {
                    fill: ${buttonColor};
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
    #ButtonIcon-GCN-X {
      fill: ${pressed ? buttonColor : "transparent"};
    }
  `;
  return (
    <Outer onClick={onClick}>
      <svg width="100%" viewBox="0 0 114 184" version="1.1" overflow="visible">
        <g>
          <g id="Page-1" stroke={buttonColor} strokeWidth="8" fill="none" fillRule="evenodd">
            <g id="ButtonIcon-GCN-X" fillRule="nonzero">
              <path
                d="M81.55434,22.403604 C69.62499,1.741363 43.20429,-5.338044 22.542047,6.591306 C1.879807,18.520657 -5.199603,44.941364 6.729747,65.60361 C19.737317,88.13338 26.665167,113.98847 26.665167,140.00361 C26.665167,163.86231 46.00647,183.20361 69.86517,183.20361 C93.72387,183.20361 113.06517,163.86231 113.06517,140.00361 C113.06517,99.02525 102.04352,57.891896 81.55434,22.403604 L81.55434,22.403604 Z"
                id="path4214"
              />
            </g>
          </g>
          <text alignmentBaseline="middle" textAnchor="middle" x="50%" y="50%" fontSize="52">
            X
          </text>
        </g>
      </svg>
    </Outer>
  );
};

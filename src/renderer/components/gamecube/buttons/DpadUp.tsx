import React from "react";

import styled from "@emotion/styled";

export const DpadUp: React.FC<{
  pressed?: boolean;
  color?: string;
  onClick?: () => void;
}> = (props) => {
  const { pressed, onClick } = props;
  const buttonColor = props.color || "#8F8F8F";
  const textColor = "white";
  const Outer = styled.div`
    width: 5em;
    height: 6em;
    border-top-left-radius: 1em;
    border-top-right-radius: 1em;
    background-color: ${pressed ? buttonColor : "transparent"};
    border: solid 0.4em ${buttonColor};
    border-bottom-color: transparent;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.5em;
    padding-bottom: 2em;
    ${onClick &&
    `
            cursor: pointer;
            &:hover {
                ${
                  pressed
                    ? "opacity: 0.85;"
                    : `
                    background-color: ${buttonColor};
                    #ButtonIcon-GCN-D-Pad {
                        fill: ${textColor};
                    }
                `
                }
            }
        `}
    svg {
      overflow: visible;
    }
    #ButtonIcon-GCN-D-Pad {
      fill: ${pressed ? textColor : "transparent"};
    }
  `;
  return (
    <Outer onClick={onClick}>
      <svg height="100%" viewBox="0 0 32 34" version="1.1" overflow="visible">
        <g id="Page-1" stroke={buttonColor} strokeWidth="4" fill="none" fillRule="evenodd">
          <g id="ButtonIcon-GCN-D-Pad" transform="translate(-80.000000, -16.000000)" fillRule="nonzero">
            <path
              d="M96,16.822266 C95.13509,16.822266 94.27017,17.126858 94,17.736328 L80.87891,47.335938 C81.24118,48.237056 81.98169,49.035156 82.77539,49.035156 L109.22461,49.035156 C110.01831,49.035156 110.75882,48.237056 111.12109,47.335938 L98,17.736328 C97.72983,17.126858 96.86491,16.822266 96,16.822266 Z"
              id="path4219"
            />
          </g>
        </g>
      </svg>
    </Outer>
  );
};

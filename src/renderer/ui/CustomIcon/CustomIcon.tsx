import styled from "@emotion/styled";
import React from "react";
import type { IconSizeProp } from "semantic-ui-react/dist/commonjs/elements/Icon/Icon";

const Outer = styled.i<{
  image: any;
  color?: string;
}>`
  &&& {
    .ui.icon.header & {
      width: 1.18em;
      height: 1em;
    }

    &:before {
      content: "";
      mask: url("${(p) => p.image}") no-repeat 100% 100%;
      mask-size: contain;
      background-color: ${(p) => (p.color ? p.color : p.theme.foreground)} !important;
      height: 100%;
      width: 100%;
    }
  }
`;

export interface CustomIconProps {
  image: any;
  size?: IconSizeProp;
  color?: string;
}

export const CustomIcon: React.FC<CustomIconProps> = (props) => {
  return <Outer image={props.image} color={props.color} className={`icon ${props.size || ""}`} />;
};

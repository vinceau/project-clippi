import { css } from "@emotion/core";
import styled from "@emotion/styled";

import { pulseAnimation } from "../styles/animations";

const animated = (color: string) => css`
  animation: ${pulseAnimation("6px", color)};
`;

export const ScanningDot = styled.span<{
  color: string;
  shouldPulse?: boolean;
}>`
  height: 10px;
  width: 10px;
  background-color: ${(props) => props.color};
  border-radius: 50%;
  display: inline-block;
  margin-right: 5px;
  ${(props) => (props.shouldPulse ? animated(props.color) : "")};
`;

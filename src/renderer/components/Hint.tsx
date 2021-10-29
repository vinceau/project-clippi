import styled from "@emotion/styled";
import React from "react";

import { Labelled } from "./Labelled";

const Outer = styled.span`
  text-decoration-style: dotted;
  text-decoration-line: underline;
`;

export const Hint: React.FC<{
  text: string;
}> = (props) => {
  return (
    <Labelled title={props.text}>
      <Outer>{props.children}</Outer>
    </Labelled>
  );
};

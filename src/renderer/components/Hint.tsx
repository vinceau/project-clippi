import styled from "@emotion/styled";
import React from "react";

import { Labelled } from "./Labelled";

const Outer = styled.span`
  text-decoration-style: dotted;
  text-decoration-line: underline;
`;

export function Hint({ text, children }: { text: string; children?: React.ReactNode }) {
  return (
    <Labelled title={text}>
      <Outer>{children}</Outer>
    </Labelled>
  );
}

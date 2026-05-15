import styled from "@emotion/styled";
import { transparentize } from "polished";
import React from "react";
import { Icon } from "@/ui/Icon/Icon";

import { Labelled } from "./Labelled";

const Container = styled.div`
border: solid 0.1rem ${({ theme }) => theme.background3}
border-radius: 0.3rem;
margin-bottom: 0.5rem;
padding: 1rem;
display: flex;
justify-content: space-between;
align-items: center;
word-break: break-all;
background-color: ${({ theme }) => transparentize(0.3, theme.foreground3)};
a {
    color: ${({ theme }) => theme.foreground}

}
h2 {
    font-size: 1.8rem;
    margin: 0;
    margin-bottom: 0.5rem;
    cursor: pointer;
}
&:hover .remove-button {
    opacity: 1;
}

.remove-button {
    opacity: 0;
    font-size: 2rem;
    padding-left: 1rem;
    &:hover {
        cursor: pointer;
    }
}
`;

export function SoundFileInfo({
  name,
  path,
  onPathClick,
  onRemove,
}: {
  name: string;
  path: string;
  onPathClick?: () => void;
  onRemove: () => void;
}) {
  return (
    <Container>
      <div>
        <Labelled title="Open location">
          <h2 onClick={onPathClick}>{name}</h2>
        </Labelled>
        <div>{path}</div>
      </div>
      <div className="remove-button">
        <Labelled title="Remove">
          <Icon name="trash" onClick={onRemove} />
        </Labelled>
      </div>
    </Container>
  );
}

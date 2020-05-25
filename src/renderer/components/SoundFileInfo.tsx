import React from "react";

import { transparentize } from "polished";
import { Icon } from "semantic-ui-react";
import styled from "styled-components";
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

export const SoundFileInfo: React.FC<{
  name: string;
  path: string;
  onPathClick?: () => void;
  onRemove: () => void;
}> = (props) => {
  return (
    <Container>
      <div>
        <Labelled title="Open location">
          <h2 onClick={props.onPathClick}>{props.name}</h2>
        </Labelled>
        <div>{props.path}</div>
      </div>
      <div className="remove-button">
        <Labelled title="Remove">
          <Icon name="trash" onClick={props.onRemove} />
        </Labelled>
      </div>
    </Container>
  );
};

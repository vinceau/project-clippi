import styled from "@emotion/styled";
import React from "react";
import { Button } from "semantic-ui-react";

import { SlippiIcon } from "./SlippiIcon";

const Outer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Notice = styled.div`
  margin: 20px 0;
  text-align: center;
`;

export const PlaybackQueueEmpty: React.FC<{
  onOpen?: () => void;
}> = (props) => {
  return (
    <Outer>
      <SlippiIcon size="huge" />
      <Notice>
        <h2>No files added</h2>
        <p>Drag and drop SLP files here to add them to the queue</p>
      </Notice>
      <Button onClick={props.onOpen}>Select files</Button>
    </Outer>
  );
};

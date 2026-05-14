import styled from "@emotion/styled";
import React from "react";
import { Button } from "@/ui/Button/Button";

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

export const PlaybackQueueEmpty = ({ onOpen }: { onOpen?: () => void }) => {
  return (
    <Outer>
      <SlippiIcon size="huge" />
      <Notice>
        <h2>No files added</h2>
        <p>Drag and drop SLP files here to add them to the queue</p>
      </Notice>
      <Button onClick={onOpen}>Select files</Button>
    </Outer>
  );
};

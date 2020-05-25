import React from "react";

import styled from "styled-components";

import { Icon } from "semantic-ui-react";

import { iRootState } from "@/store";
import { useSelector } from "react-redux";

import { Text } from "@/components/Form";
import { ProgressBar } from "@/components/ProgressBar";
import { ProcessorStatusBar } from "@/containers/processor/ProcessorStatusBar";
import { ComboFinder } from "@/containers/settings/ComboFinder";

const Content = styled.div`
  padding: 20px;
  height: calc(100% - 56px);
  overflow: hidden;
  overflow-y: auto;
`;

const Footer = styled.div`
  border-top: solid 1px ${({ theme }) => theme.background3};
  background-color: ${(props) => props.theme.background};
  height: 55px;
  padding: 0 20px;
  position: relative;
  display: flex;
`;

const Outer = styled.div`
  display: flex;
  height: 100%;
  overflow: hidden;
  flex-direction: column;
`;

export const ReplayProcessorView: React.FC = () => {
  const { comboFinderPercent } = useSelector((state: iRootState) => state.tempContainer);
  return (
    <Outer>
      <Content>
        <h1>
          Replay Processor <Icon name="angle double right" />
        </h1>
        <Text>Find combos and highlights from your replay files</Text>
        <ComboFinder />
      </Content>
      <Footer>
        <ProcessorStatusBar />
        {comboFinderPercent !== 100 && <ProgressBar percent={comboFinderPercent} />}
      </Footer>
    </Outer>
  );
};

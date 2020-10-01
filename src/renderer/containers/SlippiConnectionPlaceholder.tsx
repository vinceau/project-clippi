import * as React from "react";

import styled from "@emotion/styled";

import { useDispatch, useSelector } from "react-redux";
import { Button, Divider, Grid, Header, Input, Segment } from "semantic-ui-react";

import { CustomIcon } from "@/components/CustomIcon";
import { BufferedInput } from "@/components/InlineInputs";
import { streamManager } from "@/lib/realtime";
import { getFolderPath } from "@/lib/utils";
import { Dispatch, dispatcher, iRootState } from "@/store";
import { device } from "@/styles/device";

import { SlippiIcon } from "@/components/SlippiIcon";
import dolphinLogoSVG from "@/styles/images/dolphin.svg";
import { Ports } from "@slippi/slippi-js";

export const SlippiConnectionPlaceholder: React.FC<{
  port: string;
  onClick: (port: string) => void;
}> = (props) => {
  const { liveSlpFilesPath } = useSelector((state: iRootState) => state.filesystem);
  const dispatch = useDispatch<Dispatch>();
  const selectPath = async () => {
    const filepath = await getFolderPath();
    if (filepath) {
      dispatch.filesystem.setLiveSlpFilesPath(filepath);
    }
  };
  const [port, setPort] = React.useState(props.port);
  const VerticalHeader = styled(Header)`
    &&& {
      display: flex;
      flex-direction: column;
    }
  `;
  const FolderInput = styled.div`
    &&& {
      display: flex;
      flex-direction: column;
      padding: 0 10px;
      @media ${device.laptop} {
        flex-direction: row;
        padding: 0 30px;
      }
    }
  `;
  const ButtonContainer = styled.div`
    &&& {
      margin-top: 5px;
      margin-left: 0px;
      @media ${device.laptop} {
        margin-top: 0px;
        margin-left: 5px;
      }
    }
  `;
  const VerticalDivider = styled(Divider)`
    &&& {
      display: none !important;
      @media ${device.laptop} {
        display: block !important;
      }
    }
  `;
  const HorizontalDivider = styled(Divider)`
    &&& {
      width: 100%;
      display: block !important;
      @media ${device.laptop} {
        display: none !important;
      }
    }
  `;
  const setSlpFilePath = (filepath: string) => dispatch.filesystem.setLiveSlpFilesPath(filepath);
  return (
    <Segment placeholder>
      <Grid columns={2} stackable textAlign="center">
        <VerticalDivider vertical>Or</VerticalDivider>
        <Grid.Row verticalAlign="middle">
          <Grid.Column>
            <VerticalHeader icon>
              <SlippiIcon size={54} />
              Connect to a Slippi Relay
            </VerticalHeader>
            <Input
              style={{ maxWidth: "150px", width: "100%" }}
              placeholder="Port"
              value={port}
              onChange={(_: any, { value }: any) => setPort(value)}
              onBlur={() => dispatcher.slippi.setPort(port)}
            />
            <div style={{ padding: "10px 0" }}>
              <Button primary onClick={() => props.onClick(port)}>
                Connect
              </Button>
            </div>
          </Grid.Column>
          <HorizontalDivider horizontal>Or</HorizontalDivider>
          <Grid.Column>
            <VerticalHeader icon>
              <CustomIcon image={dolphinLogoSVG} size={54} />
              Connect to Slippi Dolphin
            </VerticalHeader>
            <div style={{ padding: "10px 0" }}>
              <Button primary={true} onClick={() => dispatcher.slippi.connectToDolphin()}>
                Find Dolphin Instance
              </Button>
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>
  );
};

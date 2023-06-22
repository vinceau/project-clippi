import styled from "@emotion/styled";
import React from "react";
import { Button, Divider, Grid, Header, Input, Segment } from "semantic-ui-react";

import { CustomIcon } from "@/components/CustomIcon";
import { SlippiIcon } from "@/components/SlippiIcon";
import { dispatcher } from "@/store";
import { device } from "@/styles/device";
import dolphinLogoSVG from "@/styles/images/dolphin.svg";

const VerticalHeader = styled(Header)`
  &&& {
    display: flex;
    flex-direction: column;
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

export const SlippiConnectionPlaceholder: React.FC<{
  address: string;
  port: string;
  onClick: (value: { address: string; port: string }) => void;
}> = (props) => {
  const [address, setAddress] = React.useState(props.address);
  const [port, setPort] = React.useState(props.port);
  return (
    <Segment placeholder>
      <Grid columns={2} stackable textAlign="center">
        <VerticalDivider vertical>Or</VerticalDivider>
        <Grid.Row verticalAlign="middle">
          <Grid.Column>
            <VerticalHeader icon>
              <SlippiIcon />
              Connect to a Slippi Relay
            </VerticalHeader>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                maxWidth: 300,
                marginLeft: "auto",
                marginRight: "auto",
                marginTop: 20,
              }}
            >
              <div style={{ marginBottom: 5 }}>
                <Input
                  label="Host address"
                  placeholder="localhost"
                  fluid={true}
                  value={address}
                  onChange={(_: any, { value }: any) => setAddress(value)}
                  onBlur={() => dispatcher.slippi.setRelayAddress(address)}
                />
              </div>
              <Input
                label="Port"
                placeholder="1667"
                fluid={true}
                value={port}
                onChange={(_: any, { value }: any) => setPort(value)}
                onBlur={() => dispatcher.slippi.setPort(port)}
              />
              <div style={{ padding: "10px 0" }}>
                <Button onClick={() => props.onClick({ address, port })}>Connect</Button>
              </div>
            </div>
          </Grid.Column>
          <HorizontalDivider horizontal>Or</HorizontalDivider>
          <Grid.Column>
            <VerticalHeader icon>
              <CustomIcon image={dolphinLogoSVG} />
              Connect to Slippi Dolphin
            </VerticalHeader>
            <div style={{ padding: "10px 0" }}>
              <Button onClick={() => dispatcher.slippi.connectToDolphin()}>Find Dolphin Instance</Button>
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>
  );
};

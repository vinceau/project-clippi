import React from "react";
import { Button } from "@/ui/Button/Button";
import { Divider } from "@/ui/Divider/Divider";
import { Grid } from "@/ui/Grid/Grid";
import { Header } from "@/ui/Header/Header";
import { Input } from "@/ui/Input/Input";
import { Segment } from "@/ui/Segment/Segment";

import { CustomIcon } from "@/ui/CustomIcon/CustomIcon";
import { SlippiIcon } from "@/components/SlippiIcon";
import { dispatcher } from "@/store";
import dolphinLogoSVG from "@/styles/images/dolphin.svg";

import styles from "./SlippiConnectionPlaceholder.module.css";

export function SlippiConnectionPlaceholder({
  address,
  port,
  onClick,
}: {
  address: string;
  port: string;
  onClick: (value: { address: string; port: string }) => void;
}) {
  const [address_, setAddress] = React.useState(address);
  const [port_, setPort] = React.useState(port);
  return (
    <Segment placeholder>
      <Grid columns={2} stackable textAlign="center">
        <Divider className={styles.verticalDivider} vertical>Or</Divider>
        <Grid.Row verticalAlign="middle">
          <Grid.Column>
            <Header className={styles.verticalHeader} icon>
              <SlippiIcon />
              Connect to a Slippi Relay
            </Header>
            <div className={styles.formContainer}>
              <div className={styles.fieldMargin}>
                <Input
                  label="Address"
                  placeholder="localhost"
                  fluid
                  value={address_}
                  onChange={(_: any, { value }: any) => setAddress(value)}
                  onBlur={() => dispatcher.slippi.setRelayAddress(address_)}
                />
              </div>
              <Input
                label="Port"
                placeholder="1667"
                fluid
                value={port_}
                onChange={(_: any, { value }: any) => setPort(value)}
                onBlur={() => dispatcher.slippi.setPort(port_)}
              />
              <div className={styles.buttonPadding}>
                <Button onClick={() => onClick({ address_, port_ })}>Connect</Button>
              </div>
            </div>
          </Grid.Column>
          <Divider className={styles.horizontalDivider} horizontal>Or</Divider>
          <Grid.Column>
            <Header className={styles.verticalHeader} icon>
              <CustomIcon image={dolphinLogoSVG} />
              Connect to Slippi Dolphin
            </Header>
            <div className={styles.buttonPadding}>
              <Button onClick={() => dispatcher.slippi.connectToDolphin()}>Find Dolphin Instance</Button>
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>
  );
}

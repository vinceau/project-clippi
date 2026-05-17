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

function VerticalDivider({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.verticalDivider}>
      <Divider vertical>{children}</Divider>
    </div>
  );
}

function HorizontalDivider({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.horizontalDivider}>
      <Divider horizontal>{children}</Divider>
    </div>
  );
}

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
      <div className={styles.container}>
        <div>
          <Header vertical icon>
            <SlippiIcon style={{ width: "64px", height: "64px" }} />
            Connect to a Slippi Relay
          </Header>
          <div className={styles.formContainer}>
            <div className={styles.fieldMargin}>
              <Input
                label="Address"
                placeholder="localhost"
                fluid
                value={address_}
                onChange={(e: any) => setAddress(e.target.value)}
                onBlur={() => dispatcher.slippi.setRelayAddress(address_)}
              />
            </div>
            <Input
              label="Port"
              placeholder="1667"
              fluid
              value={port_}
              onChange={(e: any) => setPort(e.target.value)}
              onBlur={() => dispatcher.slippi.setPort(port_)}
            />
            <div className={styles.buttonPadding}>
              <Button onClick={() => onClick({ address: address_, port: port_ })}>Connect</Button>
            </div>
          </div>
        </div>
        <div className={styles.dividerContainer}>
          <VerticalDivider>Or</VerticalDivider>
          <HorizontalDivider>Or</HorizontalDivider>
        </div>
        <div>
          <Header vertical icon>
            <CustomIcon image={dolphinLogoSVG} style={{ width: "64px", height: "64px" }} />
            Connect to Slippi Dolphin
          </Header>
          <div className={styles.buttonPadding}>
            <Button onClick={() => dispatcher.slippi.connectToDolphin()}>Find Dolphin Instance</Button>
          </div>
        </div>
      </div>
    </Segment>
  );
}

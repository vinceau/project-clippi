/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import React from "react";
import { Button } from "@/ui/Button/Button";
import { Card } from "@/ui/Card/Card";
import { Image } from "@/ui/Image/Image";

import { ScanningDot } from "@/components/ScanningDot";

export const ConnectionStatusCard: React.FC<{
  userImage: string;
  header: string;
  subHeader: string;
  statusColor?: string;
  shouldPulse?: boolean;
  onDisconnect?: () => void;
  buttonText?: string;
}> = (props) => {
  const handleButtonClick = () => {
    if (props.onDisconnect) {
      props.onDisconnect();
    }
  };
  const color = props.statusColor || "red";
  return (
    <div style={{ padding: "3px" }}>
      <Card>
        <Card.Content>
          <Image floated="right" size="mini" src={props.userImage} />
          <Card.Header>
            <span
              css={css`
                text-transform: capitalize;
                margin-right: 10px;
              `}
            >
              {props.header}
            </span>
            <ScanningDot color={color} shouldPulse={props.shouldPulse} />
          </Card.Header>
          <Card.Meta>
            <span>{props.subHeader}</span>
          </Card.Meta>
        </Card.Content>
        <Card.Content extra>
          <Button basic fluid color="red" onClick={handleButtonClick}>
            {props.buttonText || "Disconnect"}
          </Button>
        </Card.Content>
      </Card>
    </div>
  );
};

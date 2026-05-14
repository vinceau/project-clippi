/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import React from "react";
import { Button } from "@/ui/Button/Button";
import { Card } from "@/ui/Card/Card";
import { Image } from "@/ui/Image/Image";

import { ScanningDot } from "@/components/ScanningDot";

export const ConnectionStatusCard = ({
  userImage,
  header,
  subHeader,
  statusColor,
  shouldPulse,
  onDisconnect,
  buttonText,
}: {
  userImage: string;
  header: string;
  subHeader: string;
  statusColor?: string;
  shouldPulse?: boolean;
  onDisconnect?: () => void;
  buttonText?: string;
}) => {
  const handleButtonClick = () => {
    if (onDisconnect) {
      onDisconnect();
    }
  };
  const color = statusColor || "red";
  return (
    <div style={{ padding: "3px" }}>
      <Card>
        <Card.Content>
          <Image floated="right" size="mini" src={userImage} />
          <Card.Header>
            <span
              css={css`
                text-transform: capitalize;
                margin-right: 10px;
              `}
            >
              {header}
            </span>
            <ScanningDot color={color} shouldPulse={shouldPulse} />
          </Card.Header>
          <Card.Meta>
            <span>{subHeader}</span>
          </Card.Meta>
        </Card.Content>
        <Card.Content extra>
          <Button basic fluid color="red" onClick={handleButtonClick}>
            {buttonText || "Disconnect"}
          </Button>
        </Card.Content>
      </Card>
    </div>
  );
};

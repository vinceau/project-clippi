import React from "react";
import { Button } from "@/ui/Button/Button";
import { Card } from "@/ui/Card/Card";
import { Image } from "@/ui/Image/Image";

import { ScanningDot } from "@/components/ScanningDot";

import styles from "./ConnectionStatusCard.module.css";

export function ConnectionStatusCard({
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
}) {
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
          <Image floated="left" size="mini" src={userImage} />
          <Card.Header>
            <span className={styles.header}>{header}</span>
            <ScanningDot color={color} shouldPulse={shouldPulse} />
          </Card.Header>
          <Card.Meta>
            <span>{subHeader}</span>
          </Card.Meta>
        </Card.Content>
        <Card.Content extra>
          <Button basic color="red" onClick={handleButtonClick}>
            {buttonText || "Disconnect"}
          </Button>
        </Card.Content>
      </Card>
    </div>
  );
}

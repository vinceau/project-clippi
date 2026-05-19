import * as React from "react";
import { Button } from "@/ui/Button/Button";
import { Card } from "@/ui/Card/Card";
import { Image } from "@/ui/Image/Image";

import defaultUserImage from "@/styles/images/user.svg";

import { ExternalLink as A } from "../ExternalLink";

export function TwitchUserStatus({
  displayName,
  channel,
  image,
  onSignOut,
}: {
  displayName: string;
  channel: string;
  image?: any;
  onSignOut: () => void;
}) {
  const userImage = image || defaultUserImage;
  const url = `twitch.tv/${channel}`;
  return (
    <div style={{ padding: "3px" }}>
      <Card>
        <Card.Content>
          <Image floated="left" size="mini" src={userImage} />
          <Card.Header>{displayName}</Card.Header>
          <Card.Meta>
            <A style={{ color: "var(--color-secondary)" }} href={`https://${url}`}>{url}</A>
          </Card.Meta>
        </Card.Content>
        <Card.Content extra>
          <Button basic color="red" onClick={onSignOut}>
            Sign out
          </Button>
        </Card.Content>
      </Card>
    </div>
  );
}

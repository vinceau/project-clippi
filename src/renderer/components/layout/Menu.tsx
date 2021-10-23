import styled from "@emotion/styled";
import * as React from "react";
import { Link, useRouteMatch } from "react-router-dom";
import { Icon, Label } from "semantic-ui-react";

import { MenuIcon, MenuIconLink } from "@/components/layout/MenuIcon";

const Outer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const updateNotificationStyles = {
  position: "absolute",
  maxHeight: "0.5em",
  top: "2rem",
  right: "2rem",
};

export const Menu: React.FC<{
  settingsPage: string;
  updateAvailable?: boolean;
}> = (props) => {
  const match = useRouteMatch();
  const { settingsPage } = props;
  return (
    <Outer>
      <div>
        <MenuIconLink to={`${match.url}/automator`} label="Automator">
          <Icon name="bolt" />
        </MenuIconLink>
        <MenuIconLink to={`${match.url}/processor`} label="Replay Processor">
          <Icon name="angle double right" />
        </MenuIconLink>
        <MenuIconLink to={`${match.url}/recorder`} label="Playback Queue">
          <Icon name="play circle" />
        </MenuIconLink>
        {/* <MenuIconLink to={`${match.url}/streamer`} label="Stream Assistant"><Icon name="tv" /></MenuIconLink> */}
      </div>
      <div>
        <Link to={settingsPage}>
          <MenuIcon label="Settings">
            <Icon name="cog" />
            {props.updateAvailable && <Label circular color="red" empty style={updateNotificationStyles} />}
          </MenuIcon>
        </Link>
      </div>
    </Outer>
  );
};

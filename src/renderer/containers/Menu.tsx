import * as React from "react";

import styled from "styled-components";

import { useSelector } from "react-redux";
import { Link, useRouteMatch } from "react-router-dom";
import { Icon } from "semantic-ui-react";

import { MenuIcon, MenuIconLink } from "@/components/layout/MenuIcon";
import { iRootState } from "@/store";

const Outer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const Menu: React.FC = () => {
  const match = useRouteMatch();
  const { latestPath } = useSelector((state: iRootState) => state.tempContainer);
  const settingsPage = latestPath.settings || "/settings";
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
          </MenuIcon>
        </Link>
      </div>
    </Outer>
  );
};

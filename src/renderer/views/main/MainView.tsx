import * as React from "react";

import { iRootState } from "@/store";
import { useSelector } from "react-redux";
import styled from "@emotion/styled";

import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";

import { Menu } from "@/containers/Menu";
import { AutomatorView } from "./AutomatorView";
import { RecorderView } from "./RecorderView";
import { ReplayProcessorView } from "./ReplayProcessorView";

const SettingsContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  overflow: auto;
`;
const MenuColumn = styled.div`
  width: 70px;
  overflow: hidden;
  overflow-y: auto;
  height: 100vh;
  background-color: ${({ theme }) => theme.background2};
  border-right: solid 1px ${({ theme }) => theme.background3};
`;
const ContentColumn = styled.div`
  width: calc(100% - 70px);
  overflow: hidden;
  overflow-y: auto;
  height: 100vh;
  color: ${({ theme }) => theme.foreground};
  background: ${({ theme }) => theme.background};
`;

export const MainView: React.FC = () => {
  const match = useRouteMatch();
  const { latestPath } = useSelector((state: iRootState) => state.tempContainer);
  const settingsPage = latestPath.settings || "/settings";
  return (
    <SettingsContainer>
      <div style={{ display: "flex" }}>
        <MenuColumn>
          <Menu settingsPage={settingsPage} />
        </MenuColumn>
        <ContentColumn>
          <Switch>
            <Route path={`${match.path}/automator`}>
              <AutomatorView />
            </Route>
            <Route path={`${match.path}/processor`}>
              <ReplayProcessorView />
            </Route>
            <Route path={`${match.path}/recorder`}>
              <RecorderView />
            </Route>
            {/* <Route path={`${match.path}/streamer`}>
                            <div>Streamer</div>
                        </Route> */}
            <Route exact path={match.path}>
              <Redirect to={`${match.path}/automator`} />
            </Route>
          </Switch>
        </ContentColumn>
      </div>
    </SettingsContainer>
  );
};

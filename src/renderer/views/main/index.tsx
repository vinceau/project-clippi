import * as React from "react";
import { useSelector } from "react-redux";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";

import { Menu } from "@/components/layout/Menu";
import type { iRootState } from "@/store";

import { AutomatorView } from "./AutomatorView";
import { RecorderView } from "./RecorderView";
import { ReplayProcessorView } from "./ReplayProcessorView";

import styles from "./index.module.css";

export function MainView() {
  const match = useRouteMatch();
  const latestPath = useSelector((state: iRootState) => state.tempContainer.latestPath);
  const updateAvailable = useSelector((state: iRootState) => state.tempContainer.updateAvailable);
  const settingsPage = latestPath.settings || "/settings";
  return (
    <div className={styles.settingsContainer}>
      <div className={styles.flex}>
        <div className={styles.menuColumn}>
          <Menu settingsPage={settingsPage} updateAvailable={updateAvailable} />
        </div>
        <div className={styles.contentColumn}>
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
            <Route exact path={match.path}>
              <Redirect to={`${match.path}/automator`} />
            </Route>
          </Switch>
        </div>
      </div>
    </div>
  );
}

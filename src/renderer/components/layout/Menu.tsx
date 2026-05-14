import * as React from "react";
import { Link, useRouteMatch } from "react-router-dom";
import { Icon } from "@/ui/Icon/Icon";
import { Label } from "@/ui/Label/Label";

import { MenuIcon, MenuIconLink } from "@/components/layout/MenuIcon";

import styles from "./Menu.module.css";

export function Menu({ settingsPage, updateAvailable }: { settingsPage: string; updateAvailable?: boolean }) {
  const match = useRouteMatch();
  return (
    <div className={styles.outer}>
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
      </div>
      <div>
        <Link to={settingsPage}>
          <MenuIcon label="Settings">
            <Icon name="cog" />
            {updateAvailable && (
              <span style={{ position: "absolute", top: "2rem", right: "2rem" }}>
                <Label circular color="red" empty />
              </span>
            )}
          </MenuIcon>
        </Link>
      </div>
    </div>
  );
}

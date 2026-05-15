import * as React from "react";
import { Link, useRouteMatch } from "react-router-dom";
import { Zap, ChevronsRight, CirclePlay, Settings } from "lucide-react";
import { Label } from "@/ui/Label/Label";

import { MenuIcon, MenuIconLink } from "@/components/layout/MenuIcon";

import styles from "./Menu.module.css";

export function Menu({ settingsPage, updateAvailable }: { settingsPage: string; updateAvailable?: boolean }) {
  const match = useRouteMatch();
  return (
    <div className={styles.outer}>
      <div>
        <MenuIconLink to={`${match.url}/automator`} label="Automator">
          <Zap size={30} />
        </MenuIconLink>
        <MenuIconLink to={`${match.url}/processor`} label="Replay Processor">
          <ChevronsRight size={30} />
        </MenuIconLink>
        <MenuIconLink to={`${match.url}/recorder`} label="Playback Queue">
          <CirclePlay size={30} />
        </MenuIconLink>
      </div>
      <div>
        <Link to={settingsPage}>
          <MenuIcon label="Settings">
            <Settings size={30} />
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

import { AUTO_UPDATES_ENABLED, GITHUB_RELEASES_PAGE } from "common/constants";
import { shell } from "electron";
import React from "react";

import { downloadLatestUpdate } from "@/lib/utils";

export const UpdateAvailable: React.FC<{
  version: string;
  dismiss: () => void;
}> = (props) => {
  const startDownload = () => {
    downloadLatestUpdate();
    props.dismiss();
  };
  const openReleases = () => {
    shell.openExternal(GITHUB_RELEASES_PAGE);
    props.dismiss();
  };
  return (
    <div>
      <h3>New update available</h3>
      <p>
        Project Clippi v{props.version} is now available.
        {AUTO_UPDATES_ENABLED ? <> Download and install the update?</> : <> Visit the releases page to download.</>}
      </p>
      <div className="buttons">
        {AUTO_UPDATES_ENABLED ? (
          <button onClick={startDownload}>Download now</button>
        ) : (
          <button onClick={openReleases}>Show release</button>
        )}
      </div>
    </div>
  );
};

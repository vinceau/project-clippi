import React from "react";

import { autoUpdatesEnabled } from "common/utils";
import { ExternalLink as A } from "../ExternalLink";
import { downloadLatestUpdate } from "@/lib/utils";

const LATEST_RELEASE_PAGE = "https://github.com/vinceau/project-clippi/releases/latest";

export const UpdateAvailable: React.FC<{
  version: string;
}> = (props) => {
  const startDownload = () => {
    downloadLatestUpdate();
  };
  return (
    <div>
      <h3>New update available</h3>
      <p>
        Project Clippi v{props.version} is now available.
        {autoUpdatesEnabled ? <> Download and install the update?</> : <> Visit the releases page to download.</>}
      </p>
      <div className="buttons">
        {autoUpdatesEnabled ? (
          <button onClick={startDownload}>Download now</button>
        ) : (
          <A href={LATEST_RELEASE_PAGE}>Show release</A>
        )}
      </div>
    </div>
  );
};

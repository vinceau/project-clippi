import React from "react";

import { autoUpdatesEnabled } from "common/utils";
import { ExternalLink as A } from "../ExternalLink";
import { downloadLatestUpdate } from "@/lib/utils";

const LATEST_RELEASE_PAGE = "https://github.com/vinceau/project-clippi/releases/latest";

export const UpdateAvailable: React.FC<{
  version: string;
}> = (props) => {
  const startDownload = (e: any) => {
    e.preventDefault();
    downloadLatestUpdate();
  };
  return (
    <div>
      <h3>New update available</h3>
      <p>
        Project Clippi v{props.version} is now available.
        {autoUpdatesEnabled ? (
          <>
            Would you like to download and install the update? <A onClick={startDownload}>(Download now)</A>
          </>
        ) : (
          <>
            Visit the releases page to download the latest update.{" "}
            <A href={LATEST_RELEASE_PAGE}>(Show latest release)</A>
          </>
        )}
      </p>
    </div>
  );
};

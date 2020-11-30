/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import React from "react";

import { Dispatch, iRootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "semantic-ui-react";
import { UpdateStatus, VersionUpdatePayload } from "common/types";
import { checkForNewUpdates, downloadLatestUpdate, installUpdateAndRestart } from "@/lib/utils";
import { autoUpdatesEnabled } from "common/utils";
import { shell } from "electron";
import { GITHUB_RELEASES_PAGE } from "common/constants";
import { ExternalLink as A } from "@/components/ExternalLink";

export const UpdateStatusInfo: React.FC = () => {
  const updateStatus = useSelector((state: iRootState) => state.tempContainer.updateStatus);

  const dispatch = useDispatch<Dispatch>();
  // const updateAvailable = needsUpdate(latestVersion);
  const onUpdateCheckClick = () => {
    // Clear the update status first
    dispatch.tempContainer.setUpdateStatus(null);
    checkForNewUpdates();
  };

  React.useEffect(() => {
    // On unmount, we should reset the update status if it was an error or if no update was available
    return () => {
      if (updateStatus !== null) {
        if (updateStatus.status === UpdateStatus.NO_UPDATE || updateStatus.status === UpdateStatus.UPDATE_ERROR) {
          dispatch.tempContainer.setUpdateStatus(null);
        }
      }
    };
  });

  // Hide the check for updates button if we already know there's an update available or if an update is ready to be installed
  const updateAvailable =
    updateStatus &&
    (updateStatus.status === UpdateStatus.UPDATE_AVAILABLE || updateStatus.status === UpdateStatus.DOWNLOAD_COMPLETE);

  return (
    <div
      css={css`
        &&& {
          button {
            margin: 0;
          }
        }
      `}
    >
      {!updateAvailable && (
        <Button
          css={css`
            margin: none;
          `}
          onClick={onUpdateCheckClick}
        >
          Check for updates
        </Button>
      )}
      <div
        css={css`
          margin-top: 1rem;
          white-space: pre-wrap;
          min-height: 1.25em;
          line-height: 1.25em;
        `}
      >
        <ShowUpdateMessage versionPayload={updateStatus} />
      </div>
      {updateStatus && updateStatus.status === UpdateStatus.UPDATE_AVAILABLE && (
        <div
          css={css`
            margin-top: 2rem;
          `}
        >
          <UpdateAvailableMessage />
        </div>
      )}
      {updateStatus && updateStatus.status === UpdateStatus.DOWNLOAD_COMPLETE && (
        <div
          css={css`
            margin-top: 2rem;
          `}
        >
          <Button
            css={css`
              margin: none;
            `}
            onClick={() => installUpdateAndRestart()}
          >
            Restart now
          </Button>
        </div>
      )}
    </div>
  );
};

const ShowUpdateMessage: React.FC<{
  versionPayload: VersionUpdatePayload | null;
}> = (props) => {
  if (!props.versionPayload) {
    return null;
  }

  const { status, payload } = props.versionPayload;
  switch (status) {
    case UpdateStatus.NO_UPDATE:
      return <span>No update available</span>;
    case UpdateStatus.UPDATE_ERROR:
      return <span>Update error: {payload}</span>;
    case UpdateStatus.UPDATE_AVAILABLE:
      return (
        <div>
          <div
            css={css`
              font-weight: bold;
              margin-bottom: 0.5rem;
            `}
          >
            New update v{payload} is now available!
          </div>
          <div>
            <A href={GITHUB_RELEASES_PAGE}>View changelog</A>
          </div>
        </div>
      );
    case UpdateStatus.DOWNLOAD_COMPLETE:
      return <span>Update is ready to install.</span>;
  }
};

const UpdateAvailableMessage: React.FC = () => {
  if (!autoUpdatesEnabled) {
    return <Button onClick={() => shell.openExternal(GITHUB_RELEASES_PAGE)}>Open releases page</Button>;
  }
  return <Button onClick={() => downloadLatestUpdate()}>Download now</Button>;
};

import { AUTO_UPDATES_ENABLED, GITHUB_RELEASES_PAGE } from "common/constants";
import type { VersionUpdatePayload } from "common/types";
import { UpdateStatus } from "common/types";
import { shell } from "electron";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/ui/Button/Button";
import { format } from "timeago.js";

import { ExternalLink as A } from "@/components/ExternalLink";
import { checkForNewUpdates, downloadLatestUpdate, installUpdateAndRestart } from "@/lib/utils";
import type { Dispatch, iRootState } from "@/store";

import styles from "./UpdateStatus.module.css";

export function UpdateStatusInfo() {
  const updateStatus = useSelector((state: iRootState) => state.tempContainer.updateStatus);
  const updateAvailable = useSelector((state: iRootState) => state.tempContainer.updateAvailable);

  const dispatch = useDispatch<Dispatch>();
  const onUpdateCheckClick = () => {
    dispatch.tempContainer.setUpdateStatus(null);
    checkForNewUpdates();
  };

  return (
    <div className={styles.buttonWrapper}>
      {!updateAvailable && <Button onClick={onUpdateCheckClick}>Check for updates</Button>}
      <div className={styles.message}>
        <ShowUpdateMessage versionPayload={updateStatus} />
      </div>
      {updateStatus && updateStatus.status === UpdateStatus.UPDATE_AVAILABLE && (
        <div className={styles.actionWrapper}>
          <UpdateAvailableMessage />
        </div>
      )}
      {updateStatus && updateStatus.status === UpdateStatus.DOWNLOAD_COMPLETE && (
        <div className={styles.actionWrapper}>
          <Button onClick={() => installUpdateAndRestart()}>Restart now</Button>
        </div>
      )}
    </div>
  );
}

function ShowUpdateMessage({ versionPayload }: { versionPayload: VersionUpdatePayload | null }) {
  if (!versionPayload) {
    return null;
  }

  switch (versionPayload.status) {
    case UpdateStatus.NO_UPDATE:
      return <span>No update available. Last checked {format(new Date(versionPayload.payload.lastChecked))}.</span>;
    case UpdateStatus.UPDATE_ERROR:
      return <span>Failed to check for updates. {versionPayload.payload}</span>;
    case UpdateStatus.UPDATE_AVAILABLE:
      return (
        <div>
          <div className={styles.bold}>
            New update v{versionPayload.payload.version} is now available!
          </div>
          <div>
            <A href={GITHUB_RELEASES_PAGE}>View changelog</A>
          </div>
        </div>
      );
    case UpdateStatus.DOWNLOAD_COMPLETE:
      return <span>Update is ready to install.</span>;
  }
}

function UpdateAvailableMessage() {
  if (!AUTO_UPDATES_ENABLED) {
    return <Button onClick={() => shell.openExternal(GITHUB_RELEASES_PAGE)}>Open releases page</Button>;
  }
  return <Button onClick={() => downloadLatestUpdate()}>Download now</Button>;
}

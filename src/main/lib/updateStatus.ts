import { needsUpdate } from "common/githubReleaseVersions";
import type { VersionUpdatePayload } from "common/types";
import { Message, UpdateStatus } from "common/types";
import clean from "semver/functions/clean";

import { sendMessage } from "./sendMessage";

function sendVersionUpdateStatus(payload: VersionUpdatePayload) {
  sendMessage(Message.VersionUpdateStatus, payload);
}

export function sendLatestVersion(version: string) {
  const versionString = clean(version) || version;
  const payload = {
    version: versionString,
    lastChecked: new Date().toISOString(),
  };
  if (needsUpdate(versionString)) {
    sendVersionUpdateStatus({ status: UpdateStatus.UPDATE_AVAILABLE, payload });
  } else {
    sendVersionUpdateStatus({ status: UpdateStatus.NO_UPDATE, payload });
  }
}

export function sendDownloadComplete() {
  sendVersionUpdateStatus({ status: UpdateStatus.DOWNLOAD_COMPLETE });
}

export function sendUpdateError(message: string) {
  sendVersionUpdateStatus({ status: UpdateStatus.UPDATE_ERROR, payload: message });
}

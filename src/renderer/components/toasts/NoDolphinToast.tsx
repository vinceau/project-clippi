import React from "react";

import { isMacOrWindows } from "common/utils";

export const NoDolphinToast: React.FC = () => {
  const url = "https://slippi.gg/downloads";
  const linuxUrl =
    "https://github.com/project-slippi/Slippi-FM-installer/blob/master/README.md";
  return (
    <div>
      <h3>No Dolphin Found</h3>
      {isMacOrWindows ? (
        <p>
          Please download and install the Slippi Desktop App and try again.{" "}
          <a target="_blank" href={url}>
            Download now.
          </a>
        </p>
      ) : (
        <p>
          Please compile Dolphin for your Linux machine and set the Dolphin path
          in the settings.{" "}
          <a target="_blank" href={linuxUrl}>
            Learn more.
          </a>
        </p>
      )}
    </div>
  );
};

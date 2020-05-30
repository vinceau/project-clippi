import React from "react";

import { isMacOrWindows } from "common/utils";
import { A } from "../ExternalLink";

export const NoDolphinToast: React.FC = () => {
  const url = "https://slippi.gg/downloads";
  const linuxUrl = "https://github.com/project-slippi/Slippi-FM-installer/blob/master/README.md";
  return (
    <div>
      <h3>No Dolphin Found</h3>
      {isMacOrWindows ? (
        <p>
          Please download and install the Slippi Desktop App and try again. <A href={url}>Download now.</A>
        </p>
      ) : (
        <p>
          Please compile Dolphin for your Linux machine and set the Dolphin path in the settings.{" "}
          <A href={linuxUrl}>Learn more.</A>
        </p>
      )}
    </div>
  );
};

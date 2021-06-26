import React from "react";

import { ExternalLink as A } from "../ExternalLink";

export const NoDolphinToast: React.FC = () => {
  const url = "https://slippi.gg/downloads";
  return (
    <div>
      <h3>No Dolphin Found</h3>
      <p>
        Please download and install the Slippi Launcher and try again. <A href={url}>Download now.</A>
      </p>
    </div>
  );
};

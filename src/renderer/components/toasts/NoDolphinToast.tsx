import React from "react";

import { ExternalLink as A } from "../ExternalLink";

export function NoDolphinToast() {
  const url = "https://slippi.gg/downloads";
  return (
    <div>
      <h3>No Dolphin Found</h3>
      <p>
        Please download and install the Slippi Launcher and try again. <A href={url}>Download now.</A>
      </p>
    </div>
  );
}

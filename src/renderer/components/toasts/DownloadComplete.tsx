import React from "react";

import { installUpdateAndRestart } from "@/lib/utils";

export const DownloadComplete: React.FC = () => {
  const onClick = () => {
    installUpdateAndRestart();
  };
  return (
    <div>
      <h3>Update downloaded</h3>
      <p>An update is ready for installation. Restart to install now.</p>
      <div className="buttons">
        <button onClick={onClick}>Restart</button>
      </div>
    </div>
  );
};

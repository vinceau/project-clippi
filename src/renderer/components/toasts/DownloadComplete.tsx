import React from "react";

import { installUpdateAndRestart } from "@/lib/utils";
import { Button } from "@/ui/Button/Button";

export function DownloadComplete() {
  const onClick = () => {
    installUpdateAndRestart();
  };
  return (
    <div>
      <h3>Update downloaded</h3>
      <p>An update is ready for installation. Restart to install now.</p>
      <div className="buttons">
        <Button onClick={onClick}>Restart</Button>
      </div>
    </div>
  );
}

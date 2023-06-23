import React from "react";
import { Dropdown } from "semantic-ui-react";

export const ProfileExport = ({ onImport, onExport }: { onImport: () => void; onExport: () => void }) => {
  return (
    <Dropdown icon="bars" floating button className="icon">
      <Dropdown.Menu>
        <Dropdown.Item icon="download" text="Import profile" onClick={onImport} />
        <Dropdown.Item icon="upload" text="Export profile" onClick={onExport} />
      </Dropdown.Menu>
    </Dropdown>
  );
};

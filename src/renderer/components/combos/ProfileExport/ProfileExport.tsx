import React from "react";
import { Menu, HardDriveDownload, HardDriveUpload } from "lucide-react";
import { Dropdown } from "./Dropdown/Dropdown";

export function ProfileExport({ onImport, onExport }: { onImport: () => void; onExport: () => void }) {
  return (
    <Dropdown icon={<Menu size={16} />} floating button className="icon">
      <Dropdown.Menu>
        <Dropdown.Item icon={<HardDriveDownload size={16} />} text="Import profile" onClick={onImport} />
        <Dropdown.Item icon={<HardDriveUpload size={16} />} text="Export profile" onClick={onExport} />
      </Dropdown.Menu>
    </Dropdown>
  );
}

import * as React from "react";
import { Button } from "@/ui/Button/Button";
import { Icon } from "@/ui/Icon/Icon";
import { Input } from "@/ui/Input/Input";

import { getFilePath, getFolderPath, openFileOrParentFolder } from "@/lib/utils";

import styles from "./FileInput.module.css";
import { Labelled } from "./Labelled";

interface FileInputProps extends Record<string, any> {
  value: string;
  onChange: (value: string) => void;
  directory?: boolean;
  fileTypeFilters?: Array<{ name: string; extensions: string[] }>;
  saveFile?: boolean;
}

export function FileInput({ value, directory, onChange, fileTypeFilters, saveFile, placeholder }: FileInputProps) {
  const [filesPath, setFilesPath] = React.useState<string>(value);

  // Make sure we display the correct value
  React.useEffect(() => {
    setFilesPath(value);
  }, [value]);

  const selectFromFileSystem = async () => {
    let p: string | null = null;
    if (directory) {
      // Handle directory selection
      p = await getFolderPath();
    } else {
      // Handle file selection
      let options: any;
      if (fileTypeFilters) {
        options = {
          filters: fileTypeFilters,
        };
      }
      const filePaths = await getFilePath(options, saveFile);
      if (filePaths && filePaths.length > 0) {
        p = filePaths[0];
      }
    }

    if (p) {
      setFilesPath(p);
      onChange(p);
    }
  };
  const actionLabel = saveFile ? "Save as" : "Choose";
  return (
    <div className={styles.outer}>
      <div className={styles.inputRow}>
        <Button onClick={() => openFileOrParentFolder(filesPath)} disabled={!filesPath}>
          <Labelled title="Open location">
            <Icon name="folder open outline" />
          </Labelled>
        </Button>
        <Input
          fluid
          value={filesPath}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilesPath(e.target.value)}
          onBlur={() => onChange(filesPath)}
          placeholder={placeholder}
        />
        <Button onClick={() => selectFromFileSystem().catch(console.error)}>{actionLabel}</Button>
      </div>
    </div>
  );
}

import * as React from "react";

import styled from "styled-components";

import { getFilePath, getFolderPath, openFileOrParentFolder } from "@/lib/utils";
import { Button, Icon, Input } from "semantic-ui-react";
import { Labelled } from "./Labelled";

const NoMarginIcon = styled(Icon)`
  &&& {
    margin: 0 !important;
  }
`;

const Outer = styled.div`
  input[type="text"] {
    width: auto !important;
  }
`;

interface FileInputProps extends Record<string, any> {
  value: string;
  onChange: (value: string) => void;
  directory?: boolean;
  fileTypeFilters?: Array<{ name: string; extensions: string[] }>;
  saveFile?: boolean;
}

export const FileInput: React.FC<FileInputProps> = (props) => {
  const { value, directory, onChange, fileTypeFilters, saveFile, placeholder } = props;
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
    <Outer>
      <Input
        style={{ width: "100%" }}
        label={
          <Button onClick={() => openFileOrParentFolder(filesPath)} disabled={!Boolean(filesPath)}>
            <Labelled title="Open location">
              <NoMarginIcon name="folder open outline" />
            </Labelled>
          </Button>
        }
        value={filesPath}
        onChange={(_: any, { value }: any) => setFilesPath(value)}
        onBlur={() => onChange(filesPath)}
        action={<Button onClick={() => selectFromFileSystem().catch(console.error)}>{actionLabel}</Button>}
        placeholder={placeholder}
      />
    </Outer>
  );
};

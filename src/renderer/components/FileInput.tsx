import * as React from "react";

import styled from "styled-components";

import { Button, Icon, Input } from "semantic-ui-react";
import { getFilePath, getFolderPath, openFileOrParentFolder } from "../lib/utils";
import { Labelled } from "./Labelled";

const NoMarginIcon = styled(Icon)`
&&& {
    margin: 0 !important;
}
`;

interface FileInputProps extends Record<string, any> {
    value: string;
    onChange: (value: string) => void;
    directory?: boolean;
    fileTypeFilters?: Array<{name: string, extensions: string[]}>;
    saveFile?: boolean;
}

export const FileInput: React.FC<FileInputProps> = props => {
    const {value, directory, onChange, fileTypeFilters, saveFile} = props;
    const [filesPath, setFilesPath] = React.useState<string>(value);
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
            p = await getFilePath(options, saveFile);
        }

        if (p) {
            setFilesPath(p);
            onChange(p);
        }
    };
    const actionLabel = saveFile ? "Save as" : "Choose";
    return (
        <Input
            style={{ width: "100%" }}
            label={
                <Button onClick={() => openFileOrParentFolder(filesPath)}>
                    <Labelled title="Open location">
                        <NoMarginIcon name="folder open outline" />
                    </Labelled>
                </Button>
            }
            value={filesPath}
            onChange={(_: any, { value }: any) => setFilesPath(value)}
            onBlur={() => onChange(filesPath)}
            action={<Button onClick={() => selectFromFileSystem().catch(console.error)}>{actionLabel}</Button>}
        />
    );
};

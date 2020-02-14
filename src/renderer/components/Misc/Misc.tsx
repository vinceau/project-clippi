import * as React from "react";

import styled, { css } from "styled-components";

import { Tooltip, withTooltip } from "react-tippy";

import { eventActionManager } from "@/actions";
import { connectToOBS, setScene } from "@/lib/obs";
import { ActionEvent } from "@/lib/realtime";
import { getFilePath, getFolderPath, isDevelopment } from "@/lib/utils";
import { Button, Icon, Input } from "semantic-ui-react";
import { notify, openFileOrParentFolder } from "../../lib/utils";

export const DevTools = () => {
    const handleClick = () => {
        console.log("notify clicked");
        notify("Here's a notification", "A notification title");
    };
    const customEvent = () => {
        eventActionManager.emitEvent(ActionEvent.TEST_EVENT).catch(console.error);
    };
    const [sceneName, setSceneName] = React.useState("");
    return (
        <div>
            <input value={sceneName} onChange={(e) => setSceneName(e.target.value)} />
            <button onClick={() => setScene(sceneName).catch(console.error)}>change obs scene</button>
            <button onClick={() => connectToOBS().catch(console.error)}>connect to obs</button>
            <button onClick={handleClick}>notify</button>
            <button onClick={customEvent}>trigger test event</button>
        </div>
    );
};

export const Labelled = (props: any) => {
    const { onClick, children, ...rest } = props;
    const pointerStyle = {
        cursor: "pointer",
    };
    return (
        <span style={onClick ? pointerStyle : undefined} onClick={onClick}>
            <Tooltip arrow={true} duration={200} position="bottom" style={{ display: "inline-block" }} {...rest}>
                {children}
            </Tooltip>
        </span>
    );
};

export const CustomIcon: React.FC<{
    image: string;
    color: string;
    size?: number;
}> = (props) => {
    const size = (s: number) => css`
    height: ${s}px !important;
    width: ${s}px !important;
    `;
    const Outer = styled.i`
    &&& {
        ${props.size && size(props.size)}
        &::before {
            content: "";
            mask: url("${props.image}") no-repeat 100% 100%;
            mask-size: contain;
            background-color: ${props.color} !important;
            height: 100%;
            width: 100%;
            display: block;
        }
    }
    `;
    return (
        <Outer aria-hidden="true" className="icon" />
    );
};

export const CodeBlock: React.FC<{
    values: any
}> = (props) => {
    if (isDevelopment) {
        return (<pre style={{overflowX: "auto"}}>{(JSON as any).stringify(props.values, 0, 2)}</pre>);
    }
    return null;
};

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
    // const IconWithTooltip = withTooltip(NoMarginIcon, { title: "Open location" });
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

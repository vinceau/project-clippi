import * as React from "react";

import formatter from "formatter";

import { ActionTypeGenerator, Context } from "@vinceau/event-actions";
import { produce } from "immer";
import { Form, Icon, TextArea } from "semantic-ui-react";

import { InlineDropdown } from "@/components/Misc/InlineInputs";
import { FileInput } from "@/components/Misc/Misc";
import { notify as sendNotification } from "@/lib/utils";
import { writeFile } from "common/utils";
import { ActionComponent } from "./types";
import { exampleContext } from "@/lib/realtime";
import { FormatTextArea } from "@/components/Settings/RenameFiles";

interface ActionWriteFileParams {
    content: string;
    outputFileName?: string;
    append?: boolean;
}

const defaultParams = (): ActionWriteFileParams => {
    return {
        content: "",
        outputFileName: "",
        append: false,
    };
};

const actionWriteFile: ActionTypeGenerator = (params: ActionWriteFileParams) => {
    return async (ctx: Context): Promise<Context> => {
        const { content, outputFileName, append } = params;
        if (content && outputFileName) {
            try {
                const formattedContent = formatter(content)(ctx);
                const formattedFileName = formatter(outputFileName)(ctx);
                await writeFile(formattedContent, formattedFileName, append);
            } catch (err) {
                console.error(err);
                sendNotification(`Failed to write to file`);
            }
        }
        return ctx;
    };
};

const ActionIcon = () => {
    return (
        <Icon name="file alternate" size="large" />
    );
};

interface WriteFileProps extends Record<string, any> {
    value: ActionWriteFileParams;
    onChange(value: ActionWriteFileParams): void;
}

const WriteFileInput = (props: WriteFileProps) => {
    const { value, onChange, event } = props;
    const onContentChange = (msg: string) => {
        const newValue = produce(value, (draft) => {
            draft.content = msg;
        });
        onChange(newValue);
    };
    const onAppendChange = (append: boolean) => {
        const newValue = produce(value, (draft) => {
            draft.append = append;
        });
        onChange(newValue);
    };
    const onOutputFileChange = (name: string) => {
        const newValue = produce(value, (draft) => {
            draft.outputFileName = name;
        });
        onChange(newValue);
    };
    const ctx = exampleContext(event);
    return (
        <div style={{ maxWidth: "500px" }} key={`${props.event}-file-write`}>
            <p>{props.event}</p>
            <p>{JSON.stringify(ctx)}</p>
            <Form>
            <FormatTextArea
                onChange={onContentChange}
                value={value.content || ""}
                context={ctx}
                placeholder="Hmmm.. What should I write?"
            >
                <div style={{ paddingBottom: "5px" }}>
                    <InlineDropdown
                        value={Boolean(value.append)}
                        onChange={onAppendChange}
                        options={[
                            {
                                key: "write",
                                value: false,
                                text: "Write",
                            },
                            {
                                key: "append",
                                value: true,
                                text: "Append",
                            },
                        ]}
                    />
                    {" the following:"}
                </div>
            </FormatTextArea>
            </Form>
            <div style={{ padding: "5px 0" }}>To the file:</div>
            <FileInput value={value.outputFileName || ""} onChange={onOutputFileChange} saveFile={true} />
        </div>
    );
};

export const ActionWriteFile: ActionComponent = {
    label: "write to a file",
    action: actionWriteFile,
    Icon: ActionIcon,
    Component: WriteFileInput,
    defaultParams,
};

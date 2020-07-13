import * as React from "react";

import formatter from "formatter";

import { ActionTypeGenerator, Context } from "@vinceau/event-actions";
import { produce } from "immer";
import { Form, Icon, TextArea } from "semantic-ui-react";

import { FileInput } from "@/components/FileInput";
import { InlineDropdown } from "@/components/InlineInputs";
import { notify as sendNotification } from "@/lib/utils";
import { writeFile } from "common/utils";
import { ActionComponent } from "./types";

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
        const msgFormatter = formatter(content);
        const formattedContent = msgFormatter(ctx);
        const formattedFilename = formatter(outputFileName)(ctx);
        await writeFile(formattedContent, formattedFilename, append);
      } catch (err) {
        console.error(err);
        sendNotification(`Failed to write to file`);
      }
    }
    return ctx;
  };
};

const ActionIcon = () => {
  return <Icon name="file alternate" size="large" />;
};

interface WriteFileProps extends Record<string, any> {
  value: ActionWriteFileParams;
  onChange(value: ActionWriteFileParams): void;
}

const WriteFileInput = (props: WriteFileProps) => {
  const { value, onChange } = props;
  const defaultValue = value && value.content ? value.content : "";
  const [msg, setMsg] = React.useState(defaultValue);
  const onContentChange = () => {
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
  return (
    <div>
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
      <Form>
        <TextArea
          onBlur={onContentChange}
          value={msg}
          onChange={(_: any, { value }: any) => setMsg(value)}
          placeholder="Hmmm.. What should I write?"
        />
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

import type { ActionTypeGenerator, Context } from "@vinceau/event-actions";
import { produce } from "immer";
import * as React from "react";
import { Icon } from "semantic-ui-react";
import { NodeVM } from "vm2";

import { FileInput } from "@/components/FileInput";
import { notify as sendNotification } from "@/lib/utils";

import type { ActionComponent } from "./types";
import { readFile } from "fs-extra";

interface ActionExecuteScriptParams {
  outputFileName: string;
}

const defaultParams = (): ActionExecuteScriptParams => {
  return {
    outputFileName: "",
  };
};

const executeScript: ActionTypeGenerator = (params: ActionExecuteScriptParams) => {
  return async (ctx: Context): Promise<Context> => {
    const { outputFileName } = params;

    if (outputFileName) {
      try {
        const code = await readFile(outputFileName, "utf8");
        const vm = new NodeVM({
          require: {
            external: true,
          },
          env: {
            clippiCtx: ctx,
          },
        });

        vm.run(code);
      } catch (err) {
        console.error(err);
        sendNotification(`Failed to write to file`);
      }
    }

    return ctx;
  };
};

const ActionIcon = () => {
  return <Icon name="file code" size="large" />;
};

interface ExecuteScriptProps extends Record<string, any> {
  value: ActionExecuteScriptParams;
  onChange(value: ActionExecuteScriptParams): void;
}

const ExecuteScriptInput = (props: ExecuteScriptProps) => {
  const { value, onChange } = props;
  const onOutputFileChange = (name: string) => {
    const newValue = produce(value, (draft) => {
      draft.outputFileName = name;
    });
    onChange(newValue);
  };
  return (
    <div>
      <div style={{ padding: "5px 0" }}>File:</div>
      <FileInput value={value.outputFileName || ""} onChange={onOutputFileChange} />
    </div>
  );
};

export const ActionExecuteScript: ActionComponent = {
  label: "execute script",
  action: executeScript,
  Icon: ActionIcon,
  Component: ExecuteScriptInput,
  defaultParams,
};

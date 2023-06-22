import { exec } from "child_process";
import * as React from "react";
import { Form, Icon, Message, TextArea } from "semantic-ui-react";

import { Text } from "@/components/Form";
import type { ActionTypeGenerator, Context } from "@/lib/event_actions";

import type { ActionComponent } from "./types";

type ActionRunShellCommandParams = {
  command: string;
};

const ActionRunShellCommandFunc: ActionTypeGenerator = (params: ActionRunShellCommandParams) => {
  return async (ctx: Context): Promise<Context> => {
    // Make sure we actually have a command to run
    if (params.command) {
      const ctxJson = JSON.stringify(ctx).replace(/"/gm, '\\"');
      const command = ctx ? params.command.replace(/{event}/gm, ctxJson) : params.command;

      runShellCommand(command);
    }

    return ctx;
  };
};

const ActionIcon = () => {
  return <Icon name="terminal" size="large" />;
};

const RunShellCommandInput = ({
  value,
  onChange,
}: {
  value: ActionRunShellCommandParams;
  onChange: (val: ActionRunShellCommandParams) => void;
}) => {
  const defaultValue = value && value.command ? value.command : "";
  const [cmd, setMsg] = React.useState(defaultValue);
  return (
    <div style={{ marginTop: 10 }}>
      <Message warning={true}>
        <Icon name="warning sign" />
        Running unknown commands can be very dangerous! Only run commands that you fully understand!
      </Message>
      <Form>
        <TextArea
          style={{ fontFamily: "monospace", fontSize: 16 }}
          onBlur={() => onChange({ command: cmd })}
          value={cmd}
          onChange={(_: any, { value }: any) => setMsg(value)}
          placeholder="Enter a shell command to run..."
        />
      </Form>
      <Text>Pro tip: Use &#123;event&#125; to get the event data as a JSON string.</Text>
    </div>
  );
};

export const ActionRunShellCommand: ActionComponent = {
  label: "run a shell command",
  action: ActionRunShellCommandFunc,
  Icon: ActionIcon,
  Component: RunShellCommandInput,
};

async function runShellCommand(command: string) {
  exec(command, (error: Error | null, stdout: string, stderr: string) => {
    if (error) {
      console.error(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.warn(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
}

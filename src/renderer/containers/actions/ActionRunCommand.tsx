import { runCommand } from "common/utils";
import * as React from "react";
import { Form, Icon, Message, TextArea } from "semantic-ui-react";

import { Text } from "@/components/Form";
import type { ActionTypeGenerator, Context } from "@/lib/event_actions";

import type { ActionComponent } from "./types";

type ActionRunCommandParams = {
  command: string;
};

const ActionRunCommandFunc: ActionTypeGenerator = (params: ActionRunCommandParams) => {
  return async (ctx: Context): Promise<Context> => {
    // Make sure we actually have a command to run
    if (params.command) {
      const ctxJson = JSON.stringify(ctx).replace(/"/gm, '\\"');
      const command = ctx ? params.command.replace(/{event}/gm, ctxJson) : params.command;

      runCommand(command);
    }

    return ctx;
  };
};

const ActionIcon = () => {
  return <Icon name="terminal" size="large" />;
};

const RunCommandInput = ({
  value,
  onChange,
}: {
  value: ActionRunCommandParams;
  onChange: (val: ActionRunCommandParams) => void;
}) => {
  const defaultValue = value && value.command ? value.command : "";
  const [cmd, setMsg] = React.useState(defaultValue);
  return (
    <div>
      <Message warning={true}>
        <Icon name="warning sign" />
        Running unknown commands can be very dangerous! Only run commands that you fully understand!
      </Message>
      <div style={{ padding: "5px 0" }}></div>
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

export const ActionRunCommand: ActionComponent = {
  label: "run a shell command",
  action: ActionRunCommandFunc,
  Icon: ActionIcon,
  Component: RunCommandInput,
};

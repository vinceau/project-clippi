import * as React from "react";

import { ActionTypeGenerator, Context } from "@vinceau/event-actions";
import { Form, Icon, TextArea } from "semantic-ui-react";

import { ActionComponent } from "./types";
import { runCommand } from "common/utils";

interface ActionRunCommandParams {
  command: string;
}

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

const RunCommandInput = (props: any) => {
  const { value, onChange } = props;
  const defaultValue = value && value.command ? value.command : "";
  const [cmd, setMsg] = React.useState(defaultValue);
  return (
    <div>
      <div style={{ padding: "5px 0" }}>Only enter commands you understand!</div>
      <Form>
        <TextArea
          style={{ fontFamily: "monospace" }}
          onBlur={() => onChange({ command: cmd })}
          value={cmd}
          onChange={(_: any, { value }: any) => setMsg(value)}
          placeholder="Use {event} to get the event data as a JSON string."
        />
      </Form>
    </div>
  );
};

export const ActionRunCommand: ActionComponent = {
  label: "run a command",
  action: ActionRunCommandFunc,
  Icon: ActionIcon,
  Component: RunCommandInput,
};

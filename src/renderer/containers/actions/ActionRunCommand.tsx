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
      runCommand(params.command);
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
      <Form>
        <TextArea
          onBlur={() => onChange({ command: cmd })}
          value={cmd}
          onChange={(_: any, { value }: any) => setMsg(value)}
          placeholder="You little hackerman you"
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

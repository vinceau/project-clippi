import { exec } from "child_process";
import * as React from "react";
import { Message } from "@/ui/Message/Message";
import { Terminal, TriangleAlert } from "lucide-react";
import { TextArea } from "@/ui/TextArea/TextArea";

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

function ActionIcon() {
  return <Terminal size={20} />;
}

function RunShellCommandInput({
  value,
  onChange,
}: {
  value: ActionRunShellCommandParams;
  onChange: (val: ActionRunShellCommandParams) => void;
}) {
  const defaultValue = value && value.command ? value.command : "";
  const [cmd, setMsg] = React.useState(defaultValue);
  return (
    <div style={{ marginTop: 10 }}>
      <Message warning>
        <TriangleAlert size={24} />
        <span style={{ marginLeft: 10 }}>
          Running unknown commands can be very dangerous! Only run commands that you fully understand!
        </span>
      </Message>
      <div style={{ marginTop: 16 }}>
        <TextArea
          monospace
          onBlur={() => onChange({ command: cmd })}
          value={cmd}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMsg(e.target.value)}
          placeholder="Enter a shell command to run..."
        />
      </div>
      <Text>Pro tip: Use &#123;event&#125; to get the event data as a JSON string.</Text>
    </div>
  );
}

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

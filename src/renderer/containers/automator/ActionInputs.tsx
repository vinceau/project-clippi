import { produce } from "immer";
import React from "react";

import { InlineDropdown } from "@/components/InlineInputs";
import { Plus } from "lucide-react";
import { Tooltip } from "@/ui/Tooltip/Tooltip";
import { actionComponents } from "@/containers/actions";
import type { Action as ActionDefinition } from "@/lib/event_actions";

import { ActionComponentBlock } from "./ActionComponentBlock";
import { ActionIcon } from "./ActionIcon";

const allActions = Object.keys(actionComponents);

function ActionSelector(props: any) {
  const { options, ...rest } = props;
  return (
    <InlineDropdown
      {...rest}
      customOptions={options || allActions}
      mapOptionToLabel={(opt: string) => actionComponents[opt].label}
      fontSize={18}
    />
  );
}

export function ActionInput({
  selectPrefix,
  value,
  onChange,
  disabledActions,
  onRemove,
}: {
  selectPrefix: string;
  value: ActionDefinition;
  onChange: (a: ActionDefinition) => void;
  disabledActions: string[];
  onRemove: () => void;
}) {
  const outerRef = React.createRef<HTMLDivElement>() as any;
  const onActionChange = (action: string) => {
    const params = actionComponents[action].defaultParams;
    const newValue = produce(value, (draft: ActionDefinition) => {
      draft.name = action;
      draft.args = params ? params() : {};
    });
    onChange(newValue);
  };
  const onArgsChange = (args: any) => {
    const newValue = produce(value, (draft: ActionDefinition) => {
      draft.args = args;
    });
    onChange(newValue);
  };
  if (!actionComponents[value.name]) {
    return null;
  }
  const ActionArgsInput = actionComponents[value.name].Component;
  return (
    <ActionComponentBlock
      ref={outerRef}
      icon={
        <Tooltip title="Remove" onClick={onRemove}>
          <ActionIcon name={value.name} outer={outerRef} />
        </Tooltip>
      }
      header={
        <ActionSelector
          prefix={selectPrefix}
          value={value.name}
          onChange={onActionChange}
          disabledOptions={disabledActions}
        />
      }
    >
      <ActionArgsInput value={value.args} onChange={onArgsChange} />
    </ActionComponentBlock>
  );
}

export function AddActionInput({
  onChange,
  disabledActions,
}: {
  onChange: (action: string) => void;
  disabledActions: string[];
}) {
  const unusedOptions = allActions.filter((a) => !disabledActions.includes(a));
  const noOtherActions = unusedOptions.length === allActions.length;
  const addText = noOtherActions ? "Then..." : "And also...";
  if (unusedOptions.length === 0) {
    return null;
  }

  return (
    <ActionComponentBlock
      hideBorder
      icon={<Plus size={20} />}
      header={<ActionSelector text={addText} selectOnBlur={false} onChange={onChange} options={unusedOptions} />}
    />
  );
}

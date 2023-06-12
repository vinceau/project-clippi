import { produce } from "immer";
import React from "react";
import { Icon } from "semantic-ui-react";

import { InlineDropdown } from "@/components/InlineInputs";
import { Labelled } from "@/components/Labelled";
import { actionComponents } from "@/containers/actions";
import type { Action as ActionDefinition } from "@/lib/event_actions";

import { ActionComponentBlock } from "./ActionComponentBlock";
import { ActionIcon } from "./ActionIcon";

const allActions = Object.keys(actionComponents);

const ActionSelector = (props: any) => {
  const { options, ...rest } = props;
  return (
    <InlineDropdown
      {...rest}
      customOptions={options || allActions}
      mapOptionToLabel={(opt: string) => actionComponents[opt].label}
      fontSize={18}
    />
  );
};

export const ActionInput: React.FC<{
  selectPrefix: string;
  value: ActionDefinition;
  onChange: (a: ActionDefinition) => void;
  disabledActions: string[];
  onRemove: () => void;
}> = (props) => {
  const outerRef = React.createRef<HTMLDivElement>();
  const { value, onChange, onRemove, selectPrefix, disabledActions } = props;
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
        <Labelled title="Remove" onClick={onRemove}>
          <ActionIcon name={value.name} outer={outerRef} />
        </Labelled>
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
};

export const AddActionInput: React.FC<{
  onChange: (action: string) => void;
  disabledActions: string[];
}> = (props) => {
  const { onChange, disabledActions } = props;
  const unusedOptions = allActions.filter((a) => !disabledActions.includes(a));
  const noOtherActions = unusedOptions.length === allActions.length;
  const addText = noOtherActions ? "Then..." : "And also...";
  if (unusedOptions.length === 0) {
    return null;
  }

  return (
    <ActionComponentBlock
      hideBorder={true}
      icon={<Icon name="add" size="large" />}
      header={<ActionSelector text={addText} selectOnBlur={false} onChange={onChange} options={unusedOptions} />}
    />
  );
};

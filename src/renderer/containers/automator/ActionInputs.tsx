import * as React from "react";

import styled from "@emotion/styled";

import { Action as ActionDefinition } from "@vinceau/event-actions";
import { produce } from "immer";
import { Icon } from "semantic-ui-react";

import { InlineDropdown } from "@/components/InlineInputs";
import { Labelled } from "@/components/Labelled";
import { actionComponents } from "@/containers/actions";

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
/*
      {
        name: string;
        transform?: boolean;
        args?: any;
      }
*/

const ActionComponentBlock = (props: any) => {
  const { icon, header, children, ...rest } = props;
  const Outer = styled.div`
    display: flex;
    margin-left: 20px;
    margin-bottom: 10px;
  `;
  const Content = styled.div`
    margin-left: 10px;
    width: 100%;
  `;
  const ActionDetails = styled.div`
    margin: 1rem 0;
    padding: 0.5rem 0;
    padding-left: 2rem;
    border-left: solid 0.3rem ${({ theme }) => theme.foreground3};
    line-height: 2rem;
  `;
  return (
    <Outer {...rest}>
      <div>{icon}</div>
      <Content>
        <div>{header}</div>
        {children && <ActionDetails>{children}</ActionDetails>}
      </Content>
    </Outer>
  );
};

export const ActionInput: React.FC<{
  selectPrefix: string;
  value: ActionDefinition;
  onChange: (a: ActionDefinition) => void;
  disabledActions: string[];
  onRemove: () => void;
}> = (props) => {
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
  const ActionIcon = actionComponents[value.name].Icon;
  const ActionArgsInput = actionComponents[value.name].Component;
  return (
    <ActionComponentBlock
      icon={
        <Labelled title="Click to remove" onClick={onRemove}>
          <ActionIcon />
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
  return (
    <ActionComponentBlock
      style={unusedOptions.length === 0 ? { display: "none" } : undefined}
      icon={<Icon name="add" size="large" />}
      header={<ActionSelector text={addText} selectOnBlur={false} onChange={onChange} options={unusedOptions} />}
    />
  );
};

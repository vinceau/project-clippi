/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import React from "react";

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
  const { hideBorder, icon, header, children, ...rest } = props;
  const Outer = styled.div`
    margin: 2rem;
    padding: 2rem;
    padding-top: 0;
    display: flex;
    flex-direction: column;
    ${({ theme }) => (hideBorder ? "" : `border-bottom: solid 0.3rem ${theme.foreground3}`)};
  `;
  const Content = styled.div`
    width: 100%;
  `;
  const ActionDetails = styled.div`
    line-height: 3rem;
  `;
  return (
    <Outer {...rest}>
      <div
        css={css`
          display: flex;
          flex-direction: row;
          align-items: center;
          ${!hideBorder && `padding-bottom: 1rem;`}
        `}
      >
        <div
          css={css`
            margin-right: 1rem;
          `}
        >
          {icon}
        </div>
        <div>{header}</div>
      </div>
      <Content>{children && <ActionDetails>{children}</ActionDetails>}</Content>
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
  const [hover, setHover] = React.useState<boolean>(false);
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
          <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
            {hover ? <Icon name="close" size="large" /> : <ActionIcon />}
          </div>
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
      hideBorder={true}
      style={unusedOptions.length === 0 ? { display: "none" } : undefined}
      icon={<Icon name="add" size="large" />}
      header={<ActionSelector text={addText} selectOnBlur={false} onChange={onChange} options={unusedOptions} />}
    />
  );
};

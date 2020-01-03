import * as React from "react";

import { Icon } from "semantic-ui-react";

import { Action, actionComponents } from "@/actions";

import { Action as ActionDefinition } from "@vinceau/event-actions";
import { produce } from "immer";
import styled from "styled-components";
import { InlineDropdown } from "../InlineInputs";
import { Labelled } from "../Misc";

const allActions = Object.keys(actionComponents);

const ActionSelector = (props: any) => {
    const { options, ...rest } = props;
    return (
        <InlineDropdown
            {...rest}
            options={options || allActions}
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

const ActionIcon = (props: any) => {
    const { actionType, ...rest } = props;
    switch (actionType) {
        case Action.NOTIFY:
            return (
                <Icon name="exclamation circle" {...rest} />
            );
        case Action.PLAY_SOUND:
            return (
                <Icon name="music" {...rest} />
            );
        case Action.CREATE_TWITCH_CLIP:
            return (
                <Icon name="twitch" {...rest} />
            );
        default:
            return (
                <Icon name="question" {...rest} />
            );
    }
};

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
    return (
        <Outer {...rest}>
            <div style={{padding: "5px"}}>{icon}</div>
            <Content>
                <div style={{ marginBottom: "10px"}}>{header}</div>
                {children && <div>{children}</div>}
            </Content>
        </Outer>
    );
};

export const ActionInput = (props: any) => {
    const { snippet, value, onChange, onRemove, selectPrefix, disabledActions } = props;
    const onActionChange = (action: string) => {
        const newValue = produce(value, (draft: ActionDefinition) => {
            draft.name = action;
            draft.args = {};
        });
        onChange(newValue);
    };
    const onArgsChange = (args: any) => {
        const newValue = produce(value, (draft: ActionDefinition) => {
            draft.args = args;
        });
        onChange(newValue);
    };
    const ActionArgsInput = actionComponents[value.name].Component;
    const content = (
        <ActionArgsInput value={value.args} onChange={onArgsChange} snippet={snippet} />
    );
    if (snippet) {
        return content;
    }
    return (
        <ActionComponentBlock
            icon={
                <Labelled title="Click to remove" onClick={onRemove}>
                    <ActionIcon actionType={value.name} size="large" />
                </Labelled>
            }
            header={
                <ActionSelector prefix={selectPrefix} value={value.name} onChange={onActionChange} disabledOptions={disabledActions} />
            }
        >
            {content}
        </ActionComponentBlock>
    );
};

export const AddActionInput = (props: any) => {
    const { onChange, disabledActions } = props;
    const unusedOptions = allActions.filter(a => !disabledActions.includes(a));
    const noOtherActions = unusedOptions.length === allActions.length;
    const addText = noOtherActions ? "Then..." : "And also...";
    return (
        <ActionComponentBlock
            style={unusedOptions.length === 0 ? { display: "none" } : undefined}
            icon={
                <Icon name="add" size="large" />
            }
            header={
                <ActionSelector text={addText} selectOnBlur={false} onChange={onChange} options={unusedOptions} />
            }
        />
    );
};

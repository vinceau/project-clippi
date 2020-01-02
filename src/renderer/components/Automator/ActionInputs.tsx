import * as React from "react";

import { Icon, List } from "semantic-ui-react";

import { Action, actionComponents } from "@/actions";

import { Action as ActionDefinition } from "@vinceau/event-actions";
import { produce } from "immer";
import styled, { css } from "styled-components";
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

export const ActionInput = (props: any) => {
    const { value, onChange, onRemove, selectPrefix, disabledActions } = props;
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
    const Container = styled(List.Item)`
    &&& {
        padding: 10px 0;
    }
    `;
    const ListHeader = styled(List.Header)`
    &&& {
        padding-bottom: 10px;
    }
    `;

    const ActionArgsInput = actionComponents[value.name].Component;
    return (
        <Container>
            <i className="icon">
                <Labelled title="Click to remove" onClick={onRemove}>
                    <ActionIcon actionType={value.name} size="large" />
                </Labelled>
            </i>
            <List.Content>
                <ListHeader>
                    <ActionSelector prefix={selectPrefix} value={value.name} onChange={onActionChange} disabledOptions={disabledActions} />
                </ListHeader>
                <List.Description>
                    <ActionArgsInput value={value.args} onChange={onArgsChange} />
                </List.Description>
            </List.Content>
        </Container>
    );
};

export const AddActionInput = (props: any) => {
    const { onChange, disabledActions } = props;
    const unusedOptions = allActions.filter(a => !disabledActions.includes(a));
    const noOtherActions = unusedOptions.length === allActions.length;
    const addText = noOtherActions ? "Then..." : "And also...";
    const shouldShow = css`
        ${unusedOptions.length === 0 && "display: none;"}
    `;
    const Container = styled(List.Item)`
    &&& {
        ${shouldShow}
        padding: 10px 0;
    }
    `;
    const ListHeader = styled(List.Header)`
    &&& {
        padding-bottom: 10px;
    }
    `;
    return (
        <Container>
            <List.Icon name="add" verticalAlign="top" size="large" />
            <List.Content>
                <ListHeader>
                    <ActionSelector text={addText} selectOnBlur={false} onChange={onChange} options={unusedOptions} />
                </ListHeader>
            </List.Content>
        </Container>
    );
};

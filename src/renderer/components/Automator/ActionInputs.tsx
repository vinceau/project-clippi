import * as React from "react";

import { Form, TextArea, Checkbox, Icon, List } from "semantic-ui-react";

import { Action, ActionCreateTwitchClipParams, ActionPlaySoundParams } from "@/lib/actions";
import { iRootState } from "@/store";
import { useSelector } from "react-redux";

import { Action as ActionDefinition } from "@vinceau/event-actions";
import { produce } from "immer";
import styled, { css } from "styled-components";
import { InlineDropdown } from "../InlineInputs";
import { LabelledButton } from "../Misc";
import { AddSoundButton } from "../Settings/SoundSettings";

const allActions: Action[] = [
    Action.NOTIFY,
    Action.CREATE_TWITCH_CLIP,
    Action.PLAY_SOUND,
];

const mapEventToName: { [eventName: string]: string } = {
    [Action.NOTIFY]: "show a notification",
    [Action.CREATE_TWITCH_CLIP]: "create a Twitch clip",
    [Action.PLAY_SOUND]: "play a sound",
};

const ActionSelector = (props: any) => {
    const { options, ...rest } = props;
    return (
        <InlineDropdown
            {...rest}
            options={options || allActions}
            mapOptionToLabel={(opt: string) => mapEventToName[opt]}
            fontSize={18}
        />
    );
};

const NotifyInputOuter = styled.div`
    max-width: 500px;
`;
const NotifyInput = (props: any) => {
    const { value, onChange } = props;
    const defaultValue = value && value.message ? value.message : "";
    const [ msg, setMsg ] = React.useState(defaultValue);
    return (
        <NotifyInputOuter>
            <Form>
                <TextArea
                    onBlur={() => onChange(({ message: msg }))}
                    value={msg}
                    onChange={(_: any, {value}: any) => setMsg(value)}
                    placeholder="Here's a notification!"
                />
            </Form>
        </NotifyInputOuter>
    );
};

const SoundInput = (props: any) => {
    const { value, onChange } = props;
    const soundFiles = useSelector((state: iRootState) => state.filesystem.soundFiles);
    const allSounds = Object.keys(soundFiles);
    if (allSounds.length === 0) {
        return (
            <AddSoundButton />
        );
    }

    const onSoundChange = (sound: string) => {
        const newValue = produce(value, (draft: ActionPlaySoundParams) => {
            draft.sound = sound;
        });
        onChange(newValue);
    };
    return (
        <InlineDropdown
            value={value.sound}
            prefix="Play"
            onChange={onSoundChange}
            options={allSounds}
        />
    );
};

const TwitchClipInput = (props: any) => {
    const { value, onChange } = props;
    const onDelayChange = (delay?: boolean) => {
        const newValue = produce(value, (draft: ActionCreateTwitchClipParams) => {
            draft.delay = delay;
        });
        onChange(newValue);
    };
    const toggle = () => onDelayChange(!value.delay);

    return (
        <div>
            <Checkbox
                label="Delay before clipping"
                onChange={toggle}
                checked={value.delay}
            />
        </div>
    );
};

/*
      {
        name: string;
        transform?: boolean;
        args?: any;
      }
*/

const ActionArgsInput = (props: any) => {
    const { actionType, ...rest } = props;
    switch (actionType) {
        case Action.NOTIFY:
            return (
                <NotifyInput {...rest} />
            );
        case Action.PLAY_SOUND:
            return (<SoundInput {...rest} />);
        case Action.CREATE_TWITCH_CLIP:
            return (<TwitchClipInput {...rest} />);
        default:
            return (<div>Unknown action: {actionType}</div>);
    }
};

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
    return (
        <Container>
            <i className="icon">
                <LabelledButton title="Click to remove" onClick={onRemove}>
                    <ActionIcon actionType={value.name} size="large" />
                </LabelledButton>
            </i>
            <List.Content>
                <ListHeader>
                    <ActionSelector prefix={selectPrefix} value={value.name} onChange={onActionChange} disabledOptions={disabledActions} />
                </ListHeader>
                <List.Description>
                    <ActionArgsInput actionType={value.name} value={value.args} onChange={onArgsChange} />
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

import * as React from "react";

import { Card, Checkbox, Dropdown, List, Item } from "semantic-ui-react";

import { Action, ActionNotifyParams } from "@/lib/actions";
import styled from "styled-components";
import { addSound } from "../Settings/SoundSettings";
import { sp } from "@/lib/sounds";
import { produce } from "immer";
import { InlineDropdown, InlineInput } from "../InlineInputs";

const allActions: Action[] = [
    Action.NOTIFY,
    Action.CREATE_TWITCH_CLIP,
    Action.PLAY_SOUND,
];

const mapEventToName: { [eventName: string]: string } = {
    [Action.NOTIFY]: "display a notification",
    [Action.CREATE_TWITCH_CLIP]: "create a Twitch clip",
    [Action.PLAY_SOUND]: "play a sound",
};

const ActionSelector: React.FC<{
    value: Action,
    onChange: (e: string) => void;
    prefix?: string,
    disabledActions?: string[];
}> = props => {
    return (
        <InlineDropdown
            prefix={props.prefix}
            options={allActions}
            value={props.value}
            mapOptionToLabel={(opt: string) => mapEventToName[opt]}
            onChange={props.onChange}
            disabledOptions={props.disabledActions}
            fontSize={18}
        />
    );
};

const NotifyInput = (props: any) => {
    const { value, onChange } = props;
    const { title, body } = value as ActionNotifyParams;
    const onTitleChange = (newTitle: string) => {
        const newValue = {
            title: newTitle,
            body,
        };
        onChange(newValue);
    };

    const onBodyChange = (newBody: string) => {
        const newValue = {
            title,
            body: newBody,
        };
        onChange(newValue);
    };
    return (
        <Card.Group>
            <Card>
                <Card.Content>
                    <Card.Header>
                        <InlineInput value={title} onChange={onTitleChange} placeholder="Notification title" />
                    </Card.Header>
                    <Card.Description>
                        <InlineInput value={body} onChange={onBodyChange} placeholder="Notification body" />
                    </Card.Description>
                </Card.Content>
            </Card>
        </Card.Group>
    );
};

const SoundInput = (props: any) => {
    const { value, onChange } = props;
    const mapOptions = (str: string) => ({
        key: str,
        value: str,
        text: str,
    });
    const allSounds = Object.keys(sp.sounds);
    const options = allSounds.map(mapOptions);
    const onSoundChange = (sound: string) => {
        const newValue = produce(value, draft => {
            draft.sound = sound;
        });
        onChange(newValue);
    };

    return (
        <span>
            Play {" "}
            <Dropdown
                inline
                value={value.sound}
                onChange={(_, { value }) => onSoundChange(value)}
                options={options}
            />
        </span>
    );
};

const TwitchClipInput = (props: any) => {
    const { value, onChange } = props;
    const onDelayChange = (delay?: boolean) => {
        const newValue = produce(value, draft => {
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
                <List.Icon name="exclamation circle" {...rest} />
            );
        case Action.PLAY_SOUND:
            return (
                <List.Icon name="music" {...rest} />
            );
        case Action.CREATE_TWITCH_CLIP:
            return (
                <List.Icon name="twitch" {...rest} />
            );
        default:
            return (
                <List.Icon name="question" {...rest} />
            );
    }
};

export const ActionInput = (props: any) => {
    const { value, onChange, selectPrefix, disabledActions } = props;
    const onActionChange = (action: string) => {
        const newValue = produce(value, draft => {
            draft.name = action;
            draft.args = {};
        });
        onChange(newValue);
    };
    const onArgsChange = (args: any) => {
        const newValue = produce(value, draft => {
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
            <ActionIcon actionType={value.name} verticalAlign="top" size="large" />
            <List.Content>
                <ListHeader>
                    <ActionSelector prefix={selectPrefix} value={value.name} onChange={onActionChange} disabledActions={disabledActions} />
                </ListHeader>
                <List.Description>
                    <ActionArgsInput actionType={value.name} value={value.args} onChange={onArgsChange} />
                </List.Description>
            </List.Content>
        </Container>
    );
};

import * as React from "react";

import { Dropdown, Input, Item } from "semantic-ui-react";

import { Action, ActionNotifyParams } from "@/lib/actions";
import styled from "styled-components";
import { addSound } from "../Settings/SoundSettings";
import { sp } from "@/lib/sounds";
import {produce} from "immer";
import { InlineDropdown } from "../InlineDropdown";

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

const ActionInputContainer: React.FC<{
    header: any;
}> = props => {
    return (
        // <Card fluid>
        //     <Card.Header>{props.header}</Card.Header>
        //     <Card.Description>
        //         {props.children}
        //     </Card.Description>
        // </Card>
        <Item>
            {/* <Item.Image size='tiny' src='/images/wireframe/image.png' /> */}

            <Item.Content>
                <Item.Header>{props.header}</Item.Header>
                <Item.Description>{props.children}</Item.Description>
            </Item.Content>
        </Item>
    );
};

/*
const CardExampleFluid = () => (
    <Card.Group>
      <Card fluid color='red' header='Option 1' />
      <Card fluid color='orange' header='Option 2' />
      <Card fluid color='yellow' header='Option 3' />
    </Card.Group>
  )
  */

export const NotifyInput = (props: any) => {
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
        <>
            {/* <CardExampleFluid /> */}
            <ActionInputContainer header="Display a notification">
                <InlineInput value={title} onChange={onTitleChange} placeholder="Title..." />
                <InlineInput value={body} onChange={onBodyChange} placeholder="Body..." />
            </ActionInputContainer>
        </>
    );
};

const InlineInput = (props: any) => {
    const { value, onChange, ...rest } = props;
    const [newValue, setNewValue] = React.useState<string>(value || "");
    const submitValue = () => {
        console.log("submit value");
        onChange(newValue);
    };
    const onKeyDown = (event: any) => {
        if (event.keyCode === 13) {
            submitValue();
        }
    };
    const newOnChange = (_: any, data: any) => {
        setNewValue(data.value);
    };
    return (
        <Input
            {...rest}
            transparent={true}
            value={newValue}
            onChange={newOnChange}
            onKeyDown={onKeyDown}
            onBlur={submitValue}
        />
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

    // const [v, setV] = React.useState("");
    return (
            <ActionInputContainer header={
        <span>
            Play {" "}
            <Dropdown
                inline
                value={value.sound}
                onChange={(_, { value }) => onSoundChange(value)}
                options={options}
            />
        </span>
        } />
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
            return (<div>create twitch clip</div>);
        default:
            return (<div>unknown action name: {value.name}</div>);
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
    return (
        <div>
            <ActionSelector prefix={selectPrefix} value={value.name} onChange={onActionChange} disabledActions={disabledActions}/>
            <ActionArgsInput actionType={value.name} value={value.args} onChange={onArgsChange} />
        </div>
    );
};
import * as React from "react";

import { Card, Input, Item } from 'semantic-ui-react'

import { ActionNotifyParams } from "@/lib/actions";

const ActionInputContainer: React.FC<{
    header: string;
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

const CardExampleFluid = () => (
    <Card.Group>
      <Card fluid color='red' header='Option 1' />
      <Card fluid color='orange' header='Option 2' />
      <Card fluid color='yellow' header='Option 3' />
    </Card.Group>
  )

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
    const [ newValue, setNewValue ] = React.useState<string>(value || "");
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

import React from "react";

import styled from "styled-components";
import { Button, Header, Icon, Modal } from 'semantic-ui-react'

import { ButtonPreview } from "./ButtonPreview";
import { ControllerLayout } from "./ControllerLayout";

export const ButtonPicker: React.FC<{
    value?: string[];
    onChange?: (newButtons: string[]) => void;
}> = (props) => {
    const [opened, setOpened] = React.useState<boolean>(false);
    const [buttons, setButtons] = React.useState<string[]>(props.value || []);
    const onButtonChange = (newButtons: string[]) => {
        console.log(newButtons);
        setButtons(newButtons);
    };
    const onSave = () => {
        console.log("saving...");
        if (props.onChange) {
            props.onChange(buttons);
        }
        setOpened(false);
    }
    return (
        <Modal
        open={opened}
        onClose={() => setOpened(false)}
        closeIcon trigger={
            <div onClick={() => setOpened(true)}>
                {buttons.length > 0 ?
                    <ButtonPreview value={buttons} />
                    :
                    <p>No buttons selected. Click to choose.</p>
                }
            </div>
        }>
            <Modal.Header>Choose a button combination</Modal.Header>
            <Modal.Content>
                <ControllerLayout value={buttons} onChange={onButtonChange} />
            </Modal.Content>
            <Modal.Actions>
                <Button color="green" onClick={onSave}>
                    <Icon name="checkmark" /> Save
                </Button>
            </Modal.Actions>
        </Modal>
    );
};

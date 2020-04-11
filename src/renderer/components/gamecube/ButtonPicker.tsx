import React from "react";

import { Button, Icon, Modal } from "semantic-ui-react";

import { ControllerLayout } from "./ControllerLayout";

import { useTheme } from "@/styles";

export const ButtonPicker: React.FC<{
    value?: string[];
    onChange?: (newButtons: string[]) => void;
}> = (props) => {
    const theme = useTheme();
    const [opened, setOpened] = React.useState<boolean>(false);
    const [buttons, setButtons] = React.useState<string[]>(props.value || []);
    const onOpen = () => {
        // props value is the true value so reset the state
        setButtons(props.value || []);
        setOpened(true);
    };
    const onSave = () => {
        console.log("saving...");
        if (props.onChange) {
            props.onChange(buttons);
        }
        setOpened(false);
    };
    return (
        <Modal
        className={theme.themeName}
        open={opened}
        onClose={() => setOpened(false)}
        closeIcon trigger={
            <div onClick={onOpen}>
                {props.children}
            </div>
        }>
            <Modal.Header>Choose a button combination</Modal.Header>
            <Modal.Content>
                <ControllerLayout value={buttons} onChange={setButtons} />
            </Modal.Content>
            <Modal.Actions>
                <Button color="green" onClick={onSave}>
                    <Icon name="checkmark" /> Save
                </Button>
            </Modal.Actions>
        </Modal>
    );
};

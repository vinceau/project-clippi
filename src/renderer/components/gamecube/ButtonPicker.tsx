import React from "react";

import { Button, Icon, Modal } from "semantic-ui-react";

import { ControllerLayout } from "./ControllerLayout";

import { useTheme } from "@/styles";
import styled from "styled-components";
import { ButtonTextPreview } from "./ButtonPreview";

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
    const ButtonTextContainer = styled.div`
    font-size: 26px;
    text-align: center;
    margin-bottom: 20px;
    `;
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
                <div>
                    <ButtonTextContainer>
                        {buttons.length > 0 ?
                            <ButtonTextPreview value={buttons} />
                        : "No buttons selected"
                        }
                    </ButtonTextContainer>
                    <ControllerLayout value={buttons} onChange={setButtons} />
                </div>
            </Modal.Content>
            <Modal.Actions>
                <Button disabled={buttons.length === 0} color="green" onClick={onSave}>
                    <Icon name="checkmark" /> Save
                </Button>
            </Modal.Actions>
        </Modal>
    );
};

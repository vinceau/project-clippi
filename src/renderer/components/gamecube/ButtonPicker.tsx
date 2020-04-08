import React from "react";

import styled from "styled-components";

import { AButton, BButton, DpadDown, DpadLeft, DpadRight, DpadUp, LTrigger, RTrigger, XButton, YButton, ZButton, StartButton } from "./buttons";
import { Input } from "@vinceau/slp-realtime";

export const ButtonPicker: React.FC<{
    value?: string[];
    onChange?: string[];
}> = (props) => {
    const value = props.value ? props.value : [];
    const shouldShow = (button: Input): boolean => {
        return value.includes(button);
    };
    const pressed = false;
    const Outer = styled.div`
    font-size: 0.3em;
    display: flex;
    align-items: center;
    `;
    const ButtonContainer = styled.div<{
        show: boolean;
    }>`
    display: ${p => p.show ? "block" : "none"}
    `;
    return (
        <Outer>
            <ButtonContainer show={shouldShow(Input.A)}>
                <AButton pressed={pressed} />
            </ButtonContainer>
            <ButtonContainer show={shouldShow(Input.B)}>
                <BButton pressed={pressed} />
            </ButtonContainer>
            <ButtonContainer show={shouldShow(Input.X)}>
                <XButton pressed={pressed} />
            </ButtonContainer>
            <ButtonContainer show={shouldShow(Input.Y)}>
                <YButton pressed={pressed} />
            </ButtonContainer>
            <ButtonContainer show={shouldShow(Input.L)}>
                <LTrigger pressed={pressed} />
            </ButtonContainer>
            <ButtonContainer show={shouldShow(Input.Z)}>
                <ZButton pressed={pressed} />
            </ButtonContainer>
            <ButtonContainer show={shouldShow(Input.R)}>
                <RTrigger pressed={pressed} />
            </ButtonContainer>
            <ButtonContainer show={shouldShow(Input.D_UP)}>
                <DpadUp pressed={pressed} />
            </ButtonContainer>
            <ButtonContainer show={shouldShow(Input.D_DOWN)}>
                <DpadDown pressed={pressed} />
            </ButtonContainer>
            <ButtonContainer show={shouldShow(Input.D_LEFT)}>
                <DpadLeft pressed={pressed} />
            </ButtonContainer>
            <ButtonContainer show={shouldShow(Input.D_RIGHT)}>
                <DpadRight pressed={pressed} />
            </ButtonContainer>
            <ButtonContainer show={shouldShow(Input.START)}>
                <StartButton pressed={pressed} />
            </ButtonContainer>
        </Outer>
    );
};
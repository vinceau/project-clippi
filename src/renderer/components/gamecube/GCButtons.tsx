import React from "react";

import styled from "styled-components";

import { AButton } from "./AButton";
import { BButton } from "./BButton";
import { DpadDown } from "./DpadDown";
import { DpadLeft } from "./DpadLeft";
import { DpadRight } from "./DpadRight";
import { DpadUp } from "./DpadUp";
import { LTrigger } from "./LTrigger";
import { RTrigger } from "./RTrigger";
import { XButton } from "./XButton";
import { YButton } from "./YButton";
import { ZButton } from "./ZButton";
import { Input } from "@vinceau/slp-realtime";

export const GCButtons: React.FC<{
    value?: Input[],
    onChange?: (values: Input[]) => void;
}> = (props) => {
    const value = props.value ? props.value : [];
    const isPressed = (input: Input) => {
        return value.includes(input);
    };
    const onClick = (input: Input) => {
        console.log(`${input} was clicked`);
        const filtered = value.filter(i => i !== input);
        if (!isPressed(input)) {
            // Add button to the list
            filtered.push(input);
        }
        if (props.onChange) {
            props.onChange(filtered);
        }
    };
    const Outer = styled.div`
    display: flex;
    flex-direction: column;
    `;
    const Row = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    `;
    const StyledDpadLeft = styled(DpadLeft)`
    margin-right: 10px !important;
    `;
    const StyledDpadRight = styled(DpadRight)`
    margin-left: 10px !important;
    `;
    const Dpad = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    ${StyledDpadLeft} {
        margin-right: 10px !important;
    }
    ${StyledDpadRight} {
        margin-left: 10px !important;
    }
    `;
    const MainButtons = styled.div`
    display: grid;
    grid-gap: 1.2em;
    grid-template-columns: repeat(3, 1fr);
    `;
    return (
        <Outer>
            <Row>
                <LTrigger pressed={isPressed(Input.L)} onClick={() => onClick(Input.L)} />
                <RTrigger pressed={isPressed(Input.R)} onClick={() => onClick(Input.R)} />
            </Row>
            <div style={{ alignSelf: "flex-end" }}>
                <ZButton pressed={isPressed(Input.Z)} onClick={() => onClick(Input.Z)} />
            </div>

            <Row>
                <Dpad>
                    <DpadUp pressed={isPressed(Input.D_UP)} onClick={() => onClick(Input.D_UP)} />
                    <div style={{ display: "flex" }}>
                        <StyledDpadLeft pressed={isPressed(Input.D_LEFT)} onClick={() => onClick(Input.D_LEFT)} />
                        <StyledDpadRight pressed={isPressed(Input.D_RIGHT)} onClick={() => onClick(Input.D_RIGHT)} />
                    </div>
                    <DpadDown pressed={isPressed(Input.D_DOWN)} onClick={() => onClick(Input.D_DOWN)} />
                </Dpad>
                <MainButtons>
                    <span style={{ gridColumn: "1 / 3", gridRow: "1 / 2", justifySelf: "end" }}>
                        <YButton pressed={isPressed(Input.Y)} onClick={() => onClick(Input.Y)} />
                    </span>
                    <span style={{ gridColumn: "2 / 3", gridRow: "2 / 4" }}>
                        <AButton pressed={isPressed(Input.A)} onClick={() => onClick(Input.A)} />
                    </span>
                    <span style={{ gridColumn: "3 / 4", gridRow: "1 / 4", alignSelf: "end" }}>
                        <XButton pressed={isPressed(Input.X)} onClick={() => onClick(Input.X)} />
                    </span>
                    <span style={{ gridColumn: "1 / 2", gridRow: "1 / 4", alignSelf: "end", justifySelf: "end" }}>
                        <BButton pressed={isPressed(Input.B)} onClick={() => onClick(Input.B)} />
                    </span>
                </MainButtons>
            </Row>
        </Outer>
    );
};

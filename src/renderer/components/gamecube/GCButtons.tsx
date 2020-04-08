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

export const GCButtons: React.FC = () => {
    const [zPressed, setZPressed] = React.useState(false);
    const [xPressed, setXPressed] = React.useState(false);
    const [yPressed, setYPressed] = React.useState(false);
    const [lPressed, setLPressed] = React.useState(false);
    const [rPressed, setRPressed] = React.useState(false);
    const [dlPressed, setDLPressed] = React.useState(false);
    const [drPressed, setDRPressed] = React.useState(false);
    const [duPressed, setDUPressed] = React.useState(false);
    const [ddPressed, setDDPressed] = React.useState(false);
    const [aPressed, setAPressed] = React.useState(false);
    const [bPressed, setBPressed] = React.useState(false);
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
                <LTrigger pressed={lPressed} onClick={setLPressed} />
                <RTrigger pressed={rPressed} onClick={setRPressed} />
            </Row>
            <div style={{ alignSelf: "flex-end" }}>
                <ZButton pressed={zPressed} onClick={setZPressed} />
            </div>

            <Row>
                <Dpad>
                    <DpadUp pressed={duPressed} onClick={setDUPressed} />
                    <div style={{ display: "flex" }}>
                        <StyledDpadLeft pressed={dlPressed} onClick={setDLPressed} />
                        <StyledDpadRight pressed={drPressed} onClick={setDRPressed} />
                    </div>
                    <DpadDown pressed={ddPressed} onClick={setDDPressed} />
                </Dpad>
                <MainButtons>
                    <span style={{ gridColumn: "1 / 3", gridRow: "1 / 2", justifySelf: "end" }}>
                        <YButton pressed={yPressed} onClick={setYPressed} />
                    </span>
                    <span style={{ gridColumn: "2 / 3", gridRow: "2 / 4" }}>
                        <AButton pressed={aPressed} onClick={setAPressed} />
                    </span>
                    <span style={{ gridColumn: "3 / 4", gridRow: "1 / 4", alignSelf: "end" }}>
                        <XButton pressed={xPressed} onClick={setXPressed} />
                    </span>
                    <span style={{ gridColumn: "1 / 2", gridRow: "1 / 4", alignSelf: "end", justifySelf: "end" }}>
                        <BButton pressed={bPressed} onClick={setBPressed} />
                    </span>
                </MainButtons>
            </Row>
        </Outer>
    );
};

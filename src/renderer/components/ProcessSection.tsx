import * as React from "react";
import styled from "styled-components";

import { Checkbox } from "semantic-ui-react";

export const SlideReveal = styled.div`
    overflow-y: ${(props: { open: boolean }) => props.open ? "visible" : "hidden"};
    max-height: ${(props: { open: boolean }) => props.open ? "1000px" : "0"};
    transition: all 0.3s ease-in-out;
`;

const Outer = styled.div`
padding: 20px 0;
border-top: solid 1px ${({ theme }) => theme.foreground3};
`;

const SectionLabel = styled.h2`
cursor: pointer;
margin-bottom: 0;
`;

export const ProcessSection: React.FC<{
    open: boolean;
    onOpenChange: (open: boolean) => void;
    label: string;
}> = (props) => {
    const { open, onOpenChange, label } = props;
    return (
        <Outer>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <SectionLabel onClick={() => onOpenChange(!open)}>{label}</SectionLabel>
                <Checkbox
                    toggle={true}
                    checked={open}
                    onChange={(_, data) => onOpenChange(Boolean(data.checked))}
                />
            </div>
            <SlideReveal open={open}>
                <div style={{ marginTop: "10px" }}>
                    {props.children}
                </div>
            </SlideReveal>
        </Outer>
    );
};

import * as React from "react";
import styled from "styled-components";

import { Checkbox } from "semantic-ui-react";

export const SlideReveal = styled.div`
    overflow-y: ${(props: { open: boolean }) => props.open ? "visible" : "hidden"};
    max-height: ${(props: { open: boolean }) => props.open ? "1000px" : "0"};
    transition: all 0.3s ease-in-out;
`;

export const ProcessSection: React.FC<{
    open: boolean;
    onOpenChange: (open: boolean) => void;
    label: string;
    disabled: boolean;
}> = (props) => {
    const { open, onOpenChange, label, disabled=false } = props;
    return (
        <div style={{ padding: "10px 0" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h3>{label}</h3>
                <Checkbox
                    toggle={true}
                    checked={open}
                    onChange={(_, data) => onOpenChange(Boolean(data.checked))}
                    disabled={disabled}
                />
            </div>
            <SlideReveal open={open}>
                {props.children}
            </SlideReveal>
        </div>
    );
};

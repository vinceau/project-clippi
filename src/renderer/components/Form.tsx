import React from "react";

import styled from "styled-components";
import { Checkbox } from "semantic-ui-react";

export const FormContainer = styled.div`
max-width: 650px;
`;

export const PageHeader = styled.h1`
font-variant: all-small-caps;
margin-bottom: 10px;
`;

export const Label = styled.div`
&&& {
font-weight: 500;
font-size: 14px;
margin-bottom: 10px;
}
`;

export const Text = styled.p<{
    margin?: string;
}>`
font-size: 12px;
opacity: 0.8;
${p => p.margin !== "none" && `
margin-top: 10px;
`}
`;

export const Field = styled.div<{
    border?: string;
}>`
padding-top: 20px;
padding-bottom: 20px;

${p => (p.border === "top" || p.border === "both") && `
border-top: solid 1px ${p.theme.foreground3};
`}

${p => (p.border === "bottom" || p.border === "both") && `
border-bottom: solid 1px ${p.theme.foreground3};
`}

`;

const ToggleOuter = styled.div`
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: center;
`;

export const Toggle: React.FC<{
    label: string;
    value: boolean;
    onChange?: (checked: boolean) => void;
}> = (props) => {
    const onChange = (value: boolean) => {
        if (props.onChange) {
            props.onChange(value);
        }
    }
    return (
        <ToggleOuter>
            <Label style={{cursor: props.onChange ? "pointer" : "auto"}} onClick={() => onChange(!props.value)}>{props.label}</Label>
            <Checkbox
                checked={props.value}
                onChange={(_, data) => onChange(Boolean(data.checked))}
                toggle={true}
            />
        </ToggleOuter>
    );
};

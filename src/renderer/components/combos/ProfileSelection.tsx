import * as React from "react";

import styled from "styled-components";

import { Dropdown } from "semantic-ui-react";
import { Text, Label, Field } from "../Form";
import { lighten } from "polished";

const generateOptions = (opts: string[]) => {
    return opts.map(o => ({
        key: o,
        text: o,
        value: o,
    }));
};

const Outer = styled.div`
padding: 0 2rem;
border-radius: 0.5rem;
background-color: ${({theme}) => lighten(0.05, theme.background)};
`;

export const ProfileSelector = (props: any) => {
    const { initialOptions, value, onChange, ...rest } = props;
    const options = generateOptions(initialOptions);
    const handleChange = (_: any, { value }: any) => onChange(value);
    return (
    <Outer>
        <Field>
           <Label>Current Profile</Label>
            <Dropdown
                style={{ width: "100%" }}
                options={options}
                placeholder="Select a profile"
                search
                selection
                allowAdditions
                value={value}
                onAddItem={handleChange}
                onChange={handleChange}
                {...rest}
            />
            <Text>
                Combo profiles are used to determine the combo and conversion events as well as the combos found by the <b>Replay Processor</b>.
                You can create new profiles by typing a new profile name in the dropdown.
            </Text>
        </Field>
    </Outer>
   );
};

import * as React from "react";

import styled from "styled-components";

import { Divider, Dropdown } from "semantic-ui-react";

const generateOptions = (opts: string[]) => {
    return opts.map(o => ({
        key: o,
        text: o,
        value: o,
    }));
};

export const ProfileSelector = (props: any) => {
    const { initialOptions, value, onChange, ...rest } = props;
    const options = generateOptions(initialOptions);
    const handleChange = (_: any, { value }) => onChange(value);
    const Text = styled.span`
    font-weight: bold;
    margin-right: 5px;
    `;
    return (
        <div>
            <Divider />
            <Text>Current Profile</Text>
            <Dropdown
                {...rest}
                options={options}
                placeholder="Select a profile"
                search
                selection
                allowAdditions
                value={value}
                onAddItem={handleChange}
                onChange={handleChange}
            />
            <Divider />
        </div>
    );
};

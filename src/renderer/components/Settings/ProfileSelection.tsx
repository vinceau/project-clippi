import * as React from "react";

import { Dropdown } from "semantic-ui-react";

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
    return (
        <Dropdown
            {...rest}
            options={options}
            placeholder="Select a profile"
            search
            selection
            fluid
            allowAdditions
            value={value}
            onAddItem={handleChange}
            onChange={handleChange}
        />
    );
};

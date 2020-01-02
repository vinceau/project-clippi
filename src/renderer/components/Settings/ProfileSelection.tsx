import * as React from "react";

import { produce } from "immer";
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
    const [options, setOptions] = React.useState(generateOptions(initialOptions));

    const handleAddition = (_: any, { value }) => {
        const newOptions = produce(options, draft => {
            draft.push({
                key: value,
                text: value,
                value,
            });
        });
        setOptions(newOptions);
    };

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
            onAddItem={handleAddition}
            onChange={handleChange}
        />
    );
};

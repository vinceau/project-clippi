import * as React from "react";

import Select from "react-select";
import { Field } from "react-final-form";
import styled from "styled-components";

const ReactSelectAdapter = (props: any) => {
    const { input, ...rest } = props;
    const SelectContainer = styled(Select)`
        width: 100%;
    `;
    return (<SelectContainer
        {...input}
        {...rest}
        searchable={true}
        isMulti={true}
    />);
};

const CharacterSelect = (props: any) => {
    const { input, options, ...rest } = props;
    const stringToOption = (s: string) => {
        console.log(`inside string to option. got this string`);
        console.log(s);
        return {
            value: s,
            label: s,
        };
    };
    const newOptions = options.map(stringToOption);
    const { value, onChange, ...iRest } = input;
    let newValue = value;
    if (value.map) {
        newValue = value.map(c => stringToOption(c));
    }
    const newInput = {
        value: newValue,
        onChange: (v: any) => {
            console.log('inside on change');
            console.log(v);
            onChange(v.map(c => c.value));
        },
    };
    return <ReactSelectAdapter {...iRest} input={newInput} options={newOptions} />
};

export const CustomSelect: React.FC<{ name: string }> = props => {
    const options = ["hello", "world", "foo", "bar", "baz"];
    return (<Field name={props.name}>
        {fprops => (
            <CharacterSelect {...fprops} options={options} />
        )}
    </Field>);
};

import * as React from "react";

import Select from "react-select";
import { Field } from "react-final-form";
import styled from "styled-components";
import { Character, CharacterInfo, getAllCharacters, getCharacterName } from "slp-realtime";

const sortedCharacters: CharacterInfo[] = getAllCharacters()
    .sort((a, b) => {
        if (a.name < b.name) { return -1; }
        if (a.name > b.name) { return 1; }
        return 0;
    });

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

interface Option {
    label: string;
    value: any;
}

const CharacterSelect = (props: any) => {
    const { valueToOption, optionToValue, input, ...rest } = props;
    const { value, onChange, ...iRest } = input;
    let newValue = value;
    if (value.map && value.length > 0) {
        newValue = value.map((c: Character) => valueToOption(c));
    }
    const newInput = {
        value: newValue,
        onChange: (v: any) => {
            const newV = v.map(optionToValue);
            onChange(newV);
        },
    };
    return <ReactSelectAdapter {...rest} {...iRest} input={newInput} />
};

export const CustomSelect: React.FC<{ name: string, }> = props => {
    const chars = sortedCharacters.map(c => {
        return {
            value: c.id,
            label: c.name,
        };
    });
    const optionToValue = (o: Option): Character => {
        return o.value;
    }
    const valueToOption = (c: Character): Option => {
        return {
            value: c,
            label: getCharacterName(c),
        };
    };
    return (<Field name={props.name}>
        {fprops => {
            return (
                <CharacterSelect
                    {...fprops}
                    options={chars}
                    optionToValue={optionToValue}
                    valueToOption={valueToOption}
                />
            );
        }}
    </Field>);
};

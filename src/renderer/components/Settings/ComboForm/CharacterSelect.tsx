import * as React from "react";
import Select, { components, MultiValueProps, OptionProps, OptionTypeBase } from "react-select";
import { Character,CharacterInfo, getAllCharacters, getCharacterName } from "slp-realtime";
import styled from "styled-components";
import { Field } from "react-final-form";

import { CharacterIcon } from "../../CharacterIcon";

const sortedCharacters: CharacterInfo[] = getAllCharacters()
  .sort((a, b) => {
    if (a.name < b.name) { return -1; }
    if (a.name > b.name) { return 1; }
    return 0;
  });

const MultiValueRemove: React.ComponentType<MultiValueProps<OptionTypeBase>> = (props) => {
  return (
    <components.MultiValueRemove {...props}><CharacterIcon character={props.data.value} /></components.MultiValueRemove>
  );
};

const Option: React.ComponentType<OptionProps<OptionTypeBase>> = (props) => {
  const { innerProps, innerRef } = props;
  const CharacterLabel = styled.div`
    &:hover {
      background-color: #F8F8F8;
    }
      display: flex;
    `;
  return (
    <div ref={innerRef} {...innerProps}>
      <CharacterLabel>
        <CharacterIcon character={props.data.value} />
        <span>{props.data.label}</span>
      </CharacterLabel>
    </div>
  );
};

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
    components={{ MultiValueRemove, Option }}
    styles={{
      multiValue: (base: any) => ({
        ...base,
        backgroundColor: "transparent",
      }),
      multiValueLabel: (base: any) => ({
        ...base,
        display: "none",
      }),
    }}
  />);
};

export const CharacterSelect: React.FC<{
  name: string;
}> = (props: any) => {
  const chars = sortedCharacters.map(c => ({
    value: c.id,
    label: c.name,
  }));
  const optionToValue = (o: any): Character => o.value;
  const valueToOption = (c: Character) => ({
    value: c,
    label: getCharacterName(c),
  });
  const parseValue = (value: any) => (value && value.map ? value.map(optionToValue) : value);
  const formatValue = (value: any) => (value && value.map ? value.map(valueToOption) : value);
  return (
    <Field
      name={props.name}
      parse={parseValue}
      format={formatValue}
      component={ReactSelectAdapter}
      options={chars}
    />
  );
};

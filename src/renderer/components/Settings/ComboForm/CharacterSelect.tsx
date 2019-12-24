import * as React from "react";
import Select, { components, MultiValueProps, OptionProps, OptionTypeBase, SingleValueProps } from "react-select";
import { Character,CharacterInfo, getAllCharacters, getCharacterName } from "@vinceau/slp-realtime";
import styled from "styled-components";
import { Field } from "react-final-form";

import { CharacterIcon } from "../../CharacterIcon";

export const sortedCharacters: CharacterInfo[] = getAllCharacters()
  .sort((a, b) => {
    if (a.name < b.name) { return -1; }
    if (a.name > b.name) { return 1; }
    return 0;
  });

export const characterSelectOptions = sortedCharacters.map(c => ({
      value: c.id,
      label: c.name,
    }));

const SingleValue: React.ComponentType<SingleValueProps<OptionTypeBase>> = (props) => {
  return (
    <components.SingleValue {...props}><CharacterLabel characterId={props.data.value} name={props.data.label} /></components.SingleValue>
  );
};

const MultiValueRemove: React.ComponentType<MultiValueProps<OptionTypeBase>> = (props) => {
  return (
    <components.MultiValueRemove {...props}><CharacterIcon character={props.data.value} /></components.MultiValueRemove>
  );
};

const CharacterLabel: React.FC<{characterId: Character, name: string}> = (props) => {
  const Label = styled.div`
      display: flex;
    `;
  return (
      <Label>
        <CharacterIcon character={props.characterId} />
        <span>{props.name}</span>
      </Label>
  );
};

const Option: React.ComponentType<OptionProps<OptionTypeBase>> = (props) => {
  const { innerProps, innerRef } = props;
  const Outer = styled.div`
    &:hover {
      background-color: #F8F8F8;
    }
  `;
  return (
    <Outer ref={innerRef} {...innerProps}>
      <CharacterLabel characterId={props.data.value} name={props.data.label} />
    </Outer>
  );
};

export const CharacterSelectAdapter = (props: any) => {
  const { input, ...rest } = props;
  const SelectContainer = styled(Select)`
        width: 100%;
    `;
  return (<SelectContainer
    {...input}
    {...rest}
    searchable={true}
    components={{ MultiValueRemove, Option, SingleValue }}
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

export const CharacterSelect = (props: any) => {
  const { options, ...rest } = props;
  const optionToValue = (o: any): Character => o.value;
  const valueToOption = (c: Character) => ({
    value: c,
    label: getCharacterName(c),
  });
  let selectOptions;
  if (props.options) {
    selectOptions = options.map(valueToOption);
  } else {
    selectOptions = characterSelectOptions;
  }
  const parseValue = (value: any) => (value === undefined ? value : value.map ? value.map(optionToValue) : optionToValue(value));
  const formatValue = (value: any) => (value === undefined ? value : value.map ? value.map(valueToOption) : valueToOption(value));
  return (
    <Field
      {...rest}
      parse={parseValue}
      format={formatValue}
      component={CharacterSelectAdapter}
      options={selectOptions}
    />
  );
};

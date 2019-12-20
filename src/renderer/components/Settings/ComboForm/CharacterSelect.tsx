import * as React from "react";
import Select, { components, OptionProps, OptionTypeBase, MultiValueProps } from "react-select";
import styled from "styled-components";
import { getAllCharacters } from "slp-realtime";
import { CharacterIcon } from "./CharacterIcon";

const MultiValueRemove: React.ComponentType<MultiValueProps<OptionTypeBase>> = (props) => {
  return (
      <components.MultiValueRemove {...props}><CharacterIcon character={props.data.value}/></components.MultiValueRemove>
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
        components={{MultiValueRemove, Option}}
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
  const chars = getAllCharacters()
  .sort((a, b) => {
      if (a.name < b.name) { return -1; }
      if (a.name > b.name) { return 1; }
      return 0;
  })
  .map(c => {
      return {
          value: c.id,
          label: c.name,
      };
  });
  return <ReactSelectAdapter {...props} options={chars} />
}

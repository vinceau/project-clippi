import * as React from "react";
import Select, { IndicatorProps, components, OptionProps, OptionTypeBase, MultiValueProps } from "react-select";
import styled from "styled-components";
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

const  Indicator= (indicatorProps: IndicatorProps<any>) => (
    <div>{indicatorProps.children}</div>
  );

export const ReactSelectAdapter = (props: any) => {
    const { input, ...rest } = props;
    const SelectContainer = styled(Select)`
        width: 100%;
    `;
    return (<SelectContainer
        {...input}
        {...rest}
        searchable={true}
        isMulti={true}
        components={{MultiValueRemove, Option, Indicator}}
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
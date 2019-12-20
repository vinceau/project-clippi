import * as React from "react";
import Select, { IndicatorProps } from "react-select";
import styled from "styled-components";
import { CharacterIcon } from "./CharacterIcon";

const Option = (props: any) => {
    const { innerProps, innerRef } = props;
    const CharacterLabel = styled.div`
    &:hover {
      background-color: #F8F8F8;
    }
      display: flex;
      img {
        width: 24px;
        height: 24px;
      }
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
        components={{Option, Indicator}}
    />);
};
import * as React from "react";
import Select, { IndicatorProps } from "react-select";
import styled from "styled-components";
import { CharacterIcon } from "./CharacterIcon";

const Option = (props: any) => {
    const { innerProps, innerRef } = props;
    return (
      <article ref={innerRef} {...innerProps} className="custom-option">
        <CharacterIcon character={props.data.value} />
        <div className="sub">{props.data.label} </div>
      </article>
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
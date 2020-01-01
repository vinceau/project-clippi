import * as React from "react";

import { Dropdown, Input } from "semantic-ui-react";
import styled, { css } from "styled-components";

const generateOptions = (events: string[], mapOptionToLabel: (opt: string) => string, selectedValue?: string, disabledEvents?: string[]): Array<{ key: string; text: string; value: string }> => {
  const disabled = disabledEvents || [];
  return events.map((e) => ({
    key: e,
    value: e,
    text: mapOptionToLabel(e),
    disabled: e !== selectedValue && disabled.includes(e),
  }));
};

export const InlineDropdown: React.FC<{
  value: string,
  options: string[];
  onChange: (e: string) => void;
  mapOptionToLabel: (option: string) => string;
  fontSize?: number;
  prefix?: string;
  disabledOptions?: string[];
}> = props => {
  const fontSize = (size: number) => css`
    &&&,
    * {
      font-size: ${size}px;
    }
  `;
  const Outer = styled.span`
    ${props.fontSize ? fontSize(props.fontSize) : ""}
  `;
  const options = generateOptions(props.options, props.mapOptionToLabel, props.value, props.disabledOptions);
  return (
    <Outer>
      {props.prefix ? `${props.prefix} ` : ""}
      <Dropdown
        inline
        options={options}
        value={props.value}
        onChange={(e, { value }) => props.onChange(value)}
      />
    </Outer>
  );
};

export const InlineInput = (props: any) => {
    const { value, onChange, ...rest } = props;
    const [newValue, setNewValue] = React.useState<string>(value || "");
    const submitValue = () => {
        onChange(newValue);
    };
    const onKeyDown = (event: any) => {
        if (event.keyCode === 13) {
            submitValue();
        }
    };
    const newOnChange = (_: any, data: any) => {
        setNewValue(data.value);
    };
    return (
        <Input
            {...rest}
            transparent={true}
            value={newValue}
            onChange={newOnChange}
            onKeyDown={onKeyDown}
            onBlur={submitValue}
        />
    );
};

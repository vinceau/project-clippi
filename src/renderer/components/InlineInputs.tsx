import * as React from "react";

import { Dropdown, Input } from "semantic-ui-react";
import styled, { css } from "styled-components";

const generateOptions = (events: string[], mapOptionToLabel?: (opt: string) => string, selectedValue?: string, disabledEvents?: string[]): Array<{ key: string; text: string; value: string }> => {
  const disabled = disabledEvents || [];
  return events.map((e) => ({
    key: e,
    value: e,
    text: mapOptionToLabel ? mapOptionToLabel(e) : e,
    disabled: e !== selectedValue && disabled.includes(e),
  }));
};

export const InlineDropdown = (props: any) => {
  const { value, options, onChange, mapOptionToLabel, fontSize, prefix, disabledOptions, ...rest } = props;
  const fontSizeCSS = (size: number) => css`
    &&&,
    * {
      font-size: ${size}px;
    }
  `;
  const Outer = styled.span`
    ${fontSize ? fontSizeCSS(fontSize) : ""}
  `;
  const newOptions = generateOptions(options, mapOptionToLabel, value, disabledOptions);
  return (
    <Outer>
      {props.prefix ? `${props.prefix} ` : ""}
      <Dropdown
        inline={true}
        {...rest}
        options={newOptions}
        value={value}
        onChange={(e, { value }) => onChange(value)}
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

import * as React from "react";

import { Dropdown, Input } from "semantic-ui-react";
import styled from "@emotion/styled";

const generateOptions = (
  events: string[],
  mapOptionToLabel?: (opt: string) => string,
  selectedValue?: string,
  disabledEvents?: string[]
): Array<{ key: string; text: string; value: string }> => {
  const disabled = disabledEvents || [];
  return events.map((e) => ({
    key: e,
    value: e,
    text: mapOptionToLabel ? mapOptionToLabel(e) : e,
    disabled: e !== selectedValue && disabled.includes(e),
  }));
};

export const InlineDropdown = (props: any) => {
  const { value, customOptions, options, onChange, mapOptionToLabel, prefix, disabledOptions, ...rest } = props;
  let newOptions;
  if (customOptions && !options) {
    newOptions = generateOptions(customOptions, mapOptionToLabel, value, disabledOptions);
  } else {
    newOptions = options;
  }
  return (
    <span>
      {prefix ? `${prefix} ` : ""}
      <Dropdown
        scrolling={true}
        inline={true}
        {...rest}
        options={newOptions}
        value={value}
        onChange={(_: any, { value }) => onChange(value)}
      />
    </span>
  );
};

export const InlineInput = (props: any) => {
  return <BufferedInput {...props} transparent={true} />;
};

export const BufferedInput = (props: any) => {
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
  return <Input value={newValue} onChange={newOnChange} onKeyDown={onKeyDown} onBlur={submitValue} {...rest} />;
};

export const SimpleInput = styled.input`
  padding: 0.3rem;
  text-align: center;
  border-radius: 0.3rem;
  border: solid 0.1rem #d4d4d5;
  font-weight: bold;
  margin: 0 0.5rem;
`;

export const DelayInput: React.FC<{
  value?: string;
  placeholder?: string;
  onChange?: (delay: string) => void;
}> = (props) => {
  const [delayAmount, setDelayAmount] = React.useState(props.value || "0");
  const onChange = () => {
    if (props.onChange) {
      props.onChange(delayAmount);
    }
  };
  return (
    <SimpleInput
      style={{ width: "100px" }}
      value={delayAmount}
      onBlur={onChange}
      onChange={(e) => setDelayAmount(e.target.value)}
      placeholder={props.placeholder}
    />
  );
};

export const NotifyInput: React.FC<{
  value?: boolean;
  onChange: (notify: boolean) => void;
  options?: any;
}> = (props) => {
  const options = props.options
    ? props.options
    : [
        {
          key: "notify-me",
          value: true,
          text: "notify",
        },
        {
          key: "dont-notify-me",
          value: false,
          text: "don't notify",
        },
      ];
  return <InlineDropdown value={Boolean(props.value)} onChange={props.onChange} options={options} />;
};

import * as React from "react";
import { Dropdown } from "@/ui/Dropdown/Dropdown";
import { Input } from "@/ui/Input/Input";

import styles from "./InlineInputs.module.css";

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

export function InlineDropdown(props: any) {
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
        scrolling
        inline
        {...rest}
        options={newOptions}
        value={value}
        onChange={(_: any, { value }) => onChange(value)}
      />
    </span>
  );
}

export function InlineInput(props: any) {
  return <BufferedInput {...props} transparent />;
}

export function BufferedInput(props: any) {
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
}

export function DelayInput({
  value,
  placeholder,
  onChange: onChangeProp,
}: {
  value?: string;
  placeholder?: string;
  onChange?: (delay: string) => void;
}) {
  const [delayAmount, setDelayAmount] = React.useState(value || "0");
  const onChange = () => {
    if (onChangeProp) {
      onChangeProp(delayAmount);
    }
  };
  return (
    <input
      className={styles.simpleInput}
      value={delayAmount}
      onBlur={onChange}
      onChange={(e) => setDelayAmount(e.target.value)}
      placeholder={placeholder}
    />
  );
}

export function SimpleInput(props: any) {
  return <input className={styles.simpleInput} {...props} />;
}

export function NotifyInput({
  value,
  onChange,
  options: optionsProp,
}: {
  value?: boolean;
  onChange: (notify: boolean) => void;
  options?: any;
}) {
  const options = optionsProp || [
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
  return <InlineDropdown value={Boolean(value)} onChange={onChange} options={options} />;
}

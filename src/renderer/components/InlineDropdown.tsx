import * as React from "react";

import { Dropdown } from "semantic-ui-react";

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
  disabledOptions?: string[];
}> = props => {
  const options = generateOptions(props.options, props.mapOptionToLabel, props.value, props.disabledOptions);
  return (
    <Dropdown
      inline
      options={options}
      value={props.value}
      onChange={(e, { value }) => props.onChange(value)}
    />
  );
};

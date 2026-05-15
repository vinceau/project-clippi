import React from "react";
import { Button } from "@/ui/Button/Button";
import { Select } from "@/ui/Select/Select";

export function RecordButton({
  onClick: onClickProp,
  onChange: onChangeProp,
  disabled,
  value,
  options: optionsProp,
  children,
}: {
  onClick?: () => void;
  onChange?: (value: string) => void;
  disabled?: boolean;
  value?: string;
  options?: Array<{
    icon: string;
    text: string;
    value: string;
  }>;
  children?: React.ReactNode;
}) {
  const onChange = (value: any) => {
    if (onChangeProp) {
      onChangeProp(value);
    }
  };
  const onClick = () => {
    if (onClickProp) {
      onClickProp();
    }
  };
  const options = optionsProp ? optionsProp.map((v) => ({ ...v, key: v.value })) : [];
  return (
    <Button.Group>
      <Button disabled={disabled} onClick={onClick}>
        {children}
      </Button>
      {options.length > 0 && (
        <Select value={value} disabled={disabled} button floating onChange={(v) => onChange(v)} options={options} />
      )}
    </Button.Group>
  );
}

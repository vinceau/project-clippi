import React from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/ui/Button/Button";
import { Select } from "@/ui/Select/Select";
import styles from "./RecordButton.module.css";

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
  const options = optionsProp ? optionsProp.map((v) => ({ ...v, key: v.value })) : [];
  const onChange = (value: any) => {
    if (onChangeProp) {
      onChangeProp(value);
    }
  };
  return (
    <Button.Group>
      <Button disabled={disabled} onClick={onClickProp}>
        {children}
      </Button>
      {options.length > 0 && (
        <Select
          value={value}
          disabled={disabled}
          button
          floating
          onChange={(v) => onChange(v)}
          options={options}
          trigger={<ChevronDown size={16} />}
          triggerClassName={styles.dropdownTrigger}
        />
      )}
    </Button.Group>
  );
}

import * as React from "react";
import { toast } from "react-toastify";
import type { SelectProps } from "@/ui/Select/Select";
import { Select } from "@/ui/Select/Select";

import { Field, Label, Text } from "../Form";

import styles from "./ProfileSelection.module.css";

const generateOptions = (opts: string[]) => {
  return opts.map((o) => ({
    key: o,
    text: o,
    value: o,
  }));
};

export interface ProfileSelectorProps extends SelectProps {
  initialOptions: string[];
  onChange: (value: any) => void;
}

export function ProfileSelector({ initialOptions, value, onChange, ...rest }: ProfileSelectorProps) {
  const options = generateOptions(initialOptions);
  const handleNewItem = (_: any, data: any) => {
    const notification = (
      <>
        Created <b>{data.value}</b> profile.
      </>
    );
    toast.info(notification, {
      toastId: `${data.value}-profile-created`,
    });
    onChange(data.value);
  };
  return (
    <div className={styles.outer}>
      <Field>
        <Label>Current Profile</Label>
        <Select
          fluid
          options={options}
          placeholder="Select a profile"
          search
          value={value}
          onChange={(_: any, data: any) => onChange(data.value)}
          onAddItem={handleNewItem}
          {...rest}
        />
        <Text>
          Combo profiles are used to determine the combo and conversion events as well as the combos found by the{" "}
          <b>Replay Processor</b>. You can create new profiles by typing a new profile name in the dropdown.
        </Text>
      </Field>
    </div>
  );
}

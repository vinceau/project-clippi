import type { Character } from "@slippi/slippi-js";
import type { CharacterInfo } from "@vinceau/slp-realtime";
import { getAllCharacters, getCharacterName } from "@vinceau/slp-realtime";
import * as React from "react";
import { Field } from "react-final-form";
import type { MultiValueProps, OptionProps, OptionTypeBase, SingleValueProps } from "react-select";
import Select, { components } from "react-select";
import { Button } from "@/ui/Button/Button";

import { ThemeMode, useTheme } from "@/styles";

import { CharacterIcon } from "../CharacterIcon";
import { Tooltip } from "@/ui/Tooltip/Tooltip";
import { CharacterLabel } from "./CharacterLabel";

import styles from "./CharacterSelect.module.css";

export const sortedCharacterInfos: CharacterInfo[] = getAllCharacters().sort((a, b) => {
  if (a.name < b.name) {
    return -1;
  }
  if (a.name > b.name) {
    return 1;
  }
  return 0;
});

export const sortedCharacterIDs: Character[] = sortedCharacterInfos.map((c) => c.id);

const SingleValue: React.ComponentType<SingleValueProps<OptionTypeBase>> = (props) => {
  return (
    <components.SingleValue {...props}>
      <CharacterLabel characterId={props.data.value} name={props.data.label} />
    </components.SingleValue>
  );
};

const MultiValueRemove: React.ComponentType<MultiValueProps<OptionTypeBase>> = (props) => {
  return (
    <components.MultiValueRemove {...props}>
      <CharacterIcon character={props.data.value} />
    </components.MultiValueRemove>
  );
};

const CustomOption: React.ComponentType<OptionProps<OptionTypeBase, false>> = (props) => {
  const { innerProps, innerRef } = props;
  return (
    <div className={styles.outerOption} ref={innerRef} {...innerProps}>
      <CharacterLabel characterId={props.data.value} name={props.data.label} disabled={props.data.isDisabled} />
    </div>
  );
};

export function CharacterSelect(props: any) {
  const { value, onChange, options, disabledOptions, components, ...rest } = props;
  const disabledList = disabledOptions || [];
  const optionToValue = (o: any): Character => o.value;
  const valueToOption = (c: Character) => {
    let label: string;
    try {
      label = getCharacterName(c);
    } catch (err) {
      label = `Unknown: ${c}`;
    }
    return {
      value: c,
      label,
      isDisabled: disabledList.includes(c),
    };
  };
  const parseValue = (val: any) =>
    val === undefined || val === "" || val === null ? undefined : val.map ? val.map(optionToValue) : optionToValue(val);
  const formatValue = (val: any) =>
    val === undefined || val === "" || val === null ? undefined : val.map ? val.map(valueToOption) : valueToOption(val);
  const newValue = formatValue(value);
  const newOnChange = (v: any) => onChange(parseValue(v));
  const selectOptions = options || sortedCharacterIDs;
  const mainTheme = useTheme();
  const minHeight = "3.8rem";
  const customStyles: any = {
    dropdownIndicator: (base: any) => ({
      ...base,
      padding: "0 0.8rem",
    }),
    multiValue: (base: any) => ({
      ...base,
      backgroundColor: "transparent",
    }),
    multiValueLabel: (base: any) => ({
      ...base,
      display: "none",
    }),
    control: (base: any) => ({
      ...base,
      minHeight,
    }),
    placeholder: (base: any) => ({
      ...base,
      whiteSpace: "nowrap",
      opacity: 0.4,
    }),
  };
  if (mainTheme.themeName === ThemeMode.DARK) {
    customStyles.menuList = (base: any) => ({
      ...base,
      backgroundColor: mainTheme.theme.foreground,
      color: mainTheme.theme.background,
    });
    customStyles.dropdownIndicator = (base: any) => ({
      ...base,
      padding: "0 0.8rem",
      color: mainTheme.theme.background,
    });
    customStyles.control = (base: any) => ({
      ...base,
      backgroundColor: mainTheme.theme.foreground,
      color: mainTheme.theme.background,
      minHeight,
    });
  }

  return (
    <Select
      {...rest}
      width="100%"
      value={newValue}
      onChange={newOnChange}
      options={selectOptions.map(valueToOption)}
      searchable
      components={{ ...components, MultiValueRemove, Option: CustomOption, SingleValue }}
      menuColor={mainTheme.theme.background}
      styles={customStyles}
      placeholder={`Choose your character${props.isMulti ? "s" : ""}...`}
    />
  );
}

export function CharacterSelectAdapter(props: any) {
  const { name, ...rest } = props;
  return (
    <Field name={name}>
      {(fprops) => {
        const { input, ...frest } = fprops;
        return <CharacterSelect {...rest} {...frest} {...input} />;
      }}
    </Field>
  );
}

export interface CustomCharacterListProps {
  value?: Character[];
  onChange?: (value: Character[]) => void;
}

export function CustomCharacterList({ value, onChange }: CustomCharacterListProps) {
  const [text, setText] = React.useState("");
  const deleteChar = (c: Character) => {
    if (!value || !onChange) {
      return;
    }
    const newValue = value.filter((v) => v !== c);
    onChange(newValue);
  };
  const addChar = (c: Character) => {
    const newValue = Array.from(value ?? []);
    if (!newValue.includes(c) && onChange) {
      newValue.push(c);
      onChange(newValue);
    }
  };
  return (
    <div>
      <div className={styles.flexRow}>
        {(value ?? []).map((c, i) => (
          <Tooltip title={`Delete ${c}`} key={`item-${i}-${c}`} onClick={() => deleteChar(c)}>
            <div className={styles.chip}>
              <span>{c}</span>
              <CharacterIcon character={c} />
            </div>
          </Tooltip>
        ))}
      </div>
      <div className={styles.addRow}>
        <input
          placeholder="Enter a character ID and press Add"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <Button
          onClick={() => {
            const val = parseInt(text);
            if (!isNaN(val)) {
              addChar(val as Character);
            }
            setText("");
          }}
          content="Add"
        />
      </div>
    </div>
  );
}

export function CustomCharacterListAdapter(props: any) {
  const { name, ...rest } = props;
  return (
    <Field name={name}>
      {(fprops) => {
        const { input, ...frest } = fprops;
        return <CustomCharacterList {...rest} {...frest} {...input} />;
      }}
    </Field>
  );
}

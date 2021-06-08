import { Character, CharacterInfo, getAllCharacters, getCharacterName } from "@vinceau/slp-realtime";
import * as React from "react";
import { Field } from "react-final-form";
import Select, { components, MultiValueProps, OptionProps, OptionTypeBase, SingleValueProps } from "react-select";
import styled from "@emotion/styled";

import { ThemeMode, useTheme } from "@/styles";
import { CharacterIcon } from "../CharacterIcon";
import { CharacterLabel } from "./CharacterLabel";

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

const OuterOption = styled.div<{
  themeName: string;
}>`
  padding: 5px 10px;
  ${({ theme, themeName }) => `
  &:hover {
    background-color: ${themeName === ThemeMode.DARK ? theme.foreground2 : "#F8F8F8"};
    ${
      themeName === ThemeMode.DARK &&
      `
      color: ${theme.foreground};
    `
    }
  }`}
`;
const CustomOption: React.ComponentType<OptionProps<OptionTypeBase>> = (props) => {
  const { themeName } = useTheme();
  const { innerProps, innerRef } = props;
  return (
    <OuterOption {...innerProps} ref={innerRef} themeName={themeName}>
      <CharacterLabel characterId={props.data.value} name={props.data.label} disabled={props.data.isDisabled} />
    </OuterOption>
  );
};

export const CharacterSelect = (props: any) => {
  const { value, onChange, options, disabledOptions, components, ...rest } = props;
  const disabledList = disabledOptions ? disabledOptions : [];
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
  const selectOptions = options ? options : sortedCharacterIDs;
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
      searchable={true}
      components={{ ...components, MultiValueRemove, Option: CustomOption, SingleValue }}
      menuColor={mainTheme.theme.background}
      styles={customStyles}
      placeholder={`Choose your character${props.isMulti ? "s" : ""}...`}
    />
  );
};

export const CharacterSelectAdapter = (props: any) => {
  const { name, ...rest } = props;
  return (
    <Field name={name}>
      {(fprops) => {
        const { input, ...frest } = fprops;
        return <CharacterSelect {...rest} {...frest} {...input} />;
      }}
    </Field>
  );
};

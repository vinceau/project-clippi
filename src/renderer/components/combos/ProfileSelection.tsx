import * as React from "react";

import styled from "styled-components";

import { ThemeMode, useTheme } from "@/styles";
import { darken, lighten } from "polished";
import { toast } from "react-toastify";
import { Dropdown } from "semantic-ui-react";
import { Field, Label, Text } from "../Form";

const generateOptions = (opts: string[]) => {
    return opts.map(o => ({
        key: o,
        text: o,
        value: o,
    }));
};

const Outer = styled.div<{
    themeName: string;
}>`
padding: 0 2rem;
border-radius: 0.5rem;
background-color: ${(p) => {
    const adjust = p.themeName === ThemeMode.DARK ? lighten : darken;
    return adjust(0.05, p.theme.background);
}};
`;

export const ProfileSelector = (props: any) => {
    const theme = useTheme();
    const { initialOptions, value, onChange, ...rest } = props;
    const options = generateOptions(initialOptions);
    const handleNewItem = (_: any, data: any) => {
        const notification = <>Created <b>{data.value}</b> profile.</>;
        toast.info(notification, {
            toastId: `${data.value}-profile-created`,
        });
        onChange(data.value);
    };
    return (
    <Outer themeName={theme.themeName}>
        <Field>
           <Label>Current Profile</Label>
            <Dropdown
                style={{ width: "100%" }}
                options={options}
                placeholder="Select a profile"
                search
                selection
                allowAdditions
                value={value}
                onAddItem={handleNewItem}
                onChange={(_: any, data: any) => onChange(data.value)}
                {...rest}
            />
            <Text>
                Combo profiles are used to determine the combo and conversion events as well as the combos found by the <b>Replay Processor</b>.
                You can create new profiles by typing a new profile name in the dropdown.
            </Text>
        </Field>
    </Outer>
   );
};

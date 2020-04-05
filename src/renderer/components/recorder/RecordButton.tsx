import React from "react";

import { Button, Dropdown } from "semantic-ui-react";

export const RecordButton: React.FC<{
    onClick?: () => void;
    onChange?: (value: string) => void;
    disabled?: boolean;
    value?: string;
    options?: Array<{
        icon: string;
        text: string;
        value: string;
    }>;
}> = (props) => {
    const onChange = (value: any) => {
        if (props.onChange) {
            props.onChange(value);
        }
    };
    const onClick = () => {
        if (props.onClick) {
            props.onClick();
        }
    };
    const options = props.options ? props.options.map(v => ({...v, key: v.value})) : [];
    return (
        <Button.Group>
            <Button disabled={props.disabled} onClick={onClick}>{props.children}</Button>
            {options.length > 0 && <Dropdown
                value={props.value}
                disabled={props.disabled}
                className="button icon"
                floating
                onChange={(_: any, { value }) => onChange(value)}
                options={options}
                trigger={<React.Fragment />}
            />}
        </Button.Group>
    );
};

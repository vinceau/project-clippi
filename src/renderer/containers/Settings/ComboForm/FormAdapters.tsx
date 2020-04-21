import * as React from "react";

import { Toggle } from "@/components/Form";
import { Checkbox, Form as SemanticForm, Input } from "semantic-ui-react";

export const ToggleAdapter = (props: any) => {
    const { input, label } = props;
    return (
        <Toggle
            value={input.value}
            label={label}
            onChange={input.onChange}
        />
    );
};

export const SemanticCheckboxInput = (props: any) => {
    const { input, label } = props;
    return (
        <SemanticForm.Field>
            <Checkbox
                checked={input.value}
                label={label}
                onChange={(_, obj) => input.onChange(obj.checked)}
            />
        </SemanticForm.Field>
    );
};

export const SemanticInput = (props: any) => {
    const { inputLabel, input, meta, ...rest } = props;
    return (
        <SemanticForm.Field error={meta.error && meta.touched}>
            {/* <RenderCount /> */}
            {inputLabel && <label>{inputLabel}</label>}
            <Input {...input} {...rest} />
            {meta.error && meta.touched && (
                <span style={{ color: "red" }}>{meta.error}</span>
            )}
        </SemanticForm.Field>
    );
};

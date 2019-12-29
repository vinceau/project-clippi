import * as React from "react";
import { Checkbox, Form as SemanticForm, Input } from "semantic-ui-react";

export const SemanticCheckboxInput = (props: any) => {
    const { input, label } = props;
    return (
        <SemanticForm.Field>
            <Checkbox
                checked={input.value}
                label={label}
                onChange={(e, obj) => input.onChange(obj.checked)}
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

import * as React from "react";
import { Checkbox, Form as SemanticForm } from "semantic-ui-react";

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

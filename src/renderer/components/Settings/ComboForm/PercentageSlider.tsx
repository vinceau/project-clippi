import React from "react";
import { Field } from "react-final-form";

export const PercentageSlider: React.FC<{
    name: string;
    min?: string;
    max?: string;
}> = props => {
    const min = props.min || "0";
    const max = props.max || "100";
    return (
        <div>
            <Field
                name={props.name}
                component="input"
                type="range"
                min={min}
                max={max}
            />
            <Field
                name={props.name}
                min={min}
                max={max}
                component="input"
                type="text"
            />
        </div>
    );
};

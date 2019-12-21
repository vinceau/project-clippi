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
                parse={(v) => parseFloat(v)}
                name={props.name}
                component="input"
                type="range"
                min={min}
                max={max}
                step={`${parseInt(max, 10) / 100}`}
            />
            <Field
                parse={(v) => parseFloat(v)}
                name={props.name}
                min={min}
                max={max}
                component="input"
                type="text"
            />
        </div>
    );
};

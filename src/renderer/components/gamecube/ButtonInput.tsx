import React from "react";

import { ButtonPicker } from "./ButtonPicker";
import { ButtonPreview } from "./ButtonPreview";

export const ButtonInput: React.FC<{
    value?: string[];
    onChange?: (newButtons: string[]) => void;
}> = (props) => {
    const { value, onChange } = props;
    return (
        <div>
            <ButtonPicker value={value} onChange={onChange}>
                {
                    value && value.length > 0 ?
                        <ButtonPreview value={value} />
                        :
                        <p>Click to choose buttons.</p>
                }
            </ButtonPicker>
        </div>
    );
};

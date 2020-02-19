
import * as React from "react";

import { Tooltip } from "react-tippy";

export const Labelled = (props: any) => {
    const { onClick, children, ...rest } = props;
    const pointerStyle = {
        cursor: "pointer",
    };
    return (
        <span style={onClick ? pointerStyle : undefined} onClick={onClick}>
            <Tooltip arrow={true} duration={200} position="bottom" style={{ display: "inline-block" }} {...rest}>
                {children}
            </Tooltip>
        </span>
    );
};

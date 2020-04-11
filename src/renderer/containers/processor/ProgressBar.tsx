import React from "react";

import { iRootState } from "@/store";
import { useSelector } from "react-redux";

import styled from "styled-components";

const Outer = styled.div<{
    percent: number;
}>`
position: absolute;
top: 0;
left: 0;
height: 100%;
width: ${p => p.percent}%;
background-color: green;
opacity: 0.3;
`;

export const ProgressBar: React.FC = () => {
    const { comboFinderPercent } = useSelector((state: iRootState) => state.tempContainer);
    return (
        <Outer percent={comboFinderPercent} />
    );
};

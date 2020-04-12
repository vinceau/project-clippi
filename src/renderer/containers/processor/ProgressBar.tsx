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
background-color: ${({theme}) => theme.secondary};
opacity: 0.1;
transition: all 0.5s ease-in-out;
`;

export const ProgressBar: React.FC = () => {
    const { comboFinderPercent } = useSelector((state: iRootState) => state.tempContainer);
    if (comboFinderPercent === 100) {
        return null;
    }
    return (
        <Outer percent={comboFinderPercent} />
    );
};

import React from "react";

import ReactMarkdown from "react-markdown";

import styled from "styled-components";

import supporters from "raw-loader!../../../../SUPPORTERS.md";
import { version } from "../../../../package.json";

const Container = styled.div`
text-align: center;

ul {
    list-style: none;
    padding: 0;
}
`;

export const InfoView: React.FC = () => {
    return (
        <Container>
            <h1>Project Clippi</h1>
            <p>Version {version}</p>
            <ReactMarkdown
                source={supporters}
            />
        </Container>
    );
};

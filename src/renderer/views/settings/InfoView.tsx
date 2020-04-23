import React from "react";

import ReactMarkdown from "react-markdown";

import styled from "styled-components";

import supporters from "raw-loader!../../../../SUPPORTERS.md";

import clippiLogo from "../../../../build/icon.png";

const Container = styled.div`
text-align: center;

ul {
    list-style: none;
    padding: 0;
}
`;

const Content = styled.div`
p {
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
}
`;

const Footer = styled.div`
font-style: italic;
font-size: 16px;
margin-top: 40px;
`;

const Logo = styled.img`
height: 6.4rem;
width: 6.4rem;
`;

export const InfoView: React.FC = () => {
    return (
        <Container>
            <Logo src={clippiLogo} />
            <h1>Project Clippi</h1>
            <Content>
                <h3>Version {__VERSION__}</h3>
                <p>
                    Commit {__BUILD__}<br />
                    {__DATE__}
                </p>
                <p>Source code available on <a href="https://github.com/vinceau/project-clippi" target="_blank">Github</a>.</p>
                <p>Please report bugs by tweeting at <a href="https://twitter.com/ProjectClippi" target="_blank">@ProjectClippi</a>.</p>
            </Content>
            <h1>Acknowledgements</h1>
            <Content>
                <p>Project Clippi was made possible by <a href="https://github.com/JLaferri" target="_blank">Jas Laferriere</a> and the rest of the <a href="https://github.com/project-slippi" target="_blank">Project Slippi</a> team.</p>
                <p>Project Clippi contains icons by <a href="https://icons8.com/" target="_blank">Icons8</a>.</p>
            </Content>
            <ReactMarkdown
                source={supporters}
            />
            <Footer>
                <p>To God be the glory</p>
            </Footer>
        </Container>
    );
};

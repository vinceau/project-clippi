import React from "react";

import ReactMarkdown from "react-markdown";

import { Dispatch, iRootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";

import styled from "styled-components";

import supporters from "raw-loader!../../../../SUPPORTERS.md";

import clippiLogo from "../../../../build/icon.png";
import { FormContainer } from "@/components/Form";

const Container = styled(FormContainer)`
text-align: center;

ul {
    list-style: none;
    padding: 0;
}
`;

const Content = styled.div`
padding-bottom: 2rem;
p {
    margin-left: auto;
    margin-right: auto;
}
`;

const Footer = styled.div`
font-style: italic;
font-size: 1.6rem;
margin-top: 4rem;
`;

const Logo = styled.img<{
    isDev: boolean;
}>`
height: 6.4rem;
width: 6.4rem;
${({isDev}) => isDev && `
    transform: scaleX(-1);
`}
`;

const DEV_THRESHOLD = 7;

export const InfoView: React.FC = () => {
    const [ clickCount, setClickCount ] = React.useState(0);
    const { isDev } = useSelector((state: iRootState) => state.appContainer);
    const dispatch = useDispatch<Dispatch>();
    const handleLogoClick = () => {
        setClickCount(clickCount + 1);
        if (clickCount === DEV_THRESHOLD - 1) {
            console.log(isDev ? "Disabling dev" : "Enabling dev");
            dispatch.appContainer.setIsDev(!isDev);
            setClickCount(0);
        }
    };
    return (
        <Container>
            <Logo isDev={isDev} src={clippiLogo} onClick={handleLogoClick} />
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

import React from "react";

import ReactMarkdown from "react-markdown";

import { Dispatch, iRootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { Icon } from "semantic-ui-react";

import styled from "@emotion/styled";

import supporters from "raw-loader!../../../../SUPPORTERS.md";

import { A } from "@/components/ExternalLink";
import { FormContainer } from "@/components/Form";
import { Labelled } from "@/components/Labelled";
import { needsUpdate } from "@/lib/checkForUpdates";
import clippiLogo from "../../../../build/icon.png";

const Container = styled(FormContainer)`
  text-align: center;

  ul {
    list-style: none;
    padding: 0;
  }

  a:hover {
    text-decoration: underline;
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
  ${({ isDev }) =>
    isDev &&
    `
    transform: scaleX(-1);
`}
`;

const UpdateInfo = styled.h3`
  a {
    color: red;
    font-size: 1.2em;
  }
  padding: 1rem 0;
`;

const DEV_THRESHOLD = 7;

export const InfoView: React.FC = () => {
  const [clickCount, setClickCount] = React.useState(0);
  const { isDev, latestVersion } = useSelector((state: iRootState) => state.appContainer);
  const dispatch = useDispatch<Dispatch>();
  const updateAvailable = needsUpdate(latestVersion);
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
      <h1>Project Clippi v{__VERSION__}</h1>
      <Content>
        {updateAvailable && (
          <UpdateInfo>
            <A href="https://github.com/vinceau/project-clippi/releases/latest">
              <Labelled title="Open releases page">
                <Icon name="exclamation triangle" /> New update available!
              </Labelled>
            </A>
          </UpdateInfo>
        )}
        <p>
          Commit {__BUILD__}
          <br />
          {__DATE__}
        </p>
        <div style={{ paddingTop: "2rem" }}>
          <p>
            Made with love by <A href="https://twitter.com/_vinceau">Vincent Au</A> and{" "}
            <A href="https://github.com/vinceau/project-clippi/graphs/contributors">contributors</A>.
          </p>
          <p>
            Source code available on <A href="https://github.com/vinceau/project-clippi">Github</A>
            .<br />
            Please report bugs by tweeting at <A href="https://twitter.com/ProjectClippi">@ProjectClippi</A>.
          </p>
        </div>
      </Content>
      <h1>Acknowledgements</h1>
      <Content>
        <p>
          Project Clippi was made possible by <A href="https://github.com/JLaferri">Jas Laferriere</A> and the rest of
          the <A href="https://github.com/project-slippi">Project Slippi</A> team.
        </p>
        <p>
          Project Clippi contains icons by <A href="https://icons8.com/">Icons8</A>.
        </p>
      </Content>
      <ReactMarkdown source={supporters} />
      <Footer>
        <p>To God be the glory</p>
      </Footer>
    </Container>
  );
};

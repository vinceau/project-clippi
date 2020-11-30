/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import React from "react";

import ReactMarkdown from "react-markdown";

import { Dispatch, iRootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { Button, Icon } from "semantic-ui-react";
import { darken, lighten } from "polished";

import styled from "@emotion/styled";

import supporters from "raw-loader!../../../../SUPPORTERS.md";

import { ExternalLink as A } from "@/components/ExternalLink";
import { FormContainer } from "@/components/Form";
import { needsUpdate } from "common/githubReleaseVersions";
import clippiLogo from "../../../../build/icon.png";
import { checkForNewUpdates, installUpdateAndRestart, openUrl } from "@/lib/utils";
import { ThemeMode, useTheme } from "@/styles";
import { GITHUB_PAGE } from "common/constants";

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

const UpdateInfo = styled.div<{
  themeName: string;
}>`
  max-width: 50rem;
  padding: 2rem;
  border-radius: 0.5rem;
  background-color: ${(p) => {
    const adjust = p.themeName === ThemeMode.DARK ? lighten : darken;
    return adjust(0.05, p.theme.background);
  }};
  margin-left: auto;
  margin-right: auto;
`;

const DEV_THRESHOLD = 7;

export const InfoView: React.FC = () => {
  const theme = useTheme();
  const [clickCount, setClickCount] = React.useState(0);
  const isDev = useSelector((state: iRootState) => state.appContainer.isDev);
  const latestVersion = useSelector((state: iRootState) => state.appContainer.latestVersion);
  const updateDownloaded = useSelector((state: iRootState) => state.tempContainer.updateDownloaded);

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
  const handleUpdateAction = () => {
    if (updateDownloaded) {
      installUpdateAndRestart();
    } else {
      openUrl("https://github.com/vinceau/project-clippi/releases/latest");
    }
  };
  const updateMessage = updateDownloaded ? "ready to be installed" : "available";
  return (
    <Container>
      <Logo isDev={isDev} src={clippiLogo} onClick={handleLogoClick} />
      <h1>Project Clippi v{__VERSION__}</h1>
      <Content>
        <p>
          Commit {__BUILD__}
          <br />
          {__DATE__}
        </p>
        {updateAvailable ? (
          <UpdateInfo themeName={theme.themeName}>
            <div
              css={css`
                color: red;
                font-size: 1.2em;
              `}
            >
              <Icon name="exclamation triangle" /> An update to v{latestVersion} {updateMessage}!
            </div>
            <div
              css={css`
                padding-top: 1rem;
              `}
            >
              <Button onClick={handleUpdateAction}>{updateDownloaded ? "Restart now" : "Open releases page"}</Button>
            </div>
          </UpdateInfo>
        ) : (
          <div>
            <Button onClick={checkForNewUpdates}>Check for updates</Button>
          </div>
        )}
        <div style={{ paddingTop: "2rem" }}>
          <p>
            Made with love by <A href="https://twitter.com/_vinceau">Vince Au</A> and{" "}
            <A href={`${GITHUB_PAGE}/graphs/contributors`}>contributors</A>.
          </p>
          <p>
            Source code available on <A href={GITHUB_PAGE}>Github</A>
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

import React from "react";

import ReactMarkdown from "react-markdown";

import { Dispatch, iRootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";

import styled from "@emotion/styled";

import supporters from "raw-loader!../../../../SUPPORTERS.md";

import { ExternalLink as A } from "@/components/ExternalLink";
import { FormContainer } from "@/components/Form";
import clippiLogo from "../../../../build/icon.png";
import { useTheme } from "@/styles";
import { UpdateStatusInfo } from "@/containers/UpdateStatus";
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
  flip: boolean;
}>`
  height: 6.4rem;
  width: 6.4rem;
  ${({ flip }) =>
    flip &&
    `
    transform: scaleX(-1);
`}
`;

const UpdateInfo = styled.div<{
  themeName: string;
  updateAvailable?: boolean;
}>`
  ${(p) => `border: solid 0.2rem ${p.updateAvailable ? "#db2828" : "transparent"};`}
  max-width: 50rem;
  padding: 2rem;
  border-radius: 0.5rem;
  margin-left: auto;
  margin-right: auto;
`;

const DEV_THRESHOLD = 7;

export const InfoView: React.FC = () => {
  const theme = useTheme();
  const [clickCount, setClickCount] = React.useState(0);
  const showDevOptions = useSelector((state: iRootState) => state.appContainer.showDevOptions);
  const updateAvailable = useSelector((state: iRootState) => state.tempContainer.updateAvailable);

  const dispatch = useDispatch<Dispatch>();
  const handleLogoClick = () => {
    setClickCount(clickCount + 1);
    if (clickCount === DEV_THRESHOLD - 1) {
      console.log(showDevOptions ? "Disabling dev" : "Enabling dev");
      dispatch.appContainer.setIsDev(!showDevOptions);
      setClickCount(0);
    }
  };
  return (
    <Container>
      <Logo flip={showDevOptions} src={clippiLogo} onClick={handleLogoClick} />
      <h1>Project Clippi v{__VERSION__}</h1>
      <Content>
        <p>
          Commit {__BUILD__}
          <br />
          {__DATE__}
        </p>
        <UpdateInfo themeName={theme.themeName} updateAvailable={updateAvailable}>
          <UpdateStatusInfo />
        </UpdateInfo>
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

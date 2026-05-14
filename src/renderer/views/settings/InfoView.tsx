import { clsx } from "clsx";
import { GITHUB_PAGE } from "common/constants";
import supporters from "raw-loader!../../../../SUPPORTERS.md";
import React from "react";
import ReactMarkdown from "react-markdown";
import { useDispatch, useSelector } from "react-redux";

import { ExternalLink as A } from "@/components/ExternalLink";
import { FormContainer } from "@/components/Form";
import { UpdateStatusInfo } from "@/containers/UpdateStatus";
import type { Dispatch, iRootState } from "@/store";

import clippiLogo from "@/styles/images/clippi-icon.png";

import styles from "./InfoView.module.css";

const DEV_THRESHOLD = 7;

export function InfoView() {
  const [clickCount, setClickCount] = React.useState(0);
  const showDevOptions = useSelector((state: iRootState) => state.appContainer.showDevOptions);
  const updateAvailable = useSelector((state: iRootState) => state.tempContainer.updateAvailable);

  const dispatch = useDispatch<Dispatch>();
  const handleLogoClick = () => {
    setClickCount(clickCount + 1);
    if (clickCount === DEV_THRESHOLD - 1) {
      console.log(showDevOptions ? "Disabling dev" : "Enabling dev");
      dispatch.appContainer.setShowDevOptions(!showDevOptions);
      setClickCount(0);
    }
  };
  return (
    <div className={styles.container}>
      <FormContainer>
        <img
          className={clsx(styles.logo, showDevOptions && styles.logoFlipped)}
          src={clippiLogo}
          onClick={handleLogoClick}
          alt="logo"
        />
      </FormContainer>
      <h1>Project Clippi v{__VERSION__}</h1>
      <div className={styles.content}>
        <p>
          Commit {__BUILD__}
          <br />
          {__DATE__}
        </p>
        <div className={clsx(styles.updateInfo, updateAvailable && styles.updateInfoAvailable)}>
          <UpdateStatusInfo />
        </div>
        <div className={styles.section}>
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
      </div>
      <h1>Acknowledgements</h1>
      <div className={styles.content}>
        <p>
          Project Clippi was made possible by <A href="https://github.com/JLaferri">Jas Laferriere</A> and the rest of
          the <A href="https://github.com/project-slippi">Project Slippi</A> team.
        </p>
        <p>
          Project Clippi contains icons by <A href="https://icons8.com/">Icons8</A>.
        </p>
      </div>
      <ReactMarkdown source={supporters} />
      <div className={styles.footer}>
        <p>To God be the glory</p>
      </div>
    </div>
  );
}

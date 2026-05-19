import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Loader } from "@/ui/Loader/Loader";
import { TwitchConnectButton } from "@/components/twitch";
import { ExternalLink as A } from "@/components/ExternalLink";
import styles from "./TwitchConnectContainer.module.css";

export function TwitchConnectContainer() {
  const { twitchUser, twitchLoading, twitchDeviceCode } = useSelector((s: any) => s.tempContainer);
  const dispatch = useDispatch();

  if (twitchUser) {
    return null;
  }

  if (twitchLoading) {
    if (twitchDeviceCode) {
      return (
        <div className={styles.container}>
          <p className={styles.description}>
            Go to{" "}
            <A className={styles.link} href={twitchDeviceCode.verificationUri}>
              {stripQuery(twitchDeviceCode.verificationUri)}
            </A>{" "}
            and enter code:
          </p>
          <div className={styles.codeDisplay}>{twitchDeviceCode.userCode}</div>
        </div>
      );
    }

    return <Loader active inline content="Loading" />;
  }

  return <TwitchConnectButton onClick={() => dispatch({ type: "tempContainer/authenticateTwitch" })} />;
}

const stripQuery = (u) => {
  const url = new URL(u);
  return url.origin + url.pathname;
};

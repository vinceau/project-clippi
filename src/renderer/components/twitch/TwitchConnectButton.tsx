import React from "react";
import { CustomIcon } from "@/ui/CustomIcon/CustomIcon";

import twitchIcon from "@/styles/images/twitch.svg";
import styles from "./TwitchConnectButton.module.css";

export function TwitchConnectButton({
  onClick,
}: {
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}) {
  return (
    <button className={styles.button} style={{ backgroundColor: "#6441A4", padding: "10px 16px" }} onClick={onClick}>
      <CustomIcon image={twitchIcon} color="#fff" style={{ width: "24px", height: "24px" }} />
      <span className={styles.buttonText}>Connect with Twitch</span>
    </button>
  );
}

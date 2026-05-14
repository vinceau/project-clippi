import React from "react";
import { Icon } from "@/ui/Icon/Icon";

import styles from "./TwitchConnectButton.module.css";

export function TwitchConnectButton({
  onClick,
}: {
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}) {
  return (
    <button className={styles.button} style={{ backgroundColor: "#6441A4" }} onClick={onClick}>
      <Icon name="twitch" />
      <span className={styles.buttonText}>Connect with Twitch</span>
    </button>
  );
}

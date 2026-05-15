import React from "react";
import { Zap } from "lucide-react";

import { Text } from "@/components/Form";
import { Automator } from "@/containers/automator/Automator";
import { StatusBar } from "@/containers/automator/StatusBar";

import styles from "./AutomatorView.module.css";

export function AutomatorView() {
  return (
    <div className={styles.outer}>
      <div className={styles.content}>
        <h1>
          Automator <Zap />
        </h1>
        <Text margin="none">Automatically execute commands when an in-game event occurs</Text>
        <Automator />
      </div>
      <div className={styles.footer}>
        <StatusBar />
      </div>
    </div>
  );
}

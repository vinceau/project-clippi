import React from "react";
import { Zap } from "lucide-react";

import { Automator } from "@/containers/automator/Automator";
import { StatusBar } from "@/containers/automator/StatusBar";
import { Header } from "./Header/Header";

import styles from "./AutomatorView.module.css";

export function AutomatorView() {
  return (
    <div className={styles.outer}>
      <div className={styles.content}>
        <Header
          title="Automator"
          icon={<Zap />}
          description="Automatically execute commands when an in-game event occurs"
        />
        <Automator />
      </div>
      <div className={styles.footer}>
        <StatusBar />
      </div>
    </div>
  );
}

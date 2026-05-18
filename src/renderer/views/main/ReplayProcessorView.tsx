import React from "react";
import { useSelector } from "react-redux";
import { ChevronsRight } from "lucide-react";
import { ProgressBar } from "@/components/ProgressBar";
import { ComboFinder } from "@/containers/ComboFinder";
import { ProcessorStatusBar } from "@/containers/ProcessorStatusBar";
import type { iRootState } from "@/store";

import styles from "./ReplayProcessorView.module.css";
import { Header } from "./Header/Header";

export function ReplayProcessorView() {
  const { comboFinderPercent } = useSelector((state: iRootState) => state.tempContainer);
  return (
    <div className={styles.outer}>
      <div className={styles.content}>
        <Header
          title="Replay Processor"
          icon={<ChevronsRight />}
          description="Find combos and highlights from your replay files"
        />
        <ComboFinder />
      </div>
      <div className={styles.footer}>
        <ProcessorStatusBar />
        {comboFinderPercent !== 100 && <ProgressBar percent={comboFinderPercent} />}
      </div>
    </div>
  );
}

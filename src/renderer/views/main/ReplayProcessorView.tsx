import React from "react";
import { useSelector } from "react-redux";
import { Text } from "@/components/Form";
import { ChevronsRight } from "lucide-react";
import { ProgressBar } from "@/components/ProgressBar";
import { ComboFinder } from "@/containers/ComboFinder";
import { ProcessorStatusBar } from "@/containers/ProcessorStatusBar";
import type { iRootState } from "@/store";

import styles from "./ReplayProcessorView.module.css";

export function ReplayProcessorView() {
  const { comboFinderPercent } = useSelector((state: iRootState) => state.tempContainer);
  return (
    <div className={styles.outer}>
      <div className={styles.content}>
        <h1>
          Replay Processor <ChevronsRight size={16} />
        </h1>
        <Text>Find combos and highlights from your replay files</Text>
        <ComboFinder />
      </div>
      <div className={styles.footer}>
        <ProcessorStatusBar />
        {comboFinderPercent !== 100 && <ProgressBar percent={comboFinderPercent} />}
      </div>
    </div>
  );
}

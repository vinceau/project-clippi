import { Input } from "@vinceau/slp-realtime";
import React from "react";
import {
  AButton,
  BButton,
  DpadDown,
  DpadLeft,
  DpadRight,
  DpadUp,
  LTrigger,
  RTrigger,
  StartButton,
  XButton,
  YButton,
  ZButton,
} from "react-gamecube";

import styles from "./ButtonPreview.module.css";

export function ButtonPreview({ value, pressed }: { value: string[]; pressed?: boolean }) {
  return (
    <div className={styles.outer}>
      <div className={styles.buttonContainer} style={{ display: value.includes(Input.Z) ? "block" : "none" }}>
        <ZButton pressed={pressed} />
      </div>
      <div className={styles.buttonContainer} style={{ display: value.includes(Input.L) ? "block" : "none" }}>
        <LTrigger pressed={pressed} />
      </div>
      <div className={styles.buttonContainer} style={{ display: value.includes(Input.R) ? "block" : "none" }}>
        <RTrigger pressed={pressed} />
      </div>
      <div className={styles.buttonContainer} style={{ display: value.includes(Input.A) ? "block" : "none" }}>
        <AButton pressed={pressed} />
      </div>
      <div className={styles.buttonContainer} style={{ display: value.includes(Input.B) ? "block" : "none" }}>
        <BButton pressed={pressed} />
      </div>
      <div className={styles.buttonContainer} style={{ display: value.includes(Input.X) ? "block" : "none" }}>
        <XButton pressed={pressed} />
      </div>
      <div className={styles.buttonContainer} style={{ display: value.includes(Input.Y) ? "block" : "none" }}>
        <YButton pressed={pressed} />
      </div>
      <div className={styles.buttonContainer} style={{ display: value.includes(Input.START) ? "block" : "none" }}>
        <StartButton pressed={pressed} />
      </div>
      <div className={styles.buttonContainer} style={{ display: value.includes(Input.D_UP) ? "block" : "none" }}>
        <DpadUp pressed={pressed} />
      </div>
      <div className={styles.buttonContainer} style={{ display: value.includes(Input.D_DOWN) ? "block" : "none" }}>
        <DpadDown pressed={pressed} />
      </div>
      <div className={styles.buttonContainer} style={{ display: value.includes(Input.D_LEFT) ? "block" : "none" }}>
        <DpadLeft pressed={pressed} />
      </div>
      <div className={styles.buttonContainer} style={{ display: value.includes(Input.D_RIGHT) ? "block" : "none" }}>
        <DpadRight pressed={pressed} />
      </div>
    </div>
  );
}

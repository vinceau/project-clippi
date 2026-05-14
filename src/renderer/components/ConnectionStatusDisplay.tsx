import React from "react";
import { Header } from "@/ui/Header/Header";

import styles from "./ConnectionStatusDisplay.module.css";
import { Labelled } from "@/components/Labelled";
import { ScanningDot } from "@/components/ScanningDot";

export function ConnectionStatusDisplay({
  icon,
  iconHoverText,
  onIconClick,
  headerText,
  headerHoverTitle,
  onHeaderClick,
  color,
  shouldPulse,
  children,
}: {
  icon?: string;
  iconHoverText?: string;
  onIconClick?: () => void;
  headerText: string;
  headerHoverTitle?: string;
  onHeaderClick?: () => void;
  color?: string;
  shouldPulse?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div className={styles.outer}>
      {icon && (
        <Labelled disabled={!iconHoverText} title={iconHoverText}>
          <img
            src={icon}
            onClick={onIconClick}
            style={{
              height: "35px",
              width: "35px",
              cursor: onIconClick ? "pointer" : "auto",
            }}
          />
        </Labelled>
      )}
      <div className={styles.connectInfo}>
        <Labelled disabled={!headerHoverTitle} title={headerHoverTitle} onClick={onHeaderClick} position="right">
          <Header sub>
            <ScanningDot shouldPulse={shouldPulse} color={color || "red"} /> {headerText}
          </Header>
        </Labelled>
        {children && <span>{children}</span>}
      </div>
    </div>
  );
}

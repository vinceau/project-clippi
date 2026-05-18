import React from "react";
import { Header } from "@/ui/Header/Header";

import { Tooltip } from "@/ui/Tooltip/Tooltip";
import { ScanningDot } from "@/components/ScanningDot";
import styles from "./ConnectionStatusDisplay.module.css";

export function ConnectionStatusDisplay({
  icon,
  iconHoverText = "",
  onIconClick,
  headerText,
  headerHoverTitle = "",
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
        <Tooltip disabled={!iconHoverText} title={iconHoverText}>
          <img
            src={icon}
            onClick={onIconClick}
            style={{
              height: "35px",
              width: "35px",
              cursor: onIconClick ? "pointer" : "auto",
            }}
          />
        </Tooltip>
      )}
      <div className={styles.connectInfo}>
        <Tooltip disabled={!headerHoverTitle} title={headerHoverTitle} onClick={onHeaderClick} position="right">
          <Header sub uppercase>
            <ScanningDot shouldPulse={shouldPulse} color={color || "red"} /> {headerText}
          </Header>
        </Tooltip>
        {children && <span>{children}</span>}
      </div>
    </div>
  );
}

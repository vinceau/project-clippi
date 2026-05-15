import styled from "@emotion/styled";
import React from "react";
import { Header } from "@/ui/Header/Header";

import { Labelled } from "@/components/Labelled";
import { ScanningDot } from "@/components/ScanningDot";

const Outer = styled.div`
  padding: 10px 0;
  display: flex;
`;
const ConnectInfo = styled.div`
  margin-left: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

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
    <Outer>
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
      <ConnectInfo>
        <Labelled disabled={!headerHoverTitle} title={headerHoverTitle} onClick={onHeaderClick} position="right">
          <Header sub>
            <ScanningDot shouldPulse={shouldPulse} color={color || "red"} /> {headerText}
          </Header>
        </Labelled>
        {children && <span>{children}</span>}
      </ConnectInfo>
    </Outer>
  );
}

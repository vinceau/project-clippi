import styled from "@emotion/styled";
import * as React from "react";
import { Checkbox } from "@/ui/Checkbox/Checkbox";

export const SlideReveal = styled.div<{
  open: boolean;
}>`
  overflow-y: ${({ open }) => (open ? "visible" : "hidden")};
  max-height: ${({ open }) => (open ? "1000px" : "0")};
  transition: all 0.3s ease-in-out;
`;

const Outer = styled.div`
  padding: 20px 0;
  border-top: solid 1px ${({ theme }) => theme.foreground3};
`;

const SectionLabel = styled.h2`
  cursor: pointer;
  margin-bottom: 0;
`;

export function ProcessSection({
  open,
  onOpenChange,
  label,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  label: string;
  children?: React.ReactNode;
}) {
  return (
    <Outer>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <SectionLabel onClick={() => onOpenChange(!open)}>{label}</SectionLabel>
        <Checkbox toggle checked={open} onChange={(_, data) => onOpenChange(Boolean(data.checked))} />
      </div>
      <SlideReveal open={open}>
        <div style={{ marginTop: "10px" }}>{children}</div>
      </SlideReveal>
    </Outer>
  );
}

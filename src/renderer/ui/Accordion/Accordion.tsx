import { clsx } from "clsx";
import React from "react";
import styles from "./Accordion.module.css";

interface AccordionTitleProps {
  active?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
}

interface AccordionContentProps {
  active?: boolean;
  children?: React.ReactNode;
}

function Accordion({ children }: { children?: React.ReactNode }) {
  return <div>{children}</div>;
}

function AccordionTitle({ active, onClick, children }: AccordionTitleProps) {
  return (
    <div
      className={clsx(styles.title, active && styles.active)}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

function AccordionContent({ active, children }: AccordionContentProps) {
  if (!active) return null;
  return <div className={styles.content}>{children}</div>;
}

Accordion.Title = AccordionTitle;
Accordion.Content = AccordionContent;

export { Accordion, AccordionTitle, AccordionContent };

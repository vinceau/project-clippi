import { Collapsible } from "@base-ui/react/collapsible";
import { clsx } from "clsx";
import React from "react";
import styles from "./Accordion.module.css";

function AccordionRoot({ className, ...props }: React.ComponentProps<typeof Collapsible.Root>) {
  return <Collapsible.Root className={clsx(styles.root, className)} {...props} />;
}

function AccordionTrigger({ className, children, ...props }: React.ComponentProps<typeof Collapsible.Trigger>) {
  return (
    <Collapsible.Trigger className={clsx(styles.trigger, className as string | undefined)} {...props}>
      <ChevronIcon className={styles.chevronIcon} />
      {children}
    </Collapsible.Trigger>
  );
}

function AccordionPanel({ className, ...props }: React.ComponentProps<typeof Collapsible.Panel>) {
  return <Collapsible.Panel className={clsx(styles.panel, className as string | undefined)} {...props} />;
}

export const Accordion = {
  Root: AccordionRoot,
  Trigger: AccordionTrigger,
  Panel: AccordionPanel,
};

export function ChevronIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" {...props}>
      <path
        d="M3.5 9L7.5 5L3.5 1"
        stroke="currentcolor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

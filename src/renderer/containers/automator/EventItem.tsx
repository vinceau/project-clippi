import { clsx } from "clsx";
import React from "react";
import { Icon } from "@/ui/Icon/Icon";

import { generateEventName } from "@/lib/events";
import type { NamedEventConfig } from "@/store/models/automator";

import styles from "./EventItem.module.css";

export interface EventItemProps {
  event: NamedEventConfig;
  disabled?: boolean;
  selected?: boolean;
  onClick?: () => void;
}

export function EventItem({ event, onClick, selected, disabled }: EventItemProps) {
  const eventName = event.name ? event.name : `${generateEventName(event)}...`;
  const isClickable = !selected && !disabled && !!onClick;
  return (
    <div
      className={clsx(
        styles.outer,
        selected && styles.selected,
        disabled && styles.disabled,
        isClickable && styles.clickable
      )}
      onClick={isClickable ? onClick : undefined}
    >
      <div className={styles.iconCell}>
        <Icon name={disabled ? "window close" : "flag"} />
      </div>
      <div>{eventName}</div>
    </div>
  );
}

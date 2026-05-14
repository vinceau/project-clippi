import { clsx } from "clsx";
import React from "react";
import styles from "./Card.module.css";

interface CardProps {
  children?: React.ReactNode;
}

export function Card({ children }: CardProps) {
  return <div className={styles.card}>{children}</div>;
}

export function CardContent({
  children,
  extra,
}: {
  children?: React.ReactNode;
  extra?: boolean;
}) {
  return <div className={clsx(styles.content, extra && styles.extra)}>{children}</div>;
}

export function CardHeader({ children }: { children?: React.ReactNode }) {
  return <div className={styles.header}>{children}</div>;
}

export function CardMeta({ children }: { children?: React.ReactNode }) {
  return <div className={styles.meta}>{children}</div>;
}

Card.Content = CardContent;
Card.Header = CardHeader;
Card.Meta = CardMeta;

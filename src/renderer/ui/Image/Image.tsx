import { clsx } from "clsx";
import React from "react";
import styles from "./Image.module.css";

interface ImageProps {
  src: string;
  alt?: string;
  floated?: "left" | "right";
  size?: "mini" | "tiny" | "small" | "medium" | "large";
}

export function Image({ src, alt, floated, size }: ImageProps) {
  return (
    <img
      src={src}
      alt={alt || ""}
      className={clsx(
        styles.image,
        floated === "left" && styles.floatedLeft,
        floated === "right" && styles.floatedRight,
        size && styles[size],
      )}
    />
  );
}

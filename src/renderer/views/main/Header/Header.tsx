import React from "react";
import styles from "./Header.module.css";

export function Header({ title, description, icon }: { title: string; description: string; icon: React.ReactNode }) {
  return (
    <div className={styles.container}>
      <h1 className={styles.header}>
        {title} {icon}
      </h1>
      <p className={styles.description}>{description}</p>
    </div>
  );
}

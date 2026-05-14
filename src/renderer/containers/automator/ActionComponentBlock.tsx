import { clsx } from "clsx";
import React from "react";

import styles from "./ActionComponentBlock.module.css";

export interface ActionComponentBlockProps {
  hideBorder?: boolean;
  icon: JSX.Element;
  header: JSX.Element;
  children?: JSX.Element;
}

export const ActionComponentBlock = React.forwardRef<HTMLDivElement, ActionComponentBlockProps>((props, ref) => {
  const { hideBorder, icon, header, children } = props;
  return (
    <div className={clsx(styles.outer, !hideBorder && styles.outerBorder)}>
      <div className={styles.inner} ref={ref}>
        <div className={clsx(styles.headerRow, !hideBorder && styles.headerRowBorder)}>
          <div className={styles.iconCell}>
            {icon}
          </div>
          <div>{header}</div>
        </div>
        {children && (
          <div className={styles.children}>
            {children}
          </div>
        )}
      </div>
    </div>
  );
});

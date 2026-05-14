import React from "react";
import type { ConfirmProps } from "semantic-ui-react";
import { Confirm as SemanticConfirm } from "semantic-ui-react";

import styles from "./Confirm.module.css";
import { useTheme } from "@/styles";

export function Confirm(props: ConfirmProps) {
  const theme = useTheme();
  return <SemanticConfirm className={`${styles.confirm} ${theme.themeName}`} {...props} />;
}

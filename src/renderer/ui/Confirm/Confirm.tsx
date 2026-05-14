import React from "react";
import type { ConfirmProps } from "semantic-ui-react";
import { Confirm as SemanticConfirm } from "semantic-ui-react";

import { useTheme } from "@/styles";
import styles from "./Confirm.module.css";

export function Confirm(props: ConfirmProps) {
  const theme = useTheme();
  return <SemanticConfirm className={`${styles.confirm} ${theme.themeName}`} {...props} />;
}

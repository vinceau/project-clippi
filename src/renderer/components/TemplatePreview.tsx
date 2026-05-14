import type { GameStartType } from "@slippi/slippi-js";
import { parseFileRenameFormat } from "common/context";
import * as React from "react";

import styles from "./TemplatePreview.module.css";

export function TemplatePreview({
  template,
  settings,
  metadata,
}: {
  template: string;
  settings?: GameStartType;
  metadata?: any;
}) {
  const parsedTemplate = parseFileRenameFormat(template, settings, metadata);
  return (
    <span className={styles.preview}>
      {parsedTemplate}
    </span>
  );
}
